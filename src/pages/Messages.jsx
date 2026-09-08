import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const AUTEURS = ["Fatou", "Abdou"];

function Messages() {
  const [messages, setMessages] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  const [auteur, setAuteur] = useState(AUTEURS[0]);
  const [contenu, setContenu] = useState("");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  useEffect(() => {
    chargerMessages();
  }, []);

  async function chargerMessages() {
    setChargement(true);
    setErreur("");

    try {
      const reponse = await fetch(
        `${API_URL}/api/messages/list.php`
      );

      const resultat = await reponse.json();

      if (resultat.success) {
        setMessages(resultat.messages);
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

    if (contenu.trim() === "") {
      return;
    }

    setEnvoiEnCours(true);

    try {
      const reponse = await fetch(
        `${API_URL}/api/messages/create.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ auteur, contenu }),
        }
      );

      const resultat = await reponse.json();

      if (resultat.success) {
        setContenu("");
        chargerMessages();
      } else {
        setErreur(resultat.message);
      }
    } catch (erreur) {
      console.error(erreur);
      setErreur("Impossible d'envoyer le message.");
    } finally {
      setEnvoiEnCours(false);
    }
  }

  async function supprimerMessage(id) {
    try {
      const reponse = await fetch(
        `${API_URL}/api/messages/delete.php`,
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
        setMessages((precedent) =>
          precedent.filter((message) => message.id !== id)
        );
      }
    } catch (erreur) {
      console.error(erreur);
    }
  }

  function formaterDate(date) {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className="souvenirs-page">

      <section className="souvenirs-hero">
        <p>💌 QUELQUES MOTS POUR NOUS</p>
        <h1>Nos messages</h1>
        <span>
          L'espace où l'on se laisse des mots doux,
          des lettres et des pensées à se relire un jour. ❤️
        </span>
      </section>

      <section className="messages-composer">

        <form onSubmit={handleSubmit} className="message-form">

          <div className="message-form-header">

            <div className="auteur-toggle">
              {AUTEURS.map((nom) => (
                <button
                  type="button"
                  key={nom}
                  className={
                    "auteur-option" +
                    (auteur === nom ? " active" : "")
                  }
                  onClick={() => setAuteur(nom)}
                >
                  {nom}
                </button>
              ))}
            </div>

          </div>

          <textarea
            rows="3"
            placeholder="Écris un petit mot doux..."
            value={contenu}
            onChange={(event) => setContenu(event.target.value)}
          ></textarea>

          <button
            type="submit"
            className="send-button"
            disabled={envoiEnCours || contenu.trim() === ""}
          >
            {envoiEnCours ? "Envoi..." : "💌 Envoyer"}
          </button>

        </form>

      </section>

      <section className="messages-list">

        {chargement && (
          <div className="empty-gallery">
            <div className="empty-gallery-icon">⏳</div>
            <h2>Récupération de vos messages...</h2>
          </div>
        )}

        {!chargement && erreur && (
          <div className="empty-gallery">
            <div className="empty-gallery-icon">❌</div>
            <h2>Oups...</h2>
            <p>{erreur}</p>
            <button className="empty-gallery-button" onClick={chargerMessages}>
              Réessayer
            </button>
          </div>
        )}

        {!chargement && !erreur && messages.length === 0 && (
          <div className="empty-section">
            <span>💌</span>
            <h2>Notre petit espace secret</h2>
            <p>
              Aucun message pour l'instant. Écrivez le premier mot doux
              de cette collection ❤️
            </p>
          </div>
        )}

        {!chargement &&
          !erreur &&
          messages.length > 0 &&
          messages.map((message) => (
            <article className="message-card" key={message.id}>

              <div className="message-card-header">

                <span
                  className={
                    "message-auteur" +
                    (message.auteur === "Fatou" ? " fatou" : " abdou")
                  }
                >
                  {message.auteur}
                </span>

                <span className="message-date">
                  {formaterDate(message.created_at)}
                </span>

                <button
                  className="delete-photo"
                  onClick={() => supprimerMessage(message.id)}
                  aria-label="Supprimer ce message"
                >
                  Supprimer
                </button>

              </div>

              <p className="message-contenu">
                {message.contenu}
              </p>

            </article>
          ))}

      </section>

    </main>
  );
}

export default Messages;
