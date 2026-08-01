const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_API_KEY,
  },
});

const sendEmail = async (to, subject, text) => {
  console.log("Connecting to Brevo...");

  await transporter.verify();
  console.log("SMTP verified");
  await transporter.sendMail({
    from: `"Tango" <${process.env.SENDER_EMAIL}>`,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
