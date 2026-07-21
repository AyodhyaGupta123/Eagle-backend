import "dotenv/config";
import nodemailer from "nodemailer";

const smtpPort = Number(process.env.SMTP_PORT || 465);

console.log("Mailer SMTP Config:", {
  host: process.env.SMTP_HOST,
  port: smtpPort,
  user: process.env.SMTP_USER,
  passwordAvailable: Boolean(process.env.SMTP_PASS),
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default transporter;