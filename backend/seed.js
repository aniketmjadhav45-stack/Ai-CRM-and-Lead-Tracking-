const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const orgId = "demo-org-123";

  // Ensure Organization exists
  await prisma.organization.upsert({
    where: { id: orgId },
    update: {},
    create: {
      id: orgId,
      name: "Apex Plumbing & HVAC",
    },
  });

  // Seed Leads with Advanced Attribution
  const leads = [
    {
      firstName: "Sarah", lastName: "Jenkins", email: "sarah.j@example.com", phone: "+1 555-0100",
      source: "Google Ads", utmSource: "google", utmMedium: "cpc", utmCampaign: "spring_hvac_repair",
      adSet: "homeowners_35_65", keyword: "emergency ac repair", landingPage: "/ac-repair",
      status: "new", costPerLead: 45.50
    },
    {
      firstName: "Michael", lastName: "Chen", email: "m.chen@example.com", phone: "+1 555-0101",
      source: "Facebook Ads", utmSource: "facebook", utmMedium: "social", utmCampaign: "plumbing_specials",
      adSet: "retargeting_website_visitors", keyword: null, landingPage: "/plumbing",
      status: "contacted", costPerLead: 22.00
    },
    {
      firstName: "David", lastName: "Rodriguez", email: "david.r@example.com", phone: "+1 555-0102",
      source: "Organic Search", utmSource: "google", utmMedium: "organic", utmCampaign: null,
      adSet: null, keyword: "best plumber near me", landingPage: "/",
      status: "qualified", costPerLead: 0
    },
    {
      firstName: "Emma", lastName: "Thompson", email: "emma.t@example.com", phone: "+1 555-0103",
      source: "Referral", utmSource: null, utmMedium: null, utmCampaign: null,
      adSet: null, keyword: null, landingPage: null,
      status: "won", costPerLead: 0
    }
  ];

  for (const lead of leads) {
    const contact = await prisma.contact.create({
      data: {
        organizationId: orgId,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        source: lead.source,
        utmSource: lead.utmSource,
        utmMedium: lead.utmMedium,
        utmCampaign: lead.utmCampaign,
        adSet: lead.adSet,
        keyword: lead.keyword,
        landingPage: lead.landingPage,
        status: lead.status,
        costPerLead: lead.costPerLead
      }
    });

    if (lead.status === "won" || lead.status === "qualified") {
      await prisma.deal.create({
        data: {
          contactId: contact.id,
          title: `${lead.firstName} ${lead.lastName} - Service Project`,
          value: Math.floor(Math.random() * 5000) + 1000,
          revenueGenerated: lead.status === 'won' ? Math.floor(Math.random() * 5000) + 1000 : 0,
          stage: lead.status === 'won' ? 'won' : 'estimate'
        }
      });
    }
  }

  console.log("Database seeded with advanced leads!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
