import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/register.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nom,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        setMessage(data.message);
        return;
      }

      setMessage("Compte créé avec succès !");

      // Redirection vers la connexion
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      setMessage("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Créer un compte ❤️</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Votre nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Votre mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Création..." : "Créer mon compte"}
        </button>

      </form>

      {message && (
        <p className="auth-message">
          {message}
        </p>
      )}

      <p>
        Vous avez déjà un compte ?{" "}
        <Link to="/login">
          Se connecter
        </Link>
      </p>

    </div>
  );
}

export default Register;
