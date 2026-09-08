import { Link } from "react-router-dom";

import Timeline from "../components/Timeline";
import LoveCounter from "../components/LoveCounter";

function Home() {
  return (
    <main className="home">

      {/* HERO */}
      <section className="hero">

        <div className="hero-decoration">
          ♡
        </div>

        <p className="hero-label">
          NOTRE PETITE HISTOIRE
        </p>

        <h1>
          Fatou <span>&</span> Abdou
        </h1>

        <p className="hero-text">
          Une rencontre devenue une histoire,
          <br />
          une histoire devenue toute une vie. ❤️
        </p>

        <div className="hero-heart">
          ❤️
        </div>

        <p className="hero-date">
          Depuis le 14 décembre 2024
        </p>

      </section>


      {/* COMPTEUR */}
      <LoveCounter />


      {/* DATES IMPORTANTES */}
      <section className="important-dates">

        <div className="section-intro">

          <span>
            ✦
          </span>

          <p>
            LES MOMENTS QUI ONT TOUT CHANGÉ
          </p>

          <h2>
            Notre histoire
          </h2>

        </div>


        <div className="story-cards">

          {/* RENCONTRE */}
          <article className="story-card">

            <div className="story-number">
              01
            </div>

            <div className="story-icon">
              💕
            </div>

            <div className="story-content">

              <span className="story-date">
                14 DÉCEMBRE 2024
              </span>

              <h3>
                Notre rencontre
              </h3>

              <p>
                Le jour où deux chemins se sont croisés
                et où notre histoire a commencé.
              </p>

            </div>

          </article>


          {/* LIGNE */}
          <div className="story-line">
            <span>
              ♥
            </span>
          </div>


          {/* MARIAGE */}
          <article className="story-card">

            <div className="story-number">
              02
            </div>

            <div className="story-icon">
              💍
            </div>

            <div className="story-content">

              <span className="story-date">
                4 OCTOBRE 2025
              </span>

              <h3>
                Notre mariage
              </h3>

              <p>
                Le jour où notre amour est devenu
                officiellement une vie à deux.
              </p>

            </div>

          </article>

        </div>

      </section>


      {/* CITATION */}
      <section className="love-quote">

        <div className="quote-decoration">
          “
        </div>

        <p>
          Certaines histoires sont écrites dans les livres.
          <br />
          La nôtre est écrite dans nos cœurs.
        </p>

        <span>
          — Fatou & Abdou ❤️
        </span>

      </section>


      {/* TIMELINE */}
      <Timeline />


      {/* BIENVENUE */}
      <section className="welcome">

        <div className="welcome-icon">
          ✨
        </div>

        <p className="welcome-label">
          NOTRE PETIT UNIVERS
        </p>

        <h2>
          Bienvenue dans notre histoire
        </h2>

        <p>
          Un endroit rien qu'à nous pour garder
          nos souvenirs, nos mots doux, nos moments
          précieux et tous les rêves que nous construirons
          ensemble.
        </p>

        <Link
          to="/ajouter"
          className="welcome-button"
        >
          Ajouter un souvenir
          <span>
            →
          </span>
        </Link>

      </section>

    </main>
  );
}

export default Home;
