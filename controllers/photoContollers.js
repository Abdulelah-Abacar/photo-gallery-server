const { put } = require("@vercel/blob");
const Photo = require("../models/Photo");

const getAllPhotos = async (req, res, next) => {
  try {
    const photos = await Photo.find().populate("userId", "name");
    res.json({ success: true, photos });
  } catch (err) {
    next(err);
  }
};

const createPhoto = async (req, res, next) => {
  const { title, description } = req.body;

  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No photo uploaded" });
    }

    if (!title || title.trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Photo Title is required" });
    }

    // Upload to Vercel Blob
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `photo-${uniqueSuffix}-${req.file.originalname}`;

    const blob = await put(filename, req.file.buffer, {
      access: "public",
      contentType: req.file.mimetype,
    });

    const photo = new Photo({
      title: title.trim(),
      description: description ? description.trim() : "",
      filename: blob.url, // Store the blob URL instead of local filename
      userId: req.user.id,
    });

    await photo.save();

    const populatedPhoto = await Photo.findById(photo._id).populate(
      "userId",
      "name"
    );

    res.status(201).json({ success: true, photo: populatedPhoto });
  } catch (err) {
    next(err);
  }
};

const updatePhoto = async (req, res, next) => {
  const { title, description } = req.body;

  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Photo not found",
      });
    }

    if (photo.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this photo",
      });
    }

    if (!title || title.trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Photo Title is required" });
    }

    photo.title = title.trim();
    photo.description = description ? description.trim() : "";

    await photo.save();

    const populatedPhoto = await Photo.findById(photo._id).populate(
      "userId",
      "name"
    );

    res.json({ success: true, photo: populatedPhoto });
  } catch (err) {
    next(err);
  }
};

const deletePhoto = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Photo not found",
      });
    }

    if (photo.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this photo",
      });
    }

    // Note: Vercel Blob files are automatically cleaned up after 1 hour
    // If you need immediate deletion, you'd need to use a different approach
    // For now, we just delete from database

    await Photo.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Photo deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

const likePhoto = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Photo not found",
      });
    }

    const likeIndex = photo.likes.indexOf(userId);

    if (likeIndex > -1) {
      photo.likes.splice(likeIndex, 1);
    } else {
      photo.likes.push(userId);
    }

    await photo.save();

    const updatedPhoto = await Photo.findById(photo._id).populate(
      "userId",
      "name"
    );
    res.json({ success: true, photo: updatedPhoto });
  } catch (err) {
    next(err);
  }
};

const getUserPhotos = async (req, res, next) => {
  try {
    const photos = await Photo.find({ userId: req.params.id })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, photos });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllPhotos,
  getUserPhotos,
  createPhoto,
  updatePhoto,
  deletePhoto,
  likePhoto,
};

// ================================= OLD =========================

// const fs = require("fs");
// const path = require("path");
// const Photo = require("../models/Photo");

// const UPLOAD_DIR = process.env.UPLOAD_DIR;

// const getAllPhotos = async (req, res, next) => {
//   try {
//     const photos = await Photo.find().populate("userId", "name");
//     res.json({ success: true, photos });
//   } catch (err) {
//     next(err);
//   }
// };

// const createPhoto = async (req, res, next) => {
//   const { title, description } = req.body;

//   try {
//     if (!req.file) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No photo uploaded" });
//     }

//     if (!title && !title.trim().length === 0) {
//       fs.unlinkSync(req.file.path);
//       return res
//         .status(400)
//         .json({ success: false, message: "Photo Title is requierd" });
//     }
//     const photo = new Photo({
//       title: title.trim(),
//       description: description ? description.trim() : "",
//       filename: req.file.filename,
//       userId: req.user.id,
//     });

//     await photo.save();

//     const populatedPhot = await Photo.findById(photo._id).populate(
//       "userId",
//       "name"
//     );

//     res.status(201).json({ success: true, photo: populatedPhot });
//   } catch (err) {
//     if (req.file) {
//       fs.unlinkSync(req.file.path);
//     }
//     next(err);
//   }
// };

// const updatePhoto = async (req, res, next) => {
//   const { title, description } = req.body;

//   try {
//     const photo = await Photo.findById(req.params.id);

//     if (!photo) {
//       return res.status(404).json({
//         success: false,
//         message: "Photo not found",
//       });
//     }

//     if (photo.userId.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: "Not authorized to update this photo",
//       });
//     }

//     if (!title && !title.trim().length === 0) {
//       fs.unlinkSync(req.file.path);
//       return res
//         .status(400)
//         .json({ success: false, message: "Photo Title is requierd" });
//     }

//     photo.title = title.trim();
//     photo.description = description ? description.trim() : "";
//     await photo.save();

//     const populatedPhot = await Photo.findById(photo._id).populate(
//       "userId",
//       "name"
//     );

//     res.json({ success: true, photo: populatedPhot });
//   } catch (err) {
//     if (req.file) {
//       fs.unlinkSync(req.file.path);
//     }
//     next(err);
//   }
// };

// const deletePhoto = async (req, res, next) => {
//   try {
//     const photo = await Photo.findById(req.params.id);

//     if (!photo) {
//       return res.status(404).json({
//         success: false,
//         message: "Photo not found",
//       });
//     }

//     if (photo.userId.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: "Not authorized to delete this photo",
//       });
//     }

//     const filePath = path.join(UPLOAD_DIR, photo.filename);
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }

//     await Photo.findByIdAndDelete(req.params.id);
//     res.json({
//       success: true,
//       message: "Photo deleted successfully",
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// const likePhoto = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const photo = await Photo.findById(req.params.id);

//     if (!photo) {
//       return res.status(404).json({
//         success: false,
//         message: "Photo not found",
//       });
//     }

//     const likeIndex = photo.likes.indexOf(userId);

//     if (likeIndex > -1) {
//       photo.likes.splice(likeIndex, 1);
//     } else {
//       photo.likes.push(userId);
//     }

//     await photo.save();

//     const updatePhoto = await Photo.findById(photo._id).populate(
//       "userId",
//       "name"
//     );
//     res.json({ success: true, photo: updatePhoto });
//   } catch (err) {
//     next(err);
//   }
// };

// const getUserPhotos = async (req, res, next) => {
//   try {
//     const photos = await Photo.find({ userId: req.params.id })
//       .populate("userId", "name")
//       .sort({ createdAt: -1 });

//     res.json({ success: true, photos });
//   } catch (err) {
//     next(err);
//   }
// };

// module.exports = {
//   getAllPhotos,
//   getUserPhotos,
//   createPhoto,
//   updatePhoto,
//   deletePhoto,
//   likePhoto,
// };
