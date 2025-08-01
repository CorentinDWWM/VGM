import { useState } from "react";
import { addAGameToCurrentUser } from "../../apis/auth.api";
import { UserProfilContext } from "../../context/UserProfilContext";

export default function UserProfilProvider({ children }) {
  const { message, setMessage } = useState("");
  // faire ici la fonction pour ajouter un jeu dans un profil user

  const addGamesToUser = async (game, user) => {
    try {
      const updateUser = await addAGameToCurrentUser({ game, user });
      setMessage("Succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du jeu:", error);
      setMessage("Erreur");
    }
  };

  return (
    <UserProfilContext.Provider value={{ addGamesToUser, message }}>
      {children}
    </UserProfilContext.Provider>
  );
}
