const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema(
  {
    igdbID: { type: Number, required: true },
    name: { type: String },
    slug: { type: String },
    url: { type: String },
    nb_jeux: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Genre = mongoose.model("Genre", genreSchema);

module.exports = Genre;
