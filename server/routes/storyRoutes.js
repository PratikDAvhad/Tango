const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const uploads = require("../middlewares/multerMiddleware");

const {
  uploadStory,
  getStories,
  deleteStory,
} = require("../controllers/storyController");

// Upload a story
router.post(
  "/",
  auth,
  uploads.array("files", 1),
  uploadStory
);

// Get all stories (friends + self)
router.get(
  "/",
  auth,
  getStories
);

// Delete a story
router.delete(
  "/:id",
  auth,
  deleteStory
);

module.exports = router;