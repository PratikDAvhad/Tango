require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authroutes");
const userRoutes = require("./routes/userroutes");
const messageRoutes = require("./routes/messageRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const friendRoutes = require("./routes/friendRequestRoutes");
const { initSocket } = require("./socket");
const aiRoutes = require("./routes/aiRoutes");
const storyRoutes = require("./routes/storyRoutes");

connectDB();

const onlineUsers = new Map();
// userId -> socketId

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/friend", friendRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/story", storyRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the chat application</h1>");
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

initSocket(io);

io.on("connection", (socket) => {
  socket.on("user-online", (userId) => {
    onlineUsers.set(userId, socket.id);

    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  socket.on("setup", (userId) => {
    socket.join(userId);
    socket.emit("connected");
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socket.id === socketId) {
        onlineUsers.delete(userId);
        break;
      }
    }

    io.emit("online-users", Array.from(onlineUsers.keys()));
    console.log("Client disconnected", socket.id);
  });
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log("server is listening on ", PORT);
});
