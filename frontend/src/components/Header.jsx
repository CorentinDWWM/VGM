import { Search, Sun, Bell, User, Moon } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { IoMenu } from "react-icons/io5";
import { MenuContext } from "../context/MenuContext";
import MenuBurger from "./Menu/MenuBurger";
import MenuAuth from "./Menu/MenuAuth";
import MenuNotification from "./Menu/MenuNotification";
import { DataContext } from "../context/DataContext";
import SearchBar from "./Search/SearchBar";

export default function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const {
    burger,
    toggleBurger,
    menuAuth,
    toggleMenuAuth,
    menuAuthRef,
    menuNotif,
    toggleMenuNotif,
    menuNotifRef,
  } = useContext(MenuContext);

  const { allGamesSimplified } = useContext(DataContext);

  return (
    <header className="bg-white px-6 py-4 flex justify-between items-center shadow-md dark:bg-gray-900 dark:shadow-white/30 min-h-[70px]">
      <div className="flex-shrink-0 w-[170px] h-[70px]">
        {theme === "dark" ? (
          <Link to="/">
            <img
              src="/Logo.svg"
              alt="logo Video Games Manager"
              className="h-full w-full object-contain"
            />
          </Link>
        ) : (
          <Link to="/">
            <img
              src="/Logo_dark.svg"
              alt="logo Video Games Manager"
              className="h-full w-full object-contain"
            />
          </Link>
        )}
      </div>
      <nav className="flex items-center gap-8 max-1000:hidden">
        <Link
          to="/"
          className="text-main-text-light dark:text-main-text-dark hover:text-primary-light dark:hover:text-primary-dark whitespace-nowrap"
        >
          Accueil
        </Link>
        <Link
          to="/games"
          className="text-main-text-light dark:text-main-text-dark hover:text-primary-light dark:hover:text-primary-dark whitespace-nowrap"
        >
          Jeux
        </Link>
        <Link
          to="/discover"
          className="text-main-text-light dark:text-main-text-dark hover:text-primary-light dark:hover:text-primary-dark whitespace-nowrap"
        >
          Découvertes
        </Link>
      </nav>
      <div className="max-1000:hidden flex-shrink-0">
        <SearchBar />
      </div>
      <div className="flex items-center justify-center gap-4 max-1000:hidden flex-shrink-0">
        {theme === "dark" ? (
          <Sun
            onClick={toggleTheme}
            className="text-black dark:text-white cursor-pointer"
          />
        ) : (
          <Moon
            onClick={toggleTheme}
            className="text-black dark:text-white cursor-pointer"
          />
        )}
        <div ref={menuNotifRef}>
          <Bell
            onClick={toggleMenuNotif}
            className="text-black dark:text-white cursor-pointer"
            data-menu="notification"
          />
          {menuNotif ? <MenuNotification onSelect={toggleMenuNotif} /> : null}
        </div>
        <div ref={menuAuthRef}>
          <User
            onClick={toggleMenuAuth}
            className="text-black dark:text-white cursor-pointer"
            data-menu="auth"
          />
          {menuAuth ? <MenuAuth onSelect={toggleMenuAuth} /> : null}
        </div>
      </div>
      {burger ? (
        <MenuBurger />
      ) : (
        <IoMenu
          onClick={toggleBurger}
          className="hidden max-1000:block text-2xl cursor-pointer"
        />
      )}
    </header>
  );
}
