const express = require("express");

const router = express.Router();
const upload = require("../middlewares/multerMiddleware");

const { chatWithAI } = require("../controllers/aiController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/chat", authMiddleware, upload.array("files", 10), chatWithAI);

module.exports = router;
