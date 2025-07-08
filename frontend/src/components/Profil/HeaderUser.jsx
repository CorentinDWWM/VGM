import { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";

export default function HeaderUser() {
  const location = useLocation();
  const { theme } = useContext(ThemeContext);

  // ...existing code...
  useEffect(() => {
    let selectedId = "";
    if (location.pathname === "/profil") selectedId = "my_profil";
    if (location.pathname === "/profil/library") selectedId = "my_library";
    if (location.pathname === "/profil/statistics")
      selectedId = "my_statistics";

    if (selectedId) {
      const el = document.getElementById(selectedId);
      if (el) {
        el.classList.add("border-b-2");
        if (theme === "dark") {
          el.classList.add("border-primary-dark");
        } else {
          el.classList.add("border-primary-light");
        }
        // Scroll into view sur mobile
        if (window.innerWidth <= 768) {
          el.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
        }
      }
    }
  }, [location.pathname, theme]);
  // ...existing code...

  return (
    <div className="w-full max-md:overflow-x-auto flex justify-center items-center max-md:justify-start shadow-xl dark:shadow-white/10 hide-scrollbar bg-white dark:bg-gray-900">
      <div className="w-fit h-fit flex items-center gap-[50px] max-sm:gap-8">
        <div
          id="my_profil"
          className={`w-[150px] h-[60px] max-sm:h-[50px] flex flex-col items-center justify-center gap-2.5`}
        >
          <Link to="/profil" className="text-black dark:text-white">
            Mon Profil
          </Link>
        </div>
        <div
          id="my_library"
          className={`w-[150px] h-[60px] max-sm:h-[50px] flex flex-col items-center justify-center gap-2.5`}
        >
          <Link to="/profil/library" className="text-black dark:text-white">
            Ma Bibliothèque
          </Link>
        </div>
        <div
          id="my_statistics"
          className={`w-[150px] h-[60px] max-sm:h-[50px] flex flex-col items-center justify-center gap-2.5`}
        >
          <Link to="/profil/statistics" className="text-black dark:text-white">
            Mes Statistiques
          </Link>
        </div>
      </div>
    </div>
  );
}
