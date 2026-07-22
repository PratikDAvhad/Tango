const express = require("express");
const router = express.Router();
const { loginUser, registerUser } = require("../controllers/authController");
const uploads = require("../middlewares/multerMiddleware.js");

router.post(
  "/register",
  (req, res, next) => {
    uploads.single("profilePic")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      }

      next();
    });
  },
  registerUser,
);
router.post("/login", loginUser);

module.exports = router;
