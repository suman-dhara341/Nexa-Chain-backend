const express = require("express");
const router = express.Router();
const {
  getDashboardData,
  createInvestment,
} = require("../controllers/investmentController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/dashboard", protect, getDashboardData);
router.post("/", protect, createInvestment);

module.exports = router;
