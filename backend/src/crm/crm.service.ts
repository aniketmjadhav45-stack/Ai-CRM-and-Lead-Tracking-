import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CrmService {
  constructor(private readonly prisma: PrismaService) {}

  async createContact(organizationId: string, data: any) {
    return this.prisma.contact.create({
      data: {
        organizationId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        source: data.source,
      },
    });
  }

  async getContacts(organizationId: string) {
    return this.prisma.contact.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      include: { deals: true },
    });
  }
}
