import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Bouton from "../../components/Boutons/Bouton";
import { getEarliestReleaseDate } from "../../utils/gameUtils";

export default function GameIntroSection({
  game,
  isInCollection,
  gameStatus,
  handleAddGame,
  handleRemoveGame,
  handleStatusChange,
}) {
  const { user } = useContext(AuthContext);

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gray-50 dark:bg-gray-800 max-lg:py-10">
      <div className="absolute inset-0 z-10">
        {game.screenshots && game.screenshots.length > 0 && (
          <img
            src={`https://images.igdb.com/igdb/image/upload/t_1080p/${game.screenshots[0].image_id}.jpg`}
            alt="Background"
            className="w-full h-full object-cover filter blur-lg brightness-[0.2] opacity-30"
            fetchPriority="high"
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
            className="w-72 h-96 object-cover rounded-xl shadow-2xl transition-transform duration-300 hover:scale-105 border border-black dark:border-gray-200 "
            fetchPriority="high"
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
                    className="bg-gray-100 dark:bg-gray-900 border border-black dark:border-gray-200 px-4 py-2 rounded-full text-sm text-gray-700 dark:text-gray-300"
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
                      <label
                        htmlFor="game-status-select"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Statut du jeu :
                      </label>
                      <select
                        id="game-status-select"
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
  );
}
