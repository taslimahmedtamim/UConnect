const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe(`UPDATE Team SET assistantIds = '[]' WHERE assistantIds IS NULL OR JSON_LENGTH(assistantIds) IS NULL`);
    console.log('Fixed Team');
  } catch (e) {
    try {
      await prisma.$executeRawUnsafe(`UPDATE team SET assistantIds = '[]' WHERE assistantIds IS NULL OR JSON_LENGTH(assistantIds) IS NULL`);
      console.log('Fixed team (lowercase)');
    } catch (e2) {
      console.error(e2);
    }
  }
}

main().finally(() => prisma.$disconnect());
