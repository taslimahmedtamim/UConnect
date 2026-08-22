import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'elena.rostova@ai.edu' }
    });
    if (user) {
      await prisma.user.delete({ where: { id: user.id } });
      console.log('Deleted successfully');
    } else {
      console.log('User not found');
    }
  } catch (error: any) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
