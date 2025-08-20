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

  return (
    <div className="flex flex-col gap-5 border border-black dark:border-white mx-24 my-12 max-sm:m-8">
      <HeaderUser />
      <h2 className="text-center text-2xl max-sm:text-lg font-bold">
        Mes statistiques
      </h2>
      <div className="w-full h-full flex flex-col items-center gap-[100px] px-[100px] py-2.5">
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
        <div className="w-full flex items-center justify-between">
          <div className="w-[400px] flex flex-col gap-2.5 p-5  bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
            <h3 className="text-xl font-semibold">Jeux ajoutés par année</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gamesByYearData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="year"
                  label={{
                    value: "Années",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  allowDecimals={false}
                  label={{
                    value: "Nombre de jeux",
                    angle: -90,
                    position: "insideLeft",
                    offset: 20,
                  }}
                />
                <Tooltip />
                <Bar dataKey="count" fill={barColor} name="Jeux ajoutés" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Nouveau graphique : Jeux par genre */}
          <div className="w-[500px] flex flex-col gap-2.5 p-5 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
            <h3 className="text-xl font-semibold">Jeux par genre</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gamesByGenreData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="genre"
                  interval={0}
                  angle={0}
                  textAnchor="middle"
                  label={{
                    value: "Genres",
                    position: "insideBottomRight",
                    offset: -5,
                  }}
                />
                <YAxis
                  allowDecimals={false}
                  label={{
                    value: "Nombre de jeux",
                    angle: -90,
                    position: "insideLeft",
                    offset: 20,
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill={barColor} name="Jeux par genre" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
