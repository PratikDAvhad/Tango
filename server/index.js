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

connectDB();

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);

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

io.on("connection", (socket) => {
  console.log("New client connected ", socket.id);

  socket.on("setup", (userId) => {
    socket.join(userId);
    socket.emit("connected");
    console.log("User joined room : ", userId);
  });

  socket.on("send-message", (msg) => {
    if (!msg || !msg.recipient) return;
    console.log(msg);
    socket.to(msg.recipient).emit("recieve-message", msg);
    socket.emit("recieve-message", msg);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log("server is listening on ", PORT);
});
