import { randomBytes, scryptSync } from "node:crypto";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();
const campaignLeadName = "Hon. Mejja Donk Benjamin Gathiru";
const campaignCoverImage = "/images/mejjadonkk_bg%20_cover.jpg";

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

async function ensureAdminUser() {
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "root";
  const email = username.includes("@") ? username : "admin@muheshimiwa.local";

  const existing = await prisma.user.findFirst({
    where: {
      role: "admin",
      OR: [{ email }, { name: username }],
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.user.create({
    data: {
      name: username,
      email,
      role: "admin",
      passwordHash: hashPassword(adminPassword),
      ward: "Embakasi Central",
    },
  });
}

async function seedProjects() {
  const count = await prisma.project.count();
  if (count > 0) return;

  await prisma.project.createMany({
    data: [
      {
        title: `${campaignLeadName} Community Water Drive`,
        description:
          "Visible community-focused water and drainage work tied to the campaign's Embakasi Central development agenda.",
        category: "Infrastructure",
        status: "active",
        ward: "Mukuru Kwa Njenga",
        impact: "3,200 households",
        image: campaignCoverImage,
      },
      {
        title: "Benjamin Gathiru Bursary Transparency",
        description:
          "Transparent bursary tracking and updates to support students and families across Embakasi Central.",
        category: "Bursaries",
        status: "completed",
        ward: "Embakasi",
        impact: "1,100 students",
      },
      {
        title: "Embakasi Safety Lighting Phase II",
        description:
          "Expanded security lighting along access roads and market routes to improve night safety.",
        category: "Security",
        status: "planned",
        ward: "Utawala",
        impact: "42 junctions",
      },
    ],
  });
}

async function seedCampaignContent() {
  const campaignProjectTitle = `${campaignLeadName} Community Water Drive`;
  const projectExists = await prisma.project.findFirst({
    where: { title: campaignProjectTitle },
  });

  if (!projectExists) {
    await prisma.project.create({
      data: {
        title: campaignProjectTitle,
        description:
          "A campaign-branded community water and drainage project inspired by the public Facebook page title.",
        category: "Infrastructure",
        status: "active",
        ward: "Embakasi Central",
        impact: "Community visibility",
        image: campaignCoverImage,
      },
    });
  }

  const campaignStoryTitle = `${campaignLeadName} on Cleaner Streets`;
  const storyExists = await prisma.impactStory.findFirst({
    where: { title: campaignStoryTitle },
  });

  if (!storyExists) {
    await prisma.impactStory.create({
      data: {
        title: campaignStoryTitle,
        description:
          "A featured campaign story seeded from the public Facebook page title and paired with the local cover image.",
        impact: "Community delivery",
        ward: "Embakasi Central",
        featured: true,
        order: 0,
        image: campaignCoverImage,
      },
    });
  }

  const campaignPostTitle = `Karibu ${campaignLeadName}`;
  const postExists = await prisma.post.findFirst({
    where: { name: campaignPostTitle },
  });

  if (!postExists) {
    const admin = await ensureAdminUser();
    await prisma.post.create({
      data: {
        name: campaignPostTitle,
        createdById: admin.id,
      },
    });
  }
}

async function seedPollingStations() {
  const pollingStations = [
    {
      name: "Embakasi Central Primary School",
      code: "ECS-001",
      ward: "Embakasi Central",
      location: "Embakasi Central Primary School grounds",
      latitude: -1.3089,
      longitude: 36.9048,
      voters: 4200,
    },
    {
      name: "Kayole 1 Primary School",
      code: "ECS-002",
      ward: "Embakasi Central",
      location: "Kayole 1 Primary School, along the main access road",
      latitude: -1.3024,
      longitude: 36.8997,
      voters: 3650,
    },
    {
      name: "Kayole 2 Primary School",
      code: "ECS-003",
      ward: "Embakasi Central",
      location: "Kayole 2 Primary School compound",
      latitude: -1.3058,
      longitude: 36.8934,
      voters: 3410,
    },
    {
      name: "Komarock Primary School",
      code: "ECS-004",
      ward: "Embakasi Central",
      location: "Komarock Primary School, near the shopping centre",
      latitude: -1.3149,
      longitude: 36.9211,
      voters: 2980,
    },
    {
      name: "Mowlem Primary School",
      code: "ECS-005",
      ward: "Embakasi Central",
      location: "Mowlem Primary School, off the estate access road",
      latitude: -1.2969,
      longitude: 36.9157,
      voters: 2760,
    },
    {
      name: "Embakasi Primary School",
      code: "ECS-006",
      ward: "Embakasi Central",
      location: "Embakasi Primary School, near the shopping centre",
      latitude: -1.3111,
      longitude: 36.9032,
      voters: 3890,
    },
  ];

  for (const pollingStation of pollingStations) {
    await prisma.pollingStation.upsert({
      where: { code: pollingStation.code },
      create: pollingStation,
      update: pollingStation,
    });
  }
}

async function seedImpactStories() {
  const count = await prisma.impactStory.count();
  if (count > 0) return;

  await prisma.impactStory.createMany({
    data: [
      {
        title: `${campaignLeadName} on Cleaner Streets`,
        description:
          "Weekly coordinated clean-up drives keep major routes passable and safer for schools and traders.",
        impact: "12 cleanup zones",
        ward: "Mukuru Kwa Njenga",
        featured: true,
        order: 1,
        image: campaignCoverImage,
      },
      {
        title: "Bursary Support Reached More Families",
        description:
          "A fairer review process increased bursary access for vulnerable households.",
        impact: "+35% approvals",
        ward: "Embakasi",
        featured: true,
        order: 2,
      },
      {
        title: "Night Safety Improved",
        description:
          "Expanded public lighting has reduced dark spots and improved evening movement for residents.",
        impact: "40+ lit points",
        ward: "Utawala",
        featured: true,
        order: 3,
      },
    ],
  });
}

async function seedBursaryDistributions() {
  const count = await prisma.bursaryDistribution.count();
  if (count > 0) return;

  const now = new Date();
  const inSevenDays = new Date(now);
  inSevenDays.setDate(inSevenDays.getDate() + 7);
  const inFourteenDays = new Date(now);
  inFourteenDays.setDate(inFourteenDays.getDate() + 14);

  await prisma.bursaryDistribution.createMany({
    data: [
      {
        location: "Embakasi Social Hall",
        ward: "Embakasi",
        distributionDate: inSevenDays,
        deadline: inFourteenDays,
        description: "Forms collection and bursary disbursement for secondary and tertiary students.",
        status: "pending",
      },
    ],
  });
}

async function seedMailingList() {
  const count = await prisma.mailingList.count();
  if (count > 0) return;

  await prisma.mailingList.createMany({
    data: [
      {
        name: "Demo Supporter One",
        phoneNumber: "+254700000101",
        email: "supporter1@example.com",
        ward: "Embakasi",
        source: "seed",
      },
      {
        name: "Demo Supporter Two",
        phoneNumber: "+254700000102",
        email: "supporter2@example.com",
        ward: "Utawala",
        source: "seed",
      },
    ],
  });
}

async function seedPosts(adminUserId) {
  const count = await prisma.post.count();
  if (count > 0) return;

  await prisma.post.createMany({
    data: [
      { name: `Karibu ${campaignLeadName}`, createdById: adminUserId },
      { name: "Community First Development Agenda", createdById: adminUserId },
    ],
  });
}

async function main() {
  const admin = await ensureAdminUser();

  await seedProjects();
  await seedCampaignContent();
  await seedPollingStations();
  await seedImpactStories();
  await seedBursaryDistributions();
  await seedMailingList();
  await seedPosts(admin.id);

  console.log("Database seeded successfully.");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
