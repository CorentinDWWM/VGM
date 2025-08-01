import { useContext, useEffect, useState } from "react";
import Bouton from "../Boutons/Bouton";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { UserProfilContext } from "../../context/UserProfilContext";
import toast from "react-hot-toast";

export default function AffichesJeux({ game }) {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { addGamesToUser, message } = useContext(UserProfilContext);

  useEffect(() => {
    if (message === "Succès") {
      toast.success("Jeu ajouté à la bibliothèque");
    } else if (message === "Erreur") {
      toast.error("Erreur dans l'ajout du jeu à la bibliothèque");
    }
  }, [message]);

  return (
    <div
      className="w-[250px] relative cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={`//images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.webp`}
        alt={game.name}
        className={`border border-black dark:border-white shadow-xl dark:shadow-white/10 object-contain w-full h-full`}
      />
      {isHovered && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-end gap-2.5 max-sm:gap-0">
          {/* Note */}
          <div
            className={`w-full flex ${
              location.pathname !== "my_profil"
                ? "justify-between"
                : "justify-end"
            } items-center gap-2.5 p-2.5`}
          >
            {location.pathname !== "/my_profil" && (
              <>
                {user.games?.includes(game.name) ? (
                  <div className="w-[25px] h-[25px] bg-alert-light rounded-4xl flex border border-black justify-center items-center ml-2">
                    <p className="text-center text-white pb-0.5">-</p>
                  </div>
                ) : (
                  <div
                    onClick={addGamesToUser(game, user)}
                    className="w-[25px] h-[25px] bg-primary-light rounded-4xl flex border border-black justify-center items-center ml-2"
                  >
                    <p className="text-center text-white pb-0.5">+</p>
                  </div>
                )}
              </>
            )}
            <div className="w-[55px] h-[55px] bg-primary-light rounded-4xl border border-black flex justify-center items-center">
              <p className="text-xs text-center text-white">
                {Number(game.votes).toFixed(2)} <br />
                sur <br />
                100
              </p>
            </div>
          </div>
          {/* Info jeu */}
          <div className="w-full h-1/2 flex flex-col justify-center items-center gap-2.5 px-2.5">
            <p className="font-bold text-center text-white underline">
              {game.name}
            </p>
            <p className="text-sm text-center text-white">
              Disponible sur : {game.platforms?.map((p) => p.name).join(", ")}
            </p>
            <Bouton
              text="En savoir plus sur le jeu"
              textStyle="max-sm:px-5 max-sm:py-2"
            />
          </div>
        </div>
      )}
    </div>
  );
}
