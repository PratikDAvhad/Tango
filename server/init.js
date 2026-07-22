const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Conversation = require("./models/Conversation");
const Message = require("./models/Message");
const Story = require("./models/Story");
const FriendRequest = require("./models/FriendRequest");

async function initialize() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    // Delete old data
    await Promise.all([
      User.deleteMany({}),
      Conversation.deleteMany({}),
      Message.deleteMany({}),
      Story.deleteMany({}),
      FriendRequest.deleteMany({}),
    ]);

    console.log("Old data deleted");

    const password = await bcrypt.hash("123456", 10);

    // ---------------- Users ----------------

    const users = await User.insertMany([
      {
        name: "John Doe",
        email: "john@gmail.com",
        password,
        profilePic: "https://ui-avatars.com/api/?name=John+Doe",
      },
      {
        name: "Alice Smith",
        email: "alice@gmail.com",
        password,
        profilePic: "https://ui-avatars.com/api/?name=Alice+Smith",
      },
      {
        name: "Emma Wilson",
        email: "emma@gmail.com",
        password,
        profilePic: "https://ui-avatars.com/api/?name=Emma+Wilson",
      },
      {
        name: "Michael Brown",
        email: "michael@gmail.com",
        password,
        profilePic: "https://ui-avatars.com/api/?name=Michael+Brown",
      },
      {
        name: "Sophia Davis",
        email: "sophia@gmail.com",
        password,
        profilePic: "https://ui-avatars.com/api/?name=Sophia+Davis",
      },
    ]);

    console.log("Users created");

    // Friends
    users[0].friends.push(users[1]._id);
    users[1].friends.push(users[0]._id, users[4]._id);
    users[2].friends.push(users[0]._id);
    users[3].friends.push(users[4]._id);
    users[4].friends.push(users[1]._id, users[3]._id);

    await Promise.all(users.map((u) => u.save()));

    // Pending Friend Request

    await FriendRequest.create({
      sender: users[2]._id,
      reciever: users[4]._id,
      status: "pending",
    });

    console.log("Friend request created");

    // Conversation

    const conversation = await Conversation.create({
      participants: [users[0]._id, users[1]._id],
    });

    const messages = await Message.insertMany([
      {
        sender: users[0]._id,
        conversation: conversation._id,
        content: "Hey Alice!",
      },
      {
        sender: users[1]._id,
        conversation: conversation._id,
        content: "Hi John 👋",
      },
      {
        sender: users[0]._id,
        conversation: conversation._id,
        content: "How are you?",
      },
      {
        sender: users[1]._id,
        conversation: conversation._id,
        content: "Doing great 😊",
      },
    ]);

    conversation.lastMessage = messages[messages.length - 1]._id;
    await conversation.save();

    console.log("Conversation created");

    // Stories

    await Story.insertMany([
      {
        user: users[0]._id,
        media: {
          url: "https://picsum.photos/500/800?random=1",
          publicId: "demo1",
          type: "image",
          caption: "Beautiful day!",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      },
      {
        user: users[1]._id,
        media: {
          url: "https://picsum.photos/500/800?random=2",
          publicId: "demo2",
          type: "image",
          caption: "Coffee ☕",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      },
    ]);

    console.log("Stories created");

    console.log("Database initialized successfully.");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

initialize();
