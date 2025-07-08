import { useContext, useEffect } from "react";
import HeaderUser from "../../components/Profil/HeaderUser";
import { AuthContext } from "../../context/AuthContext";
import { Search } from "lucide-react";
import AffichesJeux from "../../components/Affiches/AffichesJeux";
import { games } from "../../games.json";

export default function Profil() {
  const { user } = useContext(AuthContext);
  // Format the date to "27 Juin 2025"
  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-5 border border-black dark:border-white mx-24 my-12 max-sm:mx-8 max-sm:my-0">
      <HeaderUser />
      <h2 className="text-center text-2xl max-sm:text-lg font-bold">
        Mon Profil
      </h2>
      <div className="flex max-xl:flex-col max-xl:items-center justify-evenly max-xl:gap-10">
        {/* Info User */}
        <div className="w-fit h-fit flex flex-col gap-[30px] justify-center">
          {/* Carte profil */}
          <div className="flex flex-col gap-2.5 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
            <div className="flex flex-col justify-center gap-2.5 px-2.5 pt-2.5">
              <div className="flex items-center gap-5">
                <img
                  src={user.avatar}
                  alt="avatar utilisateur"
                  className="w-[80px] rounded-full max-sm:w-[60px]"
                />
                <div className="flex flex-col justify-center gap-2.5 max-sm:gap-1">
                  <p className="max-sm:text-sm">{user.username}</p>
                  <p className="max-sm:text-sm">{user.email}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col border-t border-black dark:border-white">
              <div className="flex items-center px-[15px] py-2.5">
                <p className="max-sm:text-sm">
                  Inscrit depuis le {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </div>
          {/* Backlog */}
          <div className="flex flex-col max-md:items-center gap-5">
            <h3 className="font-bold text-xl max-sm:text-base max-xl:text-center">
              Backlog de mes jeux
            </h3>
            <div className="flex max-md:flex-col justify-center items-center gap-5">
              <div className="flex flex-col gap-2.5 p-5 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
                <div className="min-w-[100px] flex flex-col items-center justify-center gap-2.5">
                  <p>Terminés</p>
                  <p>48</p>
                </div>
              </div>
              <div className="flex flex-col gap-2.5 p-5 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
                <div className="min-w-[100px] flex flex-col items-center justify-center gap-2.5">
                  <p>En cours</p>
                  <p>12</p>
                </div>
              </div>
              <div className="flex flex-col gap-2.5 p-5 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
                <div className="min-w-[100px] flex flex-col items-center justify-center gap-2.5">
                  <p>Dans ma liste</p>
                  <p>102</p>
                </div>
              </div>
            </div>
          </div>
          {/* Rechercher dans ma liste */}
          <div className="flex flex-col max-xl:items-center gap-5">
            <h3 className="font-bold text-xl max-sm:text-base">
              Rechercher dans ma liste
            </h3>
            <div className="max-w-[300px] max-sm:max-w-[200px] bg-white dark:bg-gray-900 border dark:border-white flex justify-between items-center p-2.5 rounded-md">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full placeholder:text-secondary-text-light dark:text-secondary-text-dark outline-none"
              />
              <Search className="cursor-pointer text-black dark:text-white max-sm:w-5 max-sm:h-5" />
            </div>
          </div>
        </div>
        {/* Jeux terminés */}
        <div className="flex flex-col justify-center items-center gap-[30px] px-28 max-sm:px-12 max-2xl:px-24 py-5 border border-b-0 border-black dark:border-white">
          <h3 className="text-xl max-sm:text-base text-primary-light dark:text-primary-dark font-semibold">
            Jeux terminés :
          </h3>
          <div className="flex flex-col items-center overflow-y-auto hide-scrollbar">
            <div className="grid grid-cols-2 max-2xl:grid-cols-1 gap-[50px] max-h-[550px]">
              {games.map((game, index) => (
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
        </div>
      </div>
    </div>
  );
}
