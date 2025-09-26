import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AffichesJeux from "../../components/Affiches/AffichesJeux";
import { DataContext } from "../../context/DataContext";

export default function GenderDiscover() {
  const { id } = useParams();
  const { genres, games } = useContext(DataContext);
  const [genre, setGenre] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findGenre = () => {
      if (genres && genres.length > 0) {
        const foundGenre = genres.find((g) => g.igdbID === parseInt(id));
        if (foundGenre) {
          setGenre(foundGenre);
          // console.log("Genre trouvé :", foundGenre);
        }
        setLoading(false);
      }
    };
    findGenre();
  }, [id, genres]);

  if (loading || !genres) {
    return (
      <div className="w-full flex flex-col items-center pb-5">
        <div className="w-full h-full flex flex-col gap-[30px] max-sm:px-[50px] px-[100px] pt-[30px]">
          <div className="flex flex-col items-center gap-[5px]">
            <h2 className="text-black dark:text-white font-bold text-3xl text-center">
              Chargement...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (!genre || !genre.name) {
    return (
      <div className="w-full flex flex-col items-center pb-5">
        <div className="w-full h-full flex flex-col gap-[30px] max-sm:px-[50px] px-[100px] pt-[30px]">
          <div className="flex flex-col items-center gap-[5px]">
            <h2 className="text-black dark:text-white font-bold text-3xl text-center">
              Genre non trouvé
            </h2>
          </div>
        </div>
      </div>
    );
  }

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
              {genre.name}
            </span>
          </p>
          <p className="text-secondary-text-light dark:text-secondary-text-dark text-center">
            {genre.nb_jeux} jeux
          </p>
        </div>
        <div className="w-full h-full flex flex-wrap justify-center gap-[30px]">
          {games
            .filter(
              (game) =>
                game.genre &&
                Array.isArray(game.genre) &&
                game.genre.some((g) => g.id === genre.igdbID)
            )
            .map((game, index) => (
              <AffichesJeux key={index} game={game} />
            ))}
        </div>
      </div>
    </div>
  );
}
