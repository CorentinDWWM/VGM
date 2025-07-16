const { getPopularGames } = require("../controllers/games.controller");
const { getPlatforms } = require("../controllers/platforms.controller");
const { getGenres } = require("../services/igdb");

const router = require("express").Router();

router.get("/popular", getPopularGames);
router.get("/genres", getGenres);
router.get("/plateformes", getPlatforms);

module.exports = router;

// localhost:3000/user
