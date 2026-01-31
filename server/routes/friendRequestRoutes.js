const express = require("express");
const router = express.Router();

const {
  sendRequest,
  getPendingRequests,
  acceptRequest,
} = require("../controllers/friendController");

const auth = require("../middlewares/authMiddleware");

router.post("/request", auth, sendRequest);
router.get("/pending", auth, getPendingRequests);
router.post("/accept", auth, acceptRequest);

module.exports = router;
