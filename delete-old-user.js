const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'taslimahmedtamim4u@gmail.com';
  console.log(`Deleting user with email: ${email}`);
  try {
    await prisma.user.delete({
      where: { email }
    });
    console.log('User deleted successfully.');
  } catch (e) {
    console.error('Error deleting user:', e.message);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
