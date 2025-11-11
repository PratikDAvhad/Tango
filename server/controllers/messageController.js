const Message = require("../models/Message");
const User = require("../models/User");

const getMessages = async (req, res) => {
  try {
    const userId = req.params.id;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        {
          sender: myId,
          recipient: userId,
        },
        {
          recipient: myId,
          sender: userId,
        },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { recipient, content } = req.body;

    const message = await Message.create({
      sender: req.user._id,
      recipient,
      content,
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMessages, sendMessage };
