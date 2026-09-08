import { useRef, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

function AjouterSouvenir() {
  const [formulaire, setFormulaire] = useState({
    titre: "",
    date: "",
    lieu: "",
    description: "",
    favori: false,
  });

  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [musique, setMusique] = useState(null);

  const [message, setMessage] = useState("");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const inputPhotosRef = useRef(null);
  const inputVideosRef = useRef(null);
  const inputMusiqueRef = useRef(null);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormulaire({
      ...formulaire,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function handlePhotosChange(event) {
    setPhotos(Array.from(event.target.files));
  }

  function handleVideosChange(event) {
    setVideos(Array.from(event.target.files));
  }

  function handleMusiqueChange(event) {
    setMusique(event.target.files[0] ?? null);
  }

  function reinitialiserFormulaire() {
    setFormulaire({
      titre: "",
      date: "",
      lieu: "",
      description: "",
      favori: false,
    });

    setPhotos([]);
    setVideos([]);
    setMusique(null);

    if (inputPhotosRef.current) inputPhotosRef.current.value = "";
    if (inputVideosRef.current) inputVideosRef.current.value = "";
    if (inputMusiqueRef.current) inputMusiqueRef.current.value = "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setEnvoiEnCours(true);
    setMessage("Enregistrement en cours...");

    const donnees = new FormData();

    donnees.append("titre", formulaire.titre);
    donnees.append("date", formulaire.date);
    donnees.append("lieu", formulaire.lieu);
    donnees.append("description", formulaire.description);
    donnees.append("favori", formulaire.favori ? "1" : "");

    photos.forEach((fichier) => donnees.append("photos[]", fichier));
    videos.forEach((fichier) => donnees.append("videos[]", fichier));

    if (musique) {
      donnees.append("musique", musique);
    }

    try {
      const reponse = await fetch(
        `${API_URL}/api/souvenirs/create-with-photos.php`,
        {
          method: "POST",
          body: donnees,
        }
      );

      const resultat = await reponse.json();

      if (resultat.success) {
        setMessage("❤️ Souvenir enregistré avec succès !");
        reinitialiserFormulaire();
      } else {
        setMessage("❌ " + resultat.message);
      }

    } catch (erreur) {
      console.error(erreur);
      setMessage(
        "❌ Impossible de contacter le serveur."
      );
    } finally {
      setEnvoiEnCours(false);
    }
  }

  return (
    <main className="ajouter-souvenir">

      <div className="form-header">
        <span>💕</span>

        <h1>
          Ajouter un souvenir
        </h1>

        <p>
          Ajoutez un nouveau chapitre à notre histoire ❤️
        </p>
      </div>


      <form
        className="souvenir-form"
        onSubmit={handleSubmit}
      >

        <div className="form-group">

          <label htmlFor="titre">
            Titre du souvenir
          </label>

          <input
            type="text"
            id="titre"
            name="titre"
            value={formulaire.titre}
            onChange={handleChange}
            placeholder="Ex : Notre premier voyage"
            required
          />

        </div>


        <div className="form-row">

          <div className="form-group">

            <label htmlFor="date">
              Date
            </label>

            <input
              type="date"
              id="date"
              name="date"
              value={formulaire.date}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="lieu">
              Lieu
            </label>

            <input
              type="text"
              id="lieu"
              name="lieu"
              value={formulaire.lieu}
              onChange={handleChange}
              placeholder="Ex : Dakar"
            />

          </div>

        </div>


        <div className="form-group">

          <label htmlFor="description">
            Racontez votre souvenir
          </label>

          <textarea
            id="description"
            name="description"
            rows="6"
            value={formulaire.description}
            onChange={handleChange}
            placeholder="Racontez ce beau moment..."
          ></textarea>

        </div>


        <div className="media-section">

          <h2>
            📸 Photos
          </h2>

          <label className="upload-box">

            <span>📷</span>

            <strong>
              Ajouter des photos
            </strong>

            <small>
              {photos.length > 0
                ? `${photos.length} photo${photos.length > 1 ? "s" : ""} sélectionnée${photos.length > 1 ? "s" : ""}`
                : "Vous pourrez en sélectionner plusieurs"}
            </small>

            <input
              type="file"
              accept="image/*"
              multiple
              ref={inputPhotosRef}
              onChange={handlePhotosChange}
            />

          </label>

        </div>


        <div className="media-section">

          <h2>
            🎥 Vidéos
          </h2>

          <label className="upload-box">

            <span>🎬</span>

            <strong>
              Ajouter des vidéos
            </strong>

            <small>
              {videos.length > 0
                ? `${videos.length} vidéo${videos.length > 1 ? "s" : ""} sélectionnée${videos.length > 1 ? "s" : ""}`
                : "Ajoutez vos vidéos souvenirs"}
            </small>

            <input
              type="file"
              accept="video/*"
              multiple
              ref={inputVideosRef}
              onChange={handleVideosChange}
            />

          </label>

        </div>


        <div className="media-section">

          <h2>
            🎵 Notre musique
          </h2>

          <label className="upload-box">

            <span>🎶</span>

            <strong>
              Ajouter une musique
            </strong>

            <small>
              {musique
                ? musique.name
                : "La chanson qui accompagne ce souvenir"}
            </small>

            <input
              type="file"
              accept="audio/*"
              ref={inputMusiqueRef}
              onChange={handleMusiqueChange}
            />

          </label>

        </div>


        <label className="favorite-option">

          <input
            type="checkbox"
            name="favori"
            checked={formulaire.favori}
            onChange={handleChange}
          />

          <span>
            ❤️ Ajouter ce souvenir à nos favoris
          </span>

        </label>


        {message && (
          <p className="form-message">
            {message}
          </p>
        )}


        <button
          type="submit"
          className="save-button"
          disabled={envoiEnCours}
        >
          {envoiEnCours
            ? "Enregistrement..."
            : "❤️ Enregistrer notre souvenir"}
        </button>

      </form>

    </main>
  );
}

export default AjouterSouvenir;
