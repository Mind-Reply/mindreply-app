import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const org = await prisma.organization.upsert({ where: { id: "demo-org" }, update: {}, create: { id: "demo-org", name: "Demo Organization" } });
  const admin = await prisma.user.upsert({ where: { clerkId: "user_demo_admin" }, update: { role: Role.ADMIN, organizationId: org.id }, create: { clerkId: "user_demo_admin", email: "admin@example.com", role: Role.ADMIN, organizationId: org.id } });
  await prisma.project.upsert({ where: { id: "demo-project" }, update: {}, create: { id: "demo-project", name: "Demo Project", description: "Starter project", organizationId: org.id, ownerId: admin.id } });
  console.log("Seeded demo org, admin, project. Stripe price placeholder:", process.env.STRIPE_PRICE_ID ?? "price_REPLACE_ME");
}
main().finally(() => prisma.$disconnect());
