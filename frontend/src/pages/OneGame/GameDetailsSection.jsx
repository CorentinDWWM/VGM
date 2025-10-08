import {
  getEarliestReleaseDate,
  formatDateToFrench,
} from "../../utils/gameUtils";

export default function GameDetailsSection({ game }) {
  if (!game) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-8">
          <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded w-48 mx-auto mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 p-6 rounded-xl shadow-sm animate-pulse"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-4xl font-bold text-black dark:text-white text-center mb-8">
          Informations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-black dark:border-gray-200 p-6 rounded-xl flex items-start gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md min-h-[120px]">
            <div className="text-2xl flex-shrink-0">🎮</div>
            <div className="min-w-0 flex-1">
              <h3 className="text-black dark:text-white text-lg font-semibold mb-2">
                Plateformes
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed break-words">
                {game.platforms && game.platforms.length > 0
                  ? game.platforms.map((platform) => platform.name).join(", ")
                  : "Non spécifié"}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-black dark:border-gray-200 p-6 rounded-xl flex items-start gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md min-h-[120px]">
            <div className="text-2xl flex-shrink-0">🏢</div>
            <div className="min-w-0 flex-1">
              <h3 className="text-black dark:text-white text-lg font-semibold mb-2">
                Développeur
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed break-words">
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

          <div className="bg-white dark:bg-gray-900 border border-black dark:border-gray-200 p-6 rounded-xl flex items-start gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md min-h-[120px]">
            <div className="text-2xl flex-shrink-0">📦</div>
            <div className="min-w-0 flex-1">
              <h3 className="text-black dark:text-white text-lg font-semibold mb-2">
                Éditeur
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed break-words">
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

          <div className="bg-white dark:bg-gray-900 border border-black dark:border-gray-200 p-6 rounded-xl flex items-start gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md min-h-[120px]">
            <div className="text-2xl flex-shrink-0">👥</div>
            <div className="min-w-0 flex-1">
              <h3 className="text-black dark:text-white text-lg font-semibold mb-2">
                Modes de jeu
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed break-words">
                {game.game_modes && game.game_modes.length > 0
                  ? game.game_modes.map((mode) => mode.name).join(", ")
                  : "Non spécifié"}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-black dark:border-gray-200 p-6 rounded-xl flex items-start gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md min-h-[120px]">
            <div className="text-2xl flex-shrink-0">📅</div>
            <div className="min-w-0 flex-1">
              <h3 className="text-black dark:text-white text-lg font-semibold mb-2">
                Date de sortie
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed break-words">
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
            <div className="bg-white dark:bg-gray-900 border border-black dark:border-gray-200 p-6 rounded-xl flex items-start gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md min-h-[120px]">
              <div className="text-2xl flex-shrink-0">⏱️</div>
              <div className="min-w-0 flex-1">
                <h3 className="text-black dark:text-white text-lg font-semibold mb-2">
                  Temps de jeu
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed break-words">
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
  );
}
