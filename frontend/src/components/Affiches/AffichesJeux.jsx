import { useContext, useState } from "react";
import Bouton from "../Boutons/Bouton";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { UserProfilContext } from "../../context/UserProfilContext";
import { updateStatusInUser } from "../../apis/auth.api";

export default function AffichesJeux({ game }) {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const { user, setUser } = useContext(AuthContext);
  const { addGamesToUser, delGamesInUser } = useContext(UserProfilContext);

  // État local pour suivre si le jeu est dans la collection
  const [isInCollection, setIsInCollection] = useState(
    user?.games?.some((g) => g.name === game.name) || false
  );

  const handleAddGame = async () => {
    const gameWithStatus = { ...game, statusUser: "Non commencé" };
    const response = await addGamesToUser(gameWithStatus, user);
    if (response.message === "Succès") {
      setUser(response.updatedUser);
      setIsInCollection(true);
    }
  };

  const handleRemoveGame = async () => {
    const response = await delGamesInUser(game, user);
    if (response.message === "Succès") {
      setUser(response.updatedUser);
      setIsInCollection(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    // Trouver le jeu dans la collection
    const updatedGames = user.games.map((g) =>
      g.igdbID === game.igdbID ? { ...g, statusUser: newStatus } : g
    );
    // Mettre à jour l'utilisateur
    setUser({ ...user, games: updatedGames });
    // Si tu veux aussi mettre à jour côté serveur, appelle une fonction ici
    const response = await updateStatusInUser(game, newStatus, user);
    console.log(response);
  };

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
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center max-sm:gap-0">
          <div
            className={`w-full flex justify-between items-center gap-2.5 p-3`}
          >
            <>
              {user && user.games.length >= 1 && isInCollection ? (
                <div
                  onClick={handleRemoveGame}
                  className="w-[25px] h-[25px] bg-alert-light rounded-4xl flex border border-black justify-center items-center cursor-pointer"
                  title="Supprimer ce jeu de la collection"
                >
                  <p className="text-center text-white pb-0.5">-</p>
                </div>
              ) : (
                <div
                  onClick={handleAddGame}
                  className="w-[25px] h-[25px] bg-primary-light rounded-4xl flex border border-black justify-center items-center cursor-pointer"
                  title="Ajouter ce jeu à la collection"
                >
                  <p className="text-center text-white pb-0.5">+</p>
                </div>
              )}
            </>
            <div className="w-[45px] h-[45px] bg-primary-light rounded-4xl border border-black flex justify-center items-center">
              <p className="text-xs text-center text-white">
                {Number(game.votes / 10).toFixed(1)}/10
              </p>
            </div>
          </div>
          {location.pathname === "/profil" ||
            (location.pathname === "/profil/library" && (
              <>
                <select
                  className="bg-primary-light hover:bg-primary-dark rounded-4xl flex border border-black justify-center items-center text-center p-1 cursor-pointer text-white hover:text-black"
                  title="Status du jeu"
                  defaultValue={
                    user.games.find((g) => g.igdbID === game.igdbID)
                      ?.statusUser || "Non commencé"
                  }
                  onChange={handleStatusChange}
                >
                  <option value="Non commencé">Non commencé</option>
                  <option value="En cours">En cours</option>
                  <option value="Abandonné">Abandonné</option>
                  <option value="Terminé">Terminé</option>
                </select>
              </>
            ))}
          {/* Info jeu */}
          <div className="w-full h-1/2 flex flex-col items-center gap-2.5 px-2.5 mt-5">
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
