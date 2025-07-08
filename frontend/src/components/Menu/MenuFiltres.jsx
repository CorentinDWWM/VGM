import Genres from "./Filtres/Genres";
import Plateformes from "./Filtres/Plateformes";

export default function MenuFiltres() {
  return (
    <div className="w-full flex items-center justify-center">
      <Genres />
      <Plateformes />
    </div>
  );
}
