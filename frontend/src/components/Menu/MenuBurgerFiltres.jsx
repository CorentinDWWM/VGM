import { useContext, useEffect } from "react";
import { MenuContext } from "../../context/MenuContext";
import Genres from "./Filtres/Genres";
import Plateformes from "./Filtres/Plateformes";
import { IoClose } from "react-icons/io5";

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

  return (
    <>
      <div
        ref={burgerFiltresRef}
        className="absolute top-[128px] flex flex-col gap-[30px] pt-5 pb-[40px] items-center bg-main-light border border-black w-[250px] dark:bg-gray-900 dark:border-white z-50"
      >
        <div className="w-full flex justify-end px-5">
          <IoClose
            onClick={toggleBurgerFiltres}
            className="text-3xl text-black dark:text-white cursor-pointer"
          />
        </div>
        <Genres />
        <Plateformes />
      </div>
    </>
  );
}
