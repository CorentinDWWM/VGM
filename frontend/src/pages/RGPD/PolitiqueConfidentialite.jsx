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
          <h2 className="text-xl font-semibold mb-3">5. Contact</h2>
          <p>
            Pour toute question concernant cette politique de confidentialité,
            contactez-nous à : <strong>delaforgecorentin62@gmail.com</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
