import React, { useEffect, useState } from "react";
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
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState();
  const [themes, setThemes] = useState();
  const [keywords, setKeywords] = useState();
  const [plateformes, setPlateformes] = useState();
  const [loaded, setLoaded] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function loadInitialGames() {
      try {
        const getGamesData = await getGames(100, 0);
        setGames(getGamesData);
        setLoaded(getGamesData.length);
        setHasMore(getGamesData.length === 100);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        setIsLoading(false);
      }
    }
    loadInitialGames();
  }, []);

  async function loadMoreGames() {
    const getGamesData = await getGames(100, loaded);
    setGames((prev) => [...prev, ...getGamesData]);
    setLoaded((prev) => prev + getGamesData.length);
    setHasMore(getGamesData.length === 100);
  }

  return (
    <DataContext.Provider
      value={{
        isLoading,
        games,
        genres,
        themes,
        keywords,
        plateformes,
        loadMoreGames,
        hasMore,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
