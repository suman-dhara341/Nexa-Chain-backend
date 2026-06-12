const mongoose = require("mongoose");

const roiHistorySchema = new mongoose.Schema(
  {
    userReference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    investmentReference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investment",
      required: true,
    },
    roiAmount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ["Credited", "Failed"], default: "Credited" },
  },
  { timestamps: true },
);

roiHistorySchema.index({ investmentReference: 1, date: 1 });

module.exports = mongoose.model("RoiHistory", roiHistorySchema);
