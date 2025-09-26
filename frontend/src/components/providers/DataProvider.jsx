import { useEffect, useState, useCallback } from "react";
import { DataContext } from "../../context/DataContext";
import {
  getGenres,
  getGamesByGenre,
  getGamesByGenrePaginated,
  getPlateformes,
  getGamesByPlatform,
  getGamesByPlatformPaginated,
} from "../../apis/igdbData.api";
import {
  getGames,
  getGameById,
  getGamesSimplified,
} from "../../apis/games.api";

export default function DataProvider({ children }) {
  // États principaux
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [currentGenreFilter, setCurrentGenreFilter] = useState(null);
  const [currentPlatformFilter, setCurrentPlatformFilter] = useState(null);
  const [allGamesSimplified, setAllGamesSimplified] = useState([]);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  // États pour les imports par période
  const [gamesThisWeek, setGamesThisWeek] = useState([]);
  const [gamesThisMonth, setGamesThisMonth] = useState([]);
  const [gamesLastThreeMonths, setGamesLastThreeMonths] = useState([]);
  const [useImportedData, setUseImportedData] = useState(false);

  // États pour la pagination
  const [loaded, setLoaded] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Cache avec versioning
  const [gameCache, setGameCache] = useState(new Map());
  const [cacheVersion, setCacheVersion] = useState(0);

  // Fonction pour invalider le cache
  const invalidateCache = useCallback(() => {
    setGameCache(new Map());
    setCacheVersion((prev) => prev + 1);
  }, []);

  // Fonction pour récupérer un jeu par son ID
  const getAGame = useCallback(
    async (gameId) => {
      try {
        // Vérifier dans le cache local
        for (const games of gameCache.values()) {
          const foundGame = games.find((game) => game._id === gameId);
          if (foundGame) return foundGame;
        }

        // Appel API si pas trouvé dans le cache
        const game = await getGameById(gameId);
        return game;
      } catch (error) {
        console.error("Erreur lors de la récupération du jeu:", error);
        throw error;
      }
    },
    [gameCache]
  );

  // Fonction pour filtrer par genre
  const filterGamesByGenre = useCallback(async (genreId, genreName) => {
    try {
      setIsLoading(true);
      const gamesData = await getGamesByGenrePaginated(genreId, 50, 0);
      setFilteredGames(gamesData);
      setLoaded(gamesData.length);
      setHasMore(gamesData.length === 50);
      setIsFiltered(true);
      setCurrentGenreFilter({ id: genreId, name: genreName });
      setIsLoading(false);

      // Sauvegarder l'état du filtre dans le localStorage
      localStorage.setItem(
        "genreFilter",
        JSON.stringify({ id: genreId, name: genreName })
      );
    } catch (error) {
      console.error("Erreur lors du filtrage par genre:", error);
      setIsLoading(false);
    }
  }, []);

  // Fonction pour restaurer le filtre depuis le localStorage
  const restoreGenreFilter = useCallback(async () => {
    try {
      const savedFilter = localStorage.getItem("genreFilter");
      if (savedFilter) {
        const filterData = JSON.parse(savedFilter);
        await filterGamesByGenre(filterData.id, filterData.name);
      }
    } catch (error) {
      console.error("Erreur lors de la restauration du filtre:", error);
      localStorage.removeItem("genreFilter");
    }
  }, [filterGamesByGenre]);

  // Fonction pour charger plus de jeux filtrés
  const loadMoreFilteredGames = useCallback(async () => {
    if (isLoadingMore || !currentGenreFilter) return;

    setIsLoadingMore(true);
    try {
      const moreGamesData = await getGamesByGenrePaginated(
        currentGenreFilter.id,
        50,
        loaded
      );
      setFilteredGames((prev) => [...prev, ...moreGamesData]);
      setLoaded((prev) => prev + moreGamesData.length);
      setHasMore(moreGamesData.length === 50);
    } catch (error) {
      console.error(
        "Erreur lors du chargement de plus de jeux filtrés:",
        error
      );
    } finally {
      setIsLoadingMore(false);
    }
  }, [loaded, isLoadingMore, currentGenreFilter]);

  // Fonction pour supprimer le filtre
  const clearGenreFilter = useCallback(() => {
    setIsFiltered(false);
    setCurrentGenreFilter(null);
    setFilteredGames([]);
    setLoaded(games.length);
    setHasMore(games.length === 50);

    // Supprimer du localStorage
    localStorage.removeItem("genreFilter");

    // Déclencher un événement personnalisé pour notifier les autres composants
    window.dispatchEvent(new CustomEvent("genreFilterCleared"));
  }, [games.length]);

  // Fonction pour supprimer complètement le filtre (y compris localStorage)
  const clearGenreFilterCompletely = useCallback(() => {
    clearGenreFilter();
    // Aussi nettoyer le localStorage au cas où
    localStorage.removeItem("genreFilter");

    // Déclencher un événement personnalisé pour notifier les autres composants
    window.dispatchEvent(new CustomEvent("genreFilterCleared"));
  }, [clearGenreFilter]);

  // Fonction pour filtrer par plateforme
  const filterGamesByPlatform = useCallback(
    async (platformId, platformName) => {
      try {
        setIsLoading(true);
        const gamesData = await getGamesByPlatformPaginated(platformId, 50, 0);
        setFilteredGames(gamesData);
        setLoaded(gamesData.length);
        setHasMore(gamesData.length === 50);
        setIsFiltered(true);
        setCurrentPlatformFilter({ id: platformId, name: platformName });
        setCurrentGenreFilter(null); // Clear genre filter
        setIsLoading(false);

        // Sauvegarder l'état du filtre dans le localStorage
        localStorage.setItem(
          "platformFilter",
          JSON.stringify({ id: platformId, name: platformName })
        );
        // Supprimer le filtre genre s'il existe
        localStorage.removeItem("genreFilter");
      } catch (error) {
        console.error("Erreur lors du filtrage par plateforme:", error);
        setIsLoading(false);
      }
    },
    []
  );

  // Fonction pour restaurer le filtre plateforme depuis le localStorage
  const restorePlatformFilter = useCallback(async () => {
    try {
      const savedFilter = localStorage.getItem("platformFilter");
      if (savedFilter) {
        const filterData = JSON.parse(savedFilter);
        await filterGamesByPlatform(filterData.id, filterData.name);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la restauration du filtre plateforme:",
        error
      );
      localStorage.removeItem("platformFilter");
    }
  }, [filterGamesByPlatform]);

  // Fonction pour charger plus de jeux filtrés par plateforme
  const loadMorePlatformFilteredGames = useCallback(async () => {
    if (isLoadingMore || !currentPlatformFilter) return;

    setIsLoadingMore(true);
    try {
      const moreGamesData = await getGamesByPlatformPaginated(
        currentPlatformFilter.id,
        50,
        loaded
      );
      setFilteredGames((prev) => [...prev, ...moreGamesData]);
      setLoaded((prev) => prev + moreGamesData.length);
      setHasMore(moreGamesData.length === 50);
    } catch (error) {
      console.error(
        "Erreur lors du chargement de plus de jeux filtrés par plateforme:",
        error
      );
    } finally {
      setIsLoadingMore(false);
    }
  }, [loaded, isLoadingMore, currentPlatformFilter]);

  // Fonction pour supprimer le filtre plateforme
  const clearPlatformFilter = useCallback(() => {
    setIsFiltered(false);
    setCurrentPlatformFilter(null);
    setFilteredGames([]);
    setLoaded(games.length);
    setHasMore(games.length === 50);

    // Supprimer du localStorage
    localStorage.removeItem("platformFilter");

    // Déclencher un événement personnalisé pour notifier les autres composants
    window.dispatchEvent(new CustomEvent("platformFilterCleared"));
  }, [games.length]);

  // Fonction pour supprimer tous les filtres
  const clearAllFilters = useCallback(() => {
    setIsFiltered(false);
    setCurrentGenreFilter(null);
    setCurrentPlatformFilter(null);
    setFilteredGames([]);
    setLoaded(games.length);
    setHasMore(games.length === 50);

    // Supprimer du localStorage
    localStorage.removeItem("genreFilter");
    localStorage.removeItem("platformFilter");

    // Déclencher des événements personnalisés
    window.dispatchEvent(new CustomEvent("genreFilterCleared"));
    window.dispatchEvent(new CustomEvent("platformFilterCleared"));
  }, [games.length]);

  // Chargement initial des données - modifié pour restaurer les filtres
  useEffect(() => {
    async function loadData() {
      try {
        const [gamesData, gamesSimplifiedData, genresData, platformsData] =
          await Promise.all([
            getGames(50, 0),
            getGamesSimplified(),
            getGenres(),
            getPlateformes(),
          ]);

        setGames(gamesData);
        setLoaded(gamesData.length);
        setHasMore(gamesData.length === 50);
        setAllGamesSimplified(gamesSimplifiedData);
        setGenres(genresData);
        setPlatforms(platformsData);

        // Mise en cache
        setGameCache(new Map().set(`games_0_v${cacheVersion}`, gamesData));

        setIsLoading(false);

        // Restaurer les filtres s'ils existent
        await restoreGenreFilter();
        await restorePlatformFilter();
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        setIsLoading(false);
      }
    }
    loadData();
  }, [cacheVersion, restoreGenreFilter, restorePlatformFilter]);

  // Effet pour nettoyer les filtres lors du démontage ou de l'actualisation
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("genreFilter");
      localStorage.removeItem("platformFilter");
      window.dispatchEvent(new CustomEvent("genreFilterCleared"));
      window.dispatchEvent(new CustomEvent("platformFilterCleared"));
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        localStorage.removeItem("genreFilter");
        localStorage.removeItem("platformFilter");
        window.dispatchEvent(new CustomEvent("genreFilterCleared"));
        window.dispatchEvent(new CustomEvent("platformFilterCleared"));
      }
    };

    // Nettoyer lors de l'actualisation/fermeture de la page
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Nettoyer quand l'onglet devient invisible
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      // Nettoyer lors du démontage du composant
      localStorage.removeItem("genreFilter");
      localStorage.removeItem("platformFilter");
      window.dispatchEvent(new CustomEvent("genreFilterCleared"));
      window.dispatchEvent(new CustomEvent("platformFilterCleared"));
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Fonction pour charger plus de jeux (pagination) - modifié pour gérer tous les filtrages
  const loadMoreGames = useCallback(async () => {
    if (isFiltered) {
      if (currentGenreFilter) {
        return loadMoreFilteredGames();
      } else if (currentPlatformFilter) {
        return loadMorePlatformFilteredGames();
      }
    }

    if (isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const cacheKey = `games_${loaded}_v${cacheVersion}`;
      let getGamesData;

      if (gameCache.has(cacheKey)) {
        getGamesData = gameCache.get(cacheKey);
      } else {
        getGamesData = await getGames(50, loaded);
        setGameCache((prev) => new Map(prev).set(cacheKey, getGamesData));
      }

      setGames((prev) => [...prev, ...getGamesData]);
      setLoaded((prev) => prev + getGamesData.length);
      setHasMore(getGamesData.length === 50);
    } catch (error) {
      console.error("Erreur lors du chargement de plus de jeux:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    loaded,
    isLoadingMore,
    gameCache,
    cacheVersion,
    isFiltered,
    loadMoreFilteredGames,
    loadMorePlatformFilteredGames,
    currentGenreFilter,
    currentPlatformFilter,
  ]);

  // Recharger les jeux après import
  const fetchGames = useCallback(async () => {
    try {
      invalidateCache();
      const [gamesData, gamesSimplifiedData] = await Promise.all([
        getGames(50, 0),
        getGamesSimplified(),
      ]);

      setGames(gamesData);
      setLoaded(gamesData.length);
      setHasMore(gamesData.length === 50);
      setAllGamesSimplified(gamesSimplifiedData);
      setGameCache(new Map().set(`games_0_v${cacheVersion}`, gamesData));
    } catch (error) {
      console.error("Erreur lors du rechargement des jeux:", error);
    }
  }, [invalidateCache, cacheVersion]);

  // Fonctions pour mettre à jour les données par période
  const setGamesThisWeekData = useCallback((games) => {
    setGamesThisWeek(games);
    setUseImportedData(true);
  }, []);

  const setGamesThisMonthData = useCallback((games) => {
    setGamesThisMonth(games);
    setUseImportedData(true);
  }, []);

  const setGamesLastThreeMonthsData = useCallback((games) => {
    setGamesLastThreeMonths(games);
    setUseImportedData(true);
  }, []);

  // Fonction pour récupérer les jeux par genre
  const getGamesByGenreId = useCallback(async (genreId) => {
    try {
      const games = await getGamesByGenre(genreId);
      return games || [];
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des jeux par genre:",
        error
      );
      return [];
    }
  }, []);

  return (
    <DataContext.Provider
      value={{
        // États principaux
        isLoading,
        games: isFiltered ? filteredGames : games,
        genres,
        platforms,
        allGamesSimplified,
        isFiltered,
        currentGenreFilter,
        currentPlatformFilter,

        // Données par période
        gamesThisWeek,
        gamesThisMonth,
        gamesLastThreeMonths,

        // Fonctions de mise à jour
        setGamesThisWeekData,
        setGamesThisMonthData,
        setGamesLastThreeMonthsData,

        // Pagination
        loadMoreGames,
        hasMore,
        isLoadingMore,

        // Utilitaires
        getAGame,
        fetchGames,
        invalidateCache,
        getGamesByGenreId,

        // Nouvelles fonctions de filtrage
        filterGamesByGenre,
        clearGenreFilter,
        clearGenreFilterCompletely,
        filterGamesByPlatform,
        clearPlatformFilter,
        clearAllFilters,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
