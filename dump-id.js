const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findUnique({ where: { email: 'taslimahmedtamim4u@gmail.com' } })
  .then(u => console.log('Prisma User ID:', u?.id))
  .finally(() => prisma.$disconnect());
