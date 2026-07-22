const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const registerUser = async (req, res) => {
  try {
    console.log("In the register controller ");
    console.log("req body in register", req.file);
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    let profilePic = "https://res.cloudinary.com/dp70s4qu7/image/upload/v1784470092/pexels-batitay-japheth-43379766-16333664_wqhlvp.jpg";

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

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.status(201).json({ user, token });
  } catch (err) {
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

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser };
