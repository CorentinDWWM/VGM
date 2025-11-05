const {
  getGames,
  getGamesForSearch,
  getOneGame,
} = require("./baseGames.controller");

const {
  getMostPopularGamesAllTime,
  importGamesIntoBDD,
  importGamesThisWeek,
  importGamesThisMonth,
  importGamesLastThreeMonths,
} = require("./gameImport.controller");

module.exports = {
  getGames,
  getMostPopularGamesAllTime,
  importGamesIntoBDD,
  getOneGame,
  getGamesForSearch,
  importGamesThisWeek,
  importGamesThisMonth,
  importGamesLastThreeMonths,
};
