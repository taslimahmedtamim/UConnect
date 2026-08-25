fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'taslimahmedtamim4u@gmail.com', password: 'password123' })
})
.then(res => res.text().then(text => console.log('Status:', res.status, 'Body:', text)))
.catch(err => console.error(err));
