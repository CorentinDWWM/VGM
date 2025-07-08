import Genres from "../../components/Menu/Filtres/Genres";
import Plateformes from "../../components/Menu/Filtres/Plateformes";

export default function GamesPage() {
  return (
    <div className="h-screen flex flex-col items-center pb-5">
      <div className="w-full flex items-center justify-center py-2.5 bg-white dark:bg-gray-900 border-t border-black dark:border-white shadow-xl dark:shadow-white/10">
        <Genres />
        <Plateformes />
      </div>
    </div>
  );
}
