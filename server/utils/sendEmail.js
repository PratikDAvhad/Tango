const nodemailer = require("nodemailer");
require("dotenv").config();

console.log("BREVO_EMAIL:", process.env.BREVO_EMAIL);
console.log("BREVO_API_KEY exists:", !!process.env.BREVO_API_KEY);

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  requireTLS: true,

  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_API_KEY,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

const sendEmail = async (to, subject, text) => {
  console.log("Before SMTP send");

  try {
    const info = await transporter.sendMail({
      from: `"Tango" <${process.env.BREVO_EMAIL}>`,
      to,
      subject,
      text,
    });

    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (err) {
    console.error("SMTP SEND ERROR:", err);
    throw err;
  }
};

module.exports = sendEmail;
