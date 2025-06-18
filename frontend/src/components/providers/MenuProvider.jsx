import { useEffect, useRef, useState } from "react";
import { MenuContext } from "../../context/MenuContext";
import { useLocation } from "react-router-dom";

export default function MenuProvider({ children }) {
  const location = useLocation();
  // Menu Burger
  const [burger, setBurger] = useState(false);
  const menuRef = useRef(null);
  const menuBurgerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setBurger(false);
      }
      if (
        menuBurgerRef.current &&
        !menuBurgerRef.current.contains(event.target)
      ) {
        toggleBurger();
      }
    };

    if (burger) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [burger]);

  const toggleBurger = () => {
    setBurger((prev) => (prev === false ? true : false));
  };

  // Menu Auth
  const [menuAuth, setMenuAuth] = useState(false);
  const menuAuthRef = useRef(null);

  const toggleMenuAuth = () => {
    setMenuAuth((prev) => (prev === false ? true : false));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuAuthRef.current && !menuAuthRef.current.contains(event.target)) {
        setMenuAuth(false);
      }
    };

    if (menuAuth) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuAuth]);

  useEffect(() => {
    setBurger(false);
    setMenuAuth(false);
  }, [location]);

  return (
    <MenuContext.Provider
      value={{
        burger,
        toggleBurger,
        menuRef,
        menuAuth,
        toggleMenuAuth,
        menuAuthRef,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}
