const express = require("express");
const router = express.Router();

const {
  sendRequest,
  getPendingRequests,
  acceptRequest,
  declineRequest,
} = require("../controllers/friendController");

const auth = require("../middlewares/authMiddleware");

router.post("/request", auth, sendRequest);
router.get("/pending", auth, getPendingRequests);
router.post("/accept", auth, acceptRequest);
router.post("/decline", auth, declineRequest);

module.exports = router;
