const Story = require("../models/Story");
const User = require("../models/User");
const { uploadFiles, deleteFile } = require("../utils/uploadFiles");
const { getIo } = require("../socket");

const uploadStory = async (req, res) => {
  try {
    const io = getIo();

    const { caption } = req.body;
    const userId = req.user._id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Please upload an image or video.",
      });
    }

    // Upload to Cloudinary
    const uploaded = await uploadFiles(req.files, "ChatApp/Stories");

    const file = uploaded[0];

    const story = await Story.create({
      user: userId,
      media: {
        url: file.url,
        publicId: file.publicId,
        type: file.mimeType.startsWith("image") ? "image" : "video",
      },
      caption,
    });

    await story.populate("user", "name profilePic");
    io.to(userId.toString()).emit("story-added", story);

    const user = await User.findById(userId);

    user.friends.forEach((friendId) => {
      io.to(friendId.toString()).emit("story-added", story);
    });

    res.status(201).json(story);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getStories = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    console.log("Current user:", currentUser);
    console.log("Friends:", currentUser.friends);

    const ids = [...currentUser.friends, currentUser._id];

    console.log("Searching stories for:", ids);

    const stories = await Story.find({
      user: { $in: ids },
    })
      .populate("user", "name profilePic")
      .sort({ createdAt: -1 });

    console.log(stories);

    console.log(stories);
    res.json(stories);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const deleteStory = async (req, res) => {
  try {
    const io = getIo();

    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        message: "Story not found",
      });
    }

    if (story.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await deleteFile(story.media.publicId, story.media.type);

    await Story.findByIdAndDelete(story._id);

    io.to(req.user._id.toString()).emit("story-deleted", story._id);

    const user = await User.findById(req.user._id).select("friends");

    user.friends.forEach((friendId) => {
      io.to(friendId.toString()).emit("story-deleted", story._id);
    });

    res.json({
      message: "Story deleted successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  uploadStory,
  getStories,
  deleteStory,
};
