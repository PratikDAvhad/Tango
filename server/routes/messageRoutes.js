const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  getMessages,
  sendMessage,
  updateMessage,
  deleteMessage,
} = require("../controllers/messageController");
const uploads = require("../middlewares/multerMiddleware");

router.get("/:convertationId", auth, getMessages);
router.post("/send", auth, uploads.array("files", 10), sendMessage);
router.put("/:messageId", auth, updateMessage);
router.delete("/:messageId", auth, deleteMessage);

module.exports = router;
