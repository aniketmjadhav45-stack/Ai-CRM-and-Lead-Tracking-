import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { OMNIFLOW_QUEUE } from './workflow.processor';

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectQueue(OMNIFLOW_QUEUE) private workflowQueue: Queue,
    private prisma: PrismaService,
  ) {}

  async triggerWorkflow(workflowId: string, payload: any) {
    // Verify workflow exists and is active
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: workflowId },
    });

    if (!workflow || workflow.status !== 'active') {
      throw new Error('Workflow not found or not active');
    }

    // Add job to BullMQ queue
    const job = await this.workflowQueue.add('execute-dag', {
      workflowId,
      payload,
    });

    return { success: true, jobId: job.id };
  }

  async incomingWebhook(organizationId: string, triggerType: string, payload: any) {
    // Find all active workflows for this trigger type
    const workflows = await this.prisma.workflow.findMany({
      where: {
        organizationId,
        triggerType,
        status: 'active',
      },
    });

    const jobs = await Promise.all(
      workflows.map(wf => this.triggerWorkflow(wf.id, payload))
    );

    return {
      message: `Triggered ${workflows.length} workflows`,
      jobs,
    };
  }
}
