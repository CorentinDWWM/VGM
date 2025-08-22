import { useContext, useRef } from "react";
import AffichesJeux from "../../components/Affiches/AffichesJeux";
import HeaderUser from "../../components/Profil/HeaderUser";
import { games } from "../../games.json";
import { AuthContext } from "../../context/AuthContext";
import Bouton from "../../components/Boutons/Bouton";
import { useNavigate } from "react-router-dom";

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
  const { user } = useContext(AuthContext);
  // Un hook par scrollable
  const scroll1 = useHorizontalScroll();
  const scroll2 = useHorizontalScroll();
  const scroll3 = useHorizontalScroll();

  const navigate = useNavigate();
  const handleClickToDiscorver = () => {
    navigate("/games");
  };

  return (
    <div className="flex flex-col gap-5 border border-black dark:border-white mx-24 my-12 max-sm:m-8">
      <HeaderUser />
      <h2 className="text-center text-2xl max-sm:text-lg font-bold">
        Ma bibliothèque
      </h2>
      <div className="flex max-xl:flex-col max-xl:items-center justify-evenly max-xl:gap-10 px-10 pb-10 max-sm:px-5">
        {user.games && user.games.length >= 1 ? (
          <div className="w-full flex flex-col gap-[25px]">
            <div className="w-full flex flex-col gap-5">
              <h3 className="text-primary-light dark:text-primary-dark font-medium">
                Jeux dans ma bibliothèque :
              </h3>
              <div
                className="w-full overflow-x-auto hide-scrollbar cursor-grab pb-10 select-none"
                ref={scroll1.scrollRef}
                onMouseDown={scroll1.onMouseDown}
              >
                <div className="flex items-center gap-[50px] min-w-max">
                  {user.games &&
                    user.games.map((game) => (
                      <AffichesJeux key={game._id} game={game} />
                    ))}
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-5">
              <h3 className="text-primary-light dark:text-primary-dark font-medium">
                Jeux terminés :
              </h3>
              <div
                className="w-full overflow-x-auto hide-scrollbar cursor-grab pb-10 select-none"
                ref={scroll2.scrollRef}
                onMouseDown={scroll2.onMouseDown}
              >
                <div className="flex items-center gap-[50px] min-w-max">
                  {user.games &&
                    user.games
                      .filter((game) => game.statusUser === "Terminé")
                      .map((game) => (
                        <AffichesJeux key={game._id} game={game} />
                      ))}
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-5">
              <h3 className="text-primary-light dark:text-primary-dark font-medium">
                Jeux en cours :
              </h3>
              <div
                className="w-full overflow-x-auto hide-scrollbar cursor-grab pb-10 select-none"
                ref={scroll3.scrollRef}
                onMouseDown={scroll3.onMouseDown}
              >
                <div className="flex items-center gap-[50px] min-w-max">
                  {user.games &&
                    user.games
                      .filter((game) => game.statusUser === "En cours")
                      .map((game) => (
                        <AffichesJeux key={game._id} game={game} />
                      ))}
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-5">
              <h3 className="text-primary-light dark:text-primary-dark font-medium">
                Jeux abandonnés :
              </h3>
              <div
                className="w-full overflow-x-auto hide-scrollbar cursor-grab pb-10 select-none"
                ref={scroll3.scrollRef}
                onMouseDown={scroll3.onMouseDown}
              >
                <div className="flex items-center gap-[50px] min-w-max">
                  {user.games &&
                    user.games
                      .filter((game) => game.statusUser === "Abandonné")
                      .map((game) => (
                        <AffichesJeux key={game._id} game={game} />
                      ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Bouton text="Découvrez nos jeux" onClick={handleClickToDiscorver} />
        )}
      </div>
    </div>
  );
}
