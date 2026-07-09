const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding UConnect database...\n');

  // Clean existing data
  await prisma.message.deleteMany();
  await prisma.mentorConnection.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.application.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.projectSkill.deleteMany();
  await prisma.project.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.user.deleteMany();

  console.log('  ✓ Cleaned existing data');

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // ==========================================
  // Create Users
  // ==========================================
  const student1 = await prisma.user.create({
    data: {
      name: 'Taslim Ahmed Tamim',
      email: 'taslim@uconnect.com',
      password: hashedPassword,
      role: 'STUDENT',
      profile: {
        create: {
          headline: 'Full-Stack Developer & AI Enthusiast',
          bio: 'Passionate about building scalable web applications and exploring machine learning.',
          university: 'United International University',
          department: 'Computer Science & Engineering',
          yearOfStudy: 3,
          phone: '+880-1700-000001',
        },
      },
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: 'Salman Kabir Sany',
      email: 'salman@uconnect.com',
      password: hashedPassword,
      role: 'STUDENT',
      profile: {
        create: {
          headline: 'Backend Developer & Problem Solver',
          bio: 'Competitive programmer with a passion for efficient algorithms and system design.',
          university: 'United International University',
          department: 'Computer Science & Engineering',
          yearOfStudy: 3,
          phone: '+880-1700-000002',
        },
      },
    },
  });

  const student3 = await prisma.user.create({
    data: {
      name: 'Majharul Islam',
      email: 'majharul@uconnect.com',
      password: hashedPassword,
      role: 'STUDENT',
      profile: {
        create: {
          headline: 'Frontend Developer & UI/UX Enthusiast',
          bio: 'Love creating beautiful and intuitive user interfaces with modern web technologies.',
          university: 'United International University',
          department: 'Computer Science & Engineering',
          yearOfStudy: 3,
          phone: '+880-1700-000003',
        },
      },
    },
  });

  const teacher1 = await prisma.user.create({
    data: {
      name: 'Dr. Hasan Mahmud',
      email: 'hasan@uconnect.com',
      password: hashedPassword,
      role: 'TEACHER',
      profile: {
        create: {
          headline: 'Associate Professor — Software Engineering',
          bio: 'Researcher in AI-driven software engineering, mentoring students in project-based learning.',
          university: 'United International University',
          department: 'Computer Science & Engineering',
        },
      },
    },
  });

  const recruiter1 = await prisma.user.create({
    data: {
      name: 'Sarah Chen',
      email: 'sarah@techcorp.com',
      password: hashedPassword,
      role: 'RECRUITER',
      profile: {
        create: {
          headline: 'Talent Acquisition Lead — TechCorp',
          bio: 'Hiring top tech talent for innovative projects. Looking for passionate developers and engineers.',
        },
      },
    },
  });

  console.log('  ✓ Created 5 users (3 students, 1 teacher, 1 recruiter)');

  // ==========================================
  // Create Skills
  // ==========================================
  const skillsData = [
    { name: 'JavaScript', category: 'Language' },
    { name: 'Python', category: 'Language' },
    { name: 'React', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Express', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'TensorFlow', category: 'AI/ML' },
    { name: 'Machine Learning', category: 'AI/ML' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'CSS/Tailwind', category: 'Frontend' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'Git', category: 'Tool' },
    { name: 'REST API', category: 'Architecture' },
    { name: 'GraphQL', category: 'Architecture' },
  ];

  const skills = {};
  for (const s of skillsData) {
    const skill = await prisma.skill.create({ data: s });
    skills[s.name] = skill;
  }

  console.log(`  ✓ Created ${skillsData.length} skills`);

  // ==========================================
  // Assign Skills to Users
  // ==========================================
  const userSkillAssignments = [
    { userId: student1.id, skillId: skills['JavaScript'].id, level: 90 },
    { userId: student1.id, skillId: skills['React'].id, level: 85 },
    { userId: student1.id, skillId: skills['Node.js'].id, level: 80 },
    { userId: student1.id, skillId: skills['Python'].id, level: 75 },
    { userId: student1.id, skillId: skills['PostgreSQL'].id, level: 70 },
    { userId: student2.id, skillId: skills['Python'].id, level: 90 },
    { userId: student2.id, skillId: skills['Node.js'].id, level: 85 },
    { userId: student2.id, skillId: skills['PostgreSQL'].id, level: 80 },
    { userId: student2.id, skillId: skills['Docker'].id, level: 70 },
    { userId: student2.id, skillId: skills['REST API'].id, level: 85 },
    { userId: student3.id, skillId: skills['JavaScript'].id, level: 85 },
    { userId: student3.id, skillId: skills['React'].id, level: 90 },
    { userId: student3.id, skillId: skills['CSS/Tailwind'].id, level: 92 },
    { userId: student3.id, skillId: skills['TypeScript'].id, level: 75 },
    { userId: student3.id, skillId: skills['Git'].id, level: 80 },
  ];

  for (const assignment of userSkillAssignments) {
    await prisma.userSkill.create({ data: assignment });
  }

  console.log('  ✓ Assigned skills to users');

  // ==========================================
  // Create Projects
  // ==========================================
  const project1 = await prisma.project.create({
    data: {
      title: 'UConnect — University Ecosystem Platform',
      description: 'AI-driven platform connecting students, teachers, and recruiters for collaboration, team formation, and career development.',
      status: 'IN_PROGRESS',
      ownerId: student1.id,
      skills: {
        create: [
          { skillId: skills['React'].id },
          { skillId: skills['Node.js'].id },
          { skillId: skills['PostgreSQL'].id },
          { skillId: skills['Python'].id },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'Smart Campus Chatbot',
      description: 'AI-powered chatbot that answers university-specific questions about courses, schedules, and campus life.',
      status: 'PLANNING',
      ownerId: student2.id,
      skills: {
        create: [
          { skillId: skills['Python'].id },
          { skillId: skills['TensorFlow'].id },
          { skillId: skills['Machine Learning'].id },
        ],
      },
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: 'Student Portfolio Showcase',
      description: 'A gallery platform for students to showcase their projects, get feedback, and discover collaboration opportunities.',
      status: 'COMPLETED',
      ownerId: student3.id,
      skills: {
        create: [
          { skillId: skills['React'].id },
          { skillId: skills['CSS/Tailwind'].id },
          { skillId: skills['REST API'].id },
        ],
      },
    },
  });

  console.log('  ✓ Created 3 projects');

  // ==========================================
  // Create Teams
  // ==========================================
  const team1 = await prisma.team.create({
    data: {
      name: 'Team UConnect',
      members: {
        create: [
          { userId: student1.id, role: 'leader', projectId: project1.id },
          { userId: student2.id, role: 'backend-lead', projectId: project1.id },
          { userId: student3.id, role: 'frontend-lead', projectId: project1.id },
        ],
      },
    },
  });

  const team2 = await prisma.team.create({
    data: {
      name: 'AI Research Squad',
      members: {
        create: [
          { userId: student2.id, role: 'leader', projectId: project2.id },
          { userId: student1.id, role: 'member', projectId: project2.id },
        ],
      },
    },
  });

  console.log('  ✓ Created 2 teams with members');

  // ==========================================
  // Create Opportunities
  // ==========================================
  const opp1 = await prisma.opportunity.create({
    data: {
      type: 'internship',
      title: 'Full-Stack Developer Intern',
      description: 'Join our engineering team to build scalable web applications using React and Node.js.',
      company: 'TechCorp',
      location: 'Dhaka, Bangladesh',
      isRemote: true,
      postedById: recruiter1.id,
      deadline: new Date('2026-08-31'),
    },
  });

  const opp2 = await prisma.opportunity.create({
    data: {
      type: 'job',
      title: 'Machine Learning Engineer',
      description: 'Work on cutting-edge ML models for NLP and computer vision applications.',
      company: 'AI Labs',
      location: 'Remote',
      isRemote: true,
      postedById: recruiter1.id,
      deadline: new Date('2026-09-15'),
    },
  });

  const opp3 = await prisma.opportunity.create({
    data: {
      type: 'hackathon',
      title: 'UIU Hackathon 2026',
      description: 'Annual university hackathon — build innovative solutions in 48 hours!',
      company: 'UIU',
      location: 'United International University',
      isRemote: false,
      deadline: new Date('2026-07-20'),
    },
  });

  console.log('  ✓ Created 3 opportunities');

  // ==========================================
  // Create Applications
  // ==========================================
  await prisma.application.create({
    data: { userId: student1.id, opportunityId: opp1.id, status: 'PENDING' },
  });
  await prisma.application.create({
    data: { userId: student2.id, opportunityId: opp2.id, status: 'ACCEPTED' },
  });
  await prisma.application.create({
    data: { userId: student3.id, opportunityId: opp3.id, status: 'PENDING' },
  });

  console.log('  ✓ Created 3 applications');

  // ==========================================
  // Create Achievements
  // ==========================================
  await prisma.achievement.createMany({
    data: [
      { userId: student1.id, type: 'badge', title: 'First Project Created', xpPoints: 100 },
      { userId: student1.id, type: 'badge', title: 'Team Leader', xpPoints: 150 },
      { userId: student1.id, type: 'milestone', title: '5 Skills Added', xpPoints: 50 },
      { userId: student2.id, type: 'badge', title: 'Problem Solver', xpPoints: 200 },
      { userId: student2.id, type: 'certificate', title: 'Python Mastery', xpPoints: 300 },
      { userId: student3.id, type: 'badge', title: 'UI Wizard', xpPoints: 150 },
      { userId: student3.id, type: 'badge', title: 'Project Completed', xpPoints: 250 },
    ],
  });

  console.log('  ✓ Created 7 achievements');

  // ==========================================
  // Create Mentor Connections
  // ==========================================
  await prisma.mentorConnection.create({
    data: {
      menteeId: student1.id,
      mentorId: teacher1.id,
      expertise: 'Software Engineering & Project Management',
    },
  });

  await prisma.mentorConnection.create({
    data: {
      menteeId: student2.id,
      mentorId: teacher1.id,
      expertise: 'AI/ML Research & Backend Architecture',
    },
  });

  console.log('  ✓ Created 2 mentor connections');

  // ==========================================
  // Create Messages
  // ==========================================
  await prisma.message.createMany({
    data: [
      {
        senderId: student1.id,
        receiverId: student2.id,
        content: 'Hey Salman! Ready for the sprint planning today?',
      },
      {
        senderId: student2.id,
        receiverId: student1.id,
        content: 'Yes! I have the backend API design ready to discuss.',
      },
      {
        senderId: student3.id,
        receiverId: student1.id,
        content: 'The frontend components are looking great. Check the new dashboard!',
      },
      {
        senderId: teacher1.id,
        receiverId: student1.id,
        content: 'Great progress on UConnect. Let\'s discuss the AI features next week.',
      },
    ],
  });

  console.log('  ✓ Created 4 messages');

  // ==========================================
  // Create Resumes
  // ==========================================
  await prisma.resume.create({
    data: {
      userId: student1.id,
      templateName: 'professional',
    },
  });

  console.log('  ✓ Created 1 resume record');

  console.log('\n✅ Database seeded successfully!\n');
  console.log('  Test accounts (password: password123):');
  console.log('  ─────────────────────────────────────');
  console.log('  Student:   taslim@uconnect.com');
  console.log('  Student:   salman@uconnect.com');
  console.log('  Student:   majharul@uconnect.com');
  console.log('  Teacher:   hasan@uconnect.com');
  console.log('  Recruiter: sarah@techcorp.com');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
