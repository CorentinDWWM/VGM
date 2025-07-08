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

  // Séléction du genre

  const [selectedGenres, setSelectedGenres] = useState("");
  const selectedGenresRef = useRef(null);

  const toggleSelectedGenres = (nom) => {
    setSelectedGenres(nom);
  };

  // Menu Plateformes
  const [menuPlateformes, setMenuPlateformes] = useState(false);
  const menuPlateformesRef = useRef(null);

  const toggleMenuPlateformes = () => {
    setMenuPlateformes((prev) => !prev);
  };

  const [menuConsoles, setMenuConsoles] = useState("");
  const menuConsolesRef = useRef(null);

  const toggleMenuConsoles = (nom) => {
    setMenuConsoles(nom);
  };

  // Séléction de la plateformes

  const [selectedPlateformes, setSelectedPlateformes] = useState("");
  const selectedPlateformesRef = useRef(null);

  const toggleSelectedPlateformes = (nom) => {
    setSelectedPlateformes(nom);
    console.log(selectedPlateformes);
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

      // Menu Consoles
      if (
        menuConsoles &&
        menuConsolesRef.current &&
        !menuConsolesRef.current.contains(event.target)
      ) {
        setMenuConsoles("");
      }
    };

    if (burger || menuAuth || menuGenres || menuPlateformes || menuConsoles) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [burger, menuAuth, menuGenres, menuPlateformes, menuConsoles]);

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
        menuConsoles,
        menuConsolesRef,
        toggleMenuConsoles,
        selectedGenres,
        selectedGenresRef,
        toggleSelectedGenres,
        selectedPlateformes,
        selectedPlateformesRef,
        toggleSelectedPlateformes,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}
