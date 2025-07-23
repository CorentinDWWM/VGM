const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema(
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

const Genre = mongoose.model("Genre", genreSchema);

module.exports = Genre;
