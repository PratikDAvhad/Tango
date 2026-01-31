const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

const getMessages = async (req, res) => {
  try {
    const { convertationId } = req.params;

    const messages = await Message.find({
      conversation: convertationId,
    })
      .populate("sender", "name profilePic")
      .sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, content } = req.body;

    const message = await Message.create({
      sender: senderId,
      conversation: conversationId,
      content,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMessages, sendMessage };
