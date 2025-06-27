import { useContext } from "react";
import HeaderUser from "../../components/Profil/HeaderUser";
import { AuthContext } from "../../context/AuthContext";
import { Search } from "lucide-react";

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
    <div className="flex flex-col gap-5 border border-black">
      <HeaderUser />
      <h2 className="w-full text-center text-2xl font-semibold">Mon Profil</h2>
      <div className="w-full h-full flex items-center justify-between px-[100px]">
        <div className="w-fit h-fit flex flex-col gap-[30px] justify-center">
          {/* Carte profil */}
          <div className="w-full h-fit flex flex-col gap-2.5 bg-white border border-black shadow-xl rounded-xl">
            <div className="w-full h-fit flex flex-col justify-center gap-2.5 px-2.5 pt-2.5">
              <div className="flex items-center gap-5">
                <img
                  src={user.avatar}
                  alt="avatar utilisateur"
                  className="w-[80px] rounded-full"
                />
                <div className="w-full h-fit flex flex-col justify-center gap-2.5">
                  <p>{user.username}</p>
                  <p>{user.email}</p>
                </div>
              </div>
            </div>
            <div className="w-full h-fit flex flex-col border-t border-black">
              <div className="w-full h-fit flex items-center px-[15px] py-2.5">
                <p>Inscrit depuis le {formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>
          {/* Backlog */}
          <div className="w-full h-fit flex flex-col gap-5">
            <h3 className="font-bold text-xl">Backlog de mes jeux</h3>
            <div className="w-fit h-fit flex justify-center items-center gap-5">
              <div className="w-fit h-fit flex flex-col gap-2.5 p-5 border border-black shadow-xl rounded-xl">
                <div className="w-fit h-fit flex flex-col items-center justify-center gap-2.5">
                  <p>Terminés</p>
                  <p>48</p>
                </div>
              </div>
              <div className="w-fit h-fit flex flex-col gap-2.5 p-5 border border-black shadow-xl rounded-xl">
                <div className="w-fit h-fit flex flex-col items-center justify-center gap-2.5">
                  <p>En cours</p>
                  <p>12</p>
                </div>
              </div>
              <div className="w-fit h-fit flex flex-col gap-2.5 p-5 border border-black shadow-xl rounded-xl">
                <div className="w-fit h-fit flex flex-col items-center justify-center gap-2.5">
                  <p>Dans ma liste</p>
                  <p>102</p>
                </div>
              </div>
            </div>
            {/* Rechercher dans ma liste */}
            <div className="w-full h-fit flex flex-col gap-5">
              <h3 className="font-bold text-xl">Rechercher dans ma liste</h3>
              <div className="max-w-[300px] w-full bg-white dark:bg-gray-900 border dark:border-white flex justify-between items-center p-2.5 rounded-md max-header:hidden">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="placeholder:text-secondary-text-light dark:text-secondary-text-dark outline-none"
                />
                <Search className="cursor-pointer text-black dark:text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
