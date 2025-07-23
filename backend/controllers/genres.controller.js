const Genre = require("../models/genres.schema");
const { makeRequest } = require("../services/igdb");

const getGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGenresFromIGDB = async (req, res) => {
  try {
    const body = "fields name, slug, url; limit 100; sort id;";
    const data = await makeRequest("genres", body);

    let importCount = 0;
    let errorCount = 0;
    let existingCount = 0;

    for (const oneGenre of data) {
      try {
        const existingGenre = await Genre.findOne({ igdbID: oneGenre.id });
        if (existingGenre) {
          existingCount++;
          console.log(`⏩ Genre déjà en base : ${oneGenre.name}`);
          continue;
        }

        const genre = new Genre({
          igdbID: oneGenre.id,
          name: oneGenre.name,
          slug: oneGenre.slug,
          url: oneGenre.url,
        });

        await genre.save();
        importCount++;
        console.log(`✅ Genre importé : ${oneGenre.name}`);
      } catch (error) {
        errorCount++;
        console.error(
          `❌ Erreur lors de l'import de ${oneGenre.name}:`,
          error.message
        );
      }
    }

    console.log(
      `📊 Import terminé: ${importCount} genres réussis, ${existingCount} déjà dans la bdd, ${errorCount} erreurs`
    );

    res.status(200).json({
      message: `Import terminé: ${importCount} genres réussis, ${existingCount} déjà dans la bdd, ${errorCount} erreurs.`,
    });
  } catch (error) {
    res.status(400).json({ message: "Erreur dans la récupération des genres" });
  }
};

module.exports = { getGenres, getGenresFromIGDB };
