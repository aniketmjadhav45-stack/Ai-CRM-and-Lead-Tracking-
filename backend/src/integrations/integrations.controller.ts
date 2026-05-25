import { Controller, Post, Get, Body, Query, Headers } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';

@Controller('api/integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get('hubspot/callback')
  async hubspotCallback(
    @Query('code') code: string,
    @Query('state') orgId: string // We pass orgId in the state parameter during OAuth initiation
  ) {
    if (!code || !orgId) throw new Error('Missing code or orgId (state)');
    return this.integrationsService.handleHubspotOAuthCallback(orgId, code);
  }

  @Post('hubspot/sync')
  async syncHubspot(@Headers('x-org-id') orgId: string) {
    if (!orgId) throw new Error('x-org-id header required');
    return this.integrationsService.syncHubspotContacts(orgId);
  }

  @Post('ads/sync')
  async syncAds(
    @Headers('x-org-id') orgId: string,
    @Body('platform') platform: string
  ) {
    if (!orgId) throw new Error('x-org-id header required');
    if (!platform) throw new Error('platform body param required');
    return this.integrationsService.syncAdPerformance(orgId, platform);
  }
}
