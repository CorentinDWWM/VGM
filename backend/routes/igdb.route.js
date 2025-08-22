const {
  getMostPopularGames,
  importGamesIntoBDD,
  getGames,
} = require("../controllers/games.controller");
const {
  getGenres,
  getGenresFromIGDB,
  updateGenresCounts,
  getGenresWithCount,
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
router.get("/games", getGames);
router.get("/most-popular", getMostPopularGames);
router.get("/most-popular/import", importGamesIntoBDD);

// Genres
router.get("/genres", getGenres);
router.get("/genres/import", getGenresFromIGDB);
// Route pour récupérer les genres avec le nombre de jeux
router.get("/genres/with-count", getGenresWithCount);

// Route pour mettre à jour les compteurs de jeux par genre
router.put("/genres/update-counts", updateGenresCounts);

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
