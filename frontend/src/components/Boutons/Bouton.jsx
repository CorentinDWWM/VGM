export default function Bouton({ text, onClick, textStyle, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-fit h-fit flex justify-center items-center bg-primary-light text-white hover:bg-primary-dark hover:text-black gap-2.5 px-5 py-2 max-sm:px-2.5 max-sm:py-1 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
        textStyle || ""
      }`}
    >
      {text}
    </button>
  );
}
