export const COOKIE_CONSENT_KEY = "vgm_cookie_consent";
export const COOKIE_PREFERENCES_KEY = "vgm_cookie_preferences";

export const cookieManager = {
  // Vérifie si l'utilisateur a déjà donné son consentement
  hasConsent: () => {
    return localStorage.getItem(COOKIE_CONSENT_KEY) === "true";
  },

  // Enregistre le consentement
  setConsent: (preferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));
    localStorage.setItem("vgm_consent_date", new Date().toISOString());
  },

  // Récupère les préférences
  getPreferences: () => {
    const preferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    return preferences
      ? JSON.parse(preferences)
      : {
          necessary: true,
          analytics: false,
          functional: false,
          marketing: false,
        };
  },

  // Supprime le consentement (pour reset)
  clearConsent: () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    localStorage.removeItem(COOKIE_PREFERENCES_KEY);
    localStorage.removeItem("vgm_consent_date");
  },

  // Vérifie si un type de cookie est autorisé
  isAllowed: (cookieType) => {
    const preferences = cookieManager.getPreferences();
    return preferences[cookieType] || false;
  },

  // Fonctions pour différents types de cookies
  analytics: {
    track: (event, data) => {
      if (cookieManager.isAllowed("analytics")) {
        // Ici tu peux intégrer Google Analytics, Matomo, etc.
        console.log("Analytics tracking:", event, data);
      }
    },
  },

  functional: {
    saveUserPreference: (key, value) => {
      if (cookieManager.isAllowed("functional")) {
        localStorage.setItem(`vgm_pref_${key}`, value);
      }
    },

    getUserPreference: (key) => {
      if (cookieManager.isAllowed("functional")) {
        return localStorage.getItem(`vgm_pref_${key}`);
      }
      return null;
    },
  },

  // Fonction pour déclencher la réouverture de la modal
  _modalCallbacks: [],

  onModalOpen: (callback) => {
    cookieManager._modalCallbacks.push(callback);
  },

  offModalOpen: (callback) => {
    cookieManager._modalCallbacks = cookieManager._modalCallbacks.filter(
      (cb) => cb !== callback
    );
  },

  openModal: () => {
    cookieManager._modalCallbacks.forEach((callback) => callback());
  },

  // Fonction pour gérer les cookies depuis n'importe où
  reopenCookieSettings: () => {
    cookieManager.openModal();
  },

  resetConsent: () => {
    cookieManager.clearConsent();
    cookieManager.openModal();
  },
};
