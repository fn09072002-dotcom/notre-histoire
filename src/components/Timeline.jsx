import histoire from "../data/histoire.json";

function Timeline() {
  return (
    <section className="timeline">
      <div className="section-header">
        <p>💕 Notre parcours</p>
        <h2>Notre histoire</h2>
      </div>

      <div className="timeline-list">
        {histoire.map((evenement) => (
          <article className="timeline-item" key={evenement.id}>
            
            <div className="timeline-icon">
              {evenement.icone}
            </div>

            <div className="timeline-content">
              <span className="timeline-date">
                {new Date(evenement.date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>

              <h3>{evenement.titre}</h3>

              <p>{evenement.description}</p>

              {evenement.lieu && (
                <span className="timeline-place">
                  📍 {evenement.lieu}
                </span>
              )}

              {evenement.photos.length > 0 && (
                <p>📸 {evenement.photos.length} photo(s)</p>
              )}

              {evenement.videos.length > 0 && (
                <p>🎥 {evenement.videos.length} vidéo(s)</p>
              )}

              {evenement.musique && (
                <p>🎵 Une musique est associée</p>
              )}
            </div>

          </article>
        ))}
      </div>
    </section>
  );
}

export default Timeline;