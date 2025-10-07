import {
  getEarliestReleaseDate,
  formatDateToFrench,
} from "../../utils/gameUtils";

export default function GameDetailsSection({ game }) {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-4xl font-bold text-black dark:text-white text-center mb-8">
          Informations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-black dark:border-gray-200 p-6 rounded-xl flex items-start gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
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

          <div className="bg-white dark:bg-gray-900 border border-black dark:border-gray-200 p-6 rounded-xl flex items-start gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
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

          <div className="bg-white dark:bg-gray-900 border border-black dark:border-gray-200 p-6 rounded-xl flex items-start gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
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

          <div className="bg-white dark:bg-gray-900 border border-black dark:border-gray-200 p-6 rounded-xl flex items-start gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
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

          <div className="bg-white dark:bg-gray-900 border border-black dark:border-gray-200 p-6 rounded-xl flex items-start gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
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
            <div className="bg-white dark:bg-gray-900 border border-black dark:border-gray-200 p-6 rounded-xl flex items-start gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
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
  );
}
