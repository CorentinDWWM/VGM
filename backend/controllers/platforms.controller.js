const Platform = require("../models/platform.schema");
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

module.exports = { getPlatforms, getPlatformsFromIGDB };
