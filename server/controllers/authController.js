const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const sendEmail = require("../utils/sendEmail");
const EmailVerification = require("../models/EmailVerification");

const registerUser = async (req, res) => {
  try {
    console.log("In the register controller ");
    console.log("req body in register", req.body);
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    let profilePic =
      "https://res.cloudinary.com/dp70s4qu7/image/upload/v1785668420/blank-profile-picture-973460_960_720_ukswgg.webp";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profilePics",
      });

      profilePic = result.secure_url;

      //delete local file after successful upload
      fs.unlinkSync(req.file.path);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePic,
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await EmailVerification.deleteMany({ userId: user._id });

    const savedVerification = await EmailVerification.create({
      userId: user._id,
      otp: otp,
    });

    console.log(savedVerification);

    await sendEmail(
      email,
      "Verify your tango account",
      `Your verification code is : ${otp}`,
    );

    res.status(201).json({
      message: "OTP sent to your email",
      userId: user._id.toString(),
      email: user.email,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.error(user);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    user.isEmailVerified = false;

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // =====================================
    // EMAIL NOT VERIFIED
    // =====================================

    if (!user.isEmailVerified) {
      // Remove old OTP
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
      console.log("Email is being sent");
      // Send email
      await sendEmail(
        user.email,
        "Tango - Verify Your Email",
        `Your verification code is: ${otp}`,
      );
      console.log("Email has been sent");
      return res.status(403).json({
        message: "Email not verified. OTP has been sent again.",
        requiresVerification: true,
        userId: user._id,
        email: user.email,
      });
    }

    // =====================================
    // VERIFIED USER
    // =====================================

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser };
