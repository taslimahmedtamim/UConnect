const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const raw = await prisma.$queryRaw`SELECT * FROM Project`;
    console.log("Raw Projects:", JSON.stringify(raw, null, 2));
  } catch (e) {
    console.error("Raw Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
