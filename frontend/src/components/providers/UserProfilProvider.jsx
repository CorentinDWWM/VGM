import { UserProfilContext } from "../../context/UserProfilContext";

export default function UserProfilProvider({ children }) {
  return (
    <UserProfilContext.Provider value={{}}>
      {children}
    </UserProfilContext.Provider>
  );
}
