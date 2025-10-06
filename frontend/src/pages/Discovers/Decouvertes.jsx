import { useContext, useEffect, useState } from "react";
import AffichesJeux from "../../components/Affiches/AffichesJeux";
import { Link } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import { AuthContext } from "../../context/AuthContext";
import { importGamesThisWeek } from "../../apis/games.api";

export default function Decouvertes() {
  const { user } = useContext(AuthContext);
  const { games, genres, gamesThisWeek, setGamesThisWeekData } =
    useContext(DataContext);

  const formatGenreName = (genreName) => {
    if (genreName === "Role-playing (RPG)") {
      return "RPG";
    }
    return genreName;
  };

  // Avoir les genres Favoris
  const userFavoriteGenres = user?.games
    ? (() => {
        const genreCount = {};

        user.games.forEach((userGame) => {
          if (userGame.genres && Array.isArray(userGame.genres)) {
            userGame.genres.forEach((genre) => {
              const genreKey = genre.id;
              const genreName = genre.name;
              if (genreCount[genreKey]) {
                genreCount[genreKey].count += 1;
              } else {
                genreCount[genreKey] = {
                  name: genreName,
                  count: 1,
                };
              }
            });
          }
        });
        const sortedGenres = Object.entries(genreCount)
          .sort(([, a], [, b]) => b.count - a.count)
          .slice(0, 3)
          .map(([id, genre]) => ({
            id: id,
            name: formatGenreName(genre.name),
          }));

        // console.log("Top 3 genres:", sortedGenres);
        return sortedGenres;
      })()
    : [];

  // Filtre des jeux favoris de l'utilisateur
  const recommendedGames =
    userFavoriteGenres.length > 0
      ? games
          .filter((game) => {
            if (!game.genres || !Array.isArray(game.genres)) return false;
            return game.genres.some((gameGenre) =>
              userFavoriteGenres.some(
                (favoriteGenre) => favoriteGenre.id === gameGenre.id.toString()
              )
            );
          })
          .filter((game) => {
            // Exclure les jeux déjà présents dans la liste de l'utilisateur
            if (user?.games && Array.isArray(user.games)) {
              return !user.games.some((userGame) => userGame._id === game._id);
            }
            return true;
          })
          .sort(() => Math.random() - 0.5)
          .slice(0, 5)
      : games
          .filter((game) => {
            // Exclure les jeux déjà présents dans la liste de l'utilisateur même quand pas de genres favoris
            if (user?.games && Array.isArray(user.games)) {
              return !user.games.some((userGame) => userGame._id === game._id);
            }
            return true;
          })
          .slice(0, 5);

  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState({
    week: false,
  });
  // Fonction d'import des jeux par période
  const importGamesByPeriod = async () => {
    setIsImporting(true);

    // Reset status before starting
    setImportStatus({
      week: false,
    });

    // Fonction pour sanitiser les jeux importés
    const sanitizeGames = (games) => {
      return games.map((game, index) => ({
        ...game,
        _id: game._id || `temp_${index}`,
        name: game.name || "Nom non disponible",
        votes: isNaN(Number(game.votes)) ? 0 : Number(game.votes || 0),
        total_votes: isNaN(Number(game.total_votes))
          ? 0
          : Number(game.total_votes || 0),
        igdbID: isNaN(Number(game.igdbID)) ? 0 : Number(game.igdbID || 0),
        release_dates: game.release_dates || null,
        slug: game.slug || "",
        summary: game.summary || "",
        url: game.url || "",
        genres: game.genres || [],
        platforms: game.platforms || [],
        cover: game.cover || null,
      }));
    };

    // Import week games
    try {
      const weekResponse = await importGamesThisWeek();
      if (weekResponse?.games) {
        setImportStatus((prev) => ({ ...prev, week: true }));
        setGamesThisWeekData(sanitizeGames(weekResponse.games));
      }
    } catch (error) {
      console.error("Erreur import semaine:", error);
    } finally {
      setIsImporting(false);
    }
  };

  // Lancer les imports au chargement
  useEffect(() => {
    // Vérifier si les données sont déjà chargées
    if (gamesThisWeek.length === 0) {
      importGamesByPeriod();
    }
  }, []); // Retirer les dépendances pour éviter les re-exécutions

  return (
    <div className="w-full flex flex-col justify-center items-center gap-[50px] px-5 py-[30px] max-sm:px-2.5">
      {/* Intro */}
      <div className="flex flex-col justify-center items-center gap-2.5">
        <h2 className="text-black dark:text-white font-bold text-3xl text-center">
          Exploez de nouveaux univers
        </h2>
        <h3 className="text-secondary-text-light dark:text-secondary-text-dark text-center">
          Découvrez votre prochain jeu coup de coeur grâce à nos recommandations
          personnalisées
        </h3>
      </div>
      {/* Basée sur vos Jeux favoris */}
      <div className="w-full flex flex-col items-center gap-[15px] pb-8">
        <p className="text-black dark:text-white text-2xl font-semibold">
          Recommandé pour vous
        </p>
        <p className="text-secondary-text-light dark:text-secondary-text-dark text-center">
          Basé sur vos jeux favoris :{" "}
          {userFavoriteGenres.length > 0
            ? userFavoriteGenres.map((genre) => genre.name).join(", ")
            : "Aucun genre défini"}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 pt-2.5">
          {recommendedGames.map((game) => (
            <AffichesJeux key={game._id} game={game} />
          ))}
        </div>
      </div>
      {/* Jeux populaires */}
      <div className="w-full flex flex-col items-center gap-[15px] py-8 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl shadow-black/10 dark:shadow-white/10 rounded-xl">
        <p className="text-black dark:text-white text-2xl font-semibold">
          Jeux populaires
        </p>
        <p className="text-secondary-text-light dark:text-secondary-text-dark text-center">
          Une sélection de jeux appréciés par la communauté
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 pt-2.5">
          {games
            .filter((game) => {
              // Exclure les jeux déjà dans la liste de l'utilisateur
              if (user?.games && Array.isArray(user.games)) {
                return !user.games.some(
                  (userGame) => userGame._id === game._id
                );
              }
              return true;
            })
            .filter(
              (game) => Math.round(game.votes) && Math.round(game.votes) > 8
            ) // Filtre pour note > 8/10
            .sort(() => Math.random() - 0.5) // Mélange aléatoire
            .slice(0, 6)
            .map((game) => (
              <AffichesJeux key={game._id} game={game} />
            ))}
        </div>
      </div>
      {/* Nouvelles Sorties */}
      <div className="w-full flex flex-col items-center gap-[15px] pb-8">
        <div className="flex items-center justify-center gap-2.5">
          <p className="text-black dark:text-white text-2xl font-semibold">
            Nouvelles sorties (cette semaine)
          </p>
          <Link
            to="/discover/news"
            className="text-primary-light dark:text-primary-dark hover:underline cursor-pointer pt-1"
          >
            Voir tout
          </Link>
        </div>

        {/* Loading pour les nouvelles sorties */}
        {isImporting ? (
          <div className="flex flex-col items-center gap-6 pt-2.5">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent absolute top-0"></div>
            </div>
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Chargement des nouvelles sorties...
              </p>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                  importStatus.week
                    ? "bg-green-500 text-white scale-110"
                    : "bg-gray-200 dark:bg-gray-600 animate-pulse"
                }`}
              >
                {importStatus.week ? (
                  <svg
                    className="w-4 h-4 animate-bounce"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <div className="w-3 h-3 bg-current rounded-full animate-pulse"></div>
                )}
              </div>
              <span
                className={`text-sm font-medium transition-all duration-500 ${
                  importStatus.week
                    ? "text-green-600 dark:text-green-400 font-semibold"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Jeux de cette semaine
              </span>
              {importStatus.week && (
                <div className="ml-auto">
                  <span className="text-xs text-green-500 dark:text-green-400">
                    ✓ Terminé
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center items-center gap-6 pt-2.5">
            {gamesThisWeek.slice(0, 5).map((game) => (
              <AffichesJeux key={game._id} game={game} />
            ))}
          </div>
        )}
      </div>

      {/* Genres */}
      <div className="w-full flex flex-col items-center gap-6">
        <p className="text-black dark:text-white text-2xl font-semibold">
          Explorer par genre
        </p>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {genres.map((g) => (
            <Link key={g._id} to={`/discover/${g.igdbID}`}>
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:scale-105">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-light/10 to-primary-dark/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Content */}
                <div className="relative p-8 flex flex-col items-center justify-center min-h-[160px] text-center">
                  {/* Genre name */}
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors duration-300">
                    {g.name}
                  </h3>

                  {/* Number of games */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {g.nb_jeux} jeux disponibles
                  </p>

                  {/* Hover indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-light to-primary-dark transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
