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
  const [games, setGames] = useState();
  const [genres, setGenres] = useState();
  const [themes, setThemes] = useState();
  const [keywords, setKeywords] = useState();
  const [plateformes, setPlateformes] = useState();

  useEffect(() => {
    async function handleData() {
      try {
        if (!games || !keywords || !plateformes) {
          // pour les jeux
          const getGamesData = await getGames();
          setGames(getGamesData);
          setIsLoading(false);
        } else if (!genres) {
          // pour les genres
          const getGenresData = await getGenres();
          setGenres(getGenresData);
          setIsLoading(false);
        } else if (!themes) {
          // pour les themes
          const getThemesData = await getThemes();
          setThemes(getThemesData);
          setIsLoading(false);
        } else if (!keywords) {
          // pour les mots clés
          const getKeywordsData = await getKeywords();
          setKeywords(getKeywordsData);
          setIsLoading(false);
        } else if (!plateformes) {
          // pour les plateformes
          const getPlatformsData = await getPlateformes();
          setPlateformes(getPlatformsData);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        setIsLoading(false);
      }
    }
    handleData();
  }, []);

  return (
    <DataContext.Provider
      value={{ isLoading, games, genres, themes, keywords, plateformes }}
    >
      {children}
    </DataContext.Provider>
  );
}
