export default function Bouton({ text, textStyle }) {
  return (
    <button
      className={`w-fit h-fit flex justify-center items-center bg-primary-light text-white hover:bg-primary-dark hover:text-black gap-2.5 px-5 py-2 max-sm:px-2.5 max-sm:py-1 rounded-xl cursor-pointer ${textStyle}`}
    >
      {text}
    </button>
  );
}
