import { Controller, Post, Body, Headers, Param } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';

@Controller('api/webhooks')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Post(':triggerType')
  async handleWebhook(
    @Param('triggerType') triggerType: string,
    @Headers('x-org-id') orgId: string, 
    @Body() payload: any
  ) {
    if (!orgId) throw new Error('x-org-id header required');
    return this.workflowsService.incomingWebhook(orgId, triggerType, payload);
  }
}
