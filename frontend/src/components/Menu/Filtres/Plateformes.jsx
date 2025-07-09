import { useContext } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MenuContext } from "../../../context/MenuContext";
import { plateformes } from "../../../plateformes.json";
import { IoClose } from "react-icons/io5";

export default function Plateformes() {
  const {
    menuPlateformes,
    toggleMenuPlateformes,
    menuPlateformesRef,
    menuConsoles,
    menuConsolesRef,
    toggleMenuConsoles,
    selectedPlateformes,
    selectedPlateformesRef,
    toggleSelectedPlateformes,
  } = useContext(MenuContext);
  return (
    <>
      {menuPlateformes ? (
        <div
          ref={menuPlateformesRef}
          className="w-[200px] flex flex-col justify-center items-center"
        >
          <div
            onClick={toggleMenuPlateformes}
            className="flex items-center gap-5 px-5 py-2.5 bg-white dark:bg-gray-900 border border-black dark:border-white rounded-xl"
          >
            <p>Plateformes</p>
            <FaChevronUp className="pt-0.5" />
          </div>
          <div className="absolute top-[138px] w-[200px] flex flex-col items-center justify-center px-5 py-2.5 bg-white dark:bg-gray-900 border border-black dark:border-white rounded-xl">
            {plateformes.map((p, index) => (
              <div
                key={index}
                className="w-full flex items-center justify-between"
              >
                <div
                  ref={menuConsoles === p.nom ? menuConsolesRef : null}
                  className={`w-full flex flex-col justify-center gap-2 ${
                    menuConsoles === p.nom && menuConsoles !== "PC"
                      ? "outline outline-black dark:outline-white bg-white dark:bg-gray-900 rounded-xl"
                      : ""
                  } p-2`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      onClick={() => toggleMenuConsoles(p.nom)}
                      className="flex items-center gap-1"
                    >
                      <p>{p.nom}</p>
                      {menuConsoles === p.nom && p.nom !== "PC" ? (
                        <FaChevronUp className="pt-0.5" />
                      ) : p.nom !== "PC" ? (
                        <FaChevronDown className="pt-0.5" />
                      ) : null}
                    </div>
                    {selectedPlateformes === p.nom ? (
                      <div
                        ref={selectedPlateformesRef}
                        onClick={() => toggleSelectedPlateformes(p.nom)}
                        className="flex items-center justify-center w-[15px] h-[15px] bg-white dark:bg-gray-900 border border-black dark:border-white rounded-sm"
                      >
                        <IoClose className="absolute w-[25px] h-[25px] text-black dark:text-white cursor-pointer" />
                      </div>
                    ) : (
                      <div
                        ref={selectedPlateformesRef}
                        onClick={() => toggleSelectedPlateformes(p.nom)}
                        className="w-[15px] h-[15px] bg-white dark:bg-gray-900 border border-black dark:border-white rounded-sm"
                      ></div>
                    )}
                  </div>
                  {menuConsoles === p.nom
                    ? p.consoles?.map((c, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <p className="text-black dark:text-white">{c}</p>
                          {selectedPlateformes === c ? (
                            <div
                              ref={selectedPlateformesRef}
                              onClick={() => toggleSelectedPlateformes(c)}
                              className="flex items-center justify-center w-[15px] h-[15px] bg-white dark:bg-gray-900 border border-black dark:border-white rounded-sm"
                            >
                              <IoClose className="absolute w-[25px] h-[25px] text-black dark:text-white cursor-pointer" />
                            </div>
                          ) : (
                            <div
                              ref={selectedPlateformesRef}
                              onClick={() => toggleSelectedPlateformes(c)}
                              className="w-[15px] h-[15px] bg-white dark:bg-gray-900 border border-black dark:border-white rounded-sm"
                            ></div>
                          )}
                        </div>
                      ))
                    : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          ref={menuPlateformesRef}
          className="w-[200px] flex flex-col justify-center items-center"
        >
          <div
            onClick={toggleMenuPlateformes}
            className="flex items-center gap-5 px-5 py-2.5 bg-white dark:bg-gray-900 border border-black dark:border-white rounded-xl"
          >
            <p>Plateformes</p>
            <FaChevronDown className="pt-0.5" />
          </div>
        </div>
      )}
    </>
  );
}
