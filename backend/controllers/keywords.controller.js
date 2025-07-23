const Keyword = require("../models/keywords.schema");
const { makeRequest } = require("../services/igdb");

const getKeywords = async (req, res) => {
  try {
    const keywords = await Keyword.find();
    res.status(200).json(keywords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getKeywordsFromIGDB = async (req, res) => {
  try {
    const body = "fields name, slug, url; limit 100; sort id;";
    const data = await makeRequest("keywords", body);

    let importCount = 0;
    let errorCount = 0;
    let existingCount = 0;

    for (const oneKeyword of data) {
      try {
        const existingKeyword = await Keyword.findOne({
          igdbID: oneKeyword.id,
        });
        if (existingKeyword) {
          existingCount++;
          console.log(`⏩ Keyword déjà en base : ${oneKeyword.name}`);
          continue;
        }

        const keyword = new Keyword({
          igdbID: oneKeyword.id,
          name: oneKeyword.name,
          slug: oneKeyword.slug,
          url: oneKeyword.url,
        });

        await keyword.save();
        importCount++;
        console.log(`✅ Keyword importé : ${oneKeyword.name}`);
      } catch (error) {
        errorCount++;
        console.error(
          `❌ Erreur lors de l'import de ${oneKeyword.name}:`,
          error.message
        );
      }
    }

    console.log(
      `📊 Import terminé: ${importCount} keywords réussis, ${existingCount} déjà dans la bdd, ${errorCount} erreurs`
    );

    res.status(200).json({
      message: `Import terminé: ${importCount} keywords réussis, ${existingCount} déjà dans la bdd, ${errorCount} erreurs.`,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erreur dans la récupération des keywords" });
  }
};

module.exports = { getKeywords, getKeywordsFromIGDB };
