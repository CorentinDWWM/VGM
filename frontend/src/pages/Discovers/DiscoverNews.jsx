import { useRef } from "react";
import AffichesJeux from "../../components/Affiches/AffichesJeux";
import { games } from "../../games.json";

// Handler factory pour chaque scrollable
function useHorizontalScroll() {
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.classList.add("cursor-grabbing");
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    scrollRef.current.classList.remove("cursor-grabbing");
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  return { scrollRef, onMouseDown };
}

export default function DiscoverNews() {
  const scroll1 = useHorizontalScroll();
  const scroll2 = useHorizontalScroll();
  const scroll3 = useHorizontalScroll();

  return (
    <div className="w-full flex flex-col justify-center items-center gap-[30px] px-5 py-[30px]">
      <h2 className="text-black dark:text-white font-bold text-3xl text-center">
        Nouvelles sorties
      </h2>
      <div className="w-full flex flex-col gap-[15px] p-5 rounded-xl bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl shadow-black/10 dark:shadow-white/10">
        <p className="text-black dark:text-white font-semibold text-2xl">
          Cette semaine
        </p>
        <div
          className="w-full overflow-x-auto hide-scrollbar cursor-grabselect-none"
          ref={scroll1.scrollRef}
          onMouseDown={scroll1.onMouseDown}
        >
          <div className="flex items-center gap-[50px] min-w-max">
            {games.map((game, index) => (
              <AffichesJeux
                key={index}
                img={game.img}
                rating={game.rating}
                name={game.name}
                platforms={game.platforms}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-[15px] p-5">
        <p className="text-black dark:text-white font-semibold text-2xl">
          Ce mois-ci
        </p>
        <div
          className="w-full overflow-x-auto hide-scrollbar cursor-grab select-none"
          ref={scroll2.scrollRef}
          onMouseDown={scroll2.onMouseDown}
        >
          <div className="flex items-center gap-[50px] min-w-max">
            {games.map((game, index) => (
              <AffichesJeux
                key={index}
                img={game.img}
                rating={game.rating}
                name={game.name}
                platforms={game.platforms}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-[15px] p-5 rounded-xl bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl shadow-black/10 dark:shadow-white/10">
        <p className="text-black dark:text-white font-semibold text-2xl">
          Ces trois derniers mois
        </p>
        <div
          className="w-full overflow-x-auto hide-scrollbar cursor-grab select-none"
          ref={scroll3.scrollRef}
          onMouseDown={scroll3.onMouseDown}
        >
          <div className="flex items-center gap-[50px] min-w-max">
            {games.map((game, index) => (
              <AffichesJeux
                key={index}
                img={game.img}
                rating={game.rating}
                name={game.name}
                platforms={game.platforms}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
