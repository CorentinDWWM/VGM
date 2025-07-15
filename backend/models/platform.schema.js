const mongoose = require("mongoose");

const platformSchema = new mongoose.Schema(
  {
    igdbID: { type: Number, required: true },
    abbreviation: { type: String },
    name: { type: String, required: true },
    slug: { type: String },
    logo: {
      type: {
        id: { type: Number, required: true },
        url: { type: String, required: true },
      },
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Platform = mongoose.model("Platform", platformSchema);

module.exports = Platform;
