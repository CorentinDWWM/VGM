const Game = require("../models/games.schema");
const { makeRequest } = require("../services/igdb");
const { createNewGame } = require("../utils/newGame");
const {
  getTimestamps,
  getGamesByPeriod,
  importGamesByPeriod,
} = require("../utils/gameImport.utils");

const getMostPopularGamesAllTime = async (req, res) => {
  try {
    const body = `
      fields 
        id, name, summary, total_rating, total_rating_count, release_dates, category, url, slug,
        game_status.id, game_status.status,
        cover.id, cover.url, cover.image_id, cover.width, cover.height,
        screenshots.id, screenshots.url, screenshots.image_id, screenshots.width, screenshots.height,
        artworks.id, artworks.url, artworks.image_id, artworks.width, artworks.height,
        videos.id, videos.name, videos.video_id,
        genres.id, genres.name, genres.slug,
        platforms.id, platforms.name, platforms.abbreviation, platforms.alternative_name, platforms.slug,
        game_modes.id, game_modes.name, game_modes.slug,
        player_perspectives.id, player_perspectives.name, player_perspectives.slug,
        themes.id, themes.name, themes.slug,
        keywords.id, keywords.name, keywords.slug,
        involved_companies.id, involved_companies.company.id, involved_companies.company.name, involved_companies.company.slug,
        involved_companies.developer, involved_companies.publisher, involved_companies.porting, involved_companies.supporting,
        game_engines.id, game_engines.name, game_engines.slug,
        alternative_names.id, alternative_names.name, alternative_names.comment,
        bundles.id, bundles.name, bundles.slug,
        dlcs.id, dlcs.name, dlcs.slug,
        expansions.id, expansions.name, expansions.slug,
        franchises.id, franchises.name, franchises.slug,
        game_localizations.id, game_localizations.name, game_localizations.region.id, game_localizations.region.name,
        language_supports.id, language_supports.language.id, language_supports.language.name,
        language_supports.language_support_type.id, language_supports.language_support_type.name,
        multiplayer_modes.id, multiplayer_modes.campaigncoop, multiplayer_modes.dropin, multiplayer_modes.lancoop,
        multiplayer_modes.offlinecoop, multiplayer_modes.offlinecoopmax, multiplayer_modes.offlinemax,
        multiplayer_modes.onlinecoop, multiplayer_modes.onlinecoopmax, multiplayer_modes.onlinemax,
        multiplayer_modes.splitscreen, multiplayer_modes.splitscreenonline,
        parent_game.id, parent_game.name, parent_game.slug,
        ports.id, ports.name, ports.slug,
        remakes.id, remakes.name, remakes.slug,
        remasters.id, remasters.name, remasters.slug,
        similar_games.id, similar_games.name, similar_games.slug,
        standalone_expansions.id, standalone_expansions.name, standalone_expansions.slug,
        release_dates.id, release_dates.human, release_dates.platform.id, release_dates.platform.name,
        release_dates.platform.abbreviation, release_dates.release_region.id, release_dates.release_region.region,
        websites.id, websites.category, websites.trusted, websites.url;
        
      where rating > 8; 
      sort total_rating_count desc;
      offset 2000;
      limit 500;
    `;

    const data = await makeRequest("games", body);

    if (res) {
      res.status(200).json(data);
    } else {
      return data;
    }
  } catch (error) {
    if (res) {
      res.status(400).json({
        message: "Erreur lors de la récupération des jeux les plus populaires",
      });
    }
    return console.log(
      "Erreur lors de la récupération des jeux les plus populaires"
    );
  }
};

const importGamesIntoBDD = async (req, res) => {
  try {
    const data = await getMostPopularGamesAllTime();
    console.log(`🔍 Début import de ${data.length} jeux...`);

    let importCount = 0;
    let errorCount = 0;
    let existingCount = 0;
    let timeToBeatCount = 0;
    let timeToBeatErrorCount = 0;

    for (const oneGame of data) {
      try {
        const existingGame = await Game.findOne({ igdbID: oneGame.id });
        if (existingGame) {
          existingCount++;
          console.log(`⏩ Jeu déjà en base : ${oneGame.name}`);

          // Vérifier si les données TimeToBeat existent déjà
          const hasTimeToBeatData = (game) => {
            return (
              game.timeToBeat &&
              (game.timeToBeat.game_id ||
                game.timeToBeat.count ||
                game.timeToBeat.hastily ||
                game.timeToBeat.normally ||
                game.timeToBeat.completely)
            );
          };

          // Si le jeu existe mais n'a pas de données TimeToBeat, les ajouter
          if (!hasTimeToBeatData(existingGame)) {
            try {
              const timeToBeatBody = `
                fields 
                  game_id,
                  count,
                  hastily,
                  normally,
                  completely;
                
                where game_id = ${oneGame.id}; 
              `;

              const timeToBeatData = await makeRequest(
                "game_time_to_beats",
                timeToBeatBody
              );
              if (timeToBeatData && timeToBeatData.length > 0) {
                await Game.findOneAndUpdate(
                  { igdbID: oneGame.id },
                  {
                    $set: {
                      timeToBeat: {
                        game_id: timeToBeatData[0].game_id,
                        count: timeToBeatData[0].count,
                        hastily: timeToBeatData[0].hastily,
                        normally: timeToBeatData[0].normally,
                        completely: timeToBeatData[0].completely,
                      },
                    },
                  },
                  { new: true }
                );
                timeToBeatCount++;
                console.log(`⏰ TimeToBeat ajouté pour : ${oneGame.name}`);
              }
            } catch (timeToBeatError) {
              timeToBeatErrorCount++;
              console.error(
                `❌ Erreur TimeToBeat pour ${oneGame.name}:`,
                timeToBeatError.message
              );
            }
          }
          continue;
        }

        // Récupérer les données TimeToBeat pour le nouveau jeu
        let timeToBeatData = null;
        try {
          const timeToBeatBody = `
            fields 
              game_id,
              count,
              hastily,
              normally,
              completely;
            
            where game_id = ${oneGame.id}; 
          `;

          const timeToBeatResponse = await makeRequest(
            "game_time_to_beats",
            timeToBeatBody
          );
          if (timeToBeatResponse && timeToBeatResponse.length > 0) {
            timeToBeatData = {
              game_id: timeToBeatResponse[0].game_id,
              count: timeToBeatResponse[0].count,
              hastily: timeToBeatResponse[0].hastily,
              normally: timeToBeatResponse[0].normally,
              completely: timeToBeatResponse[0].completely,
            };
            timeToBeatCount++;
          }
        } catch (timeToBeatError) {
          timeToBeatErrorCount++;
          console.error(
            `❌ Erreur TimeToBeat pour ${oneGame.name}:`,
            timeToBeatError.message
          );
        }

        const game = createNewGame(oneGame, timeToBeatData);

        await game.save();
        importCount++;
        console.log(
          `✅ Jeu importé : ${oneGame.name}${
            timeToBeatData ? " (avec TimeToBeat)" : ""
          }`
        );
      } catch (error) {
        errorCount++;
        console.error(
          `❌ Erreur lors de l'import de ${oneGame.name}:`,
          error.message
        );
      }
    }

    console.log(
      `📊 Import terminé: ${importCount} jeux réussis, ${existingCount} déjà dans la bdd, ${errorCount} erreurs`
    );
    console.log(
      `⏰ TimeToBeat: ${timeToBeatCount} ajoutés, ${timeToBeatErrorCount} erreurs`
    );

    res.status(200).json({
      message: `Import terminé: ${importCount} jeux réussis, ${existingCount} déjà dans la bdd, ${errorCount} erreurs. TimeToBeat: ${timeToBeatCount} ajoutés, ${timeToBeatErrorCount} erreurs`,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erreur dans l'import des jeux les plus populaires" });
  }
};

// Fonction générique pour les imports par période
const createImportHandler = (periodKey, periodName) => async (req, res) => {
  try {
    const { start, end } = getTimestamps[periodKey]();
    const games = await getGamesByPeriod(start, end);

    if (!games?.length) {
      return res.status(200).json({
        message: `Aucun jeu trouvé pour ${periodName}`,
        games: [],
      });
    }

    const results = await importGamesByPeriod(games, periodName);
    const importedGames = await Game.find({
      igdbID: { $in: games.map((game) => game.id) },
    });

    console.log(
      `📊 Import ${periodName} terminé: ${results.importCount} jeux réussis, ${results.existingCount} déjà en BDD`
    );

    res.status(200).json({
      message: `Import ${periodName} terminé: ${results.importCount} nouveaux, ${results.existingCount} existants`,
      games: importedGames,
      ...results,
    });
  } catch (error) {
    res.status(400).json({
      message: `Erreur dans l'import des jeux de ${periodName}`,
      error: error.message,
      games: [],
    });
  }
};

// Handlers spécifiques
const importGamesThisWeek = createImportHandler("week", "cette semaine");
const importGamesThisMonth = createImportHandler("month", "ce mois-ci");
const importGamesLastThreeMonths = createImportHandler(
  "threeMonths",
  "les trois derniers mois"
);

module.exports = {
  getMostPopularGamesAllTime,
  importGamesIntoBDD,
  importGamesThisWeek,
  importGamesThisMonth,
  importGamesLastThreeMonths,
};
