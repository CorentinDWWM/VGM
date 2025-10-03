import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t h-[82px] w-full flex items-center justify-center border-black py-4 px-2 text-main-text-light dark:text-main-text-dark dark:border-white max-sm:text-xs text-center">
      <div className="flex flex-col items-center space-y-2">
        <p>
          © 2025 Video Games Manager — Un projet passionné pour les joueurs.
        </p>
        <div className="flex space-x-4 text-xs">
          <Link
            to="/politique-confidentialite"
            className="hover:underline transition-colors duration-200"
          >
            Politique de Confidentialité
          </Link>
          <span>|</span>
          <Link
            to="/mentions-legales"
            className="hover:underline transition-colors duration-200"
          >
            Mentions Légales
          </Link>
        </div>
      </div>
    </footer>
  );
}
