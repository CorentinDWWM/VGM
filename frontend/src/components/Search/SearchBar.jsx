import { Search } from "lucide-react";
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../context/DataContext";

export default function SearchBar() {
  const { allGamesSimplified } = useContext(DataContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGames, setFilteredGames] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredGames([]);
      setShowResults(false);
      return;
    }

    const filtered = allGamesSimplified.filter((game) =>
      game.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    setFilteredGames(filtered.slice(0, 10)); // Limit to 10 results
    setShowResults(true);
  }, [searchTerm, allGamesSimplified]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleGameSelect = (game) => {
    setSearchTerm("");
    setShowResults(false);
    navigate(`/games/${game.igdbID}`);
  };

  return (
    <div className="relative max-w-[300px] w-full" ref={searchRef}>
      <div className="bg-white dark:bg-gray-900 border dark:border-white flex justify-between items-center p-2.5 rounded-md">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm && setShowResults(true)}
          className="placeholder:text-secondary-text-light dark:text-secondary-text-dark outline-none bg-transparent w-full"
        />
        <Search className="cursor-pointer text-black dark:text-white" />
      </div>

      {showResults && filteredGames.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {filteredGames.map((game) => (
            <div
              key={game._id}
              onClick={() => handleGameSelect(game)}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b last:border-b-0 dark:border-gray-600"
            >
              <span className="text-main-text-light dark:text-main-text-dark">
                {game.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
