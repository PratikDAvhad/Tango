const User = require("../models/User");
const { uploadFiles } = require("../utils/uploadFiles");

const getAllUsers = async (req, res) => {
  try {
    const currUserId = req.user._id;

    const users = await User.find({ _id: { $ne: currUserId } })
      .select("_id name email profilePic")
      .sort({ name: 1 });

    return res.json(users);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Server error." });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    console.log("1");

    const user = await User.findById(req.user._id);

    console.log("2");

    await user.populate("friends", "name email profilePic");

    console.log("3");

    res.status(200).json(user);

    console.log("4");
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, about, phone, location } = req.body;

    //update normal fields
    user.name = name;
    // user.email = email;
    user.about = about;
    user.phone = phone;
    user.location = location;

    // upload new profile picture if selected

    if (req.files?.length > 0) {
      const uploadedFiles = await uploadFiles(req.files, "ChatApp/ProfilePics");

      user.profilePic = uploadedFiles[0].url;
    }

    await user.save();
    const updatedUser = await User.findById(user._id).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

const bcrypt = require("bcryptjs");

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    const valid = await bcrypt.compare(currentPassword, user.password);
    console.log(valid);

    if (!valid) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateProfile,
  getCurrentUser,
  changePassword,
};
