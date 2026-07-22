const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const uploadFiles = async (files, folder = "ChatApp") => {
  if (!files || files.length === 0) return [];

  const uploadedFiles = [];

  try {
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: "auto",
      });

      uploadedFiles.push({
        url: result.secure_url,
        publicId: result.public_id,
        fileName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      });

      // Delete local file after upload
      fs.unlinkSync(file.path);
    }

    return uploadedFiles;
  } catch (err) {
    // Clean up uploaded temp files even if upload fails
    files.forEach((file) => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });

    throw err;
  }
};

const deleteFile = async (publicId, resourceType = "image") => {
  if (!publicId) return;

  return await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};

module.exports = {
  uploadFiles,
  deleteFile,
};
