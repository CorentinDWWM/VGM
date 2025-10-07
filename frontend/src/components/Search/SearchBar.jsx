import { Search } from "lucide-react";
import { useContext, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../context/DataContext";

export default function SearchBar() {
  const { allGamesSimplified } = useContext(DataContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGames, setFilteredGames] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchRef = useRef(null);

  // Fonction de recherche optimisée avec useCallback
  const searchGames = useCallback(
    (term) => {
      if (!term.trim()) {
        setFilteredGames([]);
        setShowResults(false);
        return;
      }

      // Ne faire la recherche que si on a des données et qu'on a commencé à chercher
      if (allGamesSimplified?.length > 0) {
        const filtered = allGamesSimplified
          .filter((game) =>
            game.name.toLowerCase().startsWith(term.toLowerCase())
          )
          .slice(0, 10);
        setFilteredGames(filtered);
        setShowResults(true);
      }
    },
    [allGamesSimplified]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Marquer qu'on a commencé à chercher
    if (!hasSearched && value.trim()) {
      setHasSearched(true);
    }

    // Rechercher seulement si on a déjà commencé une recherche
    if (hasSearched || value.trim()) {
      searchGames(value);
    }
  };

  const handleInputFocus = () => {
    if (searchTerm.trim()) {
      setHasSearched(true);
      searchGames(searchTerm);
    }
  };

  const handleGameSelect = (game) => {
    setSearchTerm("");
    setShowResults(false);
    setHasSearched(false);
    navigate(`/games/${game.igdbID}`);
  };

  // Gérer les clics en dehors
  const handleClickOutside = useCallback(
    (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    },
    [searchRef]
  );

  // Ajouter/supprimer l'event listener seulement quand nécessaire
  useState(() => {
    if (showResults) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showResults, handleClickOutside]);

  return (
    <div className="relative max-w-[300px] w-full" ref={searchRef}>
      <div className="bg-white dark:bg-gray-900 border dark:border-white flex justify-between items-center p-2.5 rounded-md">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="placeholder:text-secondary-text-light dark:text-secondary-text-dark outline-none bg-transparent w-full"
        />
        <Search className="cursor-pointer text-black dark:text-white" />
      </div>

      {showResults && hasSearched && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <div
                key={game._id}
                onClick={() => handleGameSelect(game)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b last:border-b-0 dark:border-gray-600 flex items-center gap-2"
              >
                <img
                  src={
                    game.cover && typeof game.cover === "string"
                      ? game.cover
                      : game.cover?.image_id
                      ? `https://images.igdb.com/igdb/image/upload/t_thumb/${game.cover.image_id}.jpg`
                      : "/placeholder-game.png"
                  }
                  alt={game.name}
                  className="w-8 h-8 object-cover rounded flex-shrink-0"
                  onError={(e) => {
                    if (
                      e.target.src !==
                      window.location.origin + "/placeholder-game.png"
                    ) {
                      e.target.src = "/placeholder-game.png";
                    }
                  }}
                />
                <span className="text-main-text-light dark:text-main-text-dark text-sm truncate">
                  {game.name}
                </span>
              </div>
            ))
          ) : (
            <div className="p-2 text-secondary-text-light dark:text-secondary-text-dark text-sm text-center">
              Aucun jeu ne correspond à cette recherche
            </div>
          )}
        </div>
      )}
    </div>
  );
}
