import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import Bouton from "../../components/Boutons/Bouton";
import { AuthContext } from "../../context/AuthContext";
import {
  addAGameToCurrentUser,
  delAGameInCurrentUser,
  updateStatusInUser,
} from "../../apis/auth.api";
import AfficheJeux from "../../components/Affiches/AffichesJeux";
import MediaModal from "../../components/Modal/MediaModal";

export default function OneGame() {
  const { id } = useParams();
  const { getAGame, games } = useContext(DataContext);
  const { user } = useContext(AuthContext);

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameStatus, setGameStatus] = useState("");
  const [isInCollection, setIsInCollection] = useState(false);
  const [showAllScreenshots, setShowAllScreenshots] = useState(false);
  const [showAllArtworks, setShowAllArtworks] = useState(false);
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [translatedSummary, setTranslatedSummary] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // États pour la modal de galerie
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mémoriser les games de l'utilisateur pour éviter les re-renders
  const userGamesCount = user?.games?.length || 0;
  const userGameIds = useMemo(
    () => user?.games?.map((g) => g.igdbID) || [],
    [userGamesCount]
  );

  // Effet principal pour charger le jeu - version simplifiée
  useEffect(() => {
    let isMounted = true;

    const fetchGame = async () => {
      if (!id || !getAGame) return;

      try {
        setLoading(true);
        setError(null);

        const gameData = await getAGame(id);

        if (isMounted) {
          setGame(gameData);

          // Charger les recommandations seulement si le jeu a des genres
          if (gameData?.genres?.length > 0) {
            fetchRecommendations(gameData.genres);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchGame();

    return () => {
      isMounted = false;
    };
  }, [id]); // SEULEMENT id comme dépendance

  // Effet séparé pour calculer isInCollection et gameStatus
  useEffect(() => {
    if (!game || !user) return;

    const userHasGame =
      user.games?.some((g) => g.igdbID === game.igdbID) || false;
    setIsInCollection(userHasGame);

    if (userHasGame && user.games) {
      const userGame = user.games.find((g) => g.igdbID === game.igdbID);
      setGameStatus(userGame?.statusUser || "Non commencé");
    } else {
      setGameStatus("Non commencé");
    }
  }, [game?.igdbID, user?.games?.length]); // Utiliser length pour éviter la référence complète

  // Fonction pour récupérer les recommandations - optimisée avec useCallback
  const fetchRecommendations = useCallback(
    async (gameGenres) => {
      if (!gameGenres?.length || !games?.length || loadingRecommendations)
        return;

      try {
        setLoadingRecommendations(true);

        const currentGameGenreIds = gameGenres.map((genre) => genre.id);

        const similarGameIds = games
          .filter((g) => {
            if (g.id === parseInt(id)) return false;
            if (!g.genres?.length) return false;

            const gameGenreIds = g.genres.map((genre) => genre.id);
            return gameGenreIds.some((genreId) =>
              currentGameGenreIds.includes(genreId)
            );
          })
          .sort((a, b) => {
            const aCommonGenres =
              a.genres?.filter((g) => currentGameGenreIds.includes(g.id))
                .length || 0;
            const bCommonGenres =
              b.genres?.filter((g) => currentGameGenreIds.includes(g.id))
                .length || 0;

            if (aCommonGenres !== bCommonGenres) {
              return bCommonGenres - aCommonGenres;
            }

            const aRating = a.votes || 0;
            const bRating = b.votes || 0;
            return bRating - aRating;
          })
          .slice(0, 8)
          .map((g) => g.igdbID || g.id);

        const fullGameData = await Promise.all(
          similarGameIds.map(async (gameId) => {
            try {
              return await getAGame(gameId);
            } catch (error) {
              console.error(
                `Erreur lors de la récupération du jeu ${gameId}:`,
                error
              );
              return null;
            }
          })
        );

        const validRecommendations = fullGameData.filter(
          (game) => game !== null
        );
        setRecommendations(validRecommendations);
      } catch (error) {
        console.error("Erreur lors du chargement des recommandations:", error);
      } finally {
        setLoadingRecommendations(false);
      }
    },
    [games, getAGame, id, loadingRecommendations]
  );

  // Fonction pour formater la date en français
  const formatDateToFrench = (dateString) => {
    const months = {
      Jan: "Janvier",
      Feb: "Février",
      Mar: "Mars",
      Apr: "Avril",
      May: "Mai",
      Jun: "Juin",
      Jul: "Juillet",
      Aug: "Août",
      Sep: "Septembre",
      Oct: "Octobre",
      Nov: "Novembre",
      Dec: "Décembre",
    };

    // Parse "Nov 18, 2014" format
    const parts = dateString.split(" ");
    if (parts.length < 3) return dateString; // Retourne la date originale si le format est incorrect

    const monthAbbr = parts[0];
    const day = parts[1].replace(",", "");
    const year = parts[2];

    if (!months[monthAbbr] || !day || !year) {
      return dateString; // Retourne la date originale si une partie est manquante
    }

    return `${parseInt(day)} ${months[monthAbbr]} ${year}`;
  };

  // Fonction pour obtenir la date de sortie la plus ancienne
  const getEarliestReleaseDate = (releaseDates) => {
    if (!releaseDates || releaseDates.length === 0) return null;

    // Convertir toutes les dates en objets Date pour comparaison
    const sortedDates = releaseDates
      .filter((release) => release.date)
      .map((release) => ({
        original: release.date,
        dateObj: new Date(release.date),
      }))
      .sort((a, b) => a.dateObj - b.dateObj);

    return sortedDates.length > 0 ? sortedDates[0].original : null;
  };

  // Fonction pour traduire le texte
  const translateText = async (text, targetLang = "fr") => {
    try {
      setIsTranslating(true);

      if (text.length <= 450) {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
            text
          )}&langpair=en|${targetLang}`
        );
        const data = await response.json();
        return data.responseData.translatedText;
      }

      const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
      const chunks = [];
      let currentChunk = "";

      for (const sentence of sentences) {
        if ((currentChunk + sentence).length > 450) {
          if (currentChunk) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
          } else {
            const words = sentence.split(" ");
            let wordChunk = "";
            for (const word of words) {
              if ((wordChunk + " " + word).length > 450) {
                if (wordChunk) {
                  chunks.push(wordChunk.trim());
                  wordChunk = word;
                } else {
                  chunks.push(word);
                }
              } else {
                wordChunk += (wordChunk ? " " : "") + word;
              }
            }
            if (wordChunk) {
              currentChunk = wordChunk;
            }
          }
        } else {
          currentChunk += (currentChunk ? " " : "") + sentence;
        }
      }

      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }

      const translatedChunks = [];
      for (const chunk of chunks) {
        try {
          const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
              chunk
            )}&langpair=en|${targetLang}`
          );
          const data = await response.json();
          translatedChunks.push(data.responseData.translatedText);

          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          console.error("Erreur lors de la traduction d'un chunk:", error);
          translatedChunks.push(chunk);
        }
      }

      return translatedChunks.join(" ");
    } catch (error) {
      console.error("Erreur de traduction:", error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  // Fonction pour gérer la traduction du synopsis
  const handleTranslateSummary = async () => {
    if (game.summary && !translatedSummary) {
      const translated = await translateText(game.summary);
      setTranslatedSummary(translated);
    }
  };

  // Fonction pour mettre à jour le statut du jeu
  const handleStatusChange = async (newStatus) => {
    try {
      await updateStatusInUser(game, newStatus, user);
      setGameStatus(newStatus);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  // Fonctions pour gérer l'ajout/suppression de jeu avec mise à jour optimiste
  const handleAddGame = async () => {
    try {
      setIsInCollection(true); // Mise à jour optimiste
      setGameStatus("Non commencé");
      await addAGameToCurrentUser(game, user);
    } catch (error) {
      // Rollback en cas d'erreur
      setIsInCollection(false);
      setGameStatus("");
      console.error("Erreur lors de l'ajout du jeu:", error);
    }
  };

  const handleRemoveGame = async () => {
    try {
      setIsInCollection(false); // Mise à jour optimiste
      setGameStatus("");
      await delAGameInCurrentUser(game, user);
    } catch (error) {
      // Rollback en cas d'erreur
      setIsInCollection(true);
      console.error("Erreur lors de la suppression du jeu:", error);
    }
  };

  // Fonction pour ouvrir la modal avec un screenshot
  const openScreenshotModal = (index) => {
    setModalType("screenshot");
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  // Fonction pour ouvrir la modal avec un artwork
  const openArtworkModal = (index) => {
    setModalType("artwork");
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  // Fonction pour ouvrir la modal avec une vidéo
  const openVideoModal = (index) => {
    setModalType("video");
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  // Fonction pour fermer la modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
    setCurrentIndex(0);
  };

  // Navigation dans la modal
  const navigateModal = (direction) => {
    const mediaArray =
      modalType === "screenshot"
        ? game.screenshots
        : modalType === "artwork"
        ? game.artworks
        : game.videos;
    if (direction === "next") {
      setCurrentIndex((prev) => (prev + 1) % mediaArray.length);
    } else {
      setCurrentIndex(
        (prev) => (prev - 1 + mediaArray.length) % mediaArray.length
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-gray-800 text-xl">
        <h2>Chargement...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-gray-800 text-xl">
        <h2>Erreur: {error}</h2>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-gray-800 text-xl">
        <h2>Jeu non trouvé</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 mt-5">
      {/* Modal pour la galerie */}
      <MediaModal
        isOpen={isModalOpen}
        modalType={modalType}
        currentIndex={currentIndex}
        mediaData={
          modalType === "screenshot"
            ? game?.screenshots
            : modalType === "artwork"
            ? game?.artworks
            : game?.videos
        }
        gameName={game?.name}
        onClose={closeModal}
        onNavigate={navigateModal}
      />

      {/* Section Intro Jeu */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gray-50 dark:bg-gray-800 max-lg:py-10">
        <div className="absolute inset-0 z-10">
          {game.screenshots && game.screenshots.length > 0 && (
            <img
              src={`https://images.igdb.com/igdb/image/upload/t_1080p/${game.screenshots[0].image_id}.jpg`}
              alt="Background"
              className="w-full h-full object-cover filter blur-lg brightness-[0.2] opacity-30"
            />
          )}
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80"></div>
        </div>

        <div className="relative z-20 max-w-6xl mx-auto px-8 flex flex-col items-center lg:flex-row gap-12">
          <div className="flex-shrink-0">
            <img
              src={
                game.cover?.url
                  ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
                  : "/placeholder-game.jpg"
              }
              alt={game.name}
              className="w-72 h-96 object-cover rounded-xl shadow-2xl transition-transform duration-300 hover:scale-105 border border-gray-200"
            />
          </div>

          <div className="flex-1 text-gray-800">
            <h1 className="text-5xl lg:text-6xl font-black mb-4 text-black dark:text-white max-lg:text-center">
              {game.name}
            </h1>

            <div className="mb-8">
              <div className="flex flex-wrap max-lg:justify-center gap-2">
                {game.genres && game.genres.length > 0 ? (
                  game.genres.map((genre, index) => (
                    <span
                      key={genre.id}
                      className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-full text-sm text-gray-700 dark:text-gray-300"
                    >
                      {genre.name}
                    </span>
                  ))
                ) : (
                  <span className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-full text-sm text-gray-700">
                    Genre non spécifié
                  </span>
                )}
              </div>
            </div>

            <div className="flex max-lg:justify-center gap-8 mb-8">
              <div className="text-center">
                {game.votes ? (
                  <>
                    {Math.round(game.votes) >= 70 ? (
                      <div className="text-4xl font-bold text-success-light dark:text-success-dark mb-1">
                        {Math.round(game.votes) / 10}
                      </div>
                    ) : Math.round(game.votes) >= 50 ? (
                      <div className="text-4xl font-bold text-neutral-light dark:text-neutral-dark mb-1">
                        {Math.round(game.votes) / 10}
                      </div>
                    ) : (
                      <div className="text-4xl font-bold text-alert-light dark:text-alert-dark mb-1">
                        {Math.round(game.votes) / 10}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-4xl font-bold text-alert-light dark:text-alert-dark mb-1">
                    N/A
                  </p>
                )}
                <div className="text-sm text-black dark:text-white">
                  Note IGDB
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-light dark:text-primary-dark mb-1">
                  {(() => {
                    const earliestDate = getEarliestReleaseDate(
                      game.release_dates
                    );
                    return earliestDate
                      ? new Date(earliestDate).getFullYear()
                      : "TBA";
                  })()}
                </div>
                <div className="text-sm text-black dark:text-white">
                  Année de sortie
                </div>
              </div>
            </div>
            <div className="flex flex-col max-lg:items-center gap-4">
              {user ? (
                <>
                  {user && user.games.length >= 1 && isInCollection ? (
                    <div className="flex flex-col max-lg:items-center gap-4">
                      <Bouton
                        text="Retirer de ma liste"
                        onClick={handleRemoveGame}
                      />
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Statut du jeu :
                        </label>
                        <select
                          value={gameStatus}
                          onChange={(e) => handleStatusChange(e.target.value)}
                          className="w-fit px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
                        >
                          <option value="Non commencé">Non commencé</option>
                          <option value="En cours">En cours</option>
                          <option value="Terminé">Terminé</option>
                          <option value="Abandonné">Abandonné</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <Bouton text="Ajouter à ma liste" onClick={handleAddGame} />
                  )}
                </>
              ) : (
                <Bouton text="Ajouter à ma liste" navigation="/login" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Game Description */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex justify-between items-center mb-8 max-sm:flex-col max-sm:gap-4">
            <h2 className="text-4xl font-bold text-black dark:text-white">
              Synopsis
            </h2>
            {game.summary && (
              <div className="flex gap-2">
                {translatedSummary && (
                  <button
                    onClick={() => setTranslatedSummary("")}
                    className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    Version originale
                  </button>
                )}
                <button
                  onClick={handleTranslateSummary}
                  disabled={isTranslating}
                  className="px-4 py-2 text-sm bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-500 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isTranslating ? "Traduction..." : "Traduire en français"}
                </button>
              </div>
            )}
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-500 p-8 rounded-2xl shadow-sm">
            <p className="text-lg leading-relaxed text-black dark:text-white">
              {translatedSummary ||
                game.summary ||
                "Aucune description disponible pour ce jeu."}
            </p>
          </div>
        </div>
      </section>

      {/* Game Details Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-black dark:text-white text-center mb-8">
            Informations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 p-6 rounded-xl flex items-start gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="text-2xl">🎮</div>
              <div>
                <h3 className="text-black dark:text-white text-lg font-semibold mb-2">
                  Plateformes
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {game.platforms && game.platforms.length > 0
                    ? game.platforms.map((platform) => platform.name).join(", ")
                    : "Non spécifié"}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 p-6 rounded-xl flex items-start gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="text-2xl">🏢</div>
              <div>
                <h3 className="text-black dark:text-white text-lg font-semibold mb-2">
                  Développeur
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {game.companies && game.companies.length > 0
                    ? game.companies
                        .filter((company) => company.developpeur === "true")
                        .map((company) => company.company_detail?.name)
                        .filter(Boolean)
                        .join(", ") || "Non spécifié"
                    : "Non spécifié"}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 p-6 rounded-xl flex items-start gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="text-2xl">📦</div>
              <div>
                <h3 className="text-black dark:text-white text-lg font-semibold mb-2">
                  Éditeur
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {game.companies && game.companies.length > 0
                    ? game.companies
                        .filter((company) => company.editeur === "true")
                        .map((company) => company.company_detail?.name)
                        .filter(Boolean)
                        .join(", ") || "Non spécifié"
                    : "Non spécifié"}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 p-6 rounded-xl flex items-start gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="text-2xl">👥</div>
              <div>
                <h3 className="text-black dark:text-white text-lg font-semibold mb-2">
                  Modes de jeu
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {game.game_modes && game.game_modes.length > 0
                    ? game.game_modes.map((mode) => mode.name).join(", ")
                    : "Non spécifié"}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 p-6 rounded-xl flex items-start gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="text-2xl">📅</div>
              <div>
                <h3 className="text-black dark:text-white text-lg font-semibold mb-2">
                  Date de sortie
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {(() => {
                    const earliestDate = getEarliestReleaseDate(
                      game.release_dates
                    );
                    return earliestDate
                      ? formatDateToFrench(earliestDate)
                      : "Date non spécifiée";
                  })()}
                </p>
              </div>
            </div>

            {game.timeToBeat && (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 p-6 rounded-xl flex items-start gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="text-2xl">⏱️</div>
                <div>
                  <h3 className="text-black dark:text-white text-lg font-semibold mb-2">
                    Temps de jeu
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {game.timeToBeat.normally &&
                      `Principal: ${Math.round(
                        game.timeToBeat.normally / 3600
                      )}h`}
                    {game.timeToBeat.completely &&
                      ` • Complet: ${Math.round(
                        game.timeToBeat.completely / 3600
                      )}h`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Screenshots and Videos Gallery */}
      {((game.screenshots && game.screenshots.length > 0) ||
        (game.artworks && game.artworks.length > 0) ||
        (game.videos && game.videos.length > 0)) && (
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-4xl font-bold text-black dark:text-white text-center mb-12">
              Galerie
            </h2>

            {/* Screenshots Section */}
            {game.screenshots && game.screenshots.length > 0 && (
              <div className="mb-16">
                <h3 className="text-2xl font-semibold text-black dark:text-white mb-6">
                  Captures d'écran ({game.screenshots.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {(showAllScreenshots
                    ? game.screenshots
                    : game.screenshots.slice(0, 6)
                  ).map((screenshot, index) => (
                    <div
                      key={screenshot.id}
                      className="rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 border border-gray-200 shadow-sm cursor-pointer group"
                      onClick={() =>
                        openScreenshotModal(showAllScreenshots ? index : index)
                      }
                    >
                      <div className="relative">
                        <img
                          src={`https://images.igdb.com/igdb/image/upload/t_screenshot_med/${screenshot.image_id}.jpg`}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {game.screenshots.length > 6 && (
                  <div className="text-center flex justify-center">
                    <Bouton
                      text={
                        showAllScreenshots
                          ? "Voir moins d'images"
                          : `Voir ${
                              game.screenshots.length - 6
                            } images supplémentaires`
                      }
                      onClick={() => setShowAllScreenshots(!showAllScreenshots)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Artworks Section */}
            {game.artworks && game.artworks.length > 0 && (
              <div className="mb-16">
                <h3 className="text-2xl font-semibold text-black dark:text-white mb-6">
                  Artworks ({game.artworks.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {(showAllArtworks
                    ? game.artworks
                    : game.artworks.slice(0, 6)
                  ).map((artwork, index) => (
                    <div
                      key={artwork.id}
                      className="rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 border border-gray-200 shadow-sm cursor-pointer group"
                      onClick={() =>
                        openArtworkModal(showAllArtworks ? index : index)
                      }
                    >
                      <div className="relative">
                        <img
                          src={`https://images.igdb.com/igdb/image/upload/t_screenshot_med/${artwork.image_id}.jpg`}
                          alt={`Artwork ${index + 1}`}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {game.artworks.length > 6 && (
                  <div className="text-center flex justify-center">
                    <Bouton
                      text={
                        showAllArtworks
                          ? "Voir moins d'artworks"
                          : `Voir ${
                              game.artworks.length - 6
                            } artworks supplémentaires`
                      }
                      onClick={() => setShowAllArtworks(!showAllArtworks)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Videos Section */}
            {game.videos && game.videos.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold text-black dark:text-white mb-6">
                  Vidéos ({game.videos.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {(showAllVideos ? game.videos : game.videos.slice(0, 4)).map(
                    (video, index) => (
                      <div
                        key={video.id}
                        className="rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50 dark:bg-gray-800 cursor-pointer group transition-transform duration-300 hover:scale-105"
                        onClick={() =>
                          openVideoModal(showAllVideos ? index : index)
                        }
                      >
                        <div className="aspect-video relative">
                          <img
                            src={`https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`}
                            alt={`Video ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <div className="bg-red-600 rounded-full p-4 group-hover:scale-110 transition-transform">
                              <svg
                                className="w-8 h-8 text-white ml-1"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        {video.name && (
                          <div className="p-3">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {video.name}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
                {game.videos.length > 4 && (
                  <div className="text-center flex justify-center">
                    <Bouton
                      text={
                        showAllVideos
                          ? "Voir moins de vidéos"
                          : `Voir ${
                              game.videos.length - 4
                            } vidéos supplémentaires`
                      }
                      onClick={() => setShowAllVideos(!showAllVideos)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Recommendations Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="w-fit mx-auto px-8">
          <h2 className="text-4xl font-bold text-black dark:text-white text-center mb-12">
            Jeux similaires
          </h2>

          {loadingRecommendations ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-lg text-gray-600 dark:text-gray-300">
                Chargement des recommandations...
              </div>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid max-md:grid-cols-1 max-lg:grid-cols-2 max-xl:grid-cols-3 grid-cols-4 gap-6">
              {recommendations.map((game) => (
                <AfficheJeux key={game.igdbID} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                Aucune recommandation disponible pour le moment
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Les recommandations sont basées sur les genres du jeu
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
