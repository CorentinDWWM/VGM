import { useContext } from "react";
import { FaChevronDown } from "react-icons/fa";
import { MenuContext } from "../../../context/MenuContext";

export default function Plateformes() {
  const { menuPlateformes, toggleMenuPlateformes, menuPlateformesRef } =
    useContext(MenuContext);
  return (
    <div className="w-[200px] flex flex-col justify-center items-center">
      <div
        ref={menuPlateformesRef}
        onClick={toggleMenuPlateformes}
        className="flex items-center gap-5 px-5 py-2.5 bg-white dark:bg-gray-900 border border-black dark:border-white rounded-xl"
      >
        <p>Plateformes</p>
        <FaChevronDown className="pt-0.5" />
      </div>
    </div>
  );
}
