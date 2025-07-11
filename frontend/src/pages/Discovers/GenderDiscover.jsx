import { useParams } from "react-router-dom";
import { genres } from "../../genres.json";
import { useEffect, useState } from "react";
import { games } from "../../games.json";
import AffichesJeux from "../../components/Affiches/AffichesJeux";

export default function GenderDiscover() {
  const { id } = useParams();
  const [genre, setGenre] = useState({});

  useEffect(() => {
    const findGenre = () => {
      setGenre(genres.find((g) => g.id === Number(id)));
    };
    findGenre();
  }, [genre]);

  return (
    <div className="w-full flex flex-col items-center pb-5">
      <div className="w-full h-full flex flex-col gap-[30px] max-sm:px-[50px] px-[100px] pt-[30px]">
        <div className="flex flex-col items-center gap-[5px]">
          <h2 className="text-black dark:text-white font-bold text-3xl text-center">
            Explorez par genre
          </h2>
          <p className="font-semibold text-center">
            Genre :{" "}
            <span className="text-primary-light dark:text-primary-dark">
              {genre.nom}
            </span>
          </p>
          <p className="text-secondary-text-light dark:text-secondary-text-dark text-center">
            {genre.nb_jeux} jeux
          </p>
        </div>
        <div className="w-full h-full flex flex-wrap justify-center gap-[30px]">
          {games.map((game, index) => (
            <>
              <AffichesJeux
                key={index}
                img={game.img}
                rating={game.rating}
                name={game.name}
                platforms={game.platforms}
              />
              <AffichesJeux
                key={index + 100}
                img={game.img}
                rating={game.rating}
                name={game.name}
                platforms={game.platforms}
              />
              <AffichesJeux
                key={index + 1000}
                img={game.img}
                rating={game.rating}
                name={game.name}
                platforms={game.platforms}
              />
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
