const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const { getAllUsers, getUserById} = require("../controllers/userController");

router.get("/all", auth, getAllUsers);
router.get("/:id", auth, getUserById );

module.exports = router;