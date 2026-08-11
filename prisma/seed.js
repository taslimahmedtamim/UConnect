const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const skillsList = [
    'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue', 'Node.js', 'Express',
    'Python', 'Django', 'Flask', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB',
    'Data Analysis', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Docker', 'Kubernetes',
    'CI/CD', 'AWS', 'Azure', 'GCP', 'DevOps', 'System Design', 'Communication'
  ];

  const skillMap = {};
  for (const name of skillsList) {
    const s = await prisma.skill.upsert({
      where: { name },
      update: {},
      create: { name }
    });
    skillMap[name] = s.id;
  }

  const careerDefs = [
    {
      title: 'Frontend Developer',
      description: 'Build user interfaces and experiences for web applications.',
      skills: [
        { name: 'HTML', importance: 5 }, { name: 'CSS', importance: 5 }, { name: 'JavaScript', importance: 5 },
        { name: 'TypeScript', importance: 4 }, { name: 'React', importance: 5 }, { name: 'Communication', importance: 3 }
      ]
    },
    {
      title: 'Backend Developer',
      description: 'Design and implement server-side logic and APIs.',
      skills: [
        { name: 'Node.js', importance: 5 }, { name: 'Express', importance: 4 }, { name: 'SQL', importance: 4 },
        { name: 'PostgreSQL', importance: 4 }, { name: 'System Design', importance: 4 }
      ]
    },
    {
      title: 'Data Scientist',
      description: 'Analyze data and build predictive models.',
      skills: [
        { name: 'Python', importance: 5 }, { name: 'Data Analysis', importance: 5 }, { name: 'Machine Learning', importance: 5 },
        { name: 'TensorFlow', importance: 3 }, { name: 'PyTorch', importance: 3 }
      ]
    },
    {
      title: 'DevOps Engineer',
      description: 'Maintain infrastructure, CI/CD pipelines and deployment.',
      skills: [
        { name: 'Docker', importance: 5 }, { name: 'Kubernetes', importance: 5 }, { name: 'CI/CD', importance: 5 },
        { name: 'AWS', importance: 4 }, { name: 'System Design', importance: 4 }
      ]
    }
  ];

  for (const c of careerDefs) {
    const cp = await prisma.careerPath.upsert({ where: { title: c.title }, update: { description: c.description }, create: { title: c.title, description: c.description } });

    // clear existing mapping
    await prisma.careerPathSkill.deleteMany({ where: { careerPathId: cp.id } });

    const inserts = c.skills.map(s => ({ careerPathId: cp.id, skillId: skillMap[s.name], importance: s.importance || 3 }));
    if (inserts.length) {
      await prisma.careerPathSkill.createMany({ data: inserts });
    }
  }

  // Seed Mentors
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  const pass = await bcrypt.hash('mentor123', salt);

  const demoMentors = [
    {
      email: 'sarah.lin@tech.org',
      fullName: 'Sarah Lin',
      role: 'mentor',
      title: 'Staff Frontend Engineer',
      company: 'TechCorp Labs',
      expertise: ['React', 'TypeScript', 'Next.js', 'System Design'],
      experienceYears: 7,
      availability: 'Weekends & Mon/Wed Evenings',
      bio: 'Ex-Meta frontend tech lead specializing in scalable Web apps, performance optimization, and React ecosystem architecture.',
      rating: 4.9,
      reviewsCount: 18,
      featured: true
    },
    {
      email: 'alex.rivera@cloud.io',
      fullName: 'Alex Rivera',
      role: 'mentor',
      title: 'Senior DevOps Architect',
      company: 'CloudScale Solutions',
      expertise: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Wazuh'],
      experienceYears: 8,
      availability: 'Tuesday & Thursday Evenings',
      bio: 'Cloud security & infrastructure architect passionate about guiding students through container orchestration and DevSecOps pipelines.',
      rating: 5.0,
      reviewsCount: 24,
      featured: true
    },
    {
      email: 'elena.rostova@ai.edu',
      fullName: 'Dr. Elena Rostova',
      role: 'mentor',
      title: 'Lead AI & ML Specialist',
      company: 'Neural Labs AI',
      expertise: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Data Analysis'],
      experienceYears: 6,
      availability: 'Saturday Morning',
      bio: 'AI researcher helping students bridge the gap between machine learning theory, deep learning models, and real-world deployment.',
      rating: 4.8,
      reviewsCount: 15,
      featured: true
    }
  ];

  for (const m of demoMentors) {
    const user = await prisma.user.upsert({
      where: { email: m.email },
      update: {},
      create: {
        email: m.email,
        passwordHash: pass,
        fullName: m.fullName,
        role: m.role,
        bio: m.bio
      }
    });

    await prisma.mentorProfile.upsert({
      where: { userId: user.id },
      update: {
        title: m.title,
        company: m.company,
        expertise: m.expertise,
        experienceYears: m.experienceYears,
        availability: m.availability,
        bio: m.bio,
        rating: m.rating,
        reviewsCount: m.reviewsCount,
        featured: m.featured
      },
      create: {
        userId: user.id,
        title: m.title,
        company: m.company,
        expertise: m.expertise,
        experienceYears: m.experienceYears,
        availability: m.availability,
        bio: m.bio,
        rating: m.rating,
        reviewsCount: m.reviewsCount,
        featured: m.featured
      }
    });
  }

  // Seed Help Board Questions
  const sarahUser = await prisma.user.findFirst({ where: { email: 'sarah.lin@tech.org' } });
  const alexUser = await prisma.user.findFirst({ where: { email: 'alex.rivera@cloud.io' } });

  if (sarahUser && alexUser) {
    const post1 = await prisma.helpPost.create({
      data: {
        title: 'How to handle CORS in Next.js 16 App Router Route Handlers?',
        content: `I'm fetching data from a mobile client to /api/user-skills in Next.js 16 and getting blocked by CORS errors on preflight OPTIONS requests.

What is the recommended header configuration in route handlers?`,
        category: 'Frontend',
        tags: ['Next.js', 'React', 'CORS'],
        status: 'solved',
        views: 34,
        upvotes: 8,
        authorId: sarahUser.id
      }
    });

    await prisma.helpAnswer.create({
      data: {
        postId: post1.id,
        authorId: alexUser.id,
        content: `In Next.js App Router, export an OPTIONS handler in your route.ts:

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}`,
        isAccepted: true,
        upvotes: 6
      }
    });

    await prisma.helpPost.create({
      data: {
        title: 'Best practices for Docker containerizing Wazuh SIEM agent on macOS?',
        content: `I am setting up Wazuh security monitoring in Docker Desktop on mac. Memory limits seem to throttle the indexing service. Any recommended compose limits?`,
        category: 'DevOps',
        tags: ['Docker', 'Wazuh', 'Security'],
        status: 'open',
        views: 19,
        upvotes: 4,
        authorId: alexUser.id
      }
    });
  }

  console.log('Seed finished with sample mentors and help posts');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
