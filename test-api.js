const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { id: '8fa82dcd-2172-4de5-a4de-48fd84a42968' },
  process.env.JWT_SECRET || 'fallback_secret',
  { expiresIn: '1d' }
);

async function testPut() {
  const res = await fetch('http://localhost:3000/api/users/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `accessToken=${token}`
    },
    body: JSON.stringify({
      username: 'taslim_tamim',
      fullName: 'Taslim Ahmed Tamim',
      profileImage: '',
      githubUsername: '',
      title: 'SOC Analyst',
      location: 'Dhaka',
      bio: '',
      university: 'GUB',
      department: '',
      skills: [ { name: 'C++', level: 'Beginner', source: 'Manual' } ],
      experience: [],
      certificates: []
    })
  });
  
  const text = await res.text();
  console.log("STATUS:", res.status);
  console.log("BODY:", text);
}

testPut();
