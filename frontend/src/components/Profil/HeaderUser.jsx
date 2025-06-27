import { Link } from "react-router-dom";

export default function HeaderUser() {
  return (
    <div className="w-full flex justify-center items-center shadow-xl">
      <div className="w-fit h-fit flex items-center gap-[50px]">
        <div
          className={`w-[150px] flex flex-col items-center justify-center gap-2.5 py-10`}
        >
          <Link to="/profil">Mon Profil</Link>
        </div>
        <div
          className={`w-[150px] flex flex-col items-center justify-center gap-2.5 py-10`}
        >
          <Link to="/profil">Ma Bibliothèque</Link>
        </div>
        <div
          className={`w-[150px] flex flex-col items-center justify-center gap-2.5 py-10`}
        >
          <Link to="/profil">Mes Statistiques</Link>
        </div>
      </div>
    </div>
  );
}
