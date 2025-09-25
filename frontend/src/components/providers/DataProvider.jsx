import React, { useEffect, useState, useMemo, useCallback } from "react";
import { DataContext } from "../../context/DataContext";
import {
  getGenres,
  getKeywords,
  getPlateformes,
  getThemes,
} from "../../apis/igdbData.api";

import { getGames, getGameById } from "../../apis/games.api";

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

  // Fonction pour récupérer un jeu par son ID
  const getAGame = useCallback(
    async (gameId) => {
      try {
        // Vérifier d'abord dans le cache local
        for (const games of gameCache.values()) {
          const foundGame = games.find((game) => game._id === gameId);
          if (foundGame) {
            return foundGame;
          }
        }

        // Si pas trouvé dans le cache, faire un appel API
        const game = await getGameById(gameId);
        return game;
      } catch (error) {
        console.error("Erreur lors de la récupération du jeu:", error);
        throw error;
      }
    },
    [gameCache]
  );

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

        const getGenresData = await getGenres();
        setGenres(getGenresData);

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
        getAGame,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
