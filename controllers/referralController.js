const User = require("../models/User");
const ReferralIncome = require("../models/ReferralIncome");

const LEVEL_PERCENTAGES = {
  1: 0.05,
  2: 0.03,
  3: 0.02,
};

exports.distributeReferralIncome = async (generatorId, investmentAmount) => {
  try {
    let currentUser = await User.findById(generatorId);
    let currentLevel = 1;

    while (currentUser && currentUser.referredBy && currentLevel <= 3) {
      const uplineUser = await User.findById(currentUser.referredBy);

      if (!uplineUser) break;

      const incomeAmount = investmentAmount * LEVEL_PERCENTAGES[currentLevel];

      uplineUser.walletBalance = (uplineUser.walletBalance || 0) + incomeAmount;
      uplineUser.totalLevelIncomeEarned =
        (uplineUser.totalLevelIncomeEarned || 0) + incomeAmount;
      await uplineUser.save();

      await ReferralIncome.create({
        receiver: uplineUser._id,
        generator: generatorId,
        level: currentLevel,
        amount: incomeAmount,
      });

      currentUser = uplineUser;
      currentLevel++;
    }
    return true;
  } catch (error) {
    console.error("Error distributing referral income:", error);
    throw new Error("Referral distribution failed");
  }
};






