import { Link } from "react-router-dom";

export default function Bouton({
  text,
  onClick,
  navigation,
  textStyle,
  disabled = false,
}) {
  return (
    <>
      {navigation ? (
        <Link
          to={navigation}
          disabled={disabled}
          onClick={onClick}
          className={`min-w-[150px] w-fit h-fit flex justify-center items-center bg-primary-light hover:bg-primary-dark text-white hover:text-black dark:bg-primary-dark dark:hover:bg-primary-light dark:text-black dark:hover:text-white gap-2.5 px-5 py-2 max-sm:px-2.5 max-sm:py-1 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
            textStyle || ""
          }`}
        >
          {text}
        </Link>
      ) : (
        <button
          onClick={onClick}
          disabled={disabled}
          className={`min-w-[150px] w-fit h-fit flex justify-center items-center bg-primary-light text-white hover:bg-primary-dark hover:text-black dark:bg-primary-dark dark:hover:bg-primary-light dark:text-black dark:hover:text-white gap-2.5 px-5 py-2 max-sm:px-2.5 max-sm:py-1 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
            textStyle || ""
          }`}
        >
          {text}
        </button>
      )}
    </>
  );
}
