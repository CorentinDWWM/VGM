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

    // if (endpoint !== "platform_logos" || endpoint !== "game_time_to_beats") {
    //   console.log(`✅ Données reçues: ${data.length} éléments`);
    // }

    return data;
  } catch (error) {
    console.error(`❌ Erreur IGDB ${endpoint}:`, error.message);
    throw new Error(`Erreur lors de la requête IGDB: ${error.message}`);
  }
};

const getUpcomingGames = async (limit = 20) => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const body = `fields name,first_release_date; where first_release_date > ${currentTimestamp}; sort first_release_date asc; limit ${limit};`;
  return await makeRequest("games", body);
};

module.exports = {
  makeRequest,
  getUpcomingGames,
};
