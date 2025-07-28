import React, { useEffect, useState, useMemo } from "react";
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

        const getGenresData = await getGenres();
        setGenres(getGenresData);

        const getThemesData = await getThemes();
        setThemes(getThemesData);

        const getKeywordsData = await getKeywords();
        setKeywords(getKeywordsData);

        const getPlatformesData = await getPlateformes();
        setPlateformes(getPlatformesData);

        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        setIsLoading(false);
      }
    }
    loadData();

    async function loadAllGames() {
      try {
        const getAllGamesData = await getGames(2500, 0);
        setAllGames(getAllGamesData);
      } catch (error) {
        console.log(error);
      }
    }

    loadAllGames();
  }, []);

  async function loadMoreGames() {
    const getGamesData = await getGames(50, loaded);
    setGames((prev) => [...prev, ...getGamesData]);
    setLoaded((prev) => prev + getGamesData.length);
    setHasMore(getGamesData.length === 50);
  }

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
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
