export default function MentionsLegales() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-main-text-light dark:text-main-text-dark">
        Mentions Légales
      </h1>

      <div className="space-y-6 text-main-text-light dark:text-main-text-dark">
        <section>
          <h2 className="text-xl font-semibold mb-3">Éditeur du site</h2>
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
      </div>
    </div>
  );
}
