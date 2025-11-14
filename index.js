require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const photoRoutes = require("./routes/photo");
const userRoutes = require("./routes/user");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;
const UPLOAD_DIR = process.env.UPLOAD_DIR;

connectDB();

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["POST", "GET", "DELETE", "PUT"],
  })
);

app.use(express.json());
app.use("/uploads", express.static(UPLOAD_DIR));

app.use("/api/auth", authRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is runnig on port ${PORT}`));
