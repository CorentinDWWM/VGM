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
    // if (endpoint !== "platform_logos") {
    //   console.log(`📡 Requête IGDB: ${endpoint}`);
    //   console.log(`📝 Body: ${body}`);
    // }

    const response = await fetch(`${IGDB_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: getIGDBHeaders(),
      body: body,
    });

    // if (endpoint !== "platform_logos") {
    //   console.log(`📊 Status: ${response.status}`);
    // }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erreur response: ${errorText}`);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const data = await response.json();

    if (endpoint !== "platform_logos") {
      console.log(`✅ Données reçues: ${data.length} éléments`);
    }

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

const getGamesByGenre = async (genreId, limit = 20) => {
  const body = `fields name, rating, first_release_date; where genres = ${genreId} & rating != null; sort rating desc; limit ${limit};`;
  return await makeRequest("games", body);
};

const getGenres = async () => {
  const body = "fields name; limit 50;";
  return await makeRequest("genres", body);
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
  makeRequest,
  searchGames,
  getGameById,
  getGamesByGenre,
  getGenres,
  getUpcomingGames,
  testConnection,
};
