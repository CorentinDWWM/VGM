const Genre = require("../models/genres.schema");
const Game = require("../models/games.schema"); // Assurez-vous d'importer le modèle Game
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

const getGenresWithCount = async (req, res) => {
  try {
    // Agréger les jeux par genre pour compter
    const genreCounts = await Game.aggregate([
      { $unwind: "$genres" },
      { $group: { igdbID: "$genres", count: { $sum: 1 } } },
    ]);

    // Créer un map des compteurs
    const countMap = genreCounts.reduce((acc, item) => {
      acc[item.igdbID] = item.count;
      return acc;
    }, {});

    // Récupérer tous les genres et ajouter nb_jeux
    const genres = await Genre.find();
    const genresWithCount = genres.map((genre) => ({
      ...genre.toObject(),
      nb_jeux: countMap[genre.igdbID] || 0,
    }));

    res.status(200).json(genresWithCount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateGenresCounts = async (req, res) => {
  try {
    // Agréger les jeux par genre
    const genreCounts = await Game.aggregate([
      { $unwind: "$genres" },
      { $group: { igdbID: "$genres", count: { $sum: 1 } } },
    ]);

    // Mettre à jour chaque genre avec son nb_jeux
    let updateCount = 0;
    for (const genreCount of genreCounts) {
      await Genre.updateOne(
        { igdbID: genreCount.igdbID },
        { $set: { nb_jeux: genreCount.count } }
      );
      updateCount++;
    }

    // Mettre nb_jeux à 0 pour les genres sans jeux
    await Genre.updateMany(
      { igdbID: { $nin: genreCounts.map((g) => g._id) } },
      { $set: { nb_jeux: 0 } }
    );

    res.status(200).json({
      message: `Compteurs mis à jour pour ${updateCount} genres`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getGenres,
  getGenresFromIGDB,
  getGenresWithCount,
  updateGenresCounts,
};
