import { useContext, useEffect, useState, useCallback } from "react";
import AffichesJeux from "../../components/Affiches/AffichesJeux";
import { Link } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import { AuthContext } from "../../context/AuthContext";
import { importGamesThisWeek } from "../../apis/games.api";

export default function Decouvertes() {
  const { user } = useContext(AuthContext);
  const {
    games,
    genres,
    gamesThisWeek,
    importWithLock,
    importCompleted,
    importLocks,
  } = useContext(DataContext);

  const [isImporting, setIsImporting] = useState(false);

  const formatGenreName = (genreName) => {
    return genreName === "Role-playing (RPG)" ? "RPG" : genreName;
  };

  const userFavoriteGenres = user?.games
    ? (() => {
        const genreCount = {};
        user.games.forEach((userGame) => {
          if (userGame.genres?.length) {
            userGame.genres.forEach((genre) => {
              const genreKey = genre.id;
              genreCount[genreKey] = genreCount[genreKey]
                ? {
                    ...genreCount[genreKey],
                    count: genreCount[genreKey].count + 1,
                  }
                : { name: genre.name, count: 1 };
            });
          }
        });

        return Object.entries(genreCount)
          .sort(([, a], [, b]) => b.count - a.count)
          .slice(0, 3)
          .map(([id, genre]) => ({ id, name: formatGenreName(genre.name) }));
      })()
    : [];

  const filterUserGames = (gamesList) => {
    if (!user?.games?.length) return gamesList;
    return gamesList.filter(
      (game) => !user.games.some((userGame) => userGame._id === game._id)
    );
  };

  const recommendedGames =
    userFavoriteGenres.length > 0
      ? filterUserGames(games)
          .filter((game) =>
            game.genres?.some((gameGenre) =>
              userFavoriteGenres.some(
                (favoriteGenre) => favoriteGenre.id === gameGenre.id.toString()
              )
            )
          )
          .sort(() => Math.random() - 0.5)
          .slice(0, 5)
      : filterUserGames(games).slice(0, 5);

  const importGamesByPeriod = useCallback(async () => {
    // Vérifier si déjà terminé ou en cours
    if (importCompleted.week || importLocks.week || gamesThisWeek.length > 0) {
      console.log("🎯 Import semaine déjà fait ou en cours");
      return;
    }

    setIsImporting(true);
    try {
      await importWithLock("week", importGamesThisWeek);
    } catch (error) {
      console.error("Erreur import semaine:", error);
    } finally {
      setIsImporting(false);
    }
  }, [
    importWithLock,
    importCompleted.week,
    importLocks.week,
    gamesThisWeek.length,
  ]);

  useEffect(() => {
    // Délai pour éviter les conflits avec DiscoverNews
    const timeoutId = setTimeout(() => {
      importGamesByPeriod();
    }, 200);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-12 px-5 py-8">
      {/* Intro */}
      <div className="text-center">
        <h2 className="text-black dark:text-white font-bold text-3xl mb-2">
          Exploez de nouveaux univers
        </h2>
        <h3 className="text-secondary-text-light dark:text-secondary-text-dark">
          Découvrez votre prochain jeu coup de coeur grâce à nos recommandations
          personnalisées
        </h3>
      </div>

      {/* Recommandations */}
      <div className="w-full flex flex-col items-center gap-4">
        <p className="text-black dark:text-white text-2xl font-semibold">
          Recommandé pour vous
        </p>
        <p className="text-secondary-text-light dark:text-secondary-text-dark text-center">
          Basé sur vos jeux favoris :{" "}
          {userFavoriteGenres.length > 0
            ? userFavoriteGenres.map((genre) => genre.name).join(", ")
            : "Aucun genre défini"}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6">
          {recommendedGames.map((game) => (
            <AffichesJeux key={game._id} game={game} />
          ))}
        </div>
      </div>

      {/* Jeux populaires */}
      <div className="w-full flex flex-col items-center gap-4 py-8 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl rounded-xl">
        <p className="text-black dark:text-white text-2xl font-semibold">
          Jeux populaires
        </p>
        <p className="text-secondary-text-light dark:text-secondary-text-dark text-center">
          Une sélection de jeux appréciés par la communauté
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6">
          {filterUserGames(games)
            .filter((game) => game.votes > 8)
            .sort(() => Math.random() - 0.5)
            .slice(0, 6)
            .map((game) => (
              <AffichesJeux key={game._id} game={game} />
            ))}
        </div>
      </div>

      {/* Nouvelles Sorties */}
      <div className="w-full flex flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-2">
          <p className="text-black dark:text-white text-2xl font-semibold">
            Nouvelles sorties (cette semaine)
          </p>
          <Link
            to="/discover/news"
            className="text-primary-light dark:text-primary-dark hover:underline"
          >
            Voir tout
          </Link>
        </div>

        {isImporting ? (
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Chargement des nouvelles sorties...
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center items-center gap-6">
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
              <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="p-8 flex flex-col items-center justify-center min-h-[160px] text-center">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors">
                    {g.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {g.nb_jeux} jeux disponibles
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
