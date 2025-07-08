import { useState } from "react";
import Bouton from "../Boutons/Bouton";

export default function AffichesJeux({ name, rating, platforms, img }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="h-[250px] w-[170px] relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={img}
        alt={name}
        className="w-full h-full object-cover border border-black dark:border-white shadow-xl dark:shadow-white/10"
      />
      {isHovered && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-end gap-2.5 max-sm:gap-0">
          {/* Note */}
          <div className="flex flex-col justify-center items-end gap-2.5 p-2.5">
            <div className="w-[40px] h-[40px] max-sm:w-[35px] max-sm:h-[35px] bg-primary-light rounded-3xl border border-black flex justify-center items-center">
              <p className="text-xs max-sm:text-[10px] text-white">
                {rating}/10
              </p>
            </div>
          </div>
          {/* Info jeu */}
          <div className="w-full h-fit flex flex-col justify-center items-center gap-2.5 px-2.5">
            <p className="text-sm max-sm:text-xs font-bold text-center text-white underline">
              {name}
            </p>
            <p className="text-xs max-sm:text-[10px] text-center text-white">
              Disponible sur : <br /> {platforms?.join(", ")}
            </p>
            <Bouton text="En savoir plus sur le jeu" textStyle="text-[10px]" />
          </div>
        </div>
      )}
    </div>
  );
}
