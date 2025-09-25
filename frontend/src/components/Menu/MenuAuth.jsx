import { Link } from "react-router-dom";
import { MenuContext } from "../../context/MenuContext";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Bouton from "../Boutons/Bouton";

export default function MenuAuth({ onSelect }) {
  const { menuAuth, toggleMenuAuth, menuAuthRef } = useContext(MenuContext);
  const { user, logout } = useContext(AuthContext);

  const handleClick = () => {
    onSelect(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1000 && menuAuth) {
        toggleMenuAuth();
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [menuAuth, toggleMenuAuth]);

  return (
    <div
      ref={menuAuthRef}
      className="absolute z-50 top-[60px] right-6 flex flex-col items-center gap-4 p-4 bg-white dark:bg-gray-900 border border-black dark:border-white rounded-lg w-[200px]"
    >
      {user ? (
        <div className="flex flex-col items-end gap-2 justify-evenly">
          <Bouton text="Profil" navigation="/profil" />
          <Bouton text="Déconnexion" navigation="/" onClick={logout} />
          {/* <Link to="/profil">Profil</Link>
          <Link to="/" onClick={logout}>
          Déconnexion
          </Link> */}
        </div>
      ) : (
        <>
          <Bouton
            text="Se connecter"
            navigation="/login"
            onClick={handleClick}
          />
          <Bouton
            text="S'inscrire"
            navigation="/register"
            onClick={handleClick}
          />
          {/* <Link
            to="/login"
            onClick={handleClick}
            className="bg-primary-light hover:bg-hover-light dark:bg-primary-dark dark:hover:bg-hover-dark px-4 py-2 rounded-lg text-base font-semibold cursor-pointer text-main-light dark:text-main-dark text-center"
          >
            Se connecter
          </Link>
          <Link
            to="/register"
            onClick={handleClick}
            className="bg-primary-light hover:bg-hover-light dark:bg-primary-dark dark:hover:bg-hover-dark px-4 py-2 rounded-lg text-base font-semibold cursor-pointer text-main-light dark:text-main-dark text-center"
          >
            S'inscrire
          </Link> */}
        </>
      )}
    </div>
  );
}
