const {
  getMostPopularGamesAllTime,
  importGamesIntoBDD,
  getGames,
  getOneGame,
  // getPopularGamesThisWeek,
  getGamesForSearch,
  importGamesThisWeek,
  importGamesThisMonth,
  importGamesLastThreeMonths,
} = require("../controllers/games.controller");
const {
  getGenres,
  getGenresFromIGDB,
  updateGenresCounts,
  getGamesByGenre,
  getGamesByGenrePaginated,
} = require("../controllers/genres.controller");
const {
  getKeywords,
  getKeywordsFromIGDB,
} = require("../controllers/keywords.controller");
const {
  getPlatforms,
  getAllPlatforms,
  getPlatformsFromIGDB,
  getGamesByPlatform,
  getGamesByPlatformPaginated,
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
router.get("/gamesForSearch", getGamesForSearch);

// Routes d'import par période
router.get("/games/import/this-week", importGamesThisWeek);
router.get("/games/import/this-month", importGamesThisMonth);
router.get("/games/import/last-three-months", importGamesLastThreeMonths);

// Genres
router.get("/genres", getGenres);
router.get("/genres/import", getGenresFromIGDB);
router.get("/genres/:genreId/games", getGamesByGenre);
router.get("/genres/:genreId/games/paginated", getGamesByGenrePaginated);

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
router.get("/plateformes/all", getAllPlatforms);
router.get("/plateformes/import", getPlatformsFromIGDB);
router.get("/plateformes/:platformId/games", getGamesByPlatform);
router.get(
  "/plateformes/:platformId/games/paginated",
  getGamesByPlatformPaginated
);

module.exports = router;

// localhost:3000/user
