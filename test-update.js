const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Get the first user
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log("No user found");
      return;
    }

    console.log("Found user:", user.email);

    // Try to update with exact payload shapes
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        username: null, // Simulate empty string
        bio: user.bio,
        university: user.university,
        department: user.department,
        skills: typeof user.skills === 'string' ? JSON.parse(user.skills || '[]') : user.skills,
        githubUsername: null, // Simulate empty string
        codeforcesUsername: user.codeforcesUsername,
        title: user.title,
        location: user.location,
        profileImage: user.profileImage,
        experience: typeof user.experience === 'string' ? JSON.parse(user.experience || '[]') : user.experience,
        certificates: typeof user.certificates === 'string' ? JSON.parse(user.certificates || '[]') : user.certificates,
      }
    });

    console.log("Update successful!");
  } catch (error) {
    console.error("PRISMA UPDATE ERROR:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
