import { useState } from "react";
import AffichesJeux from "../../components/Affiches/AffichesJeux";
import { games } from "../../games.json";
import { genres } from "../../genres.json";
import { Link } from "react-router-dom";

export default function Decouvertes() {
  const [tendancesSelected, setTendancesSelected] = useState("all");

  const toggleTendancesSelected = (nom) => {
    if (tendancesSelected !== nom) {
      setTendancesSelected(nom);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-[50px] px-5 py-[30px]">
      {/* Intro */}
      <div className="flex flex-col justify-center items-center gap-2.5">
        <h2 className="text-black dark:text-white font-bold text-3xl text-center">
          Exploez de nouveaux univers
        </h2>
        <h3 className="text-secondary-text-light dark:text-secondary-text-dark text-center">
          Découvrez votre prochain jeu coup de coeur grâce à nos recommandations
          personnalisées
        </h3>
      </div>
      {/* Basée sur vos Jeux favoris */}
      <div className="w-full flex flex-col items-center gap-[15px] pb-8">
        <p className="text-black dark:text-white text-2xl font-semibold">
          Recommandé pour vous
        </p>
        <p className="text-secondary-text-light dark:text-secondary-text-dark">
          Basé sur vos jeux favoris : Zelda, RPG, Aventure
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 pt-2.5">
          {games.slice(0, 5).map((game, index) => (
            <AffichesJeux
              key={index}
              img={game.img}
              rating={game.rating}
              name={game.name}
              platforms={game.platforms}
            />
          ))}
        </div>
      </div>
      {/* Tendances */}
      <div className="w-full flex flex-col items-center gap-[15px] py-8 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl shadow-black/10 dark:shadow-white/10 rounded-xl">
        <p className="text-black dark:text-white text-2xl font-semibold">
          Tendances actuelles
        </p>
        <div className="w-fill flex justify-center gap-4 flex-wrap">
          <div
            id="all"
            onClick={() => toggleTendancesSelected("all")}
            className={`flex justify-center items-center gap-2.5 px-[15px] py-2.5 border border-black dark:border-white rounded-[20px] shadow-xl shadow-black/10 dark:shadow-white/10 cursor-pointer ${
              tendancesSelected === "all"
                ? "bg-primary-light dark:bg-primary-dark text-white dark:text-black"
                : "bg-white dark:bg-gray-900 text-black dark:text-white"
            }`}
          >
            <p>Tous</p>
          </div>
          <div
            id="week"
            onClick={() => toggleTendancesSelected("week")}
            className={`flex justify-center items-center gap-2.5 px-[15px] py-2.5 border border-black dark:border-white rounded-[20px] shadow-xl shadow-black/10 dark:shadow-white/10 cursor-pointer ${
              tendancesSelected === "week"
                ? "bg-primary-light dark:bg-primary-dark text-white dark:text-black"
                : "bg-white dark:bg-gray-900 text-black dark:text-white"
            }`}
          >
            <p>Cette semaine</p>
          </div>
          <div
            id="month"
            onClick={() => toggleTendancesSelected("month")}
            className={`flex justify-center items-center gap-2.5 px-[15px] py-2.5 border border-black dark:border-white rounded-[20px] shadow-xl shadow-black/10 dark:shadow-white/10 cursor-pointer ${
              tendancesSelected === "month"
                ? "bg-primary-light dark:bg-primary-dark text-white dark:text-black"
                : "bg-white dark:bg-gray-900 text-black dark:text-white"
            }`}
          >
            <p>Ce mois</p>
          </div>
          <div
            id="new"
            onClick={() => toggleTendancesSelected("new")}
            className={`flex justify-center items-center gap-2.5 px-[15px] py-2.5 border border-black dark:border-white rounded-[20px] shadow-xl shadow-black/10 dark:shadow-white/10 cursor-pointer ${
              tendancesSelected === "new"
                ? "bg-primary-light dark:bg-primary-dark text-white dark:text-black"
                : "bg-white dark:bg-gray-900 text-black dark:text-white"
            }`}
          >
            <p>Nouveautés</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-6 pt-2.5">
          {games.slice(0, 8).map((game, index) => (
            <AffichesJeux
              key={index}
              img={game.img}
              rating={game.rating}
              name={game.name}
              platforms={game.platforms}
            />
          ))}
        </div>
      </div>
      {/* Nouvelles Sorties */}
      <div className="w-full flex flex-col items-center gap-[15px] pb-8">
        <div className="flex items-center justify-center gap-2.5">
          <p className="text-black dark:text-white text-2xl font-semibold">
            Nouvelles sorties
          </p>
          <Link
            to="/discover/news"
            className="text-primary-light dark:text-primary-dark hover:underline cursor-pointer pt-1"
          >
            Voir tout
          </Link>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-6 pt-2.5">
          {games.slice(0, 5).map((game, index) => (
            <AffichesJeux
              key={index}
              img={game.img}
              rating={game.rating}
              name={game.name}
              platforms={game.platforms}
            />
          ))}
        </div>
      </div>
      <div className="w-fill flex flex-col items-center gap-6">
        <p className="text-black dark:text-white text-2xl font-semibold">
          Explorer par genre
        </p>
        <div className="w-full flex flex-wrap items-center justify-center gap-x-[30px] gap-y-5">
          {genres.map((g, index) => (
            <Link key={g.id} to={`/discover/${g.id}`}>
              <div className="w-[200px] h-[200px] flex flex-col items-center justify-center gap-2.5 py-[30px] rounded-xl bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl shadow-black/10 dark:shadow-white/10 hover:scale-110 cursor-pointer">
                <p className="text-2xl">{g.emoji}</p>
                <p className="text-lg font-semibold text-black dark:text-white">
                  {g.nom}
                </p>
                <p className="text-secondary-text-light dark:text-secondary-text-dark">
                  {g.nb_jeux} jeux
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
