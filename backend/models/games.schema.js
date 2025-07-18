const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    igdbID: { type: Number, required: true },
    name: { type: String, required: true },
    summary: { type: String },
    votes: { type: String },
    total_votes: { type: String },
    date_sortie: { type: Array },
    category: { type: Number },
    url: { type: String },
    slug: { type: String },
    game_status: {
      type: {
        id: { type: Number, required: true },
        status: { type: String, required: true },
      },
    },
    cover: {
      type: {
        id: { type: Number, required: true },
        hauteur: { type: Number },
        largeur: { type: Number },
        image_id: { type: String },
        url: { type: String, required: true },
      },
    },
    screenshots: {
      type: [
        {
          id: { type: Number, required: true },
          hauteur: { type: Number },
          largeur: { type: Number },
          image_id: { type: String },
          url: { type: String, required: true },
        },
      ],
    },
    artworks: {
      type: [
        {
          id: { type: Number, required: true },
          hauteur: { type: Number },
          largeur: { type: Number },
          image_id: { type: String },
          url: { type: String, required: true },
        },
      ],
    },
    videos: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String },
          video_id: { type: String },
        },
      ],
    },
    genres: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String },
          slug: { type: String },
        },
      ],
    },
    platforms: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String },
          abbreviation: { type: String },
          alternative_name: { type: String },
          slug: { type: String },
        },
      ],
    },
    game_modes: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String },
          slug: { type: String },
        },
      ],
    },
    player_perspectives: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String },
          slug: { type: String },
        },
      ],
    },
    themes: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String },
          slug: { type: String },
        },
      ],
    },
    keywords: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String },
          slug: { type: String },
        },
      ],
    },
    companies: {
      type: [
        {
          id: { type: Number, required: true },
          company_detail: {
            type: {
              id: { type: Number, required: true },
              name: { type: String },
              slug: { type: String },
            },
          },
          developpeur: { type: String },
          editeur: { type: String },
          porteur: { type: String },
          support: { type: String },
        },
      ],
    },
    game_engines: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String },
          slug: { type: String },
        },
      ],
    },
    alternative_names: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String },
          comment: { type: String },
        },
      ],
    },
    bundles: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String },
          slug: { type: String },
        },
      ],
    },
    dlcs: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String },
          slug: { type: String },
        },
      ],
    },
    expansions: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String },
          slug: { type: String },
        },
      ],
    },
    franchises: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String },
          slug: { type: String },
        },
      ],
    },
    game_localizations: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String },
          region: {
            type: {
              id: { type: Number, required: true },
              name: { type: String },
            },
          },
        },
      ],
    },
    language_supports: {
      type: [
        {
          id: { type: Number, required: true },
          language: {
            type: {
              id: { type: Number, required: true },
              name: { type: String },
            },
          },
          language_support_type: {
            type: {
              id: { type: Number, required: true },
              name: { type: String },
            },
          },
        },
      ],
    },
    multiplayer_modes: {
      type: [
        {
          id: { type: Number, required: true },
          campagne_coop: { type: boolean },
          dropin: { type: boolean },
          lancoop: { type: boolean },
          offlinecoop: { type: boolean },
          offlinecoopmax: { type: Number },
          offlinemax: { type: Number },
          onlinecoop: { type: boolean },
          onlinecoopmax: { type: Number },
          onlinemax: { type: Number },
          splitscreen: { type: boolean },
          splitscreenonline: { type: boolean },
        },
      ],
    },
    parent_game: {
      type: {
        id: { type: Number, required: true },
        name: { type: String },
        slug: { type: String },
      },
    },
    portages: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String },
          slug: { type: String },
        },
      ],
    },
    remakes: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String },
          slug: { type: String },
        },
      ],
    },
    remasters: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String },
          slug: { type: String },
        },
      ],
    },
    similar_games: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String },
          slug: { type: String },
        },
      ],
    },
    standalone_expansions: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String },
          slug: { type: String },
        },
      ],
    },
    release_dates: {
      type: [
        {
          id: { type: Number, required: true },
          date: { type: String },
          plateforme: {
            type: {
              id: { type: Number, required: true },
              name: { type: String },
              abbreviation: { type: String },
            },
          },
          region: {
            type: {
              id: { type: Number, required: true },
              region: { type: String },
            },
          },
        },
      ],
    },
    websites: {
      type: [
        {
          id: { type: Number, required: true },
          category: { type: Number },
          trusted: { type: boolean },
          url: { type: String },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
