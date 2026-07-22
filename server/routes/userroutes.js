const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  getAllUsers,
  getUserById,
  updateProfile,
  getCurrentUser,
  changePassword,
} = require("../controllers/userController");
const uploads = require("../middlewares/multerMiddleware");

router.get("/all", auth, getAllUsers);
router.put("/profile", auth, uploads.array("files", 1), updateProfile);
router.get("/me", auth, getCurrentUser);
router.get("/:id", auth, getUserById);
// Change password
router.put("/change-password", auth, changePassword);

module.exports = router;
