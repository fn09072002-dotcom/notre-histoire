
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import NotreHistoire from "./pages/NotreHistoire";
import Souvenirs from "./pages/Souvenirs";
import Messages from "./pages/Messages";
import NotreFutur from "./pages/NotreFutur";
import AjouterSouvenir from "./pages/AjouterSouvenir";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";

import "./styles/global.css";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Pages publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pages protégées */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navbar />
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/histoire"
          element={
            <ProtectedRoute>
              <Navbar />
              <NotreHistoire />
            </ProtectedRoute>
          }
        />

        <Route
          path="/souvenirs"
          element={
            <ProtectedRoute>
              <Navbar />
              <Souvenirs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Navbar />
              <Messages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/futur"
          element={
            <ProtectedRoute>
              <Navbar />
              <NotreFutur />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ajouter"
          element={
            <ProtectedRoute>
              <Navbar />
              <AjouterSouvenir />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;

