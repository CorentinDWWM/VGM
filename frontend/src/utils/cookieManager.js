import { updateCookiePreferences } from "../apis/auth.api";

export const COOKIE_CONSENT_KEY = "vgm_cookie_consent";
export const COOKIE_PREFERENCES_KEY = "vgm_cookie_preferences";

// Utility functions for cookie management
const setCookie = (
  name,
  value,
  days = 365,
  sameSite = "Lax",
  secure = false
) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  let cookieString = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires.toUTCString()}; path=/; SameSite=${sameSite}`;

  // En production, utiliser Secure
  if (secure || window.location.protocol === "https:") {
    cookieString += "; Secure";
  }

  document.cookie = cookieString;
};

const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
};

const deleteCookie = (name) => {
  setCookie(name, "", -1);
};

export const cookieManager = {
  // Vérifie si l'utilisateur a déjà donné son consentement
  hasConsent: () => {
    return getCookie(COOKIE_CONSENT_KEY) === "true";
  },

  // Enregistre le consentement
  setConsent: async (preferences) => {
    const isSecure = window.location.protocol === "https:";

    setCookie(COOKIE_CONSENT_KEY, "true", 365, "Lax", isSecure);
    setCookie(
      COOKIE_PREFERENCES_KEY,
      JSON.stringify(preferences),
      365,
      "Lax",
      isSecure
    );
    setCookie(
      "vgm_consent_date",
      new Date().toISOString(),
      365,
      "Lax",
      isSecure
    );

    // Fallback localStorage pour les préférences fonctionnelles si autorisées
    if (preferences.functional) {
      localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));
      localStorage.setItem("vgm_consent_date", new Date().toISOString());
    }

    // Sauvegarder en base de données si l'utilisateur est connecté
    try {
      await updateCookiePreferences(preferences);
      console.log("✅ Préférences cookies sauvegardées en base de données");
    } catch (error) {
      console.log(
        "⚠️ Impossible de sauvegarder en base (utilisateur non connecté ou erreur):",
        error
      );
      // On continue même si ça échoue, les cookies locaux suffisent
    }
  },

  // Récupère les préférences
  getPreferences: () => {
    const preferences = getCookie(COOKIE_PREFERENCES_KEY);
    return preferences
      ? JSON.parse(preferences)
      : {
          necessary: true,
          analytics: false,
          functional: false,
        };
  },

  // Supprime le consentement (pour reset)
  clearConsent: async () => {
    deleteCookie(COOKIE_CONSENT_KEY);
    deleteCookie(COOKIE_PREFERENCES_KEY);
    deleteCookie("vgm_consent_date");

    // Nettoyer aussi le localStorage
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    localStorage.removeItem(COOKIE_PREFERENCES_KEY);
    localStorage.removeItem("vgm_consent_date");

    // Supprimer tous les cookies de préférences utilisateur
    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      if (name.startsWith("vgm_pref_")) {
        deleteCookie(name);
      }
    });

    // Réinitialiser en base de données si l'utilisateur est connecté
    try {
      const defaultPreferences = {
        necessary: true,
        analytics: false,
        functional: false,
      };
      await updateCookiePreferences(defaultPreferences);
      console.log("✅ Préférences cookies réinitialisées en base de données");
    } catch (error) {
      console.log(
        "⚠️ Impossible de réinitialiser en base (utilisateur non connecté ou erreur):",
        error
      );
    }
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

        // Exemple avec Google Analytics 4
        if (typeof gtag !== "undefined") {
          gtag("event", event, data);
        }
      }
    },
  },

  functional: {
    saveUserPreference: (key, value) => {
      if (cookieManager.isAllowed("functional")) {
        const isSecure = window.location.protocol === "https:";
        setCookie(`vgm_pref_${key}`, value, 365, "Lax", isSecure);

        // Backup dans localStorage
        localStorage.setItem(`vgm_pref_${key}`, value);
      }
    },

    getUserPreference: (key) => {
      if (cookieManager.isAllowed("functional")) {
        return (
          getCookie(`vgm_pref_${key}`) ||
          localStorage.getItem(`vgm_pref_${key}`)
        );
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
