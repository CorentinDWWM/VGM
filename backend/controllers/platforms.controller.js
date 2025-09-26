const Platform = require("../models/platform.schema");
const Game = require("../models/games.schema");
const { makeRequest } = require("../services/igdb");

// Plateformes

const getPlatforms = async (req, res) => {
  try {
    const platforms = await Platform.find();
    res.status(200).json(platforms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPlatforms = async (req, res) => {
  try {
    const body = "fields id, name, platform_family; limit 100;";
    const data = await makeRequest("platforms", body);
    res.status(200).json(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getSonyPlatforms = async () => {
  try {
    const body =
      "fields id, name, abbreviation, slug, platform_logo; where platform_family = 1; limit 50;";
    const data = await makeRequest("platforms", body);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getMicrosoftPlatforms = async () => {
  try {
    const body =
      "fields id, name, abbreviation, slug, platform_logo; where platform_family = 3; limit 50;";
    const data = await makeRequest("platforms", body);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getNintendoPlatforms = async () => {
  try {
    const body =
      "fields id, name, abbreviation, slug, platform_logo; where platform_family = 5; limit 50;";
    const data = await makeRequest("platforms", body);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getPCPlatforms = async () => {
  try {
    const body =
      "fields id, name, abbreviation, slug, platform_logo; where id = 6; limit 50;";
    const data = await makeRequest("platforms", body);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getLogoPlatforms = async (id) => {
  try {
    const body = `fields url; where id = ${id};`;
    const data = await makeRequest("platform_logos", body);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getPlatformsFromIGDB = async (req, res) => {
  const platforms = [];
  try {
    // Sony
    const sony = await getSonyPlatforms();
    for (const s of sony) {
      if (s.platform_logo) {
        const logo = await getLogoPlatforms(s.platform_logo);
        platforms.push({
          ...s,
          logo: logo[0],
        });
      }
    }
    // Microsoft
    const microsoft = await getMicrosoftPlatforms();
    for (const m of microsoft) {
      if (m.platform_logo) {
        const logo = await getLogoPlatforms(m.platform_logo);
        platforms.push({
          ...m,
          logo: logo[0],
        });
      }
    }
    // Nintendo
    const nintendo = await getNintendoPlatforms();
    for (const n of nintendo) {
      if (n.platform_logo) {
        const logo = await getLogoPlatforms(n.platform_logo);
        platforms.push({
          ...n,
          logo: logo[0],
        });
      }
    }
    // PC
    const pc = await getPCPlatforms();
    for (const p of pc) {
      if (p.platform_logo) {
        const logo = await getLogoPlatforms(p.platform_logo);
        platforms.push({
          ...p,
          logo: logo[0],
        });
      }
    }
    try {
      for (const p of platforms) {
        const plateforme = await Platform.findOne(p.igdbID);
        if (plateforme) {
          console.log(`${p.name} déjà dans la base de données`);
        } else {
          const newPlatforms = new Platform({
            igdbID: p.id,
            abbreviation: p.abbreviation,
            name: p.name,
            platform_logo_id: p.platform_logo,
            slug: p.slug,
            logo: {
              id: p.logo.id,
              url: p.logo.url,
            },
          });
          await newPlatforms.save();
        }
      }
      res.status(200).json(platforms);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Problème dans l'ajout des plateformes" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Problème dans la récupération des plateformes" });
  }
};

const getGamesByPlatform = async (req, res) => {
  try {
    const { platformId } = req.params;
    const platformIdNumber = parseInt(platformId);

    // Trouver les jeux qui ont cette plateforme dans leur tableau platforms
    const games = await Game.find({
      "platforms.id": platformIdNumber,
    })
      .populate("genres")
      .populate("platforms")
      .populate("themes")
      .populate("keywords")
      .select({
        name: 1,
        slug: 1,
        summary: 1,
        cover: 1,
        first_release_date: 1,
        rating: 1,
        rating_count: 1,
        total_rating: 1,
        total_rating_count: 1,
        genres: 1,
        platforms: 1,
        themes: 1,
        keywords: 1,
        igdbID: 1,
        screenshots: 1,
        videos: 1,
        url: 1,
      });

    // S'assurer que les valeurs numériques ne sont pas undefined
    const sanitizedGames = games.map((game) => ({
      ...game.toObject(),
      rating: game.rating || 0,
      rating_count: game.rating_count || 0,
      total_rating: game.total_rating || 0,
      total_rating_count: game.total_rating_count || 0,
      first_release_date: game.first_release_date || null,
    }));

    res.status(200).json(sanitizedGames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGamesByPlatformPaginated = async (req, res) => {
  try {
    const { platformId } = req.params;
    const { limit = 50, skip = 0 } = req.query;
    const platformIdNumber = parseInt(platformId);
    const limitNumber = parseInt(limit);
    const skipNumber = parseInt(skip);

    // Trouver les jeux qui ont cette plateforme dans leur tableau platforms
    const games = await Game.find({
      "platforms.id": platformIdNumber,
    })
      .populate("genres")
      .populate("platforms")
      .populate("themes")
      .populate("keywords")
      .select({
        name: 1,
        slug: 1,
        summary: 1,
        cover: 1,
        first_release_date: 1,
        rating: 1,
        rating_count: 1,
        total_rating: 1,
        total_rating_count: 1,
        genres: 1,
        platforms: 1,
        themes: 1,
        keywords: 1,
        igdbID: 1,
        screenshots: 1,
        videos: 1,
        url: 1,
      })
      .skip(skipNumber)
      .limit(limitNumber);

    // S'assurer que les valeurs numériques ne sont pas undefined
    const sanitizedGames = games.map((game) => ({
      ...game.toObject(),
      rating: game.rating || 0,
      rating_count: game.rating_count || 0,
      total_rating: game.total_rating || 0,
      total_rating_count: game.total_rating_count || 0,
      first_release_date: game.first_release_date || null,
    }));

    res.status(200).json(sanitizedGames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPlatforms,
  getAllPlatforms,
  getPlatformsFromIGDB,
  getGamesByPlatform,
  getGamesByPlatformPaginated,
};
