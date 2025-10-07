import { updateCookiePreferences } from "../apis/auth.api";

export const COOKIE_CONSENT_KEY = "vgm_cookie_consent";
export const COOKIE_PREFERENCES_KEY = "vgm_cookie_preferences";

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
  hasConsent: () => getCookie(COOKIE_CONSENT_KEY) === "true",

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

    if (preferences.functional) {
      localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));
    }

    try {
      await updateCookiePreferences(preferences);
    } catch (error) {
      // Fail silently if user not connected
    }
  },

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

  clearConsent: async () => {
    deleteCookie(COOKIE_CONSENT_KEY);
    deleteCookie(COOKIE_PREFERENCES_KEY);
    localStorage.removeItem(COOKIE_PREFERENCES_KEY);

    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      if (name.startsWith("vgm_pref_")) {
        deleteCookie(name);
      }
    });

    try {
      await updateCookiePreferences({
        necessary: true,
        analytics: false,
        functional: false,
      });
    } catch (error) {
      // Fail silently
    }
  },

  isAllowed: (cookieType) => {
    const preferences = cookieManager.getPreferences();
    return preferences[cookieType] || false;
  },

  analytics: {
    track: (event, data) => {
      if (cookieManager.isAllowed("analytics") && typeof gtag !== "undefined") {
        gtag("event", event, data);
      }
    },
  },

  functional: {
    saveUserPreference: (key, value) => {
      if (cookieManager.isAllowed("functional")) {
        const isSecure = window.location.protocol === "https:";
        setCookie(`vgm_pref_${key}`, value, 365, "Lax", isSecure);
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

  _modalCallbacks: [],
  onModalOpen: (callback) => cookieManager._modalCallbacks.push(callback),
  offModalOpen: (callback) => {
    cookieManager._modalCallbacks = cookieManager._modalCallbacks.filter(
      (cb) => cb !== callback
    );
  },
  openModal: () =>
    cookieManager._modalCallbacks.forEach((callback) => callback()),
  reopenCookieSettings: () => cookieManager.openModal(),
  resetConsent: () => {
    cookieManager.clearConsent();
    cookieManager.openModal();
  },
};
