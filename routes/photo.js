const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const {
  getAllPhotos,
  getUserPhotos,
  deletePhoto,
  updatePhoto,
  likePhoto,
  createPhoto,
} = require("../controllers/photoContollers");

const router = express.Router();

router.get("/", getAllPhotos);
router.post("/", authenticateToken, upload.single("photo"), createPhoto);
router.put("/:id", authenticateToken, updatePhoto);
router.delete("/:id", authenticateToken, deletePhoto);
router.post("/:id/like", authenticateToken, likePhoto);
router.get("/users/:id/photos", authenticateToken, getUserPhotos);

module.exports = router;
