const Game = require("../models/games.schema");

const createNewGame = (oneGame, timeToBeatData = null) => {
  return new Game({
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
      oneGame.player_perspectives && oneGame.player_perspectives.length > 0
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
      oneGame.standalone_expansions && oneGame.standalone_expansions.length > 0
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
};

module.exports = { createNewGame };
