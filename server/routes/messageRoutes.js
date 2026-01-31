const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {getMessages, sendMessage} = require("../controllers/messageController");

router.get("/:convertationId", auth, getMessages);
router.post("/send", auth, sendMessage);

module.exports = router;