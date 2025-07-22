const { makeRequest } = require("../services/igdb");

const getGenres = async (req, res) => {
  try {
    const body = "fields name; limit 50;";
    const data = await makeRequest("genres", body);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: "Erreur dans la récupération des genres" });
  }
};

module.exports = { getGenres };
