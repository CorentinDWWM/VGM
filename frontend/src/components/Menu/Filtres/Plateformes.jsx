import { useContext, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MenuContext } from "../../../context/MenuContext";
import { DataContext } from "../../../context/DataContext";
import { IoClose } from "react-icons/io5";

export default function Plateformes() {
  const {
    menuPlateformes,
    toggleMenuPlateformes,
    menuPlateformesRef,
    selectedPlateformes,
    selectedPlateformesRef,
    toggleSelectedPlateformes,
  } = useContext(MenuContext);

  const {
    platforms,
    filterGamesByPlatform,
    clearPlatformFilter,
    currentPlatformFilter,
    isFiltered,
  } = useContext(DataContext);

  // Effet pour écouter l'événement de suppression du filtre plateforme
  useEffect(() => {
    const handlePlatformFilterCleared = () => {
      if (selectedPlateformes) {
        toggleSelectedPlateformes(null);
      }
    };

    window.addEventListener(
      "platformFilterCleared",
      handlePlatformFilterCleared
    );

    return () => {
      window.removeEventListener(
        "platformFilterCleared",
        handlePlatformFilterCleared
      );
    };
  }, [selectedPlateformes, toggleSelectedPlateformes]);

  // Effet pour synchroniser l'état de la checkbox avec le filtre
  useEffect(() => {
    if (!isFiltered && selectedPlateformes) {
      // Si le filtre est supprimé mais que la checkbox est encore cochée, la décocher
      toggleSelectedPlateformes(null);
    }
  }, [isFiltered, selectedPlateformes, toggleSelectedPlateformes]);

  const handlePlatformClick = (platformName, platformId) => {
    if (currentSelectedPlatform === platformName) {
      // Si c'est la même plateforme déjà sélectionnée, la décocher
      toggleSelectedPlateformes(null);
      clearPlatformFilter();
    } else {
      // Sélectionner une nouvelle plateforme (remplace l'ancienne s'il y en a une)
      toggleSelectedPlateformes(platformName);
      filterGamesByPlatform(platformId, platformName);
    }
  };

  // Synchroniser l'état local avec l'état global du filtre
  const currentSelectedPlatform =
    isFiltered && currentPlatformFilter
      ? currentPlatformFilter.name
      : selectedPlateformes;

  // Trier les plateformes par nombre de jeux (décroissant) et exclure celles avec 0 jeu
  const sortedPlatforms = [...platforms]
    .filter((platform) => (platform.nb_jeux || 0) > 0)
    .sort((a, b) => {
      const aCount = a.nb_jeux || 0;
      const bCount = b.nb_jeux || 0;
      return bCount - aCount;
    });

  return (
    <>
      {menuPlateformes ? (
        <div
          ref={menuPlateformesRef}
          className="w-[200px] flex flex-col justify-center items-center"
        >
          <div
            onClick={toggleMenuPlateformes}
            data-menu="plateformes"
            className="flex items-center gap-5 px-5 py-2.5 bg-white dark:bg-gray-900 border border-black dark:border-white rounded-xl"
          >
            <p>Plateformes</p>
            <FaChevronUp className="pt-0.5" />
          </div>
          <div className="absolute max-sm:relative top-[138px] max-sm:top-0 min-w-[200px] flex flex-col items-center justify-center gap-2.5 px-5 py-2.5 bg-white dark:bg-gray-900 border border-black dark:border-white rounded-xl">
            {sortedPlatforms.map((platform, index) => (
              <div
                key={index}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-1">
                  <p>{platform.name}</p>
                  <p className="text-secondary-text-light dark:text-secondary-text-dark">
                    {platform.nb_jeux || 0}
                  </p>
                </div>
                {currentSelectedPlatform === platform.name ? (
                  <div
                    ref={selectedPlateformesRef}
                    onClick={() =>
                      handlePlatformClick(platform.name, platform.igdbID)
                    }
                    className="flex items-center justify-center w-[15px] h-[15px] bg-white dark:bg-gray-900 border border-black dark:border-white rounded-sm cursor-pointer"
                  >
                    <IoClose className="absolute w-[25px] h-[25px] text-black dark:text-white cursor-pointer" />
                  </div>
                ) : (
                  <div
                    ref={selectedPlateformesRef}
                    onClick={() =>
                      handlePlatformClick(platform.name, platform.igdbID)
                    }
                    className="w-[15px] h-[15px] bg-white dark:bg-gray-900 border border-black dark:border-white rounded-sm cursor-pointer ml-2"
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          ref={menuPlateformesRef}
          className="w-[200px] flex flex-col justify-center items-center"
        >
          <div
            onClick={toggleMenuPlateformes}
            data-menu="plateformes"
            className="flex items-center gap-5 px-5 py-2.5 bg-white dark:bg-gray-900 border border-black dark:border-white rounded-xl"
          >
            <p>Plateformes</p>
            <FaChevronDown className="pt-0.5" />
          </div>
        </div>
      )}
    </>
  );
}
