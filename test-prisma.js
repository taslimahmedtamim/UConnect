const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.$executeRaw`UPDATE User SET activityLog = '{}' WHERE activityLog IS NULL OR activityLog = ''`;
    console.log("Updated users:", result);
    const user = await prisma.user.findUnique({ where: { email: 'taslimahmedtamim4u@gmail.com' } });
    console.log("Success:", user ? user.email : "Not found");
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
