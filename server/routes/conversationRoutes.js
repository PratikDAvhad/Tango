const express = require("express");
const auth = require("../middlewares/authMiddleware");
const {
  createOrGetConversation,
  getUserConversation,
} = require("../controllers/convesationController");

const router = express.Router();

router.post("/", auth, createOrGetConversation);
router.get("/:userId", auth, getUserConversation);

module.exports = router;
