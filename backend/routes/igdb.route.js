const {
  getMostPopularGames,
  importGamesIntoBDD,
  getGames,
} = require("../controllers/games.controller");
const {
  getGenres,
  getGenresFromIGDB,
} = require("../controllers/genres.controller");
const {
  getKeywords,
  getKeywordsFromIGDB,
} = require("../controllers/keywords.controller");
const {
  getPlatforms,
  getPlatformsFromIGDB,
} = require("../controllers/platforms.controller");
const {
  getThemes,
  getThemesFromIGDB,
} = require("../controllers/themes.controller");

const router = require("express").Router();

router.get("/games", getGames);
router.get("/most-popular", getMostPopularGames);
router.get("/most-popular/import", importGamesIntoBDD);
router.get("/genres", getGenres);
router.get("/genres/import", getGenresFromIGDB);
router.get("/themes", getThemes);
router.get("/themes/import", getThemesFromIGDB);
router.get("/keywords", getKeywords);
router.get("/keywords/import", getKeywordsFromIGDB);
router.get("/plateformes", getPlatforms);
router.get("/plateformes/import", getPlatformsFromIGDB);

module.exports = router;

// localhost:3000/user
