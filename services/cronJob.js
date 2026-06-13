const cron = require("node-cron");
const Investment = require("../models/Investment");
const User = require("../models/User");
const RoiHistory = require("../models/RoiHistory");

const runDailyROI = async () => {
  console.log("--- Starting Daily ROI Calculation ---");
  try {
    const activeInvestments = await Investment.find({
      investmentStatus: "Active",
    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    for (let investment of activeInvestments) {
      const alreadyCredited = await RoiHistory.findOne({
        investmentReference: investment._id,
        date: { $gte: startOfDay, $lte: endOfDay },
      });

      if (alreadyCredited) {
        console.log(
          `ROI already credited today for Investment ID: ${investment._id}. Skipping...`,
        );
        continue; 
      }

      const roiAmount =
        (investment.investmentAmount * investment.dailyRoiPercentage) / 100;

      await RoiHistory.create({
        userReference: investment.userReference,
        investmentReference: investment._id,
        roiAmount: roiAmount,
      });

      await User.findByIdAndUpdate(investment.userReference, {
        $inc: {
          walletBalance: roiAmount,
          totalRoiEarned: roiAmount,
        },
      });

      console.log(
        `Successfully credited $${roiAmount} to User: ${investment.userReference}`,
      );

      if (new Date() >= investment.endDate) {
        investment.investmentStatus = "Completed";
        await investment.save();
      }
    }

    console.log("--- Daily ROI Calculation Completed Successfully ---");
  } catch (error) {
    console.error("Error during Daily ROI Calculation:", error);
  }
};

const startCronJob = () => {
  cron.schedule("00 00 * * *", () => {
    runDailyROI();
  });
  console.log("Cron Job Scheduled: Daily ROI process will run at midnight.");
};

module.exports = { startCronJob };
