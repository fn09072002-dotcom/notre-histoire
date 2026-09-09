import Timeline from "../components/Timeline";

function NotreHistoire() {
  return (
    <main className="souvenirs-page">

      <section className="souvenirs-hero">
        <p>📖 CHAQUE CHAPITRE COMPTE</p>
        <h1>Notre histoire</h1>
        <span>
          De notre rencontre à aujourd'hui, chaque date
          a écrit une page de notre vie à deux. ❤️
        </span>
      </section>

      <Timeline />
    </main>
  );
}

export default NotreHistoire;