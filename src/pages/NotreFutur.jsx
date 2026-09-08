import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const TYPES = [
  { valeur: "voyage", label: "🌍 Voyage" },
  { valeur: "objectif", label: "🎯 Objectif" },
  { valeur: "reve", label: "✨ Rêve" },
  { valeur: "autre", label: "💫 Autre" },
];

function NotreFutur() {
  const [projets, setProjets] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("reve");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  useEffect(() => {
    chargerProjets();
  }, []);

  async function chargerProjets() {
    setChargement(true);
    setErreur("");

    try {
      const reponse = await fetch(
        `${API_URL}/api/futur/list.php`
      );

      const resultat = await reponse.json();

      if (resultat.success) {
        setProjets(resultat.projets);
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

  async function handleSubmit(event) {
    event.preventDefault();

    if (titre.trim() === "") {
      return;
    }

    setEnvoiEnCours(true);

    try {
      const reponse = await fetch(
        `${API_URL}/api/futur/create.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ titre, description, type }),
        }
      );

      const resultat = await reponse.json();

      if (resultat.success) {
        setTitre("");
        setDescription("");
        setType("reve");
        chargerProjets();
      } else {
        setErreur(resultat.message);
      }
    } catch (erreur) {
      console.error(erreur);
      setErreur("Impossible d'ajouter le projet.");
    } finally {
      setEnvoiEnCours(false);
    }
  }

  async function basculerRealise(id) {
    // mise à jour optimiste
    setProjets((precedent) =>
      precedent.map((projet) =>
        projet.id === id
          ? { ...projet, realise: projet.realise ? 0 : 1 }
          : projet
      )
    );

    try {
      await fetch(`${API_URL}/api/futur/toggle.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
    } catch (erreur) {
      console.error(erreur);
    } finally {
      chargerProjets();
    }
  }

  async function supprimerProjet(id) {
    try {
      const reponse = await fetch(
        `${API_URL}/api/futur/delete.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      const resultat = await reponse.json();

      if (resultat.success) {
        setProjets((precedent) =>
          precedent.filter((projet) => projet.id !== id)
        );
      }
    } catch (erreur) {
      console.error(erreur);
    }
  }

  function icone(typeProjet) {
    return TYPES.find((t) => t.valeur === typeProjet)?.label.split(" ")[0] ?? "💫";
  }

  const aRealiser = projets.filter((projet) => !Number(projet.realise));
  const realises = projets.filter((projet) => Number(projet.realise));

  return (
    <main className="souvenirs-page">

      <section className="souvenirs-hero">
        <p>🌙 NOS RÊVES À DEUX</p>
        <h1>Notre futur</h1>
        <span>
          Les voyages, les projets et les rêves qu'il nous
          reste à vivre ensemble. ❤️
        </span>
      </section>

      <section className="messages-composer">

        <form onSubmit={handleSubmit} className="message-form">

          <input
            type="text"
            placeholder="Un rêve, un projet, un voyage..."
            value={titre}
            onChange={(event) => setTitre(event.target.value)}
            className="futur-titre-input"
          />

          <textarea
            rows="2"
            placeholder="Quelques détails (optionnel)..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          ></textarea>

          <div className="type-toggle">
            {TYPES.map((t) => (
              <button
                type="button"
                key={t.valeur}
                className={
                  "type-option" + (type === t.valeur ? " active" : "")
                }
                onClick={() => setType(t.valeur)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="send-button"
            disabled={envoiEnCours || titre.trim() === ""}
          >
            {envoiEnCours ? "Ajout..." : "✨ Ajouter à notre liste"}
          </button>

        </form>

      </section>

      <section className="messages-list">

        {chargement && (
          <div className="empty-gallery">
            <div className="empty-gallery-icon">⏳</div>
            <h2>Récupération de vos projets...</h2>
          </div>
        )}

        {!chargement && erreur && (
          <div className="empty-gallery">
            <div className="empty-gallery-icon">❌</div>
            <h2>Oups...</h2>
            <p>{erreur}</p>
            <button className="empty-gallery-button" onClick={chargerProjets}>
              Réessayer
            </button>
          </div>
        )}

        {!chargement && !erreur && projets.length === 0 && (
          <div className="empty-section">
            <span>🌙</span>
            <h2>Tout ce qu'il nous reste à écrire</h2>
            <p>
              Ajoutez votre premier rêve, projet ou voyage à réaliser
              ensemble.
            </p>
          </div>
        )}

        {!chargement && !erreur && aRealiser.length > 0 && (
          <>
            <h3 className="futur-section-title">À réaliser</h3>

            {aRealiser.map((projet) => (
              <article className="message-card futur-card" key={projet.id}>

                <button
                  className="futur-check"
                  onClick={() => basculerRealise(projet.id)}
                  aria-label="Marquer comme réalisé"
                >
                  ○
                </button>

                <div className="futur-contenu">

                  <div className="message-card-header">
                    <span className="message-auteur futur-type">
                      {icone(projet.type)} {projet.titre}
                    </span>

                    <button
                      className="delete-photo"
                      onClick={() => supprimerProjet(projet.id)}
                      aria-label="Supprimer ce projet"
                    >
                      Supprimer
                    </button>
                  </div>

                  {projet.description && (
                    <p className="message-contenu">
                      {projet.description}
                    </p>
                  )}

                </div>

              </article>
            ))}
          </>
        )}

        {!chargement && !erreur && realises.length > 0 && (
          <>
            <h3 className="futur-section-title">Réalisés ❤️</h3>

            {realises.map((projet) => (
              <article
                className="message-card futur-card futur-card-done"
                key={projet.id}
              >

                <button
                  className="futur-check checked"
                  onClick={() => basculerRealise(projet.id)}
                  aria-label="Marquer comme non réalisé"
                >
                  ✓
                </button>

                <div className="futur-contenu">

                  <div className="message-card-header">
                    <span className="message-auteur futur-type">
                      {icone(projet.type)} {projet.titre}
                    </span>

                    <button
                      className="delete-photo"
                      onClick={() => supprimerProjet(projet.id)}
                      aria-label="Supprimer ce projet"
                    >
                      Supprimer
                    </button>
                  </div>

                  {projet.description && (
                    <p className="message-contenu">
                      {projet.description}
                    </p>
                  )}

                </div>

              </article>
            ))}
          </>
        )}

      </section>

    </main>
  );
}

export default NotreFutur;
