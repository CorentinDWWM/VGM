const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: null },
    games: { type: Array, default: [] },
    cookiePreferences: {
      type: Object,
      default: {
        necessary: true,
        analytics: false,
        functional: false,
      },
    },
    cookieConsentDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
