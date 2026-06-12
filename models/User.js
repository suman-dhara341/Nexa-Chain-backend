const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    mobileNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    referralCode: { type: String, unique: true, index: true },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    walletBalance: { type: Number, default: 0 },
    totalRoiEarned: { type: Number, default: 0 },
    totalLevelIncomeEarned: { type: Number, default: 0 },
    accountStatus: {
      type: String,
      enum: ["Active", "Suspended", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw new Error("Password encryption failed");
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
