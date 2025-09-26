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

  // Menu Notification

  const [menuNotif, setMenuNotif] = useState(false);
  const menuNotifRef = useRef(null);

  const toggleMenuNotif = () => {
    setMenuNotif((prev) => !prev);
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

  // Menu Consoles

  const [menuConsoles, setMenuConsoles] = useState("");
  const menuConsolesRef = useRef(null);

  const toggleMenuConsoles = (nom) => {
    if (menuConsoles === nom) {
      setMenuConsoles("");
    } else {
      setMenuConsoles(nom);
    }
  };

  // Séléction de la plateformes

  const [selectedPlateformes, setSelectedPlateformes] = useState("");
  const selectedPlateformesRef = useRef(null);

  const toggleSelectedPlateformes = (nom) => {
    setSelectedPlateformes(nom);
    console.log(selectedPlateformes);
  };

  // Menu Burger Filtres

  const [burgerFiltres, setBurgerFiltres] = useState(false);
  const burgerFiltresRef = useRef(null);

  const toggleBurgerFiltres = () => {
    setBurgerFiltres((prev) => !prev);
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

      // Menu Auth - Exclure l'icône User qui déclenche le menu
      if (
        menuAuth &&
        menuAuthRef.current &&
        !menuAuthRef.current.contains(event.target)
      ) {
        // Vérifier si le clic n'est pas sur l'icône User elle-même
        const userIcon = event.target.closest('[data-menu="auth"]');
        if (!userIcon) {
          setMenuAuth(false);
        }
      }

      // Menu Notification - Exclure l'icône Bell qui déclenche le menu
      if (
        menuNotif &&
        menuNotifRef.current &&
        !menuNotifRef.current.contains(event.target)
      ) {
        // Vérifier si le clic n'est pas sur l'icône Bell elle-même
        const bellIcon = event.target.closest('[data-menu="notification"]');
        if (!bellIcon) {
          setMenuNotif(false);
        }
      }

      // Menu Genres
      if (
        menuGenres &&
        menuGenresRef.current &&
        !menuGenresRef.current.contains(event.target)
      ) {
        // Vérifier si le clic n'est pas sur l'élément déclencheur du menu genres
        const genresTrigger = event.target.closest('[data-menu="genres"]');
        if (!genresTrigger) {
          setMenuGenres(false);
        }
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

      // Menu Filtres
      if (
        burgerFiltres &&
        burgerFiltresRef.current &&
        !burgerFiltresRef.current.contains(event.target)
      ) {
        setBurgerFiltres(false);
      }
    };

    if (
      burger ||
      menuAuth ||
      menuNotif ||
      menuGenres ||
      menuPlateformes ||
      menuConsoles ||
      burgerFiltres
    ) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    burger,
    menuAuth,
    menuNotif,
    menuGenres,
    menuPlateformes,
    menuConsoles,
    burgerFiltres,
  ]);

  // Fermer tous les menus au changement de page
  useEffect(() => {
    setBurger(false);
    setMenuAuth(false);
    setMenuNotif(false);
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
        menuNotif,
        toggleMenuNotif,
        menuNotifRef,
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
        burgerFiltres,
        burgerFiltresRef,
        toggleBurgerFiltres,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}
