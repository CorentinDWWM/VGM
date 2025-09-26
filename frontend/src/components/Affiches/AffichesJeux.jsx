import { useContext, useState } from "react";
import Bouton from "../Boutons/Bouton";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { UserProfilContext } from "../../context/UserProfilContext";
import { updateStatusInUser } from "../../apis/auth.api";

export default function AffichesJeux({ game }) {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const { addGamesToUser, delGamesInUser } = useContext(UserProfilContext);

  // État local pour suivre si le jeu est dans la collection
  const [isInCollection, setIsInCollection] = useState(
    user?.games?.some((g) => g.name === game.name) || false
  );

  const handleAddGame = async () => {
    const gameWithStatus = { ...game, statusUser: "Non commencé" };
    const response = await addGamesToUser(gameWithStatus, user);
    if (response.message === "Succès") {
      setUser(response.updatedUser);
      setIsInCollection(true);
    }
  };

  const handleRemoveGame = async () => {
    const response = await delGamesInUser(game, user);
    if (response.message === "Succès") {
      setUser(response.updatedUser);
      setIsInCollection(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    const updatedGames = user.games.map((g) =>
      g.igdbID === game.igdbID ? { ...g, statusUser: newStatus } : g
    );
    setUser({ ...user, games: updatedGames });
    const response = await updateStatusInUser(game, newStatus, user);
    console.log(response);
  };

  const getEarliestReleaseDate = (releaseDates) => {
    if (!releaseDates || releaseDates.length === 0) return null;
    const sortedDates = releaseDates
      .filter((release) => release.date)
      .map((release) => ({
        original: release.date,
        dateObj: new Date(release.date),
      }))
      .sort((a, b) => a.dateObj - b.dateObj);
    return sortedDates.length > 0 ? sortedDates[0].original : null;
  };

  // Fonction pour sécuriser l'affichage des valeurs numériques
  const safeNumber = (value, defaultValue = 0) => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return defaultValue;
    }
    return Number(value);
  };

  // Fonction pour sécuriser l'affichage des dates
  const safeYear = () => {
    if (game.first_release_date && !isNaN(game.first_release_date)) {
      return new Date(game.first_release_date * 1000).getFullYear();
    }
    if (game.release_dates && game.release_dates.length > 0) {
      const earliestDate = getEarliestReleaseDate(game.release_dates);
      if (earliestDate) {
        return new Date(earliestDate).getFullYear();
      }
    }
    return "TBA";
  };

  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer relative w-[280px] flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/games/${safeNumber(game.igdbID)}`)}
    >
      <div className="aspect-[3/4] overflow-hidden relative flex-shrink-0">
        <img
          src={
            game.cover?.image_id
              ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
              : "/placeholder-game.jpg"
          }
          alt={game.name}
          className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
        />

        {/* Overlay with buttons - only show on hover */}
        {isHovered && user && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="flex gap-2">
              {isInCollection ? (
                <Bouton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveGame();
                  }}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                  text="Retirer de ma liste"
                />
              ) : (
                <Bouton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddGame();
                  }}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  text="Ajouter à ma liste"
                />
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-black dark:text-white mb-2 line-clamp-2 h-12 overflow-hidden">
            {game.name}
          </h3>

          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {safeYear()}
            </span>
            {(game.total_rating || game.rating) &&
              !isNaN(game.total_rating || game.rating) &&
              (game.total_rating > 0 || game.rating > 0) && (
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {Math.round(safeNumber(game.total_rating || game.rating)) /
                    10}
                  /10
                </span>
              )}
          </div>

          {/* Status selector for profile pages */}
          {(location.pathname === "/profil" ||
            location.pathname === "/profil/library") &&
            isInCollection && (
              <div className="mb-2">
                <select
                  onClick={(e) => e.stopPropagation()}
                  onChange={handleStatusChange}
                  defaultValue={
                    user.games.find(
                      (g) => safeNumber(g.igdbID) === safeNumber(game.igdbID)
                    )?.statusUser || "Non commencé"
                  }
                  className="w-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded border border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Non commencé">Non commencé</option>
                  <option value="En cours">En cours</option>
                  <option value="Abandonné">Abandonné</option>
                  <option value="Terminé">Terminé</option>
                </select>
              </div>
            )}
        </div>

        {game.genres && game.genres.length > 0 && (
          <div className="overflow-hidden flex items-start">
            <div className="flex flex-wrap gap-1">
              {game.genres.slice(0, 2).map((genre, index) => (
                <span
                  key={safeNumber(genre.id) || index}
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full"
                  style={{
                    maxWidth: "100px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {genre.name || "Genre inconnu"}
                </span>
              ))}
              {game.genres.length > 2 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                  +{safeNumber(game.genres.length - 2)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
