const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, password, referralCode } = req.body;

    const userExists = await User.findOne({
      $or: [{ email }, { mobileNumber }],
    });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists with this email or mobile" });
    }

    let parentUserId = null;
    if (referralCode) {
      const parentUser = await User.findOne({ referralCode });
      if (parentUser) {
        parentUserId = parentUser._id;
      } else {
        return res.status(400).json({ message: "Invalid referral code" });
      }
    }

    const newReferralCode =
      "NEXA" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const user = await User.create({
      fullName,
      email,
      mobileNumber,
      password,
      referralCode: newReferralCode,
      referredBy: parentUserId,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        referralCode: user.referralCode,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      if (user.accountStatus !== "Active") {
        return res.status(403).json({ message: "Account is not active" });
      }

      res.status(200).json({
        message: "Login successful",
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          walletBalance: user.walletBalance,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
