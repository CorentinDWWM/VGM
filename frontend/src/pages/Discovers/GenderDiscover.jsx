import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AffichesJeux from "../../components/Affiches/AffichesJeux";
import { DataContext } from "../../context/DataContext";

export default function GenderDiscover() {
  const { id } = useParams();
  const { genres, getGamesByGenreId } = useContext(DataContext);
  const [genre, setGenre] = useState({});
  const [loading, setLoading] = useState(true);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(false);

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

  useEffect(() => {
    const loadGamesByGenre = async () => {
      if (genre.igdbID) {
        setLoadingGames(true);
        try {
          const games = await getGamesByGenreId(genre.igdbID);
          // console.log(`Jeux récupérés pour le genre ${genre.name}:`, games);

          // Sanitiser les données de manière très agressive
          const sanitizedGames = games.map((game, index) => {
            const sanitized = {};

            // Copier tous les champs en les sanitisant
            Object.keys(game).forEach((key) => {
              const value = game[key];

              // Si c'est un nombre ou devrait être un nombre
              if (
                typeof value === "number" ||
                [
                  "rating",
                  "rating_count",
                  "total_rating",
                  "total_rating_count",
                  "igdbID",
                  "first_release_date",
                ].includes(key)
              ) {
                if (
                  value === null ||
                  value === undefined ||
                  isNaN(Number(value))
                ) {
                  sanitized[key] = key === "first_release_date" ? null : 0;
                } else {
                  sanitized[key] = Number(value);
                }
              }
              // Si c'est une chaîne de caractères
              else if (
                typeof value === "string" ||
                ["name", "summary", "slug", "url"].includes(key)
              ) {
                sanitized[key] = value || "";
              }
              // Pour les autres types (objets, tableaux, etc.)
              else {
                sanitized[key] = value || null;
              }
            });

            // S'assurer que les champs essentiels existent
            sanitized._id = sanitized._id || `temp_${index}`;
            sanitized.name = sanitized.name || "Nom non disponible";
            sanitized.rating = Number(sanitized.rating) || 0;
            sanitized.rating_count = Number(sanitized.rating_count) || 0;
            sanitized.total_rating = Number(sanitized.total_rating) || 0;
            sanitized.total_rating_count =
              Number(sanitized.total_rating_count) || 0;
            sanitized.igdbID = Number(sanitized.igdbID) || 0;

            // Log pour déboguer
            // console.log(`Jeu ${index} sanitisé:`, sanitized);

            return sanitized;
          });

          // console.log("Tous les jeux sanitisés:", sanitizedGames);
          setFilteredGames(sanitizedGames);
        } catch (error) {
          console.error("Erreur lors du chargement des jeux:", error);
          setFilteredGames([]);
        } finally {
          setLoadingGames(false);
        }
      }
    };

    loadGamesByGenre();
  }, [genre.igdbID, getGamesByGenreId]);

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
            {loadingGames
              ? "Chargement..."
              : `${filteredGames.length} jeux trouvés`}
          </p>
        </div>
        <div className="w-full h-full flex flex-wrap justify-center gap-[30px]">
          {loadingGames ? (
            <p className="text-secondary-text-light dark:text-secondary-text-dark text-center">
              Chargement des nouveautés...
            </p>
          ) : filteredGames.length > 0 ? (
            filteredGames.map((game, index) => (
              <AffichesJeux key={game._id || index} game={game} />
            ))
          ) : (
            <p className="text-secondary-text-light dark:text-secondary-text-dark text-center">
              Aucun jeu trouvé pour ce genre.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
