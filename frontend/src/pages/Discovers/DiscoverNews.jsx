import { useContext, useRef, useState, useEffect } from "react";
import AffichesJeux from "../../components/Affiches/AffichesJeux";
import { DataContext } from "../../context/DataContext";
import {
  importGamesThisWeek,
  importGamesThisMonth,
  importGamesLastThreeMonths,
} from "../../apis/games.api";

// Hook personnalisé pour le scroll horizontal
function useHorizontalScroll() {
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.classList.add("cursor-grabbing");
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    scrollRef.current.classList.remove("cursor-grabbing");
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  return { scrollRef, onMouseDown };
}

export default function DiscoverNews() {
  const {
    gamesThisWeek,
    gamesThisMonth,
    gamesLastThreeMonths,
    setGamesThisWeekData,
    setGamesThisMonthData,
    setGamesLastThreeMonthsData,
  } = useContext(DataContext);

  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState({
    week: false,
    month: false,
    threeMonths: false,
  });

  // Hooks pour le scroll de chaque section
  const scroll1 = useHorizontalScroll();
  const scroll2 = useHorizontalScroll();
  const scroll3 = useHorizontalScroll();

  // Fonction d'import des jeux par période
  const importGamesByPeriod = async () => {
    setIsImporting(true);

    // Reset status before starting
    setImportStatus({
      week: false,
      month: false,
      threeMonths: false,
    });

    // Fonction pour sanitiser les jeux importés
    const sanitizeGames = (games) => {
      return games.map((game, index) => ({
        ...game,
        _id: game._id || `temp_${index}`,
        name: game.name || "Nom non disponible",
        votes: isNaN(Number(game.votes)) ? 0 : Number(game.votes || 0),
        total_votes: isNaN(Number(game.total_votes))
          ? 0
          : Number(game.total_votes || 0),
        igdbID: isNaN(Number(game.igdbID)) ? 0 : Number(game.igdbID || 0),
        release_dates: game.release_dates || null,
        slug: game.slug || "",
        summary: game.summary || "",
        url: game.url || "",
        genres: game.genres || [],
        platforms: game.platforms || [],
        cover: game.cover || null,
      }));
    };

    try {
      // Import week games
      try {
        const weekResponse = await importGamesThisWeek();
        if (weekResponse?.games) {
          setImportStatus((prev) => ({ ...prev, week: true }));
          setGamesThisWeekData(sanitizeGames(weekResponse.games));
        }
      } catch (error) {
        console.error("Erreur import semaine:", error);
      }

      // Import month games
      try {
        const monthResponse = await importGamesThisMonth();
        if (monthResponse?.games) {
          setImportStatus((prev) => ({ ...prev, month: true }));
          setGamesThisMonthData(sanitizeGames(monthResponse.games));
        }
      } catch (error) {
        console.error("Erreur import mois:", error);
      }

      // Import three months games
      try {
        const threeMonthsResponse = await importGamesLastThreeMonths();
        if (threeMonthsResponse?.games) {
          setImportStatus((prev) => ({ ...prev, threeMonths: true }));
          setGamesLastThreeMonthsData(sanitizeGames(threeMonthsResponse.games));
        }
      } catch (error) {
        console.error("Erreur import trois mois:", error);
      }
    } catch (error) {
      console.error("Erreur lors de l'import des jeux:", error);
    } finally {
      setIsImporting(false);
    }
  };

  // Lancer les imports au chargement
  useEffect(() => {
    importGamesByPeriod();
  }, []);

  // Composant de section de jeux amélioré
  const GameSection = ({ title, games, scrollProps, className = "" }) => (
    <div className={`w-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between px-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-black dark:text-white font-bold text-2xl md:text-3xl">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {games.length} jeu{games.length > 1 ? "x" : ""} trouvé
            {games.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="relative px-2">
        <div
          className="w-full overflow-x-auto overflow-y-visible hide-scrollbar cursor-grab"
          ref={scrollProps.scrollRef}
          onMouseDown={scrollProps.onMouseDown}
        >
          <div className="flex items-center gap-6 md:gap-8 min-w-max py-4 pt-8 px-4">
            {games.length > 0 ? (
              games.map((game, index) => (
                <div
                  key={game._id}
                  className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                >
                  <AffichesJeux game={game} />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center w-full min-h-[300px] text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Aucun jeu trouvé pour cette période
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Affichage du loading amélioré
  if (isImporting) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 mt-5">
        {/* Header avec gradient amélioré */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="relative px-6 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-black dark:text-white font-bold text-4xl md:text-5xl lg:text-6xl mb-6 animate-fade-in">
                Nouvelles sorties
              </h1>
              <p className="text-black/90 dark:text-white text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Découvrez les derniers jeux sortis cette semaine, ce mois-ci et
                ces 3 derniers mois
              </p>
            </div>
          </div>
        </div>

        {/* Loading content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col items-center gap-8">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute top-0"></div>
            </div>

            <div className="text-center">
              <h3 className="text-black dark:text-white text-2xl font-semibold mb-2">
                Import des nouveautés en cours...
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Veuillez patienter pendant que nous récupérons les dernières
                sorties
              </p>
            </div>

            {/* Progress indicators */}
            <div className="w-full max-w-md space-y-4">
              {[
                {
                  key: "week",
                  label: "Jeux de cette semaine",
                  status: importStatus.week,
                },
                {
                  key: "month",
                  label: "Jeux de ce mois-ci",
                  status: importStatus.month,
                },
                {
                  key: "threeMonths",
                  label: "Jeux des trois derniers mois",
                  status: importStatus.threeMonths,
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                      item.status
                        ? "bg-green-500 text-white scale-110"
                        : "bg-gray-200 dark:bg-gray-600 animate-pulse"
                    }`}
                  >
                    {item.status ? (
                      <svg
                        className="w-4 h-4 animate-bounce"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <div className="w-3 h-3 bg-current rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium transition-all duration-500 ${
                      item.status
                        ? "text-green-600 dark:text-green-400 font-semibold"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.status && (
                    <div className="ml-auto">
                      <span className="text-xs text-green-500 dark:text-green-400">
                        ✓ Terminé
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log("Games This Week:", gamesThisWeek);
  console.log("Games Last Three Months:", gamesLastThreeMonths);

  return (
    <div className="w-full min-h-screen mt-5">
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="relative px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-black dark:text-white font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
              Nouvelles sorties
            </h1>
            <p className="text-black/90 dark:text-white text-lg md:text-xl max-w-2xl mx-auto">
              Découvrez les derniers jeux sortis cette semaine, ce mois-ci et
              ces 3 derniers mois
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-20">
        <GameSection
          title="Cette semaine"
          games={gamesThisWeek}
          scrollProps={scroll1}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
        />
        <GameSection
          title="Ce mois-ci"
          games={gamesThisMonth}
          scrollProps={scroll2}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
        />
        <GameSection
          title="Ces trois derniers mois"
          games={gamesLastThreeMonths}
          scrollProps={scroll3}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
        />
      </div>
    </div>
  );
}
