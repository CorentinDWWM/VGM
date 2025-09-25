const {
  getMostPopularGamesAllTime,
  importGamesIntoBDD,
  getGames,
  getOneGame,
  // getPopularGamesThisWeek,
} = require("../controllers/games.controller");
const {
  getGenres,
  getGenresFromIGDB,
  updateGenresCounts,
  // getGenresWithCount,
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

// Jeux
router.get("/games/:id", getOneGame);
router.get("/games", getGames);
router.get("/most-popular/all-time", getMostPopularGamesAllTime);
// router.get("/most-popular/week", getPopularGamesThisWeek);
router.get("/most-popular/import", importGamesIntoBDD);

// Genres
router.get("/genres", getGenres);
router.get("/genres/import", getGenresFromIGDB);

// Route pour mettre à jour les compteurs de jeux par genre
router.get("/genres/update-counts", updateGenresCounts);

// Thèmes
router.get("/themes", getThemes);
router.get("/themes/import", getThemesFromIGDB);

// Mots clés
router.get("/keywords", getKeywords);
router.get("/keywords/import", getKeywordsFromIGDB);

// Plateformes
router.get("/plateformes", getPlatforms);
router.get("/plateformes/import", getPlatformsFromIGDB);

module.exports = router;

// localhost:3000/user
