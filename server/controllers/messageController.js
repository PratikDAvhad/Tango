const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const { getIo } = require("../socket");
const {uploadFiles} = require("../utils/uploadFiles");

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
    const io = getIo();
    const { conversationId, senderId, content } = req.body;

    // Upload attachments to Cloudinary
    const attachments = await uploadFiles(req.files, "ChatApp/ChatAttachments");

    // Create message
    const message = await Message.create({
      sender: senderId,
      conversation: conversationId,
      content: content || " ",
      attachments,
    });

    console.log(message);

    await message.populate("sender", "name profilePic");
    await message.populate("conversation");

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
    });

    const participants = message.conversation.participants;
    console.log(participants);
    participants.forEach((userId) => {
      console.log("User Id : ", userId.toString());
      io.to(userId.toString()).emit("receive-message", message);
    });

    res.status(201).json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

//controller for updating message
const updateMessage = async (req, res) => {
  try {
    const io = getIo();
    const { content } = req.body;
    console.log("Update route hitted");

    const msg = await Message.findById(req.params.messageId);

    if (!msg) {
      res.status(400).json({ message: "Message not found." });
      return;
    }

    const updatedMsg = await Message.findByIdAndUpdate(
      req.params.messageId,
      {
        content: content,
        edited: true,
      },
      {
        new: true,
      },
    ).populate("sender conversation");

    console.log("Updated Msg => " + updatedMsg);

    // event for updating msg
    const participants = updatedMsg.conversation.participants;
    console.log(participants);
    participants.forEach((userId) => {
      console.log("User Id : ", userId.toString());
      io.to(userId.toString()).emit("message-edited", updatedMsg);
    });
    res.status(201).json({ updatedMsg });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json({ message: e.message });
  }
};

// controller for deleting the message
const deleteMessage = async (req, res) => {
  try {
    const io = getIo();
    const mId = req.params.messageId;
    const msg = await Message.findById(mId);

    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    const deletedMsg = await Message.findByIdAndDelete(mId).populate(
      "sender conversation",
    );

    const latestMessage = await Message.findOne({
      conversation: deletedMsg.conversation._id,
    }).sort({ createdAt: -1 });

    await Conversation.findByIdAndUpdate(deletedMsg.conversation._id, {
      lastMessage: latestMessage ? latestMessage._id : null,
    });

    // event for handling msg deletion
    const participants = deletedMsg.conversation.participants;
    participants.forEach((userId) => {
      io.to(userId.toString()).emit("message-deleted", {
        messageId: deletedMsg._id,
        lastMessage: latestMessage,
      });
    });

    res.status(201).json({ message: "Message is deleted successfully." });
  } catch (e) {
    res.status(500).json({ message: "Internal server error " + e.stack });
  }
};

module.exports = { getMessages, sendMessage, updateMessage, deleteMessage };
