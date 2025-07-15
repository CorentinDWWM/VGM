const {
  getPopularGames,
  getGenres,
  getPlatforms,
  getPlatformsFamilies,
} = require("../services/igdb");

const router = require("express").Router();

router.get("/popular", getPopularGames);
router.get("/genres", getGenres);
router.get("/plateformes", getPlatforms);
router.get("/plateformFamilies", getPlatformsFamilies);

module.exports = router;

// localhost:3000/user
