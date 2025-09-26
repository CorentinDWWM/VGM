import { useContext, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MenuContext } from "../../../context/MenuContext";
import { IoClose } from "react-icons/io5";
import { DataContext } from "../../../context/DataContext";

export default function Genres() {
  const {
    menuGenres,
    toggleMenuGenres,
    menuGenresRef,
    selectedGenres,
    selectedGenresRef,
    toggleSelectedGenres,
  } = useContext(MenuContext);

  const {
    genres,
    filterGamesByGenre,
    clearGenreFilter,
    currentGenreFilter,
    isFiltered,
  } = useContext(DataContext);

  // Effet pour écouter l'événement de suppression du filtre
  useEffect(() => {
    const handleGenreFilterCleared = () => {
      if (selectedGenres) {
        toggleSelectedGenres(null);
      }
    };

    window.addEventListener("genreFilterCleared", handleGenreFilterCleared);

    return () => {
      window.removeEventListener(
        "genreFilterCleared",
        handleGenreFilterCleared
      );
    };
  }, [selectedGenres, toggleSelectedGenres]);

  // Effet pour synchroniser l'état de la checkbox avec le filtre
  useEffect(() => {
    if (!isFiltered && selectedGenres) {
      // Si le filtre est supprimé mais que la checkbox est encore cochée, la décocher
      toggleSelectedGenres(null);
    }
  }, [isFiltered, selectedGenres, toggleSelectedGenres]);

  const handleGenreClick = (genreName, genreIgdbId) => {
    if (currentSelectedGenre === genreName) {
      // Si c'est le même genre déjà sélectionné, le décocher
      toggleSelectedGenres(null);
      clearGenreFilter();
    } else {
      // Sélectionner un nouveau genre (remplace l'ancien s'il y en a un)
      toggleSelectedGenres(genreName);
      filterGamesByGenre(genreIgdbId, genreName);
    }
  };

  // Synchroniser l'état local avec l'état global du filtre
  const currentSelectedGenre = isFiltered
    ? currentGenreFilter?.name
    : selectedGenres;

  return (
    <>
      {menuGenres ? (
        <div
          ref={menuGenresRef}
          className="w-[200px] flex flex-col justify-center items-center"
        >
          <div
            onClick={toggleMenuGenres}
            data-menu="genres"
            className="flex items-center gap-5 px-5 py-2.5 bg-white dark:bg-gray-900 border border-black dark:border-white rounded-xl"
          >
            <p>Genres</p>
            <FaChevronUp className="pt-0.5" />
          </div>
          <div className="absolute max-sm:relative top-[138px] max-sm:top-0 min-w-[200px] flex flex-col items-center justify-center gap-2.5 px-5 py-2.5 bg-white dark:bg-gray-900 border border-black dark:border-white rounded-xl">
            {genres.map((g, index) => (
              <div
                key={index}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-1">
                  <p>{g.name}</p>
                  <p className="text-secondary-text-light dark:text-secondary-text-dark">
                    {g.nb_jeux || g.count || 0}
                  </p>
                </div>
                {currentSelectedGenre === g.name ? (
                  <div
                    ref={selectedGenresRef}
                    onClick={() => handleGenreClick(g.name, g.igdbID)}
                    className="flex items-center justify-center w-[15px] h-[15px] bg-white dark:bg-gray-900 border border-black dark:border-white rounded-sm cursor-pointer"
                  >
                    <IoClose className="absolute w-[25px] h-[25px] text-black dark:text-white cursor-pointer" />
                  </div>
                ) : (
                  <div
                    ref={selectedGenresRef}
                    onClick={() => handleGenreClick(g.name, g.igdbID)}
                    className="w-[15px] h-[15px] bg-white dark:bg-gray-900 border border-black dark:border-white rounded-sm cursor-pointer ml-2"
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          ref={menuGenresRef}
          className="w-[200px] flex flex-col justify-center items-center"
        >
          <div
            onClick={toggleMenuGenres}
            data-menu="genres"
            className="flex items-center gap-5 px-5 py-2.5 bg-white dark:bg-gray-900 border border-black dark:border-white rounded-xl"
          >
            <p>Genres</p>
            <FaChevronDown className="pt-0.5" />
          </div>
        </div>
      )}
    </>
  );
}
