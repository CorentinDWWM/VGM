const { makeRequest } = require("../services/igdb");

// const getPopularGames = async (req, res) => {
//   try {
//     const body = `fields age_ratings, aggregated_rating, aggregated_rating_count, alternative_names, collection, cover, dlcs, expanded_games, expansions, first_release_date, franchise, game_engines, game_localizations, game_modes, game_status, game_type, genres, involved_companies, keywords; where rating != null & rating > 80; sort rating desc;`;
//     const data = await makeRequest("games", body);
//     res.status(200).json(data);
//   } catch (error) {
//     console.log(error);
//   }
// };
const getPopularGames = async (req, res) => {
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
      limit 200;
    `;

    const data = await makeRequest("games", body);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des jeux populaires" });
  }
};

module.exports = { getPopularGames };
