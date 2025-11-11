const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const { getCurrentUser } = require("../controllers/userContollers");

const router = express.Router();

router.get("/me", authenticateToken, getCurrentUser);

module.exports = router;
