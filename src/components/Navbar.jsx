import { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [menuOuvert, setMenuOuvert] = useState(false);

  const fermerMenu = () => {
    setMenuOuvert(false);
  };

  return (
    <nav className="navbar">

      <NavLink to="/" className="logo" onClick={fermerMenu}>
        ❤️ Notre Histoire
      </NavLink>

      <button
        className="menu-button"
        onClick={() => setMenuOuvert(!menuOuvert)}
        aria-label="Ouvrir le menu"
      >
        ☰
      </button>

      <div className={`nav-links ${menuOuvert ? "open" : ""}`}>

        <NavLink to="/" onClick={fermerMenu}>
          🏠 Accueil
        </NavLink>

        <NavLink to="/histoire" onClick={fermerMenu}>
          📖 Notre histoire
        </NavLink>

        <NavLink to="/souvenirs" onClick={fermerMenu}>
          📸 Souvenirs
        </NavLink>

        <NavLink to="/messages" onClick={fermerMenu}>
          💌 Messages
        </NavLink>

        <NavLink to="/futur" onClick={fermerMenu}>
          🌙 Notre futur
        </NavLink>

        <NavLink to="/ajouter" onClick={fermerMenu}>
          ➕ Ajouter
        </NavLink>

      </div>

    </nav>
  );
}

export default Navbar;
