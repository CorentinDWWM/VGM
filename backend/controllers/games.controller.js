const Game = require("../models/games.schema");
const { makeRequest } = require("../services/igdb");
const { createNewGame } = require("../utils/newGame");

const getGames = async (req, res) => {
  try {
    // Limite et pagination via query string
    const limit = parseInt(req.query.limit) || 100;
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

// Fonctions utilitaires pour calculer les timestamps
const getTimestamps = {
  week: () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return {
      start: Math.floor(oneWeekAgo.getTime() / 1000),
      end: Math.floor(now.getTime() / 1000),
    };
  },

  month: () => {
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    return {
      start: Math.floor(oneMonthAgo.getTime() / 1000),
      end: Math.floor(now.getTime() / 1000),
    };
  },

  threeMonths: () => {
    const now = new Date();
    const threeMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 3,
      now.getDate()
    );
    return {
      start: Math.floor(threeMonthsAgo.getTime() / 1000),
      end: Math.floor(now.getTime() / 1000),
    };
  },
};

// Fonction générique pour récupérer les jeux par période
const getGamesByPeriod = async (startTimestamp, endTimestamp) => {
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
      
    where category = 0 
      & release_dates.date >= ${startTimestamp} 
      & release_dates.date <= ${endTimestamp};
    sort release_dates.date desc;
    limit 100;
  `;

  return await makeRequest("games", body);
};

// Fonction générique d'import optimisée
const importGamesByPeriod = async (games, periodName) => {
  console.log(`🔍 Début import de ${games.length} jeux pour ${periodName}...`);

  const results = {
    importCount: 0,
    errorCount: 0,
    existingCount: 0,
    timeToBeatCount: 0,
    timeToBeatErrorCount: 0,
  };
  const batchSize = 10;

  for (let i = 0; i < games.length; i += batchSize) {
    const batch = games.slice(i, i + batchSize);

    const batchPromises = batch.map(async (oneGame) => {
      try {
        const existingGame = await Game.findOne({ igdbID: oneGame.id });
        if (existingGame) {
          results.existingCount++;
          return { type: "existing" };
        }

        // Récupérer TimeToBeat data
        let timeToBeatData = null;
        try {
          const timeToBeatResponse = await makeRequest(
            "game_time_to_beats",
            `fields game_id, count, hastily, normally, completely; where game_id = ${oneGame.id};`
          );

          if (timeToBeatResponse?.length > 0) {
            timeToBeatData = {
              game_id: timeToBeatResponse[0].game_id,
              count: timeToBeatResponse[0].count,
              hastily: timeToBeatResponse[0].hastily,
              normally: timeToBeatResponse[0].normally,
              completely: timeToBeatResponse[0].completely,
            };
            results.timeToBeatCount++;
          }
        } catch (timeToBeatError) {
          results.timeToBeatErrorCount++;
        }

        const game = createNewGame(oneGame, timeToBeatData);
        await game.save();
        results.importCount++;

        return { type: "success" };
      } catch (error) {
        results.errorCount++;
        return { type: "error" };
      }
    });

    await Promise.all(batchPromises);
    console.log(
      `📊 Lot ${Math.floor(i / batchSize) + 1}/${Math.ceil(
        games.length / batchSize
      )} traité`
    );
  }

  return results;
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
  getGames,
  getMostPopularGamesAllTime,
  importGamesIntoBDD,
  getOneGame,
  getGamesForSearch,
  importGamesThisWeek,
  importGamesThisMonth,
  importGamesLastThreeMonths,
};
