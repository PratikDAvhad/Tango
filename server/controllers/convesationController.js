const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

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

    // ADD UNREAD COUNT HERE
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversation: conv._id,
          sender: { $ne: userId },
          seenBy: { $ne: userId },
        });

        return {
          ...conv.toObject(),
          unreadCount,
        };
      }),
    )

    res.status(200).json(conversationsWithUnread);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getUserConversation, createOrGetConversation };
