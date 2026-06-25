import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Create a reusable transporter using SMTP transport
// You will need to add these credentials to your .env file
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || undefined, // Your SMTP user
    pass: process.env.SMTP_PASS || undefined, // Your SMTP password
  },
});

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    // If SMTP credentials aren't set, just log it out in development
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      const nextAuthUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const localPreviewUrl = `${nextAuthUrl}/emails/latest.html`;

      try {
        const publicEmailsDir = path.join(process.cwd(), "public", "emails");
        if (!fs.existsSync(publicEmailsDir)) {
          fs.mkdirSync(publicEmailsDir, { recursive: true });
        }
        const filePath = path.join(publicEmailsDir, "latest.html");
        fs.writeFileSync(filePath, html, "utf-8");
      } catch (fsError) {
        console.error("Failed to save simulated email to public directory:", fsError);
      }

      console.log(`\n============================================================`);
      console.log(`📧 SIMULATED EMAIL SENT (SMTP Credentials Missing)`);
      console.log(`------------------------------------------------------------`);
      console.log(`To:      ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`------------------------------------------------------------`);
      
      // Extract OTP from HTML (looks for block containing OTP code)
      const otpMatch = html.match(/>(\d{6})</);
      if (otpMatch) {
        console.log(`🔑 OTP CODE DETECTED: \x1b[33m${otpMatch[1]}\x1b[0m`);
        console.log(`------------------------------------------------------------`);
      }
      
      // Extract links from HTML
      const linkRegex = /href="([^"]+)"/g;
      let match;
      const links: string[] = [];
      while ((match = linkRegex.exec(html)) !== null) {
        links.push(match[1]);
      }
      
      if (links.length > 0) {
        console.log(`Detected Links:`);
        for (const link of links) {
          console.log(`  🔗 ${link}`);
        }
        console.log(`------------------------------------------------------------`);
      }
      
      console.log(`📂 Local HTML Preview (Open in browser):`);
      console.log(`  👉 \x1b[36m${localPreviewUrl}\x1b[0m`);
      console.log(`============================================================\n`);

      return true; // Simulate success
    }

    const info = await transporter.sendMail({
      from: process.env.STORE_EMAIL || process.env.SMTP_USER || '"Store" <noreply@store.com>',
      to,
      subject,
      html,
    });

    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
