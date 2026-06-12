const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    userReference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    investmentAmount: { type: Number, required: true },
    planDetails: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    dailyRoiPercentage: { type: Number, required: true },
    investmentStatus: {
      type: String,
      enum: ["Active", "Completed", "Cancelled"],
      default: "Active",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Investment", investmentSchema);
