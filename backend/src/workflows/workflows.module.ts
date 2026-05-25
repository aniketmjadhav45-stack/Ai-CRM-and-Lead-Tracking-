import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { WorkflowsService } from './workflows.service';
import { WorkflowsController } from './workflows.controller';
import { WorkflowProcessor, OMNIFLOW_QUEUE } from './workflow.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: OMNIFLOW_QUEUE,
    }),
  ],
  controllers: [WorkflowsController],
  providers: [WorkflowsService, WorkflowProcessor],
})
export class WorkflowsModule {}
