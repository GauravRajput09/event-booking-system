// uploadMiddle.js
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Set storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Changed from 'upload/' to 'uploads/' for consistency
  },
  filename: function (req, file, cb) {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});

// File type check
const fileFilter = (req, file, cb) => {
  // Allow only images
const fileTypes = /jpeg|jpg|png|gif/;

  // Check extension
const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

  // Check mime type
const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Images only!"), false);
  }
};

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: fileFilter,
});

module.exports = upload;
