import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@uconnect.com';
  const password = 'adminpassword123';
  const passwordHash = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingAdmin) {
    const updated = await prisma.user.update({
      where: { email: adminEmail },
      data: { role: 'admin', passwordHash }
    });
    console.log('Admin user updated:', updated.email);
  } else {
    const newAdmin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        fullName: 'Admin User',
        role: 'admin',
        username: 'admin_user',
      }
    });
    console.log('Admin user created:', newAdmin.email);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
