const Genre = require("../models/genres.schema");
const Game = require("../models/games.schema");
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

const updateGenresCounts = async (req, res) => {
  try {
    // Agréger les jeux par genre en utilisant genres.id
    const genreCounts = await Game.aggregate([
      { $unwind: "$genres" },
      {
        $lookup: {
          from: "genres",
          localField: "genres.id",
          foreignField: "igdbID",
          as: "genreInfo",
        },
      },
      { $unwind: "$genreInfo" },
      {
        $group: {
          _id: "$genreInfo.igdbID",
          count: { $sum: 1 },
        },
      },
    ]);

    // Mettre à jour chaque genre avec son nb_jeux
    let updateCount = 0;
    for (const genreCount of genreCounts) {
      const igdbID = Number(genreCount._id);

      await Genre.updateOne(
        { igdbID: igdbID },
        { $set: { nb_jeux: genreCount.count } }
      );

      updateCount++;
    }

    // Mettre nb_jeux à 0 pour les genres sans jeux
    const resetResult = await Genre.updateMany(
      { igdbID: { $nin: genreCounts.map((g) => Number(g._id)) } },
      { $set: { nb_jeux: 0 } }
    );

    res.status(200).json({
      message: `Compteurs mis à jour pour ${updateCount} genres, ${resetResult.modifiedCount} remis à zéro`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGamesByGenre = async (req, res) => {
  try {
    const { genreId } = req.params;
    const genreIdNumber = parseInt(genreId);

    // Trouver les jeux qui ont ce genre dans leur tableau genres
    const games = await Game.find({
      "genres.id": genreIdNumber,
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
        release_dates: 1,
        votes: 1,
        total_votes: 1,
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
      votes: game.votes || 0,
      total_votes: game.total_votes || 0,
      release_dates: game.release_dates || null,
    }));

    res.status(200).json(sanitizedGames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGamesByGenrePaginated = async (req, res) => {
  try {
    const { genreId } = req.params;
    const { limit = 50, skip = 0 } = req.query;
    const genreIdNumber = parseInt(genreId);
    const limitNumber = parseInt(limit);
    const skipNumber = parseInt(skip);

    // Trouver les jeux qui ont ce genre dans leur tableau genres
    const games = await Game.find({
      "genres.id": genreIdNumber,
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
        release_dates: 1,
        votes: 1,
        total_votes: 1,
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
      votes: game.votes || 0,
      total_votes: game.total_votes || 0,
      release_dates: game.release_dates || null,
    }));

    res.status(200).json(sanitizedGames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getGenres,
  getGenresFromIGDB,
  updateGenresCounts,
  getGamesByGenre,
  getGamesByGenrePaginated,
};
