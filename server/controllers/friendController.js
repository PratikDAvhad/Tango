const User = require("../models/User");
const FriendRequest = require("../models/FriendRequest");
const Conversation = require("../models/Conversation");

const sendRequest = async (req, res) => {
  try {
    const senderId = req.user._id;

    const { email } = req.body;

    const reciever = await User.findOne({ email });

    if (!reciever) {
      return res.status(404).json({ message: "User not found" });
    }

    if (reciever._id.toString() === senderId.toString()) {
      return res.status(400).json({ message: "You can't add yourself" });
    }

    const sender = await User.findById(senderId);

    if (sender.friends.includes(reciever._id)) {
      return res.status(400).json({ message: "You are already friends" });
    }

    const existing = await FriendRequest.findOne({
      sender: senderId,
      reciever: reciever._id,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({ message: "Request already sent." });
    }

    await FriendRequest.create({
      sender: senderId,
      reciever: reciever._id,
    });

    res.json({ message: "Friend request sent." });
  } catch (err) {
    res.status(500).json({ error: "Server error : " + err });
  }
};

const getPendingRequests = async (req, res) => {
  const requests = await FriendRequest.find({
    reciever: req.user._id,
    status: "pending",
  }).populate("sender", "name profilePic email");

  res.status(200).json(requests);
};

const acceptRequest = async (req, res) => {
  const { requestId } = req.body;

  const request = await FriendRequest.findById(requestId);

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  request.status = "accepted";

  await request.save();

  await User.findByIdAndUpdate(request.sender, {
    $addToSet: { friends: request.reciever },
  });

  await User.findByIdAndUpdate(request.reciever, {
    $addToSet: { friends: request.sender },
  });

  await Conversation.create({
    participants: [request.sender, request.reciever],
  });

  res.status(200).json({ message: "Friend added" });
};

module.exports = { sendRequest, getPendingRequests, acceptRequest };
