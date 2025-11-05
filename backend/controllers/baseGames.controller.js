const Game = require("../models/games.schema");

const getGames = async (req, res) => {
  try {
    // Réduire la limite par défaut pour améliorer les performances
    const limit = parseInt(req.query.limit) || 30;
    const skip = parseInt(req.query.skip) || 0;

    // Optimisation : sélectionner seulement les champs nécessaires
    const games = await Game.find()
      .select(
        "igdbID name votes total_votes cover platforms genres release_dates"
      )
      .sort({ createdAt: 1, _id: 1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Utiliser lean() pour des objets JavaScript simples plus rapides

    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGamesForSearch = async (req, res) => {
  try {
    // Optimisation : sélectionner seulement les champs nécessaires
    const games = await Game.find()
      .select("igdbID name cover")
      .sort({ createdAt: 1, _id: 1 })
      .lean(); // Utiliser lean() pour des objets JavaScript simples plus rapides

    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOneGame = async (req, res) => {
  try {
    const game = await Game.findOne({ igdbID: parseInt(req.params.id) });
    if (!game) {
      res.status(404).json({ error: "Game not found" });
    } else {
      res.status(200).json(game);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getGames,
  getGamesForSearch,
  getOneGame,
};
