const User = require("../models/User");
const Investment = require("../models/Investment");
const RoiHistory = require("../models/RoiHistory");
const ReferralIncome = require("../models/ReferralIncome");

const getDownline = async (userId, currentLevel, maxLevel) => {
  if (currentLevel > maxLevel) return [];

  const children = await User.find({ referredBy: userId }).select(
    "fullName email createdAt",
  );
  const result = [];

  for (let child of children) {
    result.push({
      _id: child._id,
      fullName: child.fullName,
      email: child.email,
      joinedAt: child.createdAt,
      level: currentLevel,
      downline: await getDownline(child._id, currentLevel + 1, maxLevel),
    });
  }
  return result;
};

exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user._id;

    const investments = await Investment.find({ userReference: userId }).sort({
      createdAt: -1,
    });

    const roiHistories = await RoiHistory.find({ userReference: userId })
      .populate("investmentReference", "planDetails investmentAmount")
      .sort({ createdAt: -1 });

    const referralIncomes = await ReferralIncome.find({ receiver: userId })
      .populate("generator", "fullName email")
      .sort({ createdAt: -1 });

    const referralTree = await getDownline(userId, 1, 3);

    res.status(200).json({
      investments,
      roiHistories,
      referralIncomes,
      referralTree,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server Error fetching user details",
        error: error.message,
      });
  }
};
