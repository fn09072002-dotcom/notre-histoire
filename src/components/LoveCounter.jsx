import { useEffect, useState } from "react";

function calculerDuree(debut) {
  const maintenant = new Date();

  let annees = maintenant.getFullYear() - debut.getFullYear();
  let mois = maintenant.getMonth() - debut.getMonth();
  let jours = maintenant.getDate() - debut.getDate();

  if (jours < 0) {
    mois--;

    const dernierJourMoisPrecedent = new Date(
      maintenant.getFullYear(),
      maintenant.getMonth(),
      0
    ).getDate();

    jours += dernierJourMoisPrecedent;
  }

  if (mois < 0) {
    annees--;
    mois += 12;
  }

  return {
    annees,
    mois,
    jours,
  };
}

function LoveCounter() {
  const debut = new Date(2024, 11, 14);

  const [duree, setDuree] = useState(
    calculerDuree(debut)
  );

  useEffect(() => {
    const intervalle = setInterval(() => {
      setDuree(calculerDuree(debut));
    }, 1000);

    return () => clearInterval(intervalle);
  }, []);

  return (
    <section className="counter-section">

      <div className="counter-card">

        <p className="counter-label">
          ⏳ NOTRE HISTOIRE DURE DEPUIS
        </p>

        <div className="counter-values">

          <div className="counter-value">
            <strong>{duree.annees}</strong>
            <span>
              {duree.annees > 1 ? "années" : "année"}
            </span>
          </div>

          <div className="counter-separator">
            ·
          </div>

          <div className="counter-value">
            <strong>{duree.mois}</strong>
            <span>
              {duree.mois > 1 ? "mois" : "mois"}
            </span>
          </div>

          <div className="counter-separator">
            ·
          </div>

          <div className="counter-value">
            <strong>{duree.jours}</strong>
            <span>
              {duree.jours > 1 ? "jours" : "jour"}
            </span>
          </div>

        </div>

        <p className="counter-message">
          Et chaque jour ajoute une nouvelle page
          à notre histoire. 💕
        </p>

      </div>

    </section>
  );
}

export default LoveCounter;