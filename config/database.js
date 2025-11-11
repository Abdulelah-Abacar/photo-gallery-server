const mongoose = require("mongoose");

const MOGODB_URI =
  process.env.MOGODB_URI || "mongodb://localhost:27017/photo-gallery";

const connectDB = async () => {
  try {
    await mongoose.connect(MOGODB_URI);
    console.log("connected to MogoDB");
  } catch (err) {
    console.error("Database connection error: ", err);
  }
};

module.exports = connectDB;
