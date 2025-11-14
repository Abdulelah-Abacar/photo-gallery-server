const multer = require("multer");

// Use memory storage since we can't write to disk in Vercel
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only PNG and JPEG images are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 1,
  },
});

module.exports = { upload };
