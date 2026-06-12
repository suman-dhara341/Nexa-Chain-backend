const User = require("../models/User");
const ReferralIncome = require("../models/ReferralIncome");

const LEVEL_PERCENTAGES = [5, 3, 2];

const distributeLevelIncome = async (investorId, investmentAmount) => {
  try {
    let currentUser = await User.findById(investorId);
    let currentLevel = 1;

    while (currentUser.referredBy && currentLevel <= LEVEL_PERCENTAGES.length) {
      const parentUser = await User.findById(currentUser.referredBy);
      if (!parentUser) break;

      const commissionPercentage = LEVEL_PERCENTAGES[currentLevel - 1];
      const incomeAmount = (investmentAmount * commissionPercentage) / 100;

      await ReferralIncome.create({
        receiver: parentUser._id,
        generator: investorId,
        level: currentLevel,
        amount: incomeAmount,
      });

      await User.findByIdAndUpdate(parentUser._id, {
        $inc: {
          walletBalance: incomeAmount,
          totalLevelIncomeEarned: incomeAmount,
        },
      });

      console.log(
        `Level ${currentLevel} income of $${incomeAmount} credited to User: ${parentUser._id}`,
      );

      currentUser = parentUser;
      currentLevel++;
    }
  } catch (error) {
    console.error("Error distributing level income:", error);
  }
};

module.exports = { distributeLevelIncome };
