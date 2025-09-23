import { useContext } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MenuContext } from "../../../context/MenuContext";
import { IoClose } from "react-icons/io5";
import { DataContext } from "../../../context/DataContext";

export default function Genres() {
  const {
    menuGenres,
    toggleMenuGenres,
    menuGenresRef,
    selectedGenres,
    selectedGenresRef,
    toggleSelectedGenres,
  } = useContext(MenuContext);

  const { genres } = useContext(DataContext);

  return (
    <>
      {menuGenres ? (
        <div
          ref={menuGenresRef}
          className="w-[200px] flex flex-col justify-center items-center"
        >
          <div
            onClick={toggleMenuGenres}
            className="flex items-center gap-5 px-5 py-2.5 bg-white dark:bg-gray-900 border border-black dark:border-white rounded-xl"
          >
            <p>Genres</p>
            <FaChevronUp className="pt-0.5" />
          </div>
          <div className="absolute max-sm:relative top-[138px] max-sm:top-0 w-[200px] flex flex-col items-center justify-center gap-2.5 px-5 py-2.5 bg-white dark:bg-gray-900 border border-black dark:border-white rounded-xl">
            {genres.map((g, index) => (
              <div
                key={index}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-1">
                  <p>{g.name}</p>
                  <p className="text-secondary-text-light dark:text-secondary-text-dark">
                    {g.count}
                  </p>
                </div>
                {selectedGenres === g.name ? (
                  <div
                    ref={selectedGenresRef}
                    onClick={() => toggleSelectedGenres(g.name)}
                    className="flex items-center justify-center w-[15px] h-[15px] bg-white dark:bg-gray-900 border border-black dark:border-white rounded-sm"
                  >
                    <IoClose className="absolute w-[25px] h-[25px] text-black dark:text-white cursor-pointer" />
                  </div>
                ) : (
                  <div
                    ref={selectedGenresRef}
                    onClick={() => toggleSelectedGenres(g.name)}
                    className="w-[15px] h-[15px] bg-white dark:bg-gray-900 border border-black dark:border-white rounded-sm"
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          ref={menuGenresRef}
          className="w-[200px] flex flex-col justify-center items-center"
        >
          <div
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
