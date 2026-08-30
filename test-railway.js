async function testApi() {
  const res = await fetch("https://uconnect.up.railway.app/api/auth/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "taslimahmed4323@gmail.com" })
  });
  const data = await res.json();
  console.log(res.status, data);
}
testApi();
