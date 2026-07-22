const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/profilePics",

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/webp", // PDF
    "application/pdf",

    // Text
    "text/plain",

    // Word
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    // Excel
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    // PowerPoint
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // accept file
  } else {
    cb(new Error("Unsupported file type.."));
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024, files: 10 }, // 5mb
});
