import { useState } from "react";
import {
  addAGameToCurrentUser,
  delAGameInCurrentUser,
} from "../../apis/auth.api";
import { UserProfilContext } from "../../context/UserProfilContext";

export default function UserProfilProvider({ children }) {
  const [message, setMessage] = useState("");
  const resetMessage = () => setMessage("");
  // faire ici la fonction pour ajouter un jeu dans un profil user

  const addGamesToUser = async (game, user) => {
    try {
      const response = await addAGameToCurrentUser(game, user);
      if (response.message === "Succès") {
        setMessage("Jeu ajouté à la bibliothèque");
        return response;
      } else {
        setMessage("Erreur dans l'ajout du jeu dans la bibliothèque");
        return response;
      }
    } catch (error) {
      setMessage("Erreur lors de l'ajout du jeu");
      return error;
    }
  };

  const delGamesInUser = async (game, user) => {
    try {
      const response = await delAGameInCurrentUser(game, user);
      if (response.message === "Succès") {
        setMessage("Jeu supprimé de la bibliothèque");
        return response;
      } else {
        setMessage("Erreur dans la suppression du jeu dans la bibliothèque");
        return response;
      }
    } catch (error) {
      setMessage("Erreur lors de la suppression du jeu");
      return error;
    }
  };

  return (
    <UserProfilContext.Provider
      value={{ addGamesToUser, delGamesInUser, message, resetMessage }}
    >
      {children}
    </UserProfilContext.Provider>
  );
}
