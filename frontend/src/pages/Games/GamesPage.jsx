import { IoMenu } from "react-icons/io5";
import AffichesJeux from "../../components/Affiches/AffichesJeux";
import Genres from "../../components/Menu/Filtres/Genres";
import Plateformes from "../../components/Menu/Filtres/Plateformes";
import { useContext } from "react";
import { MenuContext } from "../../context/MenuContext";
import MenuBurgerFiltres from "../../components/Menu/MenuBurgerFiltres";
import { DataContext } from "../../context/DataContext";
import Bouton from "../../components/Boutons/Bouton";
import LoadingPage from "../../components/Loading/LoadingPage";

export default function GamesPage() {
  const { burgerFiltres, toggleBurgerFiltres } = useContext(MenuContext);
  const {
    isLoading,
    games,
    loadMoreGames,
    hasMore,
    genres,
    genresWithCount,
    isLoadingMore,
  } = useContext(DataContext);
  console.log(genresWithCount);

  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div
          className={`${
            games ? "h-full" : "h-screen"
          } flex flex-col items-center pb-5`}
        >
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
            <h2 className="w-full text-center text-2xl font-semibold text-black dark:text-white">
              Catalogue de jeux disponibles sur le site
            </h2>
            {games && (
              <>
                <div className="w-full h-full flex flex-wrap justify-center items-center gap-[20px]">
                  {games.map((game) => (
                    <AffichesJeux
                      key={game._id}
                      img={game.cover}
                      rating={game.votes}
                      name={game.name}
                      platforms={game.platforms}
                    />
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
          </div>
        </div>
      )}
    </>
  );
}
