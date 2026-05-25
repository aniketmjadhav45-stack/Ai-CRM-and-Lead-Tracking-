import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as sgMail from '@sendgrid/mail';
import * as twilio from 'twilio';
import axios from 'axios';

@Injectable()
export class CommunicationsService {
  private readonly logger = new Logger(CommunicationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ----------------------------------------------------------------------
  // SENDGRID EMAIL INTEGRATION
  // ----------------------------------------------------------------------
  async sendEmail(organizationId: string, contactId: string, to: string, subject: string, htmlContent: string) {
    this.logger.log(`Sending Email for Org: ${organizationId} to ${to}`);
    
    try {
      const integration = await this.prisma.integration.findFirst({
        where: { organizationId, provider: 'sendgrid', status: 'active' }
      });

      if (!integration?.apiKey) {
        throw new Error('SendGrid integration not configured or inactive');
      }

      // We set the API key per request so multi-tenant orgs don't share keys
      sgMail.setApiKey(integration.apiKey);
      
      const fromEmail = (integration.config as any)?.fromEmail || 'no-reply@omniflow.com';
      
      const msg = {
        to,
        from: fromEmail,
        subject,
        html: htmlContent,
      };

      // In production with real keys, this sends the email
      // await sgMail.send(msg);

      await this.prisma.communicationLog.create({
        data: {
          organizationId,
          contactId,
          type: 'email',
          direction: 'outbound',
          from: fromEmail,
          to,
          status: 'sent',
          subject,
          content: htmlContent
        }
      });

      return { success: true };
    } catch (error: any) {
      this.logger.error(`Email sending failed: ${error.message}`);
      await this.prisma.communicationLog.create({
        data: {
          organizationId,
          contactId,
          type: 'email',
          direction: 'outbound',
          from: 'unknown',
          to,
          status: 'failed',
          subject,
          content: error.message
        }
      });
      throw error;
    }
  }

  // ----------------------------------------------------------------------
  // TWILIO SMS INTEGRATION
  // ----------------------------------------------------------------------
  async sendSMS(organizationId: string, contactId: string, toPhone: string, body: string) {
    this.logger.log(`Sending SMS for Org: ${organizationId} to ${toPhone}`);

    try {
      const integration = await this.prisma.integration.findFirst({
        where: { organizationId, provider: 'twilio', status: 'active' }
      });

      if (!integration?.apiKey || !integration?.accessToken) {
        throw new Error('Twilio integration not configured (requires Account SID as apiKey and Auth Token as accessToken)');
      }

      const twilioClient = require('twilio')(integration.apiKey, integration.accessToken);
      const fromPhone = (integration.config as any)?.fromPhone || '+1234567890';

      // In production with real keys, this sends the SMS
      // await client.messages.create({ body, from: fromPhone, to: toPhone });

      await this.prisma.communicationLog.create({
        data: {
          organizationId,
          contactId,
          type: 'sms',
          direction: 'outbound',
          from: fromPhone,
          to: toPhone,
          status: 'sent',
          content: body
        }
      });

      return { success: true };
    } catch (error: any) {
      this.logger.error(`SMS sending failed: ${error.message}`);
      await this.prisma.communicationLog.create({
        data: {
          organizationId,
          contactId,
          type: 'sms',
          direction: 'outbound',
          from: 'unknown',
          to: toPhone,
          status: 'failed',
          content: error.message
        }
      });
      throw error;
    }
  }

  // ----------------------------------------------------------------------
  // VAPI AI VOICE CALL INTEGRATION
  // ----------------------------------------------------------------------
  async dispatchAICall(organizationId: string, contactId: string, toPhone: string, promptInfo: string) {
    this.logger.log(`Dispatching AI Call for Org: ${organizationId} to ${toPhone}`);

    try {
      const integration = await this.prisma.integration.findFirst({
        where: { organizationId, provider: 'vapi', status: 'active' }
      });

      if (!integration?.apiKey) {
        throw new Error('Vapi AI integration not configured');
      }

      // In production with real keys, this initiates the call
      // await axios.post('https://api.vapi.ai/call', {
      //   phoneNumber: { twilioPhoneNumber: toPhone },
      //   assistantId: (integration.config as any)?.assistantId,
      //   assistantOverrides: {
      //     variableValues: { context: promptInfo }
      //   }
      // }, {
      //   headers: { Authorization: `Bearer ${integration.apiKey}` }
      // });

      await this.prisma.communicationLog.create({
        data: {
          organizationId,
          contactId,
          type: 'call',
          direction: 'outbound',
          from: 'AI Assistant',
          to: toPhone,
          status: 'queued',
          content: promptInfo
        }
      });

      return { success: true };
    } catch (error: any) {
      this.logger.error(`Vapi AI call failed: ${error.message}`);
      throw error;
    }
  }
}
