const User = require("../models/User");
const EmailVerification = require("../models/EmailVerification");
const sendEmail = require("../utils/sendEmail");

const jwt = require("jsonwebtoken");

// ========================================
// Verify Email
// ========================================

const verifyEmail = async (req, res) => {
  try {

    const { userId, otp } = req.body;
    const user = await User.findOne({ _id:userId });
    console.log(userId);
    const verification = await EmailVerification.findOne({ userId });

    console.log(verification);

    if (!verification) {
      return res.status(400).json({
        message: "OTP expired or not found",
      });
    }

    if (verification.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    await User.findByIdAndUpdate(userId, {
      isEmailVerified: true,
    });

    await EmailVerification.deleteMany({ userId });

    // GENERATE TOKEN AFTER VERIFICATION
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Email verified successfully",
      user,
      token,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err,
    });
  }
};

// ========================================
// Resend OTP
// ========================================

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        message: "Email already verified",
      });
    }

    // Remove previous OTPs
    await EmailVerification.deleteMany({
      userId: user._id,
    });

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP
    await EmailVerification.create({
      userId: user._id,
      otp,
    });

    // Send email
    await sendEmail(
      user.email,
      "Tango - New Verification Code",
      `Your new verification code is: ${otp}`
    );

    res.json({
      message: "OTP resent successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to resend OTP",
    });
  }
};

module.exports = {
  verifyEmail,
  resendOtp,
};