const mongoose = require("mongoose");

const keywordSchema = new mongoose.Schema(
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

const Keyword = mongoose.model("Keyword", keywordSchema);

module.exports = Keyword;
