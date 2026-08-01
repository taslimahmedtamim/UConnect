// UConnect Central State Manager

const DB_KEY = 'uconnect_db';

const DEFAULT_USERS = [
  { id: 'usr_student1', email: 'ayesha.rahman@university.edu', name: 'Ayesha Rahman', role: 'student', dept: 'Computer Science', year: '3rd Year', points: 150, badges: ['Resource Guru', 'Hackathon Hero'], verified: true },
  { id: 'usr_student2', email: 'karim.hassan@university.edu', name: 'Karim Hassan', role: 'student', dept: 'Computer Science', year: '4th Year', points: 80, badges: ['Coding Wiz'], verified: true },
  { id: 'usr_student3', email: 'sara.islam@university.edu', name: 'Sara Islam', role: 'student', dept: 'Electrical Engineering', year: '2nd Year', points: 40, badges: [], verified: false },
  { id: 'usr_teacher1', email: 'rashid.ahmed@university.edu', name: 'Dr. Rashid Ahmed', role: 'teacher', dept: 'CSE Department', officeHours: 'Mon 2-4 PM, Wed 10-12 PM', officeRoom: 'Room 405', publications: ['Deep Learning for NLP (2025)', 'Graph Algorithms Survey (2024)', 'Distributed Systems (2024)'], verified: true },
  { id: 'usr_recruiter1', email: 'recruiter@techcorp.com', name: 'TechCorp HR', role: 'recruiter', company: 'TechCorp Ltd.', industry: 'Software & IT', website: 'https://techcorp.com', desc: 'Leading software development firm innovating in AI, cloud systems, and mobile technology.', logo: 'assets/logo.png', verified: true },
  { id: 'usr_admin1', email: 'admin@university.edu', name: 'System Admin', role: 'admin', verified: true }
];

const DEFAULT_POSTS = [
  {
    id: 'post_1',
    authorId: 'usr_student1',
    authorName: 'Ayesha Rahman',
    authorRole: 'Computer Science · 2h ago',
    authorAvatarColor: 'linear-gradient(135deg, #2563EB, #7C3AED)',
    text: 'Excited to announce our team won 2nd place at the National Hackathon 2026! 🏆 Huge thanks to everyone who supported us. #hackathon #coding #teamwork',
    imagePlaceholder: '🏆 Hackathon Winners 2026',
    tags: ['hackathon', 'coding', 'teamwork'],
    likes: ['usr_student2', 'usr_student3'],
    comments: [
      { id: 'c_1', authorName: 'Karim Hassan', text: 'Congratulations, Ayesha! Well deserved!', replies: [] },
      { id: 'c_2', authorName: 'Dr. Rashid Ahmed', text: 'Excellent achievement! Keep making the department proud.', replies: [] }
    ],
    sharesCount: 5,
    saves: ['usr_student1'],
    reported: false
  },
  {
    id: 'post_2',
    authorId: 'usr_teacher1',
    authorName: 'Dr. Rashid Ahmed',
    authorRole: 'Faculty · CSE Department · 5h ago',
    authorAvatarColor: 'linear-gradient(135deg, #16A34A, #059669)',
    text: '📢 Reminder: Mid-term exam for Data Structures (CSE-301) is scheduled for March 15. Review sessions will be held this week during office hours. Good luck!',
    tags: ['exam', 'datastructures', 'announcement'],
    likes: ['usr_student1', 'usr_student2'],
    comments: [
      { id: 'c_3', authorName: 'Ayesha Rahman', text: 'Thank you, professor. Will the review notes be uploaded online?', replies: [] }
    ],
    sharesCount: 1,
    saves: [],
    reported: false
  },
  {
    id: 'post_3',
    authorId: 'usr_admin1',
    authorName: 'Tech Club UConnect',
    authorRole: 'Club · 1d ago',
    authorAvatarColor: 'linear-gradient(135deg, #F59E0B, #EF4444)',
    text: '🚀 Looking for 2 more members for our hackathon team! We need a frontend dev and a UI/UX designer. DM if interested. Skills: React, Figma #hackathon #teamfinder',
    poll: {
      question: 'Which stack are you most comfortable with?',
      options: [
        { text: 'React / Next.js', votes: 14 },
        { text: 'Vue / Nuxt', votes: 9 },
        { text: 'Angular', votes: 7 }
      ],
      userVoted: null
    },
    tags: ['hackathon', 'teamfinder'],
    likes: ['usr_student3'],
    comments: [],
    sharesCount: 2,
    saves: [],
    reported: false
  }
];

const DEFAULT_MESSAGES = [
  {
    id: 'chat_group_cse',
    name: 'CSE Department Group',
    isGroup: true,
    type: 'dept',
    participants: ['usr_student1', 'usr_student2', 'usr_teacher1', 'usr_admin1'],
    messages: [
      { senderId: 'usr_teacher1', senderName: 'Dr. Rashid Ahmed', text: 'Welcome students to the CSE Department Chat. Use this channel for major announcements.', timestamp: 'Yesterday' },
      { senderId: 'usr_student1', senderName: 'Ayesha Rahman', text: 'Thank you, Professor!', timestamp: 'Yesterday' }
    ]
  },
  {
    id: 'chat_group_batch',
    name: 'Batch 2026 CSE',
    isGroup: true,
    type: 'batch',
    participants: ['usr_student1', 'usr_student2', 'usr_student3'],
    messages: [
      { senderId: 'usr_student2', senderName: 'Karim Hassan', text: 'Has anyone finished the algorithms assignment?', timestamp: '2h ago' },
      { senderId: 'usr_student1', senderName: 'Ayesha Rahman', text: 'Working on it now! Section 3 is a bit tricky.', timestamp: '1h ago' }
    ]
  },
  {
    id: 'chat_group_club',
    name: 'Coding Club Chat',
    isGroup: true,
    type: 'club',
    participants: ['usr_student1', 'usr_student2', 'usr_admin1'],
    messages: [
      { senderId: 'usr_student1', senderName: 'Ayesha Rahman', text: 'Next meeting is this Friday at 4 PM.', timestamp: '3h ago' }
    ]
  },
  {
    id: 'chat_dm_student_teacher',
    isGroup: false,
    participants: ['usr_student1', 'usr_teacher1'],
    messages: [
      { senderId: 'usr_student1', senderName: 'Ayesha Rahman', text: 'Hello Professor, are you available tomorrow during office hours for thesis discussion?', timestamp: '4h ago' },
      { senderId: 'usr_teacher1', senderName: 'Dr. Rashid Ahmed', text: 'Yes, Ayesha. Please drop by around 2:30 PM.', timestamp: '3h ago' }
    ]
  },
  {
    id: 'chat_dm_student_recruiter',
    isGroup: false,
    participants: ['usr_student1', 'usr_recruiter1'],
    messages: [
      { senderId: 'usr_recruiter1', senderName: 'TechCorp HR', text: 'Hello Ayesha, we reviewed your profile and we are impressed by your GitHub projects. Would you be interested in our Frontend Intern role?', timestamp: '1d ago' },
      { senderId: 'usr_student1', senderName: 'Ayesha Rahman', text: 'Hello! Yes, absolutely. I would love to learn more about the role.', timestamp: '1d ago' }
    ]
  }
];

const DEFAULT_JOBS = [
  {
    id: 'job_1',
    title: 'Frontend Developer Intern',
    company: 'TechCorp Ltd.',
    companyLogo: 'G',
    location: 'Remote',
    type: 'Internship',
    salary: '$800 - $1200 / mo',
    description: 'Looking for a passionate frontend developer intern. Experience with React, modern CSS, and state management systems is required.',
    skills: ['React', 'CSS', 'JavaScript', 'HTML'],
    postedBy: 'usr_recruiter1',
    postedDate: 'Mar 1, 2026',
    status: 'Active'
  },
  {
    id: 'job_2',
    title: 'Software Engineer',
    company: 'TechCorp Ltd.',
    companyLogo: 'M',
    location: 'Dhaka (Hybrid)',
    type: 'Full-time',
    salary: '$1500 - $2200 / mo',
    description: 'Join our development team building high performance cloud systems. Experience with Node.js, databases, and microservices is a plus.',
    skills: ['Node.js', 'Python', 'Database', 'Cloud'],
    postedBy: 'usr_recruiter1',
    postedDate: 'Feb 20, 2026',
    status: 'Active'
  },
  {
    id: 'job_3',
    title: 'Data Analyst',
    company: 'FinInsights',
    companyLogo: 'A',
    location: 'Hybrid',
    type: 'Full-time',
    salary: '$1200 - $1800 / mo',
    description: 'Analyze transaction datasets and generate business insights. Python, SQL, and data visualization tools are required.',
    skills: ['Python', 'SQL', 'Excel', 'Data Visualization'],
    postedBy: 'usr_recruiter1',
    postedDate: 'Feb 15, 2026',
    status: 'Closing Soon'
  },
  {
    id: 'job_4',
    title: 'UI/UX Designer',
    company: 'Creative Studio',
    companyLogo: 'S',
    location: 'Dhaka',
    type: 'Part-time',
    salary: '$900 - $1300 / mo',
    description: 'Develop mockups, design landing pages, and work closely with developers on implementing beautiful and accessible user interfaces.',
    skills: ['Figma', 'UI Design', 'Wireframing', 'UX Research'],
    postedBy: 'usr_recruiter1',
    postedDate: 'Mar 5, 2026',
    status: 'Active'
  }
];

const DEFAULT_APPLICATIONS = [
  { id: 'app_1', jobId: 'job_1', studentId: 'usr_student1', status: 'Applied', score: 92, appliedDate: 'Mar 2, 2026' },
  { id: 'app_2', jobId: 'job_2', studentId: 'usr_student2', status: 'Shortlisted', score: 91, appliedDate: 'Feb 21, 2026' }
];

const DEFAULT_NOTICES = [
  { id: 'not_1', category: 'official', title: 'Tech Career Fair 2026', content: 'The annual UConnect Tech Career Fair will take place on March 15 at the Main Auditorium. 30+ top recruiters will be present.', date: 'Mar 1, 2026', author: 'Registrar Office' },
  { id: 'not_2', category: 'exam', title: 'Mid-term Exam Schedule', content: 'CSE department midterm exams will commence from March 15. The detailed exam routine is available on the notice board portal.', date: 'Mar 3, 2026', author: 'CSE Exam Committee' },
  { id: 'not_3', category: 'scholarship', title: 'Dean Merit Scholarship Fall 2025', content: 'Applications for the Dean Merit Scholarship are now open for students with a CGPA above 3.85. Deadline to submit is March 10.', date: 'Feb 25, 2026', author: 'Dean Office' },
  { id: 'not_4', category: 'emergency', title: 'Emergency Notice: Server Maintenance', content: 'University network portals will be down for scheduled system maintenance on Saturday, March 8, from 2:00 AM to 6:00 AM.', date: 'Mar 5, 2026', author: 'ICT Cell' }
];

const DEFAULT_RESOURCES = [
  { id: 'res_1', title: 'Lecture 1: Introduction to Data Structures', category: 'Lecture Slides', courseCode: 'CSE-301', uploaderName: 'Dr. Rashid Ahmed', downloads: 48, fileUrl: '#' },
  { id: 'res_2', title: 'CSE-301 Lab Exercises 1 to 5', category: 'Lab Reports', courseCode: 'CSE-301', uploaderName: 'Ayesha Rahman', downloads: 12, fileUrl: '#' },
  { id: 'res_3', title: 'Introduction to Algorithms (4th Edition)', category: 'Books', courseCode: 'CSE-401', uploaderName: 'Dr. Rashid Ahmed', downloads: 98, fileUrl: '#' },
  { id: 'res_4', title: 'Previous Midterm Questions CSE-301 (2024)', category: 'Previous Questions', courseCode: 'CSE-301', uploaderName: 'Karim Hassan', downloads: 35, fileUrl: '#' }
];

const DEFAULT_COURSES = [
  { id: 'crs_1', code: 'CSE-301', name: 'Data Structures', teacherId: 'usr_teacher1', teacherName: 'Dr. Rashid Ahmed', studentsCount: 52, schedule: 'Mon, 10:00 AM', status: 'Active', attendance: 92, marks: { midterm: 27, assignment: 10, total: 37 } },
  { id: 'crs_2', code: 'CSE-401', name: 'Algorithms', teacherId: 'usr_teacher1', teacherName: 'Dr. Rashid Ahmed', studentsCount: 48, schedule: 'Tue, 2:00 PM', status: 'Active', attendance: 88, marks: { midterm: 24, assignment: 8, total: 32 } },
  { id: 'crs_3', code: 'CSE-450', name: 'Machine Learning', teacherId: 'usr_teacher1', teacherName: 'Dr. Rashid Ahmed', studentsCount: 38, schedule: 'Wed, 11:00 AM', status: 'Active', attendance: 95, marks: { midterm: null, assignment: null, total: null } },
  { id: 'crs_4', code: 'CSE-499', name: 'Thesis Supervision', teacherId: 'usr_teacher1', teacherName: 'Dr. Rashid Ahmed', studentsCount: 8, schedule: 'By appointment', status: 'Ongoing', attendance: 100, marks: { midterm: null, assignment: null, total: null } }
];

const DEFAULT_EVENTS = [
  { id: 'evt_1', title: 'Tech Career Fair 2026', date: '15', month: 'Mar', time: '10:00 AM', venue: 'Main Auditorium', registeredUsers: ['usr_student1'], hasCertificate: true },
  { id: 'evt_2', title: 'AI/ML Workshop', date: '18', month: 'Mar', time: '2:00 PM', venue: 'Lab 301', registeredUsers: ['usr_student1', 'usr_student2'], hasCertificate: true },
  { id: 'evt_3', title: 'Cultural Fest', date: '22', month: 'Mar', time: 'All Day', venue: 'Campus Ground', registeredUsers: [], hasCertificate: false }
];

const DEFAULT_CLUBS = [
  { id: 'clb_1', name: 'Coding Club', code: 'CCC', desc: 'Promoting competitive programming, hackathons, and web technologies across campus.', members: ['usr_student1', 'usr_student2', 'usr_student3'] },
  { id: 'clb_2', name: 'Debate Club', code: 'DBC', desc: 'Fostering rational thinking, public speaking, and structural debate skills.', members: ['usr_student1'] },
  { id: 'clb_3', name: 'Cultural Club', code: 'CLC', desc: 'Nurturing music, art, theater, and cultural festivities.', members: ['usr_student3'] }
];

const DEFAULT_MARKETPLACE = [
  { id: 'mkt_1', title: 'Introduction to Algorithms (CLRS Book)', price: 15, category: 'Books', description: 'Gently used CLRS 3rd Edition. Very helpful for CSE-401.', image: '📚', contact: 'ayesha.rahman@university.edu', sellerId: 'usr_student1' },
  { id: 'mkt_2', title: 'Mechanical Keyboard (Red Switches)', price: 25, category: 'Electronics', description: 'Custom mechanical keyboard with backlit RGB. 60% layout.', image: '⌨️', contact: 'karim.hassan@university.edu', sellerId: 'usr_student2' },
  { id: 'mkt_3', title: 'Hostel Room Study Lamp', price: 5, category: 'Hostel Essentials', description: 'Desk lamp with adjustable neck. Bulb included.', image: '💡', contact: 'sara.islam@university.edu', sellerId: 'usr_student3' },
  { id: 'mkt_4', title: 'Lost: Black Laptop Charger', price: 0, category: 'Lost & Found', description: 'Lost a Lenovo 65W charger in Lab 301 yesterday. Please contact if found.', image: '🔌', contact: 'ayesha.rahman@university.edu', sellerId: 'usr_student1' }
];

const DEFAULT_NOTIFICATIONS = [
  { id: 'ntf_1', userId: 'usr_student1', title: 'New Message', message: 'Dr. Rashid Ahmed sent you a direct message.', timestamp: '3h ago', read: false },
  { id: 'ntf_2', userId: 'usr_student1', title: 'Job Alert', message: 'Frontend Developer Intern matches 92% of your profile. Apply now!', timestamp: '5h ago', read: false },
  { id: 'ntf_3', userId: 'usr_student1', title: 'Assignment Deadline', message: 'CSE-301 Assignment is due in 3 days.', timestamp: '1d ago', read: true },
  { id: 'ntf_4', userId: 'usr_teacher1', title: 'New Submission', message: 'Ayesha Rahman submitted CSE-301 assignment.', timestamp: '2h ago', read: false }
];

const DEFAULT_REPORTS = [
  { id: 'rep_1', reportedPostId: 'post_3', reportedBy: 'usr_student2', reason: 'Irrelevant tag abuse', status: 'Open' }
];

const DEFAULT_TASKS = [
  { id: 'tsk_1', userId: 'usr_student1', text: 'Prepare review questions for CSE-301', completed: true },
  { id: 'tsk_2', userId: 'usr_student1', text: 'Upload github portfolio links', completed: false },
  { id: 'tsk_3', userId: 'usr_student1', text: 'Register for Tech Career Fair 2026', completed: true },
  { id: 'tsk_4', userId: 'usr_student1', text: 'Submit CSE-301 assignment', completed: false }
];

const DEFAULT_STATE = {
  users: DEFAULT_USERS,
  posts: DEFAULT_POSTS,
  messages: DEFAULT_MESSAGES,
  jobs: DEFAULT_JOBS,
  applications: DEFAULT_APPLICATIONS,
  notices: DEFAULT_NOTICES,
  resources: DEFAULT_RESOURCES,
  courses: DEFAULT_COURSES,
  events: DEFAULT_EVENTS,
  clubs: DEFAULT_CLUBS,
  marketplace: DEFAULT_MARKETPLACE,
  notifications: DEFAULT_NOTIFICATIONS,
  reports: DEFAULT_REPORTS,
  userTasks: DEFAULT_TASKS,
  activeSessions: [
    { id: 'ses_1', location: 'Dhaka, BD', device: 'Chrome / macOS (Current)', time: 'Active now' },
    { id: 'ses_2', location: 'Dhaka, BD', device: 'Safari / iPhone 13', time: '2 hours ago' }
  ]
};

// Initialize Database in LocalStorage
function initDatabase() {
  if (!localStorage.getItem(DB_KEY)) {
    localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_STATE));
  }
}

// Get the current database
function getDb() {
  initDatabase();
  try {
    return JSON.parse(localStorage.getItem(DB_KEY));
  } catch (e) {
    console.error('Error reading database', e);
    return DEFAULT_STATE;
  }
}

// Save database back to LocalStorage
function saveDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// Get Logged In User
function getLoggedInUser() {
  const session = sessionStorage.getItem('uconnect_user');
  if (!session) return null;
  const user = JSON.parse(session);
  const db = getDb();
  
  // Find in our database
  let found = db.users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
  
  if (!found) {
    // If not found (newly signed up), create one in DB
    found = {
      id: 'usr_' + Date.now(),
      email: user.email,
      name: user.name || user.email.split('@')[0],
      role: user.role || 'student',
      dept: user.role === 'student' ? 'Computer Science' : 'CSE Department',
      year: '1st Year',
      points: 10,
      badges: [],
      verified: false
    };
    db.users.push(found);
    saveDb(db);
  }
  return found;
}

// Global actions exporting to window
window.UConnect = {
  getDb,
  saveDb,
  getLoggedInUser,
  
  // Post Actions
  addPost: (text, tags = [], imagePlaceholder = null, poll = null) => {
    const db = getDb();
    const user = getLoggedInUser();
    if (!user) return;
    
    const newPost = {
      id: 'post_' + Date.now(),
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role === 'student' ? `${user.dept} · Just now` : `Faculty · ${user.dept} · Just now`,
      authorAvatarColor: user.role === 'student' ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)' : 'linear-gradient(135deg, #10B981, #047857)',
      text,
      tags,
      imagePlaceholder,
      poll,
      likes: [],
      comments: [],
      sharesCount: 0,
      saves: [],
      reported: false
    };
    
    db.posts.unshift(newPost);
    
    // Gamification points
    const uIndex = db.users.findIndex(u => u.id === user.id);
    if (uIndex !== -1) db.users[uIndex].points += 15; // 15 points per post
    
    saveDb(db);
    return newPost;
  },
  
  likePost: (postId, userId) => {
    const db = getDb();
    const post = db.posts.find(p => p.id === postId);
    if (!post) return;
    
    const index = post.likes.indexOf(userId);
    if (index === -1) {
      post.likes.push(userId);
      // Add notification for author
      if (post.authorId !== userId) {
        db.notifications.unshift({
          id: 'ntf_' + Date.now(),
          userId: post.authorId,
          title: 'Like Alert',
          message: `${getLoggedInUser().name} liked your post.`,
          timestamp: 'Just now',
          read: false
        });
      }
    } else {
      post.likes.splice(index, 1);
    }
    saveDb(db);
    return post;
  },
  
  addComment: (postId, text, authorName) => {
    const db = getDb();
    const post = db.posts.find(p => p.id === postId);
    if (!post) return;
    
    const newComment = {
      id: 'c_' + Date.now(),
      authorName,
      text,
      replies: []
    };
    
    post.comments.push(newComment);
    
    // Notification to author
    const user = getLoggedInUser();
    if (post.authorId !== user.id) {
      db.notifications.unshift({
        id: 'ntf_' + Date.now(),
        userId: post.authorId,
        title: 'Comment Alert',
        message: `${authorName} commented on your post.`,
        timestamp: 'Just now',
        read: false
      });
    }
    
    saveDb(db);
    return post;
  },
  
  savePost: (postId, userId) => {
    const db = getDb();
    const post = db.posts.find(p => p.id === postId);
    if (!post) return;
    
    if (!post.saves) post.saves = [];
    const index = post.saves.indexOf(userId);
    if (index === -1) {
      post.saves.push(userId);
    } else {
      post.saves.splice(index, 1);
    }
    saveDb(db);
  },

  reportPost: (postId, userId, reason) => {
    const db = getDb();
    const post = db.posts.find(p => p.id === postId);
    if (!post) return;
    
    post.reported = true;
    db.reports.unshift({
      id: 'rep_' + Date.now(),
      reportedPostId: postId,
      reportedBy: userId,
      reason,
      status: 'Open'
    });
    
    saveDb(db);
  },
  
  deletePost: (postId) => {
    const db = getDb();
    db.posts = db.posts.filter(p => p.id !== postId);
    saveDb(db);
  },
  
  // Messaging Actions
  addMessage: (chatId, text, senderId, senderName) => {
    const db = getDb();
    const chat = db.messages.find(c => c.id === chatId);
    if (!chat) return;
    
    const newMsg = {
      senderId,
      senderName,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    chat.messages.push(newMsg);
    
    // Create notifications for other participants
    chat.participants.forEach(pId => {
      if (pId !== senderId) {
        db.notifications.unshift({
          id: 'ntf_' + Date.now(),
          userId: pId,
          title: 'New Message',
          message: `New message in ${chat.name || senderName}`,
          timestamp: 'Just now',
          read: false
        });
      }
    });
    
    saveDb(db);
    return chat;
  },
  
  // Job Actions
  addJob: (title, description, salary, location, type, skills = []) => {
    const db = getDb();
    const user = getLoggedInUser();
    if (!user) return;
    
    const newJob = {
      id: 'job_' + Date.now(),
      title,
      company: user.company || 'University Partner',
      companyLogo: user.company ? user.company.charAt(0) : 'U',
      location,
      type,
      salary,
      description,
      skills,
      postedBy: user.id,
      postedDate: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Active'
    };
    db.jobs.unshift(newJob);
    saveDb(db);
    return newJob;
  },
  
  applyForJob: (jobId, studentId, matchingScore = 80) => {
    const db = getDb();
    const job = db.jobs.find(j => j.id === jobId);
    if (!job) return;
    
    // Check if already applied
    const exists = db.applications.find(a => a.jobId === jobId && a.studentId === studentId);
    if (exists) return exists;
    
    const newApp = {
      id: 'app_' + Date.now(),
      jobId,
      studentId,
      status: 'Applied',
      score: matchingScore,
      appliedDate: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
    };
    db.applications.push(newApp);
    
    // Alert recruiter
    db.notifications.unshift({
      id: 'ntf_' + Date.now(),
      userId: job.postedBy,
      title: 'Job Application',
      message: `A student has applied for ${job.title}.`,
      timestamp: 'Just now',
      read: false
    });
    
    saveDb(db);
    return newApp;
  },

  // Resource Actions
  addResource: (title, category, courseCode) => {
    const db = getDb();
    const user = getLoggedInUser();
    const newRes = {
      id: 'res_' + Date.now(),
      title,
      category,
      courseCode,
      uploaderName: user.name,
      downloads: 0,
      fileUrl: '#'
    };
    db.resources.unshift(newRes);
    
    // Add points
    const uIndex = db.users.findIndex(u => u.id === user.id);
    if (uIndex !== -1) db.users[uIndex].points += 20; // 20 points for sharing resources!
    
    saveDb(db);
    return newRes;
  },

  // Calendar Planner
  addPlannerTask: (text) => {
    const db = getDb();
    const user = getLoggedInUser();
    const newTask = {
      id: 'tsk_' + Date.now(),
      userId: user.id,
      text,
      completed: false
    };
    db.userTasks.push(newTask);
    saveDb(db);
    return newTask;
  },

  // Event Registration
  registerEvent: (eventId, userId) => {
    const db = getDb();
    const event = db.events.find(e => e.id === eventId);
    if (!event) return;
    
    if (!event.registeredUsers) event.registeredUsers = [];
    if (!event.registeredUsers.includes(userId)) {
      event.registeredUsers.push(userId);
      db.notifications.unshift({
        id: 'ntf_' + Date.now(),
        userId: userId,
        title: 'Event Registered',
        message: `Registered successfully for ${event.title}!`,
        timestamp: 'Just now',
        read: false
      });
      saveDb(db);
    }
  },

  // Notice Actions
  addNotice: (title, content, category) => {
    const db = getDb();
    const user = getLoggedInUser();
    const newNotice = {
      id: 'not_' + Date.now(),
      category,
      title,
      content,
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      author: user.name
    };
    db.notices.unshift(newNotice);
    saveDb(db);
    return newNotice;
  },

  // Marketplace Actions
  addMarketplaceItem: (title, price, category, description, image = '📦') => {
    const db = getDb();
    const user = getLoggedInUser();
    const newItem = {
      id: 'mkt_' + Date.now(),
      title,
      price: parseFloat(price) || 0,
      category,
      description,
      image,
      contact: user.email,
      sellerId: user.id
    };
    db.marketplace.unshift(newItem);
    saveDb(db);
    return newItem;
  }
};

// Auto run init
initDatabase();
