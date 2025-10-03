import { useState } from "react";
import Modal from "./Modal";
import Bouton from "../Boutons/Bouton";
import { IoShieldCheckmark, IoAnalytics, IoSettings } from "react-icons/io5";

export default function CookieModal({
  isOpen,
  onAccept,
  onReject,
  onCustomize,
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Toujours activé
    analytics: false,
    functional: false,
    marketing: false,
  });

  const handleAcceptAll = () => {
    const allPreferences = {
      necessary: true,
      analytics: true,
      functional: true,
      marketing: true,
    };
    onAccept(allPreferences);
  };

  const handleRejectAll = () => {
    const minimalPreferences = {
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false,
    };
    onReject(minimalPreferences);
  };

  const handleCustomAccept = () => {
    onCustomize(preferences);
  };

  const togglePreference = (key) => {
    if (key === "necessary") return; // Les cookies nécessaires ne peuvent pas être désactivés
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} showCloseButton={false}>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <IoShieldCheckmark className="text-4xl text-primary-light dark:text-primary-dark" />
        </div>

        <h2 className="text-xl font-bold mb-4 text-main-text-light dark:text-main-text-dark">
          Gestion des cookies
        </h2>

        <p className="text-sm text-main-text-light dark:text-main-text-dark mb-6">
          Nous utilisons des cookies pour améliorer votre expérience sur notre
          site. Vous pouvez accepter tous les cookies ou personnaliser vos
          préférences.
        </p>

        {!showDetails ? (
          <div className="space-y-3">
            <div className="flex flex-col justify-center sm:flex-row gap-2">
              <Bouton text="Accepter tout" onClick={handleAcceptAll} />
              <Bouton text="Rejeter tout" onClick={handleRejectAll} />
            </div>
            <button
              onClick={() => setShowDetails(true)}
              className="text-primary-light dark:text-primary-dark underline text-sm cursor-pointer"
            >
              Personnaliser les préférences
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-left space-y-3">
              {/* Cookies nécessaires */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <IoSettings className="text-gray-600 dark:text-gray-300" />
                  <div>
                    <p className="font-medium text-sm">Cookies nécessaires</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Essentiels au fonctionnement du site
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.necessary}
                  disabled
                  className="w-4 h-4"
                />
              </div>

              {/* Cookies analytiques */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <IoAnalytics className="text-gray-600 dark:text-gray-300" />
                  <div>
                    <p className="font-medium text-sm">Cookies analytiques</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Nous aident à améliorer le site
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={() => togglePreference("analytics")}
                  className="w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Cookies fonctionnels */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <IoSettings className="text-gray-600 dark:text-gray-300" />
                  <div>
                    <p className="font-medium text-sm">Cookies fonctionnels</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Améliorent l'expérience utilisateur
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={() => togglePreference("functional")}
                  className="w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 pt-4">
              <Bouton text="Confirmer mes choix" onClick={handleCustomAccept} />
              <Bouton text="Retour" onClick={() => setShowDetails(false)} />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
