import { useContext, useEffect } from "react";
import { MenuContext } from "../../context/MenuContext";

export default function MenuBurgerFiltres() {
  const { burgerFiltres, burgerFiltresRef, toggleBurgerFiltres } =
    useContext(MenuContext);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1000 && burgerFiltres) {
        toggleBurgerFiltres();
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [burgerFiltres, toggleBurgerFiltres]);

  return <div ref={burgerFiltresRef}></div>;
}
