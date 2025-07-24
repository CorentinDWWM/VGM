const Game = require("../models/games.schema");
const { makeRequest } = require("../services/igdb");

const getGames = async (req, res) => {
  try {
    // Limite et pagination via query string
    const limit = parseInt(req.query.limit) || 100;
    const skip = parseInt(req.query.skip) || 0;
    const games = await Game.find().skip(skip).limit(limit);
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMostPopularGames = async (req, res) => {
  try {
    const body = `
      fields 
        id,
        name,
        summary,
        total_rating,
        total_rating_count,
        release_dates,
        category,
        url,
        slug,

        game_status.id,
        game_status.status,

        cover.id,
        cover.url,
        cover.image_id,
        cover.width,
        cover.height,
        
        screenshots.id,
        screenshots.url,
        screenshots.image_id,
        screenshots.width,
        screenshots.height,
        
        artworks.id,
        artworks.url,
        artworks.image_id,
        artworks.width,
        artworks.height,
        
        videos.id,
        videos.name,
        videos.video_id,
        
        genres.id,
        genres.name,
        genres.slug,
        
        platforms.id,
        platforms.name,
        platforms.abbreviation,
        platforms.alternative_name,
        platforms.slug,
        
        game_modes.id,
        game_modes.name,
        game_modes.slug,
        
        player_perspectives.id,
        player_perspectives.name,
        player_perspectives.slug,
        
        themes.id,
        themes.name,
        themes.slug,
        
        keywords.id,
        keywords.name,
        keywords.slug,
        
        involved_companies.id,
        involved_companies.company.id,
        involved_companies.company.name,
        involved_companies.company.slug,
        involved_companies.developer,
        involved_companies.publisher,
        involved_companies.porting,
        involved_companies.supporting,
        
        game_engines.id,
        game_engines.name,
        game_engines.slug,
        
        alternative_names.id,
        alternative_names.name,
        alternative_names.comment,
        
        bundles.id,
        bundles.name,
        bundles.slug,
        
        dlcs.id,
        dlcs.name,
        dlcs.slug,
        
        expansions.id,
        expansions.name,
        expansions.slug,
        
        franchises.id,
        franchises.name,
        franchises.slug,
        
        game_localizations.id,
        game_localizations.name,
        game_localizations.region.id,
        game_localizations.region.name,
        
        language_supports.id,
        language_supports.language.id,
        language_supports.language.name,
        language_supports.language_support_type.id,
        language_supports.language_support_type.name,
        
        multiplayer_modes.id,
        multiplayer_modes.campaigncoop,
        multiplayer_modes.dropin,
        multiplayer_modes.lancoop,
        multiplayer_modes.offlinecoop,
        multiplayer_modes.offlinecoopmax,
        multiplayer_modes.offlinemax,
        multiplayer_modes.onlinecoop,
        multiplayer_modes.onlinecoopmax,
        multiplayer_modes.onlinemax,
        multiplayer_modes.splitscreen,
        multiplayer_modes.splitscreenonline,
        
        parent_game.id,
        parent_game.name,
        parent_game.slug,
        
        ports.id,
        ports.name,
        ports.slug,
        
        remakes.id,
        remakes.name,
        remakes.slug,
        
        remasters.id,
        remasters.name,
        remasters.slug,
        
        similar_games.id,
        similar_games.name,
        similar_games.slug,
        
        standalone_expansions.id,
        standalone_expansions.name,
        standalone_expansions.slug,
        
        release_dates.id,
        release_dates.human,
        release_dates.platform.id,
        release_dates.platform.name,
        release_dates.platform.abbreviation,
        release_dates.release_region.id,
        release_dates.release_region.region,
        
        websites.id,
        websites.category,
        websites.trusted,
        websites.url;
        
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
    const data = await getMostPopularGames();
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

        const game = new Game({
          igdbID: oneGame.id,
          name: oneGame.name,
          summary: oneGame.summary,
          votes: oneGame.total_rating,
          total_votes: oneGame.total_rating_count,
          date_sortie: oneGame.release_dates,
          category: oneGame.category,
          url: oneGame.url,
          slug: oneGame.slug,

          // Ajouter les données TimeToBeat si disponibles
          timeToBeat: timeToBeatData,

          game_status: oneGame.game_status
            ? {
                id: oneGame.game_status.id,
                status: oneGame.game_status.status,
              }
            : null,

          cover: oneGame.cover
            ? {
                id: oneGame.cover.id,
                hauteur: oneGame.cover.height,
                largeur: oneGame.cover.width,
                image_id: oneGame.cover.image_id,
                url: oneGame.cover.url,
              }
            : null,

          screenshots:
            oneGame.screenshots && oneGame.screenshots.length > 0
              ? oneGame.screenshots.map((screenshot) => ({
                  id: screenshot.id,
                  hauteur: screenshot.height,
                  largeur: screenshot.width,
                  image_id: screenshot.image_id,
                  url: screenshot.url,
                }))
              : [],

          artworks:
            oneGame.artworks && oneGame.artworks.length > 0
              ? oneGame.artworks.map((artwork) => ({
                  id: artwork.id,
                  hauteur: artwork.height,
                  largeur: artwork.width,
                  image_id: artwork.image_id,
                  url: artwork.url,
                }))
              : [],

          videos:
            oneGame.videos && oneGame.videos.length > 0
              ? oneGame.videos.map((video) => ({
                  id: video.id,
                  name: video.name,
                  video_id: video.video_id,
                }))
              : [],

          genres:
            oneGame.genres && oneGame.genres.length > 0
              ? oneGame.genres.map((genre) => ({
                  id: genre.id,
                  name: genre.name,
                  slug: genre.slug,
                }))
              : [],

          platforms:
            oneGame.platforms && oneGame.platforms.length > 0
              ? oneGame.platforms.map((plateforme) => ({
                  id: plateforme.id,
                  name: plateforme.name,
                  abbreviation: plateforme.abbreviation,
                  alternative_name: plateforme.alternative_name,
                  slug: plateforme.slug,
                }))
              : [],

          game_modes:
            oneGame.game_modes && oneGame.game_modes.length > 0
              ? oneGame.game_modes.map((mode) => ({
                  id: mode.id,
                  name: mode.name,
                  slug: mode.slug,
                }))
              : [],

          player_perspectives:
            oneGame.player_perspectives &&
            oneGame.player_perspectives.length > 0
              ? oneGame.player_perspectives.map((perspective) => ({
                  id: perspective.id,
                  name: perspective.name,
                  slug: perspective.slug,
                }))
              : [],

          themes:
            oneGame.themes && oneGame.themes.length > 0
              ? oneGame.themes.map((theme) => ({
                  id: theme.id,
                  name: theme.name,
                  slug: theme.slug,
                }))
              : [],

          keywords:
            oneGame.keywords && oneGame.keywords.length > 0
              ? oneGame.keywords.map((keyword) => ({
                  id: keyword.id,
                  name: keyword.name,
                  slug: keyword.slug,
                }))
              : [],

          companies:
            oneGame.involved_companies && oneGame.involved_companies.length > 0
              ? oneGame.involved_companies.map((company) => ({
                  id: company.id,
                  company_detail: {
                    id: company.company?.id,
                    name: company.company?.name,
                    slug: company.company?.slug,
                  },
                  developpeur: company.developer,
                  editeur: company.publisher,
                  porteur: company.porting,
                  support: company.supporting,
                }))
              : [],

          game_engines:
            oneGame.game_engines && oneGame.game_engines.length > 0
              ? oneGame.game_engines.map((engine) => ({
                  id: engine.id,
                  name: engine.name,
                  slug: engine.slug,
                }))
              : [],

          alternative_names:
            oneGame.alternative_names && oneGame.alternative_names.length > 0
              ? oneGame.alternative_names.map((alt) => ({
                  id: alt.id,
                  name: alt.name,
                  comment: alt.comment,
                }))
              : [],

          bundles:
            oneGame.bundles && oneGame.bundles.length > 0
              ? oneGame.bundles.map((bundle) => ({
                  id: bundle.id,
                  name: bundle.name,
                  slug: bundle.slug,
                }))
              : [],

          dlcs:
            oneGame.dlcs && oneGame.dlcs.length > 0
              ? oneGame.dlcs.map((dlc) => ({
                  id: dlc.id,
                  name: dlc.name,
                  slug: dlc.slug,
                }))
              : [],

          expansions:
            oneGame.expansions && oneGame.expansions.length > 0
              ? oneGame.expansions.map((expansion) => ({
                  id: expansion.id,
                  name: expansion.name,
                  slug: expansion.slug,
                }))
              : [],

          franchises:
            oneGame.franchises && oneGame.franchises.length > 0
              ? oneGame.franchises.map((franchise) => ({
                  id: franchise.id,
                  name: franchise.name,
                  slug: franchise.slug,
                }))
              : [],

          game_localizations:
            oneGame.game_localizations && oneGame.game_localizations.length > 0
              ? oneGame.game_localizations.map((localisation) => ({
                  id: localisation.id,
                  name: localisation.name,
                  region: {
                    id: localisation.region?.id,
                    name: localisation.region?.name,
                  },
                }))
              : [],

          language_supports:
            oneGame.language_supports && oneGame.language_supports.length > 0
              ? oneGame.language_supports.map((ls) => ({
                  id: ls.id,
                  language: {
                    id: ls.language?.id,
                    name: ls.language?.name,
                  },
                  language_support_type: {
                    id: ls.language_support_type?.id,
                    name: ls.language_support_type?.name,
                  },
                }))
              : [],

          multiplayer_modes:
            oneGame.multiplayer_modes && oneGame.multiplayer_modes.length > 0
              ? oneGame.multiplayer_modes.map((multi) => ({
                  id: multi.id,
                  campagne_coop: multi.campaigncoop,
                  dropin: multi.dropin,
                  lancoop: multi.lancoop,
                  offlinecoop: multi.offlinecoop,
                  offlinecoopmax: multi.offlinecoopmax,
                  offlinemax: multi.offlinemax,
                  onlinecoop: multi.onlinecoop,
                  onlinecoopmax: multi.onlinecoopmax,
                  onlinemax: multi.onlinemax,
                  splitscreen: multi.splitscreen,
                  splitscreenonline: multi.splitscreenonline,
                }))
              : [],

          parent_game: oneGame.parent_game
            ? {
                id: oneGame.parent_game.id,
                name: oneGame.parent_game.name,
                slug: oneGame.parent_game.slug,
              }
            : null,

          portages:
            oneGame.ports && oneGame.ports.length > 0
              ? oneGame.ports.map((portage) => ({
                  id: portage.id,
                  name: portage.name,
                  slug: portage.slug,
                }))
              : [],

          remakes:
            oneGame.remakes && oneGame.remakes.length > 0
              ? oneGame.remakes.map((remake) => ({
                  id: remake.id,
                  name: remake.name,
                  slug: remake.slug,
                }))
              : [],

          remasters:
            oneGame.remasters && oneGame.remasters.length > 0
              ? oneGame.remasters.map((remaster) => ({
                  id: remaster.id,
                  name: remaster.name,
                  slug: remaster.slug,
                }))
              : [],

          similar_games:
            oneGame.similar_games && oneGame.similar_games.length > 0
              ? oneGame.similar_games.map((similar) => ({
                  id: similar.id,
                  name: similar.name,
                  slug: similar.slug,
                }))
              : [],

          standalone_expansions:
            oneGame.standalone_expansions &&
            oneGame.standalone_expansions.length > 0
              ? oneGame.standalone_expansions.map((standalone) => ({
                  id: standalone.id,
                  name: standalone.name,
                  slug: standalone.slug,
                }))
              : [],

          release_dates:
            oneGame.release_dates && oneGame.release_dates.length > 0
              ? oneGame.release_dates.map((rDate) => ({
                  id: rDate.id,
                  date: rDate.human,
                  plateforme: {
                    id: rDate.platform?.id,
                    name: rDate.platform?.name,
                    abbreviation: rDate.platform?.abbreviation,
                  },
                  region: {
                    id: rDate.release_region?.id,
                    region: rDate.release_region?.region,
                  },
                }))
              : [],

          websites:
            oneGame.websites && oneGame.websites.length > 0
              ? oneGame.websites.map((site) => ({
                  id: site.id,
                  category: site.category,
                  trusted: site.trusted,
                  url: site.url,
                }))
              : [],
        });

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

module.exports = {
  getGames,
  getMostPopularGames,
  importGamesIntoBDD,
};
