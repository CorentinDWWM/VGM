const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema(
  {
    igdbID: { type: Number, required: true },
    name: { type: String },
    slug: { type: String },
    url: { type: String },
  },
  {
    timestamps: true,
  }
);

const Theme = mongoose.model("Theme", themeSchema);

module.exports = Theme;
