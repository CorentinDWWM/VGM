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
import { useMediaCache } from "../../hooks/useMediaCache";
import { translateText } from "../../utils/gameUtils";
import GameIntroSection from "./GameIntroSection";
import GameDetailsSection from "./GameDetailsSection";

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

  // Utilisation du hook personnalisé pour le cache média
  const { mediaCache, isPreloadingMedia, preloadMedia, getImageUrl } =
    useMediaCache();

  // Effet principal pour charger le jeu
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

  // Effet séparé pour charger les recommandations quand games ET game sont disponibles
  useEffect(() => {
    if (game?.genres?.length > 0 && games?.length > 0) {
      fetchRecommendations(game.genres);
    }
  }, [game?.igdbID, games?.length]);

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

  // Effet pour précharger les médias
  useEffect(() => {
    if (game && !isPreloadingMedia) {
      preloadMedia(game);
    }
  }, [game?.igdbID, preloadMedia, isPreloadingMedia]);

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
    [games, getAGame, id]
  );

  // Fonction pour gérer la traduction du synopsis
  const handleTranslateSummary = async () => {
    if (game.summary && !translatedSummary) {
      setIsTranslating(true);
      const translated = await translateText(game.summary);
      setTranslatedSummary(translated);
      setIsTranslating(false);
    }
  };

  // Fonctions pour gérer l'ajout/suppression de jeu
  const handleAddGame = async () => {
    try {
      setIsInCollection(true);
      setGameStatus("Non commencé");
      await addAGameToCurrentUser(game, user);
    } catch (error) {
      setIsInCollection(false);
      setGameStatus("");
      console.error("Erreur lors de l'ajout du jeu:", error);
    }
  };

  const handleRemoveGame = async () => {
    try {
      setIsInCollection(false);
      setGameStatus("");
      await delAGameInCurrentUser(game, user);
    } catch (error) {
      setIsInCollection(true);
      console.error("Erreur lors de la suppression du jeu:", error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateStatusInUser(game, newStatus, user);
      setGameStatus(newStatus);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  // Fonctions pour la modal
  const openScreenshotModal = (index) => {
    setModalType("screenshot");
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const openArtworkModal = (index) => {
    setModalType("artwork");
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const openVideoModal = (index) => {
    setModalType("video");
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
    setCurrentIndex(0);
  };

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
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
        </div>
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
    <div className="bg-white dark:bg-gray-900">
      {/* Modal pour la galerie */}
      <MediaModal
        isOpen={isModalOpen}
        modalType={modalType}
        currentIndex={currentIndex}
        mediaData={
          modalType === "screenshot"
            ? mediaCache.screenshots.length > 0
              ? mediaCache.screenshots
              : game?.screenshots
            : modalType === "artwork"
            ? mediaCache.artworks.length > 0
              ? mediaCache.artworks
              : game?.artworks
            : mediaCache.videos.length > 0
            ? mediaCache.videos
            : game?.videos
        }
        gameName={game?.name}
        onClose={closeModal}
        onNavigate={navigateModal}
      />

      {/* Section Intro Jeu */}
      <GameIntroSection
        game={game}
        isInCollection={isInCollection}
        gameStatus={gameStatus}
        handleAddGame={handleAddGame}
        handleRemoveGame={handleRemoveGame}
        handleStatusChange={handleStatusChange}
      />

      {/* Game Description */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex justify-between items-center mb-8 max-sm:flex-col max-sm:gap-4">
            <h2 className="text-4xl font-bold text-black dark:text-white">
              Synopsis
            </h2>
            {game?.summary && (
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
          <div className="bg-gray-50 dark:bg-gray-900 border border-black dark:border-gray-200 p-8 rounded-2xl shadow-sm">
            <p className="text-lg leading-relaxed text-black dark:text-white">
              {translatedSummary ||
                game?.summary ||
                "Aucune description disponible pour ce jeu."}
            </p>
          </div>
        </div>
      </section>

      {/* Game Details */}
      <GameDetailsSection game={game} />

      {/* Screenshots and Videos Gallery */}
      {((game?.screenshots && game.screenshots.length > 0) ||
        (game?.artworks && game.artworks.length > 0) ||
        (game?.videos && game.videos.length > 0)) && (
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-8">
            <div className="flex items-center justify-center gap-4 mb-12">
              <h2 className="text-4xl font-bold text-black dark:text-white text-center mb-12">
                Galerie
              </h2>
              {isPreloadingMedia && (
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-blue-600 dark:text-blue-300">
                    Optimisation en cours...
                  </span>
                </div>
              )}
            </div>

            {/* Screenshots Section */}
            {game?.screenshots && game.screenshots.length > 0 && (
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
                      className="rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 border border-black dark:border-gray-200 shadow-sm cursor-pointer group"
                      onClick={() => openScreenshotModal(index)}
                    >
                      <div className="relative aspect-video">
                        <img
                          src={getImageUrl(screenshot, "screenshot", "med")}
                          alt={`Screenshot ${index + 1} de ${game.name}`}
                          width="400"
                          height="225"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                          style={{ aspectRatio: "16/9" }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
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
            {game?.artworks && game.artworks.length > 0 && (
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
                      className="rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 border border-black dark:border-gray-200 shadow-sm cursor-pointer group"
                      onClick={() => openArtworkModal(index)}
                    >
                      <div className="relative aspect-[4/3]">
                        <img
                          src={getImageUrl(artwork, "artwork", "med")}
                          alt={`Artwork ${index + 1} de ${game.name}`}
                          width="400"
                          height="300"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                          style={{ aspectRatio: "4/3" }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
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
            {game?.videos && game.videos.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold text-black dark:text-white mb-6">
                  Vidéos ({game.videos.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {(showAllVideos ? game.videos : game.videos.slice(0, 4)).map(
                    (video, index) => (
                      <div
                        key={video.id}
                        className="rounded-lg overflow-hidden border border-black dark:border-gray-200 shadow-sm bg-gray-50 dark:bg-gray-800 cursor-pointer group transition-transform duration-300 hover:scale-105"
                        onClick={() => openVideoModal(index)}
                      >
                        <div className="aspect-video relative">
                          <img
                            src={getImageUrl(video, "video")}
                            alt={`Vidéo ${index + 1} de ${game.name}`}
                            width="400"
                            height="225"
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                            style={{ aspectRatio: "16/9" }}
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <div className="bg-red-600 rounded-full p-4 group-hover:scale-110 transition-transform">
                              <svg
                                className="w-8 h-8 text-white ml-1"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
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
        <div className="max-w-7xl mx-auto px-8">
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
            <div className="grid max-md:grid-cols-1 max-lg:grid-cols-2 max-xl:grid-cols-3 grid-cols-4 gap-6 justify-items-center">
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
