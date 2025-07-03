import { useContext, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { MenuContext } from "../../context/MenuContext";
import { Link } from "react-router-dom";
import { Search, Sun, Bell, User } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import MenuAuth from "./MenuAuth";

export default function MenuBurger() {
  const { toggleTheme } = useContext(ThemeContext);
  const {
    burger,
    toggleBurger,
    menuRef,
    menuAuth,
    toggleMenuAuth,
    menuAuthRef,
  } = useContext(MenuContext);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1000 && burger) {
        toggleBurger();
      }
      if (window.innerWidth > 1000 && menuAuth) {
        toggleMenuAuth();
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [burger, toggleBurger, menuAuth, toggleMenuAuth]);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-opacity ${
          burger ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleBurger} // Ferme le menu si on clique sur l'overlay
      ></div>
      <div
        ref={menuRef}
        className="absolute top-0 right-0 min-h-screen flex flex-col gap-10 px-5 py-6 items-center bg-main-light border-l border-b border-black w-[300px] dark:bg-gray-900 dark:border-white z-50"
      >
        <div className="w-full flex items-center justify-between gap-4">
          <Sun
            onClick={toggleTheme}
            className="text-black dark:text-white cursor-pointer"
          />
          <Bell className="text-black dark:text-white cursor-pointer" />
          <div ref={menuAuthRef}>
            <User
              onClick={toggleMenuAuth}
              className="text-black dark:text-white cursor-pointer"
            />
            {menuAuth ? <MenuAuth onSelect={toggleMenuAuth} /> : null}
          </div>
          <IoClose
            onClick={toggleBurger}
            className="text-3xl text-black dark:text-white cursor-pointer"
          />
        </div>
        <Link to="/" className="text-main-text-light dark:text-main-text-dark">
          Accueil
        </Link>
        <Link
          to="/mygames"
          className="text-main-text-light dark:text-main-text-dark"
        >
          Mes Jeux
        </Link>
        <Link
          to="/stats"
          className="text-main-text-light dark:text-main-text-dark"
        >
          Stats
        </Link>
        <Link
          to="/decouvertes"
          className="text-main-text-light dark:text-main-text-dark"
        >
          Découvertes
        </Link>
        <div className="w-[90%] bg-white dark:bg-gray-900 border dark:border-white flex justify-between items-center p-2.5 rounded-md">
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-[80%] placeholder:text-secondary-text-light dark:text-secondary-text-dark outline-none"
          />
          <Search className="cursor-pointer text-black dark:text-white" />
        </div>
      </div>
    </>
  );
}
