
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function ProtectedRoute({ children }) {
  const [chargement, setChargement] = useState(true);
  const [connecte, setConnecte] = useState(false);

  useEffect(() => {
    async function verifierConnexion() {
      try {
        const response = await fetch(
          `${API_URL}/api/auth/me.php`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        setConnecte(data.success === true);
      } catch (error) {
        console.error(error);
        setConnecte(false);
      } finally {
        setChargement(false);
      }
    }

    verifierConnexion();
  }, []);

  if (chargement) {
    return <p>Vérification de la connexion...</p>;
  }

  if (!connecte) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

