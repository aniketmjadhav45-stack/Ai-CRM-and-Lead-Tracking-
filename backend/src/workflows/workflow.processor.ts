import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowNode, WorkflowConnection } from '@prisma/client';

export const OMNIFLOW_QUEUE = 'omniflow-execution';

@Processor(OMNIFLOW_QUEUE)
@Injectable()
export class WorkflowProcessor extends WorkerHost {
  private readonly logger = new Logger(WorkflowProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { workflowId, payload, startingNodeId } = job.data;
    this.logger.log(`Executing Workflow: ${workflowId}`);

    // Create a new WorkflowRun
    const run = await this.prisma.workflowRun.create({
      data: {
        workflowId,
        status: 'running',
      },
    });

    try {
      // Fetch nodes and connections
      const nodes = await this.prisma.workflowNode.findMany({ where: { workflowId } });
      const connections = await this.prisma.workflowConnection.findMany({ where: { workflowId } });

      // Find the starting node
      let currentNode: WorkflowNode | undefined = startingNodeId 
        ? nodes.find(n => n.id === startingNodeId)
        : nodes.find(n => n.nodeType.startsWith('trigger_'));

      if (!currentNode) {
        throw new Error('No trigger node found for workflow');
      }

      let workflowState = { ...payload };

      // Topological DAG execution
      while (currentNode) {
        this.logger.debug(`Executing Node [${currentNode.nodeType}]`);
        
        let nodeResult = true; // For logic branches

        // Execute Node Action
        switch (currentNode.nodeType) {
          case 'trigger_webhook':
            this.logger.debug('Webhook triggered');
            break;
          case 'action_sms':
            this.logger.debug('Sending SMS (mock)');
            break;
          case 'action_ai_call':
            this.logger.debug('Triggering Vapi AI call (mock)');
            break;
          case 'logic_if':
            this.logger.debug('Evaluating IF logic');
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

        // Log node execution
        await this.prisma.workflowLog.create({
          data: {
            workflowRunId: run.id,
            nodeId: currentNode.id,
            status: 'success',
            message: `Executed successfully. Context: ${JSON.stringify(workflowState)}`
          }
        });

        // Find next node based on connection and nodeResult handle
        const handleId: string | null = currentNode.nodeType === 'logic_if' ? (nodeResult ? 'true' : 'false') : null;
        
        const nextConnection: WorkflowConnection | undefined = connections.find((c) => 
          c.sourceNode === currentNode!.id && 
          (handleId ? c.sourceHandle === handleId : true)
        );

        if (nextConnection) {
          currentNode = nodes.find((n) => n.id === nextConnection.targetNode);
        } else {
          currentNode = undefined; // End of path
        }
      }

      await this.prisma.workflowRun.update({
        where: { id: run.id },
        data: { status: 'completed', completedAt: new Date() },
      });

      this.logger.log(`Workflow ${workflowId} completed successfully.`);
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
