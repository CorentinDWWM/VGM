import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cookieManager } from "../../utils/cookieManager";
import Bouton from "../../components/Boutons/Bouton";
import {
  IoShieldCheckmark,
  IoAnalytics,
  IoSettings,
  IoArrowBack,
} from "react-icons/io5";

export default function CookiePreferences() {
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    functional: false,
  });

  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    // Charger les préférences actuelles
    const currentPreferences = cookieManager.getPreferences();
    setPreferences(currentPreferences);
  }, []);

  const togglePreference = (key) => {
    if (key === "necessary") return; // Les cookies nécessaires ne peuvent pas être désactivés
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    try {
      await cookieManager.setConsent(preferences);
      setIsSaved(true);
      setSaveMessage("Vos préférences ont été sauvegardées avec succès !");
      setTimeout(() => {
        setIsSaved(false);
        setSaveMessage("");
      }, 3000);
    } catch (error) {
      setIsSaved(true);
      setSaveMessage(
        "Préférences sauvegardées localement (connexion requise pour sauvegarder en ligne)"
      );
      setTimeout(() => {
        setIsSaved(false);
        setSaveMessage("");
      }, 4000);
    }
  };

  const handleAcceptAll = async () => {
    const allPreferences = {
      necessary: true,
      analytics: true,
      functional: true,
    };
    setPreferences(allPreferences);
    try {
      await cookieManager.setConsent(allPreferences);
      setIsSaved(true);
      setSaveMessage("Tous les cookies ont été acceptés !");
      setTimeout(() => {
        setIsSaved(false);
        setSaveMessage("");
      }, 3000);
    } catch (error) {
      setIsSaved(true);
      setSaveMessage(
        "Cookies acceptés localement (connexion requise pour sauvegarder en ligne)"
      );
      setTimeout(() => {
        setIsSaved(false);
        setSaveMessage("");
      }, 4000);
    }
  };

  const handleRejectAll = async () => {
    const minimalPreferences = {
      necessary: true,
      analytics: false,
      functional: false,
    };
    setPreferences(minimalPreferences);
    try {
      await cookieManager.setConsent(minimalPreferences);
      setIsSaved(true);
      setSaveMessage("Seuls les cookies nécessaires ont été conservés !");
      setTimeout(() => {
        setIsSaved(false);
        setSaveMessage("");
      }, 3000);
    } catch (error) {
      setIsSaved(true);
      setSaveMessage(
        "Cookies rejetés localement (connexion requise pour sauvegarder en ligne)"
      );
      setTimeout(() => {
        setIsSaved(false);
        setSaveMessage("");
      }, 4000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Lien de retour */}
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary-light dark:text-primary-dark hover:underline"
        >
          <IoArrowBack />
          Retour à l'accueil
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <IoShieldCheckmark className="text-3xl text-primary-light dark:text-primary-dark" />
        <h1 className="text-3xl font-bold text-main-text-light dark:text-main-text-dark">
          Préférences des cookies
        </h1>
      </div>

      <div className="mb-8">
        <p className="text-main-text-light dark:text-main-text-dark mb-4">
          Nous utilisons des cookies pour améliorer votre expérience sur notre
          site. Vous pouvez choisir quels types de cookies vous souhaitez
          accepter.
        </p>
        <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
          Les cookies nécessaires sont toujours activés car ils sont essentiels
          au fonctionnement du site.
        </p>
      </div>

      {isSaved && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
          <p className="text-green-800 dark:text-green-200 font-medium">
            ✅ {saveMessage}
          </p>
        </div>
      )}

      <div className="space-y-6 mb-8">
        {/* Cookies nécessaires */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <IoSettings className="text-2xl text-gray-600 dark:text-gray-300" />
              <div>
                <h3 className="text-lg font-semibold text-main-text-light dark:text-main-text-dark">
                  Cookies nécessaires
                </h3>
                <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
                  Essentiels au fonctionnement du site
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                Toujours activé
              </span>
              <input
                type="checkbox"
                checked={preferences.necessary}
                disabled
                className="w-5 h-5"
              />
            </div>
          </div>
          <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
            Ces cookies permettent au site de fonctionner correctement. Ils
            incluent l'authentification, la sécurité et les fonctionnalités de
            base. Ils ne peuvent pas être désactivés.
          </p>
        </div>

        {/* Cookies analytiques */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <IoAnalytics className="text-2xl text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-main-text-light dark:text-main-text-dark">
                  Cookies analytiques
                </h3>
                <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
                  Nous aident à améliorer le site
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.analytics}
              onChange={() => togglePreference("analytics")}
              className="w-5 h-5 cursor-pointer"
            />
          </div>
          <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
            Ces cookies nous permettent de mesurer l'audience, de comprendre
            comment vous utilisez le site et d'identifier les pages les plus
            populaires pour améliorer nos services.
          </p>
        </div>

        {/* Cookies fonctionnels */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <IoSettings className="text-2xl text-green-600 dark:text-green-400" />
              <div>
                <h3 className="text-lg font-semibold text-main-text-light dark:text-main-text-dark">
                  Cookies fonctionnels
                </h3>
                <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
                  Améliorent l'expérience utilisateur
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.functional}
              onChange={() => togglePreference("functional")}
              className="w-5 h-5 cursor-pointer"
            />
          </div>
          <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
            Ces cookies mémorisent vos préférences (thème sombre/clair, langue,
            paramètres d'affichage) pour personnaliser votre expérience sur le
            site.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <Bouton text="Sauvegarder mes préférences" onClick={handleSave} />
        <Bouton text="Accepter tout" onClick={handleAcceptAll} />
        <Bouton text="Rejeter tout" onClick={handleRejectAll} />
      </div>

      {/* Liens vers d'autres pages RGPD */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-semibold text-main-text-light dark:text-main-text-dark mb-4">
          Informations légales
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/politique-confidentialite"
            className="text-primary-light dark:text-primary-dark hover:underline"
          >
            Politique de confidentialité
          </Link>
          <Link
            to="/mentions-legales"
            className="text-primary-light dark:text-primary-dark hover:underline"
          >
            Mentions légales
          </Link>
        </div>
      </div>
    </div>
  );
}
