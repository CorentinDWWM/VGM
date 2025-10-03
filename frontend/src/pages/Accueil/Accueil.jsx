import { IoGameController } from "react-icons/io5";
import { GoGraph } from "react-icons/go";
import { MdOutlineSystemSecurityUpdateGood } from "react-icons/md";
import { FaEarthEurope } from "react-icons/fa6";
import { BsCollection } from "react-icons/bs";
import { VscGraph } from "react-icons/vsc";
import { MdRateReview, MdCloudSync } from "react-icons/md";
import { LuClipboardList } from "react-icons/lu";
import { TbTargetArrow } from "react-icons/tb";
import { GiBrain } from "react-icons/gi";
import { WiMoonAltThirdQuarter } from "react-icons/wi";
import { IoKeyOutline } from "react-icons/io5";
import { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import { useLoaderData } from "react-router-dom";
import Bouton from "../../components/Boutons/Bouton";
import GlobalCookieModal from "../../components/Modal/GlobalCookieModal";

export default function Accueil() {
  // const { gamesData } = useLoaderData();
  // const { games } = useContext(DataContext);
  // console.log(gamesData);

  return (
    <div className="flex flex-col items-center">
      {/* Intro */}
      <section className="m-4 rounded py-16 text-center flex flex-col items-center">
        <h2 className="text-4xl font-bold mb-4 text-main-text-light dark:text-main-text-dark">
          Bienvenue sur <br />{" "}
          <span className="text-primary-light dark:text-primary-dark">
            Video Games Manager
          </span>
        </h2>
        <p className="text-lg text-main-text-light dark:text-main-text-dark max-w-2xl mx-auto mb-6">
          Ajoutez vos jeux, suivez votre progression, organisez votre backlog et
          obtenez des statistiques sur votre temps de jeu. Compatible
          multi-plateformes !
        </p>
        <Bouton text="Commencer maintenant" navigation="/discover" />
      </section>

      {/* Fonctionnalités */}
      <section className="w-full max-w-6xl mx-auto m-4 rounded-xl p-8 max-sm:p-4 max-sm:m-2 border shadow-xl dark:shadow-white/10">
        <div className="flex justify-center items-center mb-12 gap-2">
          <IoKeyOutline className="mt-1 text-2xl" />
          <h3 className="text-3xl font-semibold text-center text-primary-light dark:text-primary-dark">
            Fonctionnalités clés
          </h3>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-main-text-light dark:text-main-text-dark">
          {[
            [
              <BsCollection className="mb-1.5 text-lg" />,
              "Ma Collection",
              "Ajoutez vos jeux et filtrez par plateforme, statut ou genre.",
            ],
            [
              <VscGraph className="mb-1.5 text-lg" />,
              "Statistiques",
              "Visualisez des graphiques de votre activité : jeux ajoutés par année, jeux par genre, répartition par statut.",
            ],
            [
              <TbTargetArrow className="mb-1.5 text-lg" />,
              "Suivi de progression",
              "Marquez leur statut (non commencé, en cours, terminé, abandonné).",
            ],
            [
              <GiBrain className="mb-1.5 text-lg" />,
              "Recommandations",
              "Découvrez des jeux similaires à ceux que vous aimez.",
            ],
            [
              <WiMoonAltThirdQuarter className="mb-1.5 text-lg" />,
              "Mode Sombre/Clair",
              "Personnalisez l'interface selon vos préférences.",
            ],
          ].map(([icon, title, desc], index) => (
            <div
              key={index}
              className="bg-main-light dark:bg-gray-900 border p-6 rounded-xl shadow-xl hover:shadow-primary-light/50 dark:shadow-white/10 dark:hover:shadow-primary-dark/50 transition min-h-[160px] flex flex-col w-full sm:w-80 md:w-72 lg:w-80"
            >
              <div className="flex items-center gap-2">
                {icon}
                <h4 className="text-xl font-bold mb-2 text-primary-light dark:text-primary-dark">
                  {title}
                </h4>
              </div>
              <p className="text-main-text-light dark:text-main-text-dark">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pour qui ? */}
      <section className="m-2 rounded px-6 py-16">
        <h3 className="text-3xl font-semibold mb-8 text-center text-primary-light dark:text-primary-dark">
          Pour qui ?
        </h3>
        <div className="max-w-3xl mx-auto text-center text-main-text-light space-y-4">
          <div className="flex justify-center items-center gap-2">
            <IoGameController className="mt-0.5 text-primary-light dark:text-primary-dark" />
            <p className="text-black dark:text-white">
              Les passionnés de jeux vidéo qui veulent tout centraliser
            </p>
          </div>
          <div className="flex justify-center items-center gap-2">
            <GoGraph className="mt-0.5 text-success-light dark:text-success-dark" />
            <p className="text-black dark:text-white">
              Les collectionneurs organisés qui aiment suivre leur progression
            </p>
          </div>
          <div className="flex justify-center items-center gap-2">
            <MdOutlineSystemSecurityUpdateGood className="mt-0.5 text-alert-light dark:text-alert-dark" />
            <p className="text-black dark:text-white">
              Les joueurs sur Steam, PlayStation, Xbox, Switch ou Epic
            </p>
          </div>
          <div className="flex justify-center items-center gap-2">
            <FaEarthEurope className="mt-0.5 text-neutral-light dark:text-neutral-dark" />
            <p className="text-black dark:text-white">
              Les technophiles de tous âges
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
