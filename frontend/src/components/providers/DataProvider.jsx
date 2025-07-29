import React, { useEffect, useState, useMemo, useCallback } from "react";
import { DataContext } from "../../context/DataContext";
import {
  getGames,
  getGenres,
  getKeywords,
  getPlateformes,
  getThemes,
} from "../../apis/igdbData.api";

export default function DataProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [allGames, setAllGames] = useState([]);
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [genresWithCount, setGenresWithCount] = useState([]);
  const [themes, setThemes] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [plateformes, setPlateformes] = useState([]);
  const [loaded, setLoaded] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Cache avec versioning pour invalidation
  const [gameCache, setGameCache] = useState(new Map());
  const [cacheVersion, setCacheVersion] = useState(0);

  // Afficher le cache dans la console
  const cacheSizeInBytes = JSON.stringify(
    Array.from(gameCache.entries())
  ).length;
  const cacheSizeInMB = (cacheSizeInBytes / (1024 * 1024)).toFixed(2);

  // Compter le nombre total de jeux dans le cache
  const totalGamesInCache = Array.from(gameCache.values()).reduce(
    (total, games) => total + games.length,
    0
  );

  // Récupérer les noms des jeux pour chaque clé
  const cacheDetails = Array.from(gameCache.entries()).map(([key, games]) => ({
    clé: key,
    nombreJeux: games.length,
    jeux: games
      .slice(0, 50)
      .map((game) => game.name || game.title || "Nom inconnu"), // Afficher les 3 premiers jeux
    tousLesJeux: games.length > 3 ? `... et ${games.length - 3} autres` : "",
  }));

  // Log pour vérifier le caches
  // console.log("🗂️ Cache:", {
  //   taille: gameCache.size,
  //   tailleMB: `${cacheSizeInMB} MB`,
  //   totalJeux: totalGamesInCache,
  //   version: cacheVersion,
  //   détails: cacheDetails,
  // });

  // Fonction pour invalider le cache
  const invalidateCache = useCallback(() => {
    setGameCache(new Map());
    setCacheVersion((prev) => prev + 1);
  }, []);

  // Fonction pour mettre à jour un jeu spécifique dans le cache
  const updateGameInCache = useCallback((gameId, updatedGame) => {
    setGameCache((prev) => {
      const newCache = new Map(prev);
      // Mettre à jour dans tous les lots du cache
      for (const [key, games] of newCache.entries()) {
        const updatedGames = games.map((game) =>
          game._id === gameId ? { ...game, ...updatedGame } : game
        );
        newCache.set(key, updatedGames);
      }
      return newCache;
    });

    // Mettre à jour aussi dans l'état local
    setGames((prev) =>
      prev.map((game) =>
        game._id === gameId ? { ...game, ...updatedGame } : game
      )
    );
  }, []);

  // Mettre à jour les genres avec le count quand les jeux changent
  // useEffect(() => {
  //   // if (games && games.length > 0 && genres && genres.length > 0) {
  //   //   // Créer un compteur pour chaque genre
  //   //   const genreCount = {};

  //   //   // Initialiser le compteur à 0 pour chaque genre
  //   //   genres.forEach((genre) => {
  //   //     genreCount[genre.igdbID] = 0;
  //   //   });

  //   //   // Compter les jeux pour chaque genre
  //   //   games.forEach((game) => {
  //   //     if (game.genres && Array.isArray(game.genres)) {
  //   //       game.genres.forEach((genre) => {
  //   //         // Récupérer l'ID du genre (c'est un objet avec {id, name, slug})
  //   //         const genreId = genre.igdbID;
  //   //         if (genreCount[genreId] !== undefined) {
  //   //           genreCount[genreId]++;
  //   //         }
  //   //       });
  //   //     }
  //   //   });

  //   //   // Créer le nouveau tableau avec les counts
  //   //   const genresWithCounts = genres.map((genre) => ({
  //   //     ...genre,
  //   //     count: genreCount[genre.igdbID] || 0,
  //   //   }));

  //   //   setGenresWithCount(genresWithCounts);
  //   // }
  //   if (games && games.length > 0 && genres && genres.length > 0) {
  //     const genreCountMap = {};
  //     games.forEach((game) => {
  //       game.genres?.forEach((genreId) => {
  //         genreCountMap[genreId] = (genreCountMap[genreId] || 0) + 1;
  //       });
  //     });

  //     // Ajout du nombre de jeux à chaque genre
  //     const enrichedGenres = genres.map((genre) => ({
  //       ...genre,
  //       nombre_de_jeux: genreCountMap[genre.id] || 0,
  //     }));

  //     setGenresWithCount(enrichedGenres);

  //     // Créer le nouveau tableau avec les counts
  //     // const genresWithCounts = genres.map((genre) => ({
  //     //   ...genre,
  //     //   count: genreCount[genre.igdbID] || 0,
  //     // }));

  //     // setGenresWithCount(gamesCount);
  //   }
  // }, [games, genres]);

  useEffect(() => {
    async function loadData() {
      try {
        const getGamesData = await getGames(50, 0);
        setGames(getGamesData);
        setLoaded(getGamesData.length);
        setHasMore(getGamesData.length === 50);

        // Mettre aussi les 50 premiers en cache
        setGameCache((prev) =>
          new Map(prev).set(`games_0_v${cacheVersion}`, getGamesData)
        );

        // const getGenresData = await getGenres();
        // setGenres(getGenresData);

        // const getThemesData = await getThemes();
        // setThemes(getThemesData);

        // const getKeywordsData = await getKeywords();
        // setKeywords(getKeywordsData);

        // const getPlatformesData = await getPlateformes();
        // setPlateformes(getPlatformesData);

        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        setIsLoading(false);
      }
    }
    loadData();

    // async function loadAllGames() {
    //   try {
    //     const getAllGamesData = await getGames(2500, 0);
    //     setAllGames(getAllGamesData);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    // loadAllGames();
  }, [cacheVersion]);

  const loadMoreGames = useCallback(async () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      // Vérifier le cache d'abord avec version
      const cacheKey = `games_${loaded}_v${cacheVersion}`;
      let getGamesData;

      if (gameCache.has(cacheKey)) {
        getGamesData = gameCache.get(cacheKey);
      } else {
        getGamesData = await getGames(50, loaded);
        // Mettre en cache pour les prochaines fois
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
  }, [loaded, isLoadingMore, gameCache, cacheVersion]);

  return (
    <DataContext.Provider
      value={{
        isLoading,
        games,
        genres: genresWithCount.length > 0 ? genresWithCount : genres,
        themes,
        keywords,
        plateformes,
        loadMoreGames,
        hasMore,
        isLoadingMore,
        invalidateCache,
        updateGameInCache,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
