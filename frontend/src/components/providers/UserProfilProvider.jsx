import { UserProfilContext } from "../../context/UserProfilContext";

export default function UserProfilProvider({ children }) {
  // faire ici la fonction pour ajouter un jeu dans un profil user
  return (
    <UserProfilContext.Provider value={{}}>
      {children}
    </UserProfilContext.Provider>
  );
}
