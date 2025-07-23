const Theme = require("../models/themes.schema");
const { makeRequest } = require("../services/igdb");

const getThemes = async (req, res) => {
  try {
    const themes = await Theme.find();
    res.status(200).json(themes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getThemesFromIGDB = async (req, res) => {
  try {
    const body = "fields name, slug, url; limit 100; sort id;";
    const data = await makeRequest("themes", body);

    let importCount = 0;
    let errorCount = 0;
    let existingCount = 0;

    for (const oneTheme of data) {
      try {
        const existingTheme = await Theme.findOne({ igdbID: oneTheme.id });
        if (existingTheme) {
          existingCount++;
          console.log(`⏩ Theme déjà en base : ${oneTheme.name}`);
          continue;
        }

        const theme = new Theme({
          igdbID: oneTheme.id,
          name: oneTheme.name,
          slug: oneTheme.slug,
          url: oneTheme.url,
        });

        await theme.save();
        importCount++;
        console.log(`✅ Theme importé : ${oneTheme.name}`);
      } catch (error) {
        errorCount++;
        console.error(
          `❌ Erreur lors de l'import de ${oneTheme.name}:`,
          error.message
        );
      }
    }

    console.log(
      `📊 Import terminé: ${importCount} themes réussis, ${existingCount} déjà dans la bdd, ${errorCount} erreurs`
    );

    res.status(200).json({
      message: `Import terminé: ${importCount} themes réussis, ${existingCount} déjà dans la bdd, ${errorCount} erreurs.`,
    });
  } catch (error) {
    res.status(400).json({ message: "Erreur dans la récupération des themes" });
  }
};

module.exports = { getThemes, getThemesFromIGDB };
