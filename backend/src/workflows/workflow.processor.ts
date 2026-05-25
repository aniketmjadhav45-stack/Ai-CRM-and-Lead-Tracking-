import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommunicationsService } from '../communications/communications.service';
import { WorkflowNode, WorkflowConnection } from '@prisma/client';

export const OMNIFLOW_QUEUE = 'omniflow-execution';

@Processor(OMNIFLOW_QUEUE, {
  concurrency: 10
})
@Injectable()
export class WorkflowProcessor extends WorkerHost {
  private readonly logger = new Logger(WorkflowProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly commsService: CommunicationsService
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { workflowId, payload, startingNodeId } = job.data;
    const organizationId = payload.organizationId;
    const contactId = payload.contactId;

    this.logger.log(`Executing Workflow: ${workflowId}`);

    const run = await this.prisma.workflowRun.create({
      data: { workflowId, status: 'running' },
    });

    try {
      const nodes = await this.prisma.workflowNode.findMany({ where: { workflowId } });
      const connections = await this.prisma.workflowConnection.findMany({ where: { workflowId } });

      let currentNode: WorkflowNode | undefined = startingNodeId 
        ? nodes.find(n => n.id === startingNodeId)
        : nodes.find(n => n.nodeType.startsWith('trigger_'));

      if (!currentNode) {
        throw new Error('No trigger node found for workflow');
      }

      let workflowState = { ...payload };

      while (currentNode) {
        this.logger.debug(`Executing Node [${currentNode.nodeType}]`);
        let nodeResult = true;

        switch (currentNode.nodeType) {
          case 'trigger_webhook':
            this.logger.debug('Webhook triggered');
            break;
            
          case 'action_sms':
            await this.commsService.sendSMS(
              organizationId,
              contactId,
              workflowState.phone || '+1234567890',
              (currentNode.configuration as any)?.body || 'Hello from OmniFlow!'
            );
            break;

          case 'action_email':
            await this.commsService.sendEmail(
              organizationId,
              contactId,
              workflowState.email || 'test@example.com',
              (currentNode.configuration as any)?.subject || 'Hello',
              (currentNode.configuration as any)?.html || '<p>Automated message</p>'
            );
            break;
            
          case 'action_ai_call':
            await this.commsService.dispatchAICall(
              organizationId,
              contactId,
              workflowState.phone || '+1234567890',
              (currentNode.configuration as any)?.prompt || 'You are an AI assistant.'
            );
            break;
            
          case 'logic_if':
            const config = currentNode.configuration as any;
            if (config?.condition === 'high_value' && workflowState.dealValue > 1000) {
               nodeResult = true;
            } else {
               nodeResult = false;
            }
            break;
            
          default:
            this.logger.warn(`Unknown node type: ${currentNode.nodeType}`);
        }

        await this.prisma.workflowLog.create({
          data: {
            workflowRunId: run.id,
            nodeId: currentNode.id,
            status: 'success',
            message: `Executed successfully.`
          }
        });

        const handleId: string | null = currentNode.nodeType === 'logic_if' ? (nodeResult ? 'true' : 'false') : null;
        const nextConnection: WorkflowConnection | undefined = connections.find((c) => 
          c.sourceNode === currentNode!.id && 
          (handleId ? c.sourceHandle === handleId : true)
        );

        if (nextConnection) {
          currentNode = nodes.find((n) => n.id === nextConnection.targetNode);
        } else {
          currentNode = undefined;
        }
      }

      await this.prisma.workflowRun.update({
        where: { id: run.id },
        data: { status: 'completed', completedAt: new Date() },
      });

      return { status: 'completed' };

    } catch (error: any) {
      this.logger.error(`Workflow ${workflowId} failed: ${error.message}`);
      await this.prisma.workflowRun.update({
        where: { id: run.id },
        data: { status: 'failed', completedAt: new Date() },
      });
      throw error;
    }
  }
}
