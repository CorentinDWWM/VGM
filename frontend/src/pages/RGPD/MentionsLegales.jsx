import Bouton from "../../components/Boutons/Bouton";

export default function MentionsLegales() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-main-text-light dark:text-main-text-dark">
        Mentions Légales
      </h1>

      <div className="space-y-6 text-main-text-light dark:text-main-text-dark">
        <section>
          <h2 className="text-xl font-semibold mb-3">
            Éditeur de l'application web
          </h2>
          <p>
            <strong>Video Games Manager</strong>
            <br />
            Projet étudiant - Centre de Formation
            <br />
            Adresse :{" "}
            <strong>495 Route Nationale, 62290 Noeux-les-Mines</strong>
            <br />
            Email : <strong>delaforgecorentin62@gmail.com</strong>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Hébergement</h2>
          <p>
            Ce site est hébergé par :<br />
            <strong>Render</strong>
            <br />
            <strong>1234 Render Street, San Francisco, CA 94111</strong>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">
            Propriété intellectuelle
          </h2>
          <p>
            L'ensemble de cette application relève de la législation française
            et internationale sur le droit d'auteur et la propriété
            intellectuelle. Tous les droits de reproduction sont réservés.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Données personnelles</h2>
          <p>
            Conformément à la loi "Informatique et Libertés" du 6 janvier 1978
            modifiée et au RGPD, vous disposez d'un droit d'accès, de
            rectification et de suppression de vos données personnelles.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Responsabilité</h2>
          <p>
            L'utilisateur reconnaît avoir pris connaissance des présentes
            mentions légales et s'engage à les respecter. Ce projet est réalisé
            dans un cadre pédagogique.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Cookies</h2>
          <p>
            Cette application utilise des cookies pour améliorer l'expérience
            utilisateur. Les cookies sont de petits fichiers stockés sur votre
            appareil qui permettent de mémoriser vos préférences et de faciliter
            la navigation.
          </p>
          <p className="mt-3">Types de cookies utilisés :</p>
          <ul className="list-disc list-inside mt-2 space-y-2">
            <li>
              <strong>Cookies nécessaires</strong> : essentiels au
              fonctionnement de l'application (toujours activés)
            </li>
            <li>
              <strong>Cookies analytiques</strong> : nous aident à comprendre
              comment vous utilisez le site pour l'améliorer
            </li>
            <li>
              <strong>Cookies fonctionnels</strong> : améliorent l'expérience
              utilisateur (mémorisation des préférences, thème, etc.)
            </li>
          </ul>
          <p className="mt-3">
            Vous pouvez gérer vos préférences de cookies via notre bandeau de
            consentement qui apparaît lors de votre première visite. Vous avez
            la possibilité d'accepter tous les cookies, de les rejeter (à
            l'exception des cookies nécessaires) ou de personnaliser vos choix
            selon vos préférences.
          </p>
          <p className="mt-3">
            Vous pouvez également configurer votre navigateur pour refuser les
            cookies, mais cela peut affecter le fonctionnement de l'application.
          </p>
          <div className="mt-4">
            <Bouton
              text="Gérer mes préférences de cookies"
              onClick={() => {
                // Déclencher l'événement pour ouvrir le modal de cookies
                const event = new CustomEvent("openCookieModal");
                window.dispatchEvent(event);
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
