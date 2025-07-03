import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function HeaderUser() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/profil") {
      document.getElementById("my_profil").classList.add("border-b-2");
      document
        .getElementById("my_profil")
        .classList.add("border-primary-light");
    }
    if (location.pathname === "/profil/library") {
      document.getElementById("my_library").classList.add("border-b-2");
      document
        .getElementById("my_library")
        .classList.add("border-primary-light");
    }
    if (location.pathname === "/profil/statistics") {
      document.getElementById("my_statistics").classList.add("border-b-2");
      document
        .getElementById("my_statistics")
        .classList.add("border-primary-light");
    }
  }, []);

  return (
    <div className="w-full flex justify-center items-center shadow-xl">
      <div className="w-fit h-fit flex items-center gap-[50px]">
        <div
          id="my_profil"
          className={`w-[150px] h-[60px] flex flex-col items-center justify-center gap-2.5`}
        >
          <Link to="/profil">Mon Profil</Link>
        </div>
        <div
          id="my_library"
          className={`w-[150px] h-[60px] flex flex-col items-center justify-center gap-2.5`}
        >
          <Link to="/profil/library">Ma Bibliothèque</Link>
        </div>
        <div
          id="my_statistics"
          className={`w-[150px] h-[60px] flex flex-col items-center justify-center gap-2.5`}
        >
          <Link to="/profil/statistics">Mes Statistiques</Link>
        </div>
      </div>
    </div>
  );
}
