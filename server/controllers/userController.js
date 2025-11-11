const User = require("../models/User");

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
    try{
        const user = await User.findById(req.params.id).select("-password");
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        return res.json(user);
    }catch(err){
        console.error(err.message);
        return res.status(500).json({message: "Server error"});
    }
}

module.exports = {getAllUsers, getUserById};