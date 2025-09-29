import { useContext, useEffect, useRef } from "react";
import HeaderUser from "../../components/Profil/HeaderUser";
import { AuthContext } from "../../context/AuthContext";
import { Search, Camera } from "lucide-react";
import AffichesJeux from "../../components/Affiches/AffichesJeux";
import { UserProfilContext } from "../../context/UserProfilContext";
import toast from "react-hot-toast";
import Bouton from "../../components/Boutons/Bouton";
import { useNavigate } from "react-router-dom";
import { updateAvatar } from "../../apis/auth.api";

export default function Profil() {
  const { user, setUser } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  // Comptage des jeux selon le statusUser
  const finishedCount =
    user.games?.filter((game) => game.statusUser === "Terminé").length || 0;
  const desertedCount =
    user.games?.filter((game) => game.statusUser === "Abandonné").length || 0;

  // Formate la date à "JJ MM YYYY"
  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };
  const navigate = useNavigate();

  const { message, resetMessage } = useContext(UserProfilContext);

  useEffect(() => {
    if (message) {
      if (message.includes("ajouté") || message.includes("supprimé")) {
        toast.success(message);
      } else if (message.includes("Erreur")) {
        toast.error(message);
      }
      resetMessage();
    }
  }, [message, resetMessage]);

  const handleClickToDiscorver = () => {
    navigate("/games");
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64Image = e.target.result;
        const response = await updateAvatar(base64Image);

        if (response && !response.message?.includes("Erreur")) {
          setUser(response);
          toast.success("Avatar mis à jour avec succès");
        } else {
          toast.error("Erreur lors de la mise à jour de l'avatar");
        }
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors de la mise à jour de l'avatar");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-5 border border-black dark:border-white mx-24 my-12 max-sm:m-8">
      <HeaderUser />
      <h2 className="text-center text-2xl max-sm:text-lg font-bold">
        Mon Profil
      </h2>
      <div className="flex max-xl:flex-col max-xl:items-center justify-evenly max-xl:gap-10">
        {/* Info User */}
        <div className="w-fit h-fit flex flex-col gap-[30px] justify-center mb-5">
          {/* Carte profil */}
          <div className="flex flex-col gap-2.5 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
            <div className="flex flex-col justify-center gap-2.5 px-2.5 pt-2.5">
              <div className="flex items-center gap-5">
                <div
                  className="relative group cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  <img
                    src={user.avatar}
                    alt="avatar utilisateur"
                    className="w-[80px] rounded-full max-sm:w-[60px]"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white w-6 h-6" />
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
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
                  <p>{finishedCount}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2.5 p-5 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
                <div className="min-w-[100px] flex flex-col items-center justify-center gap-2.5">
                  <p>Abandonné</p>
                  <p>{desertedCount}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2.5 p-5 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
                <div className="min-w-[100px] flex flex-col items-center justify-center gap-2.5">
                  <p>Dans ma liste</p>
                  <p>{user.games.length}</p>
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
        {/* Jeux dans ma liste */}
        <div className="flex flex-col justify-center items-center gap-[30px] px-28 max-sm:px-10 max-2xl:px-24 py-5 border border-b-0 border-black dark:border-white">
          <h3 className="text-xl max-sm:text-base text-primary-light dark:text-primary-dark font-semibold">
            Jeux dans ma liste :
          </h3>
          {user.games && user.games.length >= 1 ? (
            <div className="flex flex-col items-center overflow-y-auto hide-scrollbar">
              <div
                className={`grid ${
                  user.games.length === 1 ? "grid-cols-1" : "grid-cols-2"
                } max-2xl:grid-cols-1 gap-[50px] max-h-[550px]`}
              >
                {user.games.map((game) => (
                  <AffichesJeux key={game._id} game={game} />
                ))}
              </div>
            </div>
          ) : (
            <Bouton
              text="Découvrez nos jeux"
              onClick={handleClickToDiscorver}
            />
          )}
        </div>
      </div>
    </div>
  );
}
