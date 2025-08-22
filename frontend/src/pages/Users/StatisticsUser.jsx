import { useContext } from "react";
import HeaderUser from "../../components/Profil/HeaderUser";
import { AuthContext } from "../../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ThemeContext } from "../../context/ThemeContext";

export default function StatisticsUser() {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  // Comptage des jeux selon le statusUser
  const finishedCount =
    user.games?.filter((game) => game.statusUser === "Terminé").length || 0;
  const inProgressCount =
    user.games?.filter((game) => game.statusUser === "En cours").length || 0;
  const desertedCount =
    user.games?.filter((game) => game.statusUser === "Abandonné").length || 0;
  const notStartCount =
    user.games?.filter((game) => game.statusUser === "Non commencé").length ||
    0;

  // POUR LE GRAPHIQUE DES JEUX AJOUTES PAR ANNEE

  // Comptage des jeux ajoutés par année
  const gamesByYear = {};
  user.games?.forEach((game) => {
    if (game.addedAtUser) {
      const year = new Date(game.addedAtUser).getFullYear();
      gamesByYear[year] = (gamesByYear[year] || 0) + 1;
    }
  });
  // Détermination de la plage de 5 années à afficher
  const years = Object.keys(gamesByYear).map(Number);
  const currentYear = new Date().getFullYear();
  let minYear = currentYear - 4;
  if (years.length > 0) {
    const minGameYear = Math.min(...years);
    const maxGameYear = Math.max(...years);
    // Si les années de jeux sont plus anciennes, on ajuste la plage
    if (maxGameYear - minGameYear >= 4) {
      minYear = maxGameYear - 4;
    } else if (minGameYear < minYear) {
      minYear = minGameYear;
    }
  }
  const yearRange = Array.from({ length: 5 }, (_, i) => minYear + i);

  // Construction des données pour le graphique
  const gamesByYearData = yearRange.map((year) => ({
    year: year.toString(),
    count: gamesByYear[year] || 0,
  }));

  // POUR LE GRAPHIQUE DES JEUX PAR GENRE

  // Comptage des jeux par genre
  const genreCountMap = {};
  user.games?.forEach((game) => {
    if (Array.isArray(game.genres)) {
      game.genres.forEach((genre) => {
        if (genre && genre.name) {
          // Raccourcir "Role-Playing (RPG)" en "RPG"
          const genreName =
            genre.name === "Role-playing (RPG)" ? "RPG" : genre.name;
          genreCountMap[genreName] = (genreCountMap[genreName] || 0) + 1;
        }
      });
    }
    console.log(genreCountMap);
  });

  // Trier les genres par nombre décroissant et ne garder que les 8 premiers
  const gamesByGenreData = Object.entries(genreCountMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      genre: name,
      count,
    }));

  const barColor = theme === "light" ? "#4f46e5" : "#6996f1";
  const textColor = theme === "light" ? "#000000" : "#ffffff";

  // Données pour le graphique répartition des statuts
  const statusColors = {
    light: {
      Terminé: "#16a34a",
      "En cours": "#4f46e5",
      Abandonné: "#dc2626",
      "Non commencé": "#ca8a04",
    },
    dark: {
      Terminé: "#22c55e",
      "En cours": "#6996f1",
      Abandonné: "#ef4444",
      "Non commencé": "#facc15",
    },
  };

  const gamesByStatusData = [
    {
      name: "Terminé",
      value: finishedCount,
      color: statusColors[theme]["Terminé"],
    },
    {
      name: "En cours",
      value: inProgressCount,
      color: statusColors[theme]["En cours"],
    },
    {
      name: "Abandonné",
      value: desertedCount,
      color: statusColors[theme]["Abandonné"],
    },
    {
      name: "Non commencé",
      value: notStartCount,
      color: statusColors[theme]["Non commencé"],
    },
  ].filter((item) => item.value > 0); // Ne garder que les statuts avec au moins 1 jeu

  return (
    <div className="flex flex-col gap-5 border border-black dark:border-white mx-24 max-md:mx-12 my-12 max-sm:m-8">
      <HeaderUser />
      <h2 className="text-center text-2xl max-sm:text-lg font-bold">
        Mes statistiques
      </h2>
      <div className="w-full h-full flex flex-col items-center gap-[100px] max-sm:gap-10 px-[50px] max-md:px-10 pt-2.5 pb-10">
        {/* Jeux */}
        <div className="flex flex-wrap justify-center items-center gap-5">
          <div className="w-[250px] flex flex-col items-center gap-2.5 p-5 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
            <div className="flex flex-col items-center justify-center gap-2.5">
              <p>Dans ma bibliothèque</p>
              <p>{user.games.length}</p>
            </div>
          </div>
          <div className="w-[250px] flex flex-col items-center gap-2.5 p-5 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
            <div className="flex flex-col items-center justify-center gap-2.5">
              <p>Jeux terminés</p>
              <p>{finishedCount}</p>
            </div>
          </div>
          <div className="w-[250px] flex flex-col items-center gap-2.5 p-5 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
            <div className="flex flex-col items-center justify-center gap-2.5">
              <p>Jeux en cours</p>
              <p>{inProgressCount}</p>
            </div>
          </div>
          <div className="w-[250px] flex flex-col items-center gap-2.5 p-5 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
            <div className="flex flex-col items-center justify-center gap-2.5">
              <p>Jeux abandonnées</p>
              <p>{desertedCount}</p>
            </div>
          </div>
          <div className="w-[250px] flex flex-col items-center gap-2.5 p-5 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
            <div className="flex flex-col items-center justify-center gap-2.5">
              <p>Jeux non commencés</p>
              <p>{notStartCount}</p>
            </div>
          </div>
        </div>
        <div className="w-full flex max-2xl:flex-col max-2xl:gap-10 items-center justify-between">
          {/* Jeux par Année */}
          <div className="w-[425px] max-sm:w-full flex flex-col gap-2.5 p-5 max-sm:p-3 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
            <h3 className="text-xl max-sm:text-lg font-semibold">
              Jeux ajoutés par année
            </h3>
            <ResponsiveContainer
              width="100%"
              height={300}
              className="max-sm:hidden"
            >
              <BarChart data={gamesByYearData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: textColor }}
                  height={50}
                  label={{
                    value: "Années",
                    position: "insideBottomRight",
                    offset: 0,
                    style: { fill: textColor },
                  }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: textColor }}
                  label={{
                    value: "Nombre de jeux",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    style: { fill: textColor, textAnchor: "start" },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    color: "#000000",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill={barColor}
                  name="Jeux ajoutés"
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Version mobile simplifiée */}
            <div className="hidden max-sm:block">
              <div className="grid grid-cols-1 gap-2">
                {gamesByYearData.map((item) => (
                  <div
                    key={item.year}
                    className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <span className="font-medium">{item.year}</span>
                    <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Jeux par genre */}
          <div className="w-[425px] max-sm:w-full flex flex-col gap-2.5 p-5 max-sm:p-3 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
            <h3 className="text-xl max-sm:text-lg font-semibold">
              Jeux par genre
            </h3>
            <ResponsiveContainer
              width="100%"
              height={300}
              className="max-sm:hidden"
            >
              <BarChart data={gamesByGenreData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="genre"
                  interval={0}
                  angle={0}
                  textAnchor="middle"
                  height={50}
                  tick={{ fill: textColor }}
                  label={{
                    value: "Genres",
                    position: "insideBottomRight",
                    offset: 0,
                    style: { fill: textColor },
                  }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: textColor }}
                  label={{
                    value: "Nombre de jeux",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    style: { fill: textColor, textAnchor: "start" },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    color: "#000000",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill={barColor}
                  name="Jeux par genre"
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Version mobile simplifiée */}
            <div className="hidden max-sm:block">
              <div className="space-y-3">
                {gamesByGenreData.map((item, index) => (
                  <div key={item.genre} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">
                          {item.genre}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.count}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (item.count /
                                Math.max(
                                  ...gamesByGenreData.map((g) => g.count)
                                )) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Répartition par statut */}
          <div className="w-[425px] max-sm:w-full flex flex-col gap-2.5 p-5 max-sm:p-3 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
            <h3 className="text-xl max-sm:text-lg font-semibold">
              Répartition par statut
            </h3>
            <ResponsiveContainer
              width="100%"
              height={300}
              className="max-sm:hidden"
            >
              <PieChart>
                <Pie
                  data={gamesByStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {gamesByStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    color: "#000000",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            {/* Version mobile simplifiée */}
            <div className="hidden max-sm:block">
              <div className="space-y-3">
                {gamesByStatusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{item.name}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.value} (
                          {((item.value / user.games.length) * 100).toFixed(0)}
                          %)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
