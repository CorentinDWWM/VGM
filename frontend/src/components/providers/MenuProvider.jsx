import { useEffect, useRef, useState } from "react";
import { MenuContext } from "../../context/MenuContext";
import { useLocation } from "react-router-dom";

export default function MenuProvider({ children }) {
  const location = useLocation();

  // Menu Burger
  const [burger, setBurger] = useState(false);
  const menuRef = useRef(null);
  const menuBurgerRef = useRef(null);

  const toggleBurger = () => {
    setBurger((prev) => !prev);
  };

  // Menu Auth
  const [menuAuth, setMenuAuth] = useState(false);
  const menuAuthRef = useRef(null);

  const toggleMenuAuth = () => {
    setMenuAuth((prev) => !prev);
  };

  // Menu Filtres

  // Menu Genres
  const [menuGenres, setMenuGenres] = useState(false);
  const menuGenresRef = useRef(null);

  const toggleMenuGenres = () => {
    setMenuGenres((prev) => !prev);
  };

  // Menu Plateformes
  const [menuPlateformes, setMenuPlateformes] = useState(false);
  const menuPlateformesRef = useRef(null);

  const toggleMenuPlateformes = () => {
    setMenuPlateformes((prev) => !prev);
  };

  // Un seul useEffect pour gérer tous les clics extérieurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Menu Burger
      if (
        burger &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuBurgerRef.current &&
        !menuBurgerRef.current.contains(event.target)
      ) {
        setBurger(false);
      }

      // Menu Auth
      if (
        menuAuth &&
        menuAuthRef.current &&
        !menuAuthRef.current.contains(event.target)
      ) {
        setMenuAuth(false);
      }

      // Menu Genres
      if (
        menuGenres &&
        menuGenresRef.current &&
        !menuGenresRef.current.contains(event.target)
      ) {
        setMenuGenres(false);
      }

      // Menu Plateformes
      if (
        menuPlateformes &&
        menuPlateformesRef.current &&
        !menuPlateformesRef.current.contains(event.target)
      ) {
        setMenuPlateformes(false);
      }
    };

    if (burger || menuAuth || menuGenres || menuPlateformes) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [burger, menuAuth, menuGenres, menuPlateformes]);

  // Fermer tous les menus au changement de page
  useEffect(() => {
    setBurger(false);
    setMenuAuth(false);
    setMenuGenres(false);
    setMenuPlateformes(false);
  }, [location]);

  return (
    <MenuContext.Provider
      value={{
        burger,
        toggleBurger,
        menuRef,
        menuBurgerRef,
        menuAuth,
        toggleMenuAuth,
        menuAuthRef,
        menuGenres,
        toggleMenuGenres,
        menuGenresRef,
        menuPlateformes,
        toggleMenuPlateformes,
        menuPlateformesRef,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}
