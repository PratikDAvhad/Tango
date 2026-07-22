const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    edited: {
      type: Boolean,
      default: false,
    },
    attachments: [
      {
        url: {
          type: String,
          required: true,
        },

        publicId: {
          type: String,
        },

        fileName: {
          type: String,
          required: true,
        },

        mimeType: {
          type: String,
          required: true,
        },

        size: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
