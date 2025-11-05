const { makeRequest } = require("../services/igdb");
const Game = require("../models/games.schema");
const { createNewGame } = require("./newGame");

// Fonctions utilitaires pour calculer les timestamps
const getTimestamps = {
  week: () => {
    const now = new Date();
    const startOfWeek = new Date(now);

    // Obtenir le lundi de cette semaine (0 = dimanche, 1 = lundi)
    const dayOfWeek = now.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Si dimanche, reculer de 6 jours

    startOfWeek.setDate(now.getDate() - daysToMonday);
    startOfWeek.setHours(0, 0, 0, 0); // Début de journée

    return {
      start: Math.floor(startOfWeek.getTime() / 1000),
      end: Math.floor(now.getTime() / 1000),
    };
  },

  month: () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0); // Début de journée

    return {
      start: Math.floor(startOfMonth.getTime() / 1000),
      end: Math.floor(now.getTime() / 1000),
    };
  },

  threeMonths: () => {
    const now = new Date();
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(now.getMonth() - 3);

    // Gérer le cas où le jour n'existe pas dans le mois cible
    if (threeMonthsAgo.getMonth() === (now.getMonth() - 2 + 12) % 12) {
      threeMonthsAgo.setDate(0); // Va au dernier jour du mois correct
    }

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
      id, name, summary, total_rating, total_rating_count, release_dates, game_type, first_release_date, url, slug,
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
      
      where cover != null
      & first_release_date >= ${startTimestamp} 
      & first_release_date <= ${endTimestamp}
      & game_type.type = "Main Game";
    sort first_release_date desc;
    limit 100;
  `;

  return await makeRequest("games", body);
};

// Fonction pour récupérer les données TimeToBeat pour plusieurs jeux
const getTimeToBeatDataForGames = async (gameIds) => {
  if (!gameIds || gameIds.length === 0) return {};
  //   console.log("Requête TimeToBeat:", gameIds);

  const body = `
  fields 
      game_id,
      count,
      hastily,
      normally,
      completely;
      
      where game_id = (${gameIds.join(", ")});
      limit 100;
      `;

  try {
    const timeToBeatData = await makeRequest("game_time_to_beats", body);

    // Créer un Map pour un accès rapide par game_id
    const timeToBeatMap = {};
    if (timeToBeatData && timeToBeatData.length > 0) {
      timeToBeatData.forEach((data) => {
        timeToBeatMap[data.game_id] = {
          game_id: data.game_id,
          count: data.count,
          hastily: data.hastily,
          normally: data.normally,
          completely: data.completely,
        };
      });
    }

    return timeToBeatMap;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données TimeToBeat:",
      error.message
    );
    return {};
  }
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

  // Récupérer toutes les données TimeToBeat en une seule requête
  const gameIds = games.map((game) => game.id);
  const timeToBeatMap = await getTimeToBeatDataForGames(gameIds);
  console.log(
    `⏰ Données TimeToBeat récupérées pour ${
      Object.keys(timeToBeatMap).length
    } jeux`
  );

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

        // Utiliser les données TimeToBeat pré-récupérées
        const timeToBeatData = timeToBeatMap[oneGame.id] || null;
        if (timeToBeatData) {
          results.timeToBeatCount++;
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

module.exports = {
  getTimestamps,
  getGamesByPeriod,
  getTimeToBeatDataForGames,
  importGamesByPeriod,
};
