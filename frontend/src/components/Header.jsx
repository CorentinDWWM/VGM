import { Search, Sun, Bell, User } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { IoMenu } from "react-icons/io5";
import { MenuContext } from "../context/MenuContext";
import MenuBurger from "./Menu/MenuBurger";
import MenuAuth from "./Menu/MenuAuth";

export default function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { burger, toggleBurger, menuAuth, toggleMenuAuth, menuAuthRef } =
    useContext(MenuContext);
  return (
    <header className="bg-white px-6 py-4 flex justify-between items-center shadow-md dark:bg-gray-900 dark:shadow-white/30">
      {theme === "dark" ? (
        <Link to="/">
          <img
            src="/Logo.svg"
            alt="logo Video Games Manager"
            className="h-[50px]"
          />
        </Link>
      ) : (
        <Link to="/">
          <img
            src="/Logo_dark.svg"
            alt="logo Video Games Manager"
            className="h-[50px]"
          />
        </Link>
      )}
      <nav className="flex items-center gap-8 max-1000:hidden">
        <Link
          to="/"
          className="text-main-text-light dark:text-main-text-dark hover:text-primary-light dark:hover:text-primary-dark"
        >
          Accueil
        </Link>
        <Link
          to="/games"
          className="text-main-text-light dark:text-main-text-dark hover:text-primary-light dark:hover:text-primary-dark"
        >
          Jeux
        </Link>
        <Link
          to="/stats"
          className="text-main-text-light dark:text-main-text-dark hover:text-primary-light dark:hover:text-primary-dark"
        >
          Stats
        </Link>
        <Link
          to="/decouvertes"
          className="text-main-text-light dark:text-main-text-dark hover:text-primary-light dark:hover:text-primary-dark"
        >
          Découvertes
        </Link>
      </nav>
      <div className="max-w-[300px] w-full bg-white dark:bg-gray-900 border dark:border-white flex justify-between items-center p-2.5 rounded-md max-1000:hidden">
        <input
          type="text"
          placeholder="Rechercher..."
          className="placeholder:text-secondary-text-light dark:text-secondary-text-dark outline-none"
        />
        <Search className="cursor-pointer text-black dark:text-white" />
      </div>
      <div className="flex items-center justify-center gap-4 max-1000:hidden">
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
