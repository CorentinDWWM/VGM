import { useContext, useEffect } from "react";
import { MenuContext } from "../../context/MenuContext";

export default function MenuNotification({ onSelect }) {
  const { menuNotif, toggleMenuNotif, menuNotifRef } = useContext(MenuContext);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1000 && menuNotif) {
        toggleMenuNotif();
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [menuNotif, toggleMenuNotif]);
  return (
    <div
      ref={menuNotifRef}
      className="absolute z-50 top-[60px] right-16 flex flex-col gap-4 p-4 bg-white dark:bg-gray-900 border border-black dark:border-white rounded-lg w-[200px] text-center"
    >
      <p>Menu en cours de développement</p>
    </div>
  );
}
