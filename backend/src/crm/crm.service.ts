import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CrmService {
  constructor(private readonly prisma: PrismaService) {}

  async getContacts(organizationId: string) {
    return this.prisma.contact.findMany({
      where: { organizationId },
      include: {
        deals: true,
        communications: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createContact(organizationId: string, data: any) {
    return this.prisma.contact.create({
      data: {
        organizationId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        source: data.source || 'Manual Entry',
      }
    });
  }

  async getDashboardAnalytics(organizationId: string) {
    const contactsCount = await this.prisma.contact.count({ where: { organizationId } });
    const wonDeals = await this.prisma.deal.aggregate({
      where: { contact: { organizationId }, stage: 'won' },
      _sum: { value: true, revenueGenerated: true }
    });
    const adSpend = await this.prisma.adCampaign.aggregate({
      where: { adAccount: { organizationId } },
      _sum: { totalSpend: true, leadsGenerated: true }
    });

    return {
      totalLeads: contactsCount,
      revenueGenerated: wonDeals._sum.revenueGenerated || 0,
      totalAdSpend: adSpend._sum.totalSpend || 0,
      leadsFromAds: adSpend._sum.leadsGenerated || 0,
      costPerLead: (adSpend._sum.totalSpend && adSpend._sum.leadsGenerated) 
        ? adSpend._sum.totalSpend / adSpend._sum.leadsGenerated 
        : 0
    };
  }
}
