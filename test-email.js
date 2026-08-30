const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log("Testing email with user:", process.env.EMAIL_USER);
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("Missing EMAIL_USER or EMAIL_PASS in .env");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  try {
    console.log("Verifying connection...");
    await transporter.verify();
    console.log("Connection verified successfully!");

    console.log("Attempting to send test email...");
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Email from Node.js",
      text: "If you receive this, Nodemailer is working perfectly!",
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error occurred:", error.message);
    if (error.code === 'EAUTH') {
      console.error("Authentication failed. Check if App Password is correct and 2FA is enabled.");
    }
  }
}

testEmail();
