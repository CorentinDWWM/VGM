import { Link } from "react-router-dom";
import Bouton from "../../components/Boutons/Bouton";
import { cookieManager } from "../../utils/cookieManager";

export default function PolitiqueConfidentialite() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-main-text-light dark:text-main-text-dark">
        Politique de Confidentialité
      </h1>

      <div className="space-y-6 text-main-text-light dark:text-main-text-dark">
        <section>
          <h2 className="text-xl font-semibold mb-3">
            1. Collecte des données
          </h2>
          <p>
            Video Games Manager collecte uniquement les données nécessaires au
            fonctionnement de l'application : informations de profil
            utilisateur, bibliothèque de jeux, et préférences.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">
            2. Utilisation des données
          </h2>
          <p>
            Vos données sont utilisées exclusivement pour personnaliser votre
            expérience de gestion de jeux vidéo et améliorer nos services.
            Aucune donnée n'est vendue à des tiers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">
            3. Stockage et sécurité
          </h2>
          <p>
            Toutes les données sont stockées de manière sécurisée et chiffrées.
            Nous appliquons les meilleures pratiques de sécurité pour protéger
            vos informations personnelles.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez d'un droit d'accès, de
            rectification, de suppression et de portabilité de vos données.
            Contactez-nous pour exercer ces droits.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">
            5. Cookies et technologies similaires
          </h2>
          <p className="mb-4">
            Notre site utilise des cookies et des technologies similaires pour
            améliorer votre expérience de navigation et analyser l'utilisation
            du site.
          </p>

          <h3 className="text-lg font-semibold mb-2">
            Types de cookies utilisés :
          </h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>
              <strong>Cookies strictement nécessaires :</strong> Ces cookies
              sont essentiels au fonctionnement du site et ne peuvent pas être
              désactivés.
            </li>
            <li>
              <strong>Cookies analytiques :</strong> Ils nous permettent de
              mesurer l'audience et d'améliorer les performances du site.
            </li>
            <li>
              <strong>Cookies fonctionnels :</strong> Ils mémorisent vos
              préférences pour améliorer votre expérience (thème sombre/clair,
              paramètres de langue, etc.).
            </li>
          </ul>

          <p className="mb-4">
            Conformément au RGPD et à la directive ePrivacy, nous demandons
            votre consentement avant de déposer ces cookies sur votre appareil,
            à l'exception des cookies strictement nécessaires.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/preferences-cookies">
              <Bouton text="Page des préférences cookies" />
            </Link>
            <Bouton
              text="Ouvrir le panneau cookies"
              onClick={() => {
                const event = new CustomEvent("openCookieModal");
                window.dispatchEvent(event);
              }}
            />
            <Bouton
              text="Réinitialiser les cookies"
              onClick={() => {
                cookieManager.resetConsent();
              }}
            />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Contact</h2>
          <p>
            Pour toute question concernant cette politique de confidentialité,
            contactez-nous à : <strong>delaforgecorentin62@gmail.com</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
