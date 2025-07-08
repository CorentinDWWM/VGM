import { useContext } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MenuContext } from "../../../context/MenuContext";
import { genres } from "../../../genres.json";

export default function Genres() {
  const { menuGenres, toggleMenuGenres, menuGenresRef } =
    useContext(MenuContext);

  return (
    <>
      {menuGenres ? (
        <div className="w-[200px] flex flex-col justify-center items-center">
          <div
            ref={menuGenresRef}
            onClick={toggleMenuGenres}
            className="flex items-center gap-5 px-5 py-2.5 bg-white dark:bg-gray-900 border border-black dark:border-white rounded-xl"
          >
            <p>Genres</p>
            <FaChevronUp className="pt-0.5" />
          </div>
          <div className="w-[200px] flex flex-col items-center justify-center gap-2.5 px-5 py-2.5 bg-white dark:bg-gray-900 border border-black dark:border-white rounded-xl">
            {genres.map((g, index) => (
              <div
                key={index}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-1">
                  <p>{g.nom}</p>
                  <p className="text-secondary-text-light dark:text-secondary-text-dark">
                    {g.nb_jeux}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-[200px] flex flex-col justify-center items-center">
          <div
            ref={menuGenresRef}
            onClick={toggleMenuGenres}
            className="flex items-center gap-5 px-5 py-2.5 bg-white dark:bg-gray-900 border border-black dark:border-white rounded-xl"
          >
            <p>Genres</p>
            <FaChevronDown className="pt-0.5" />
          </div>
        </div>
      )}
    </>
  );
}
