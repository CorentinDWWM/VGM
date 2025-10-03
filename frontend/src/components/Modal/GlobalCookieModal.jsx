import { useState, useEffect } from "react";
import CookieModal from "./CookieModal";
import { cookieManager } from "../../utils/cookieManager";

export default function GlobalCookieModal() {
  const [showCookieModal, setShowCookieModal] = useState(false);

  useEffect(() => {
    // Vérifie si l'utilisateur n'a pas encore donné son consentement
    if (!cookieManager.hasConsent()) {
      // Affiche la modal après un petit délai pour une meilleure UX
      const timer = setTimeout(() => {
        setShowCookieModal(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleCookieAccept = (preferences) => {
    cookieManager.setConsent(preferences);
    setShowCookieModal(false);

    // Track l'acceptation si les analytics sont autorisés
    if (preferences.analytics) {
      cookieManager.analytics.track("cookie_consent", { action: "accept_all" });
    }
  };

  const handleCookieReject = (preferences) => {
    cookieManager.setConsent(preferences);
    setShowCookieModal(false);
  };

  const handleCookieCustomize = (preferences) => {
    cookieManager.setConsent(preferences);
    setShowCookieModal(false);

    // Track la personnalisation si les analytics sont autorisés
    if (preferences.analytics) {
      cookieManager.analytics.track("cookie_consent", {
        action: "customize",
        preferences,
      });
    }
  };

  return (
    <CookieModal
      isOpen={showCookieModal}
      onAccept={handleCookieAccept}
      onReject={handleCookieReject}
      onCustomize={handleCookieCustomize}
    />
  );
}
