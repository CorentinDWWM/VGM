import { IoMenu } from "react-icons/io5";
import AffichesJeux from "../../components/Affiches/AffichesJeux";
import Genres from "../../components/Menu/Filtres/Genres";
import Plateformes from "../../components/Menu/Filtres/Plateformes";
import { useContext, useEffect, useRef } from "react";
import { MenuContext } from "../../context/MenuContext";
import MenuBurgerFiltres from "../../components/Menu/MenuBurgerFiltres";
import { DataContext } from "../../context/DataContext";
import Bouton from "../../components/Boutons/Bouton";
import LoadingPage from "../../components/Loading/LoadingPage";
import { UserProfilContext } from "../../context/UserProfilContext";
import toast from "react-hot-toast";

export default function GamesPage() {
  const { burgerFiltres, toggleBurgerFiltres } = useContext(MenuContext);
  const {
    isLoading,
    games,
    loadMoreGames,
    hasMore,
    isLoadingMore,
    isFiltered,
    currentGenreFilter,
    currentPlatformFilter,
    clearGenreFilter,
    clearPlatformFilter,
    clearAllFilters,
  } = useContext(DataContext);
  const { message, resetMessage } = useContext(UserProfilContext);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (message) {
      if (message.includes("ajouté") || message.includes("supprimé")) {
        toast.success(message);
      } else if (message.includes("Erreur")) {
        toast.error(message);
      }
      resetMessage();
    }
  }, [message, resetMessage]);

  // Effet pour marquer que le composant a été monté
  useEffect(() => {
    hasMounted.current = true;
    return () => {
      // Nettoyer seulement si le composant était déjà monté (navigation)
      if (hasMounted.current) {
        clearAllFilters();
      }
    };
  }, [clearAllFilters]);

  const getFilterTitle = () => {
    if (currentGenreFilter) {
      return `Jeux du genre: ${currentGenreFilter.name}`;
    } else if (currentPlatformFilter) {
      return `Jeux de la plateforme: ${currentPlatformFilter.name}`;
    }
    return "Catalogue de jeux disponibles sur le site";
  };

  const handleClearFilter = () => {
    if (currentGenreFilter) {
      clearGenreFilter();
    } else if (currentPlatformFilter) {
      clearPlatformFilter();
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div className="min-h-screen flex flex-col items-center pb-5">
          <div className="w-full flex items-center justify-center py-2.5 bg-white dark:bg-gray-900 border-t border-black dark:border-white shadow-xl dark:shadow-white/10 max-sm:hidden z-10">
            <Genres />
            <Plateformes />
          </div>
          <div className="w-full items-center justify-center py-2.5 bg-white dark:bg-gray-900 border-t border-black dark:border-white shadow-xl dark:shadow-white/10 hidden max-sm:flex z-10">
            {burgerFiltres ? (
              <>
                <IoMenu
                  onClick={toggleBurgerFiltres}
                  className="text-2xl cursor-pointer"
                />
                <MenuBurgerFiltres />
              </>
            ) : (
              <IoMenu
                onClick={toggleBurgerFiltres}
                className="text-2xl cursor-pointer"
              />
            )}
          </div>
          <div className="w-full h-full flex flex-col items-center gap-[30px] px-[50px] pt-[30px] max-sm:px-[20px]">
            <div className="w-full text-center">
              <h2 className="text-2xl font-semibold text-black dark:text-white">
                {getFilterTitle()}
              </h2>
              {isFiltered && (
                <button
                  onClick={handleClearFilter}
                  className="mt-2 px-4 py-2 bg-alert-light text-white rounded-lg hover:bg-alert-dark dark:bg-alert-dark dark:hover:bg-alert-light transition-colors cursor-pointer"
                >
                  Supprimer le filtre
                </button>
              )}
            </div>
            {games && (
              <>
                {games.length === 0 && isFiltered ? (
                  <div className="w-full text-center py-10">
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      Aucun jeux ne correspond à ce filtre.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-full h-full flex flex-wrap justify-center items-center gap-[20px]">
                      {games.map((game) => (
                        <AffichesJeux key={game._id} game={game} />
                      ))}
                    </div>
                    {hasMore && (
                      <Bouton
                        onClick={loadMoreGames}
                        text={isLoadingMore ? "Chargement..." : "Voir Plus"}
                        disabled={isLoadingMore}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
