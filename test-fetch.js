fetch("http://localhost:3000/api/auth/login", { 
  method: "POST", 
  headers: { "Content-Type": "application/json" }, 
  body: JSON.stringify({ email: "taslimahmedtamim4u@gmail.com", password: "password123!" }) 
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
