import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/`;

function Souvenirs() {
  const [souvenirs, setSouvenirs] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [photoOuverte, setPhotoOuverte] = useState(null);

  useEffect(() => {
    chargerSouvenirs();
  }, []);

  async function chargerSouvenirs() {
    setChargement(true);
    setErreur("");

    try {
      const reponse = await fetch(
        `${API_URL}/api/souvenirs/list.php`
      );

      const resultat = await reponse.json();

      if (resultat.success) {
        setSouvenirs(resultat.souvenirs);
      } else {
        setErreur(resultat.message);
      }
    } catch (erreur) {
      console.error(erreur);
      setErreur("Impossible de contacter le serveur.");
    } finally {
      setChargement(false);
    }
  }

  function formaterDate(date) {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <main className="souvenirs-page">

      {/* HERO */}
      <section className="souvenirs-hero">

        <p>📸 NOS MOMENTS PRÉCIEUX</p>

        <h1>Nos souvenirs</h1>

        <span>
          Tous ces petits moments qui racontent
          notre grande histoire. ❤️
        </span>

      </section>


      {/* GALERIE */}
      <section className="souvenirs-gallery">

        <div className="gallery-header">

          <div>

            <span>NOTRE ALBUM</span>

            <h2>
              {souvenirs.length === 0
                ? "Quelques souvenirs"
                : `${souvenirs.length} souvenir${
                    souvenirs.length > 1 ? "s" : ""
                  }`}
            </h2>

          </div>

          <Link to="/ajouter" className="add-memory">
            ➕ Ajouter
          </Link>

        </div>


        {/* CHARGEMENT */}
        {chargement && (
          <div className="empty-gallery">

            <div className="empty-gallery-icon">
              ⏳
            </div>

            <h2>
              Nos souvenirs arrivent...
            </h2>

            <p>
              Nous récupérons notre histoire.
            </p>

          </div>
        )}


        {/* ERREUR */}
        {!chargement && erreur && (
          <div className="empty-gallery">

            <div className="empty-gallery-icon">
              ❌
            </div>

            <h2>
              Oups...
            </h2>

            <p>
              {erreur}
            </p>

            <button
              className="empty-gallery-button"
              onClick={chargerSouvenirs}
            >
              Réessayer
            </button>

          </div>
        )}


        {/* AUCUN SOUVENIR */}
        {!chargement &&
          !erreur &&
          souvenirs.length === 0 && (

            <div className="empty-gallery">

              <div className="empty-gallery-icon">
                📷
              </div>

              <h2>
                Notre album est encore vide
              </h2>

              <p>
                Ajoutez vos premiers souvenirs pour
                commencer à construire notre histoire.
              </p>

              <Link to="/ajouter" className="empty-gallery-button">
                Ajouter un souvenir
              </Link>

            </div>
          )}


        {/* SOUVENIRS */}
        {!chargement &&
          !erreur &&
          souvenirs.length > 0 && (

            <div className="memory-grid">

              {souvenirs.map((souvenir) => {
                const premierePhoto = souvenir.photos?.[0];

                return (
                  <article
                    className="memory-card"
                    key={souvenir.id}
                  >

                    <div className="memory-image">

                      {premierePhoto ? (
                        <div
                          className="real-image"
                          onClick={() =>
                            setPhotoOuverte(BASE_URL + premierePhoto.chemin)
                          }
                        >
                          <img
                            src={BASE_URL + premierePhoto.chemin}
                            alt={souvenir.titre}
                          />

                          <div className="image-overlay">
                            <span>🔍</span>
                          </div>
                        </div>
                      ) : (
                        <div className="image-placeholder">
                          <span>
                            {Boolean(souvenir.favori) ? "❤️" : "💕"}
                          </span>
                          <small>PAS DE PHOTO</small>
                        </div>
                      )}

                    </div>


                    <div className="memory-info">

                      <span className="memory-date">
                        {formaterDate(souvenir.date_souvenir)}
                      </span>

                      <h3>
                        {souvenir.titre}
                      </h3>

                      {souvenir.lieu && (
                        <p className="memory-place">
                          📍 {souvenir.lieu}
                        </p>
                      )}

                      {souvenir.description && (
                        <p className="memory-description">
                          {souvenir.description}
                        </p>
                      )}

                      {souvenir.photos?.length > 1 && (
                        <p className="memory-description">
                          📸 {souvenir.photos.length} photos
                        </p>
                      )}

                      {souvenir.videos?.length > 0 && (
                        <p className="memory-description">
                          🎥 {souvenir.videos.length} vidéo(s)
                        </p>
                      )}

                      {souvenir.musique_chemin && (
                        <p className="memory-description">
                          🎵 {souvenir.musique_nom}
                        </p>
                      )}

                      {Boolean(souvenir.favori) && (
                        <span className="memory-favorite">
                          ❤️ Notre favori
                        </span>
                      )}

                    </div>

                  </article>
                );
              })}

            </div>
          )}

      </section>


      {/* MESSAGE */}
      <section className="memories-message">

        <span>♡</span>

        <h2>
          Et ce n'est que le début...
        </h2>

        <p>
          Notre album se remplira petit à petit
          de voyages, de sourires, de journées ordinaires
          et de moments extraordinaires.
        </p>

      </section>


      {/* MODAL PHOTO */}
      {photoOuverte && (
        <div
          className="photo-modal"
          onClick={() => setPhotoOuverte(null)}
        >
          <button
            className="close-modal"
            onClick={() => setPhotoOuverte(null)}
            aria-label="Fermer"
          >
            ×
          </button>

          <img src={photoOuverte} alt="Souvenir agrandi" />
        </div>
      )}

    </main>
  );
}

export default Souvenirs;
