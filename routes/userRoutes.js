const express = require("express");
const router = express.Router();
const { getUserDetails } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/details", protect, getUserDetails);

module.exports = router;
