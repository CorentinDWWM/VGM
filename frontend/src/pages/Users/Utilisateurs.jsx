// App.jsx
import { useState, useEffect } from "react";
import TrainerCard from "../../components/TrainerCard/TrainerCard";

export default function Utilisateurs() {
  //   const [bootDone, setBootDone] = useState(false);

  //   useEffect(() => {
  //     const timer = setTimeout(() => setBootDone(true), 5000); // durée de l'animation
  //     return () => clearTimeout(timer);
  //   }, []);

  return (
    <>
      <div>
        <TrainerCard />
      </div>
    </>
    // <div className="w-full h-screen bg-gray-900 flex justify-center items-center">
    //   <div
    //     className="relative w-[800px] h-[700px] bg-center bg-no-repeat bg-contain"
    //     style={{ backgroundImage: "url(/3ds.jpg)" }}
    //   >
    //     {/* Écran du haut */}
    //     <div className="absolute top-[145px] left-[250px] w-[295px] h-[185px] bg-black overflow-hidden rounded-md shadow-inner">
    //       {!bootDone ? (
    //         <video
    //           src="/3ds_animation.mp4"
    //           autoPlay
    //           muted
    //           className="w-full h-full object-cover"
    //         />
    //       ) : (
    //         <TrainerCard />
    //       )}
    //     </div>

    //     {/* Écran du bas — optionnel */}
    //     <div className="absolute top-[370px] left-[250px] w-[280px] h-[210px] bg-black rounded-md flex items-center justify-center text-white text-xs font-mono">
    //       {bootDone ? <span>Bienvenue, Méri !</span> : null}
    //     </div>
    //   </div>
    // </div>
  );
}
