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
    menuConsoles,
    menuConsolesRef,
    toggleMenuConsoles,
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

  // Créer une liste plate des plateformes avec leur ID IGDB
  const flatPlatforms = [];

  // Ajouter PC
  const pcPlatform = platforms.find((p) => p.name === "PC (Microsoft Windows)");
  if (pcPlatform) {
    flatPlatforms.push({ nom: "PC", igdbID: pcPlatform.igdbID });
  }

  // Mapper les plateformes par famille
  const platformFamilies = {
    Sony: platforms.filter((p) =>
      [7, 8, 9, 38, 46, 48, 165, 167].includes(p.igdbID)
    ),
    Xbox: platforms.filter((p) => [11, 12, 49, 169].includes(p.igdbID)),
    Nintendo: platforms.filter((p) =>
      [18, 19, 20, 21, 37, 41, 130, 137].includes(p.igdbID)
    ),
  };

  // Debug pour voir quelles plateformes sont disponibles
  console.log("Plateformes disponibles:", platforms);
  console.log("Plateformes Xbox trouvées:", platformFamilies.Xbox);

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
            {/* PC */}
            {pcPlatform && (
              <div className="w-full flex items-center justify-between">
                <div className="w-full flex flex-col justify-center gap-2 p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <p>PC</p>
                    </div>
                    {currentSelectedPlatform === "PC" ? (
                      <div
                        ref={selectedPlateformesRef}
                        onClick={() =>
                          handlePlatformClick("PC", pcPlatform.igdbID)
                        }
                        className="flex items-center justify-center w-[15px] h-[15px] bg-white dark:bg-gray-900 border border-black dark:border-white rounded-sm cursor-pointer"
                      >
                        <IoClose className="absolute w-[25px] h-[25px] text-black dark:text-white cursor-pointer" />
                      </div>
                    ) : (
                      <div
                        ref={selectedPlateformesRef}
                        onClick={() =>
                          handlePlatformClick("PC", pcPlatform.igdbID)
                        }
                        className="w-[15px] h-[15px] bg-white dark:bg-gray-900 border border-black dark:border-white rounded-sm cursor-pointer ml-2"
                      ></div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Autres plateformes par famille */}
            {Object.entries(platformFamilies).map(
              ([familyName, familyPlatforms]) =>
                familyPlatforms.length > 0 && (
                  <div
                    key={familyName}
                    className="w-full flex items-center justify-between"
                  >
                    <div
                      ref={menuConsoles === familyName ? menuConsolesRef : null}
                      className={`w-full flex flex-col justify-center gap-2 ${
                        menuConsoles === familyName
                          ? "outline outline-black dark:outline-white bg-white dark:bg-gray-900 rounded-xl"
                          : ""
                      } p-2`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          onClick={() => toggleMenuConsoles(familyName)}
                          className="flex items-center gap-1"
                        >
                          <p>{familyName}</p>
                          {menuConsoles === familyName ? (
                            <FaChevronUp className="pt-0.5" />
                          ) : (
                            <FaChevronDown className="pt-0.5" />
                          )}
                        </div>
                        {currentSelectedPlatform === familyName ? (
                          <div
                            ref={selectedPlateformesRef}
                            onClick={() =>
                              handlePlatformClick(familyName, null)
                            }
                            className="flex items-center justify-center w-[15px] h-[15px] bg-white dark:bg-gray-900 border border-black dark:border-white rounded-sm cursor-pointer"
                          >
                            <IoClose className="absolute w-[25px] h-[25px] text-black dark:text-white cursor-pointer" />
                          </div>
                        ) : (
                          <div
                            ref={selectedPlateformesRef}
                            onClick={() =>
                              handlePlatformClick(familyName, null)
                            }
                            className="w-[15px] h-[15px] bg-white dark:bg-gray-900 border border-black dark:border-white rounded-sm cursor-pointer ml-2"
                          ></div>
                        )}
                      </div>
                      {menuConsoles === familyName &&
                        familyPlatforms.map((platform, index) => (
                          <div
                            key={index}
                            className="w-full flex items-center justify-between"
                          >
                            <p className="text-black dark:text-white">
                              {platform.name}
                            </p>
                            {currentSelectedPlatform === platform.name ? (
                              <div
                                ref={selectedPlateformesRef}
                                onClick={() =>
                                  handlePlatformClick(
                                    platform.name,
                                    platform.igdbID
                                  )
                                }
                                className="flex items-center justify-center w-[15px] h-[15px] bg-white dark:bg-gray-900 border border-black dark:border-white rounded-sm cursor-pointer"
                              >
                                <IoClose className="absolute w-[25px] h-[25px] text-black dark:text-white cursor-pointer" />
                              </div>
                            ) : (
                              <div
                                ref={selectedPlateformesRef}
                                onClick={() =>
                                  handlePlatformClick(
                                    platform.name,
                                    platform.igdbID
                                  )
                                }
                                className="w-[15px] h-[15px] bg-white dark:bg-gray-900 border border-black dark:border-white rounded-sm cursor-pointer ml-2"
                              ></div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )
            )}
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
