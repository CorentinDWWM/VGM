const mongoose = require("mongoose");

const platformSchema = new mongoose.Schema(
  {
    igdbID: { type: Number, required: true },
    abbreviation: { type: String },
    name: { type: String, required: true },
    platform_logo_id: { type: Number, required: true },
    slug: { type: String },
    logo: {
      type: {
        id: { type: Number, required: true },
        url: { type: String, required: true },
      },
    },
    nb_jeux: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Platform = mongoose.model("Platform", platformSchema);

module.exports = Platform;
