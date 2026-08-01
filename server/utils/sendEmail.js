const axios = require("axios");
require("dotenv").config();

const sendEmail = async (to, subject, text) => {
  try {
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
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Brevo email sent:", response.data);
    return response.data;
  } catch (err) {
    console.error("Brevo API Error:", err.response?.data || err.message);
    throw err;
  }
};

module.exports = sendEmail;