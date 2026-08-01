const axios = require("axios");
require("dotenv").config();

const sendEmail = async (to, subject, text) => {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    throw new Error("BREVO_API_KEY is missing");
  }

  const response = await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        name: "Tango",
        email: "avhadpratik938@gmail.com",
      },
      to: [{ email: to }],
      subject,
      textContent: text,
    },
    {
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
    }
  );

  console.log("Brevo email sent:", response.data);
};

module.exports = sendEmail;