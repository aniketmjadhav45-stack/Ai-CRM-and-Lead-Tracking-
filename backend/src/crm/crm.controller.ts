import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { CrmService } from './crm.service';

@Controller('api/crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Post('contacts')
  async createContact(
    @Headers('x-org-id') orgId: string, 
    @Body() data: any
  ) {
    // In production, orgId comes from the JWT payload. Using header for MVP mock.
    if (!orgId) throw new Error('x-org-id header required');
    return this.crmService.createContact(orgId, data);
  }

  @Get('contacts')
  async getContacts(@Headers('x-org-id') orgId: string) {
    if (!orgId) throw new Error('x-org-id header required');
    return this.crmService.getContacts(orgId);
  }

  @Get('analytics')
  async getDashboardAnalytics(@Headers('x-org-id') orgId: string) {
    if (!orgId) throw new Error('x-org-id header required');
    return this.crmService.getDashboardAnalytics(orgId);
  }
}
