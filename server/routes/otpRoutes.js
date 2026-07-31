// routes/otpRoutes.js
const express = require("express");
const router = express.Router();

const { verifyEmail, resendOtp } = require("../controllers/otpController");

router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOtp);

module.exports = router;