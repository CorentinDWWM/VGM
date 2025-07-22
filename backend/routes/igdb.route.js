const {
  getMostPopularGames,
  importGamesIntoBDD,
  getGames,
} = require("../controllers/games.controller");
const { getGenres } = require("../controllers/genres.controller");
const { getPlatforms } = require("../controllers/platforms.controller");

const router = require("express").Router();

router.get("/", getGames);
router.get("/most-popular", getMostPopularGames);
router.get("/most-popular/import", importGamesIntoBDD);
router.get("/genres", getGenres);
router.get("/plateformes", getPlatforms);

module.exports = router;

// localhost:3000/user
