const mongoose = require("mongoose");

const emailVerificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },

  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 10 * 60 * 1000),
  },
});

//automatically delete expired otps
emailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("EmailVerification", emailVerificationSchema);
