const mongoose = require("mongoose");

const PhotoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Photo title is required"],
    trim: true,
    maxlength: [100, "Title must not exceed 100 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description must not exceed 500 characters"],
  },
  filename: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

PhotoSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Photo", PhotoSchema);
