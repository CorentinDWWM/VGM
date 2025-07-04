import React, { useRef } from "react";
import AffichesJeux from "../../components/Affiches/AffichesJeux";
import HeaderUser from "../../components/Profil/HeaderUser";
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

export default function LibraryUser() {
  // Un hook par scrollable
  const scroll1 = useHorizontalScroll();
  const scroll2 = useHorizontalScroll();
  const scroll3 = useHorizontalScroll();

  return (
    <div className="flex flex-col gap-5 border border-black mx-24 my-12 max-sm:mx-8 max-sm:my-0">
      <HeaderUser />
      <h2 className="text-center text-2xl max-sm:text-lg font-bold">
        Ma bibliothèque
      </h2>
      <div className="flex max-xl:flex-col max-xl:items-center justify-evenly max-xl:gap-10 px-10">
        <div className="w-full flex flex-col gap-[50px] overflow-hidden">
          <div className="w-full flex flex-col gap-5">
            <h3>Jeux dans ma bibliothèque</h3>
            <div
              className="w-full overflow-x-auto hide-scrollbar cursor-grab"
              ref={scroll1.scrollRef}
              onMouseDown={scroll1.onMouseDown}
              style={{ minHeight: 250 }}
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
          <div className="w-full flex flex-col gap-5">
            <h3>Jeux dans ma bibliothèque</h3>
            <div
              className="w-full overflow-x-auto hide-scrollbar cursor-grab"
              ref={scroll2.scrollRef}
              onMouseDown={scroll2.onMouseDown}
              style={{ minHeight: 250 }}
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
          <div className="w-full flex flex-col gap-5">
            <h3>Jeux dans ma bibliothèque</h3>
            <div
              className="w-full overflow-x-auto hide-scrollbar cursor-grab"
              ref={scroll3.scrollRef}
              onMouseDown={scroll3.onMouseDown}
              style={{ minHeight: 250 }}
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
      </div>
    </div>
  );
}
