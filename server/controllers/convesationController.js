const Conversation = require("../models/Conversation");

const createOrGetConversation = async (req, res) => {
  try {
    const { userId, receiverId } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, receiverId],
      });
    }
    console.log("Conversation = > ", conversation);
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name profilePic")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getUserConversation, createOrGetConversation };
