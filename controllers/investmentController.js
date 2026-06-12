const Investment = require("../models/Investment");
const User = require("../models/User");
const { distributeReferralIncome } = require("./referralController");

exports.getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    const activeInvestments = await Investment.find({
      userReference: req.user._id,
      investmentStatus: "Active",
    });

    const totalInvestedAmount = activeInvestments.reduce(
      (acc, curr) => acc + curr.investmentAmount,
      0,
    );

    res.status(200).json({
      walletBalance: user.walletBalance,
      totalRoiEarned: user.totalRoiEarned,
      totalLevelIncomeEarned: user.totalLevelIncomeEarned,
      totalInvestedAmount,
      activeInvestmentsCount: activeInvestments.length,
      recentInvestments: activeInvestments,
      referralCode: user.referralCode,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error fetching dashboard data",
      error: error.message,
    });
  }
};

exports.createInvestment = async (req, res) => {
  try {
    const {
      investmentAmount,
      planDetails,
      duration, 
      dailyRoiPercentage,
    } = req.body;

    if (!duration) {
      return res.status(400).json({ message: "Duration is required" });
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + Number(duration));

    const investment = await Investment.create({
      userReference: req.user._id,
      investmentAmount,
      planDetails,
      endDate,
      dailyRoiPercentage,
    });

    await distributeReferralIncome(req.user._id, investmentAmount);

    res.status(201).json({
      message:
        "Investment created successfully and referral income distributed",
      investment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error creating investment",
      error: error.message,
    });
  }
};
