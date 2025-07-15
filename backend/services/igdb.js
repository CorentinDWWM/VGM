const IGDB_BASE_URL = "https://api.igdb.com/v4";
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_ACCESS_TOKEN = process.env.TWITCH_ACCESS_TOKEN;

if (!TWITCH_CLIENT_ID || !TWITCH_ACCESS_TOKEN) {
  console.error(
    "ERREUR: TWITCH_CLIENT_ID et TWITCH_ACCESS_TOKEN sont requis dans le fichier .env"
  );
  process.exit(1);
}

// Configuration des headers pour IGDB
const getIGDBHeaders = () => ({
  "Client-ID": TWITCH_CLIENT_ID,
  "Authorization": `Bearer ${TWITCH_ACCESS_TOKEN}`,
  "Content-Type": "text/plain",
});

// Requête IGDB avec gestion d'erreur améliorée
const makeRequest = async (endpoint, body = "") => {
  try {
    console.log(`📡 Requête IGDB: ${endpoint}`);
    console.log(`📝 Body: ${body}`);

    const response = await fetch(`${IGDB_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: getIGDBHeaders(),
      body: body,
    });

    console.log(`📊 Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erreur response: ${errorText}`);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log(`✅ Données reçues: ${data.length} éléments`);
    return data;
  } catch (error) {
    console.error(`❌ Erreur IGDB ${endpoint}:`, error.message);
    throw new Error(`Erreur lors de la requête IGDB: ${error.message}`);
  }
};

const searchGames = async (query, limit = 10) => {
  const body = `search "${query}"; fields name, summary, rating, first_release_date, platforms.name, cover.url, genres.name; limit ${limit};`;
  return await makeRequest("games", body);
};

const getGameById = async (gameId) => {
  const body = `fields name, summary, storyline, rating, rating_count, first_release_date, platforms.name, cover.url, genres.name; where id = ${gameId};`;
  return await makeRequest("games", body);
};

// Version simplifiée pour tester
const getPopularGames = async (req, res) => {
  try {
    const body = `fields name, rating, platforms.name, first_release_date; where rating != null & rating > 80; sort rating desc; limit 20;`;
    const data = await makeRequest("games", body);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
};

const getGamesByGenre = async (genreId, limit = 20) => {
  const body = `fields name, rating, first_release_date; where genres = ${genreId} & rating != null; sort rating desc; limit ${limit};`;
  return await makeRequest("games", body);
};

// Version simplifiée pour tester
const getGenres = async () => {
  const body = "fields name; limit 50;";
  return await makeRequest("genres", body);
};

const getSonyPlatforms = async () => {
  try {
    const body =
      "fields id, name, abbreviation, slug; where platform_family = 1; limit 50;";
    const data = await makeRequest("platforms", body);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getMicrosoftPlatforms = async () => {
  try {
    const body =
      "fields id, name, abbreviation, slug; where platform_family = 3; limit 50;";
    const data = await makeRequest("platforms", body);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getNintendoPlatforms = async () => {
  try {
    const body =
      "fields id, name, abbreviation, slug; where platform_family = 5; limit 50;";
    const data = await makeRequest("platforms", body);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getPCPlatforms = async () => {
  try {
    const body = "fields id, name, abbreviation, slug; where id = 6; limit 50;";
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

const getPlatforms = async (req, res) => {
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
    res.status(200).json(platforms);
  } catch (error) {
    console.log(error);
  }
};

const getPlatformsFamilies = async (req, res) => {
  try {
    const body = `fields checksum,name,slug;`;
    const data = await makeRequest("platform_families", body);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
};

const getUpcomingGames = async (limit = 20) => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const body = `fields name,first_release_date; where first_release_date > ${currentTimestamp}; sort first_release_date asc; limit ${limit};`;
  return await makeRequest("games", body);
};

// Fonction de test simple
const testConnection = async () => {
  try {
    console.log("🔍 Test de connexion IGDB...");
    const body = "fields name; limit 1;";
    const result = await makeRequest("games", body);
    console.log("✅ Connexion réussie!", result);
    return true;
  } catch (error) {
    console.error("❌ Échec de la connexion:", error.message);
    return false;
  }
};

module.exports = {
  searchGames,
  getGameById,
  getPopularGames,
  getGamesByGenre,
  getGenres,
  getPlatforms,
  getPlatformsFamilies,
  getUpcomingGames,
  testConnection,
};
