import nodemailer from 'nodemailer';

// Transporter will be initialized asynchronously
let transporter: nodemailer.Transporter | null = null;

const initTransporter = async () => {
  if (transporter) return transporter;
  
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Generate test account on the fly
    console.log("Generating Ethereal test account...");
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  }
  return transporter;
};

export const sendWeeklyDigest = async (user: any, stats: any) => {
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background-color: #2563eb; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">UConnect Weekly Digest</h1>
      </div>
      
      <div style="padding: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
        <h2>Hello ${user.fullName},</h2>
        <p>Here's your weekly progress and what's happening in the UConnect community!</p>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; color: #2563eb;">Your Stats This Week</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            <li style="margin-bottom: 10px;">🏆 <strong>${stats.pointsEarned}</strong> points earned</li>
            <li style="margin-bottom: 10px;">📈 <strong>${stats.skillsVerified}</strong> new skills verified</li>
            <li>💬 <strong>${stats.postsMade}</strong> community posts</li>
          </ul>
        </div>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; color: #2563eb;">Community Highlights</h3>
          <p>Don't miss out on what's trending:</p>
          <ul style="padding-left: 20px;">
            ${stats.trendingTopics.map((topic: any) => `<li style="margin-bottom: 5px;"><strong>${topic.tag}</strong> (${topic.count} posts)</li>`).join('')}
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:3000/dashboard" style="background-color: #2563eb; color: white; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold; display: inline-block;">View Dashboard</a>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #64748b;">
        <p>You're receiving this because you're a member of UConnect.</p>
      </div>
    </div>
  `;

  try {
    const mailTransporter = await initTransporter();
    
    const info = await mailTransporter.sendMail({
      from: '"UConnect Team" <noreply@uconnect.app>',
      to: user.email, 
      subject: `Your UConnect Weekly Digest! 🚀`,
      html: htmlTemplate,
    });
    
    console.log(`Email sent to ${user.email}. Message ID: ${info.messageId}`);
    
    // Check if it's ethereal and log preview URL
    if (!process.env.SMTP_HOST || process.env.SMTP_HOST.includes('ethereal')) {
       console.log(`Preview URL for ${user.email}: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};
