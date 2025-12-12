import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Playlists from "./pages/Playlists";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";


function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <div style={styles.logo}>MV</div>
        <span style={styles.brandText}>Music Vault</span>
      </div>

      <div style={styles.navLinks}>
        {token ? (
          <>
            <Link to="/playlists" style={styles.link}>Playlists</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register" style={styles.link}>Register</Link>
            <Link to="/login" style={styles.link}>Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/playlists" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />


        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />


        <Route
          path="/playlists"
          element={
            <ProtectedRoute>
              <Playlists />
            </ProtectedRoute>
          }
        />


        <Route path="*" element={<h2 style={{ padding: "2rem" }}>404 Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

const styles = {
  nav: {
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 1.25rem",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "#0b1220",
  },
  brand: { display: "flex", alignItems: "center", gap: 10 },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 999,
    background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
  },
  brandText: { color: "white", fontWeight: 800, letterSpacing: "-0.02em" },
  navLinks: { display: "flex", gap: 14, alignItems: "center" },
  link: { color: "rgba(255,255,255,0.85)", textDecoration: "none", fontWeight: 600 },
  logoutBtn: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.9)",
    cursor: "pointer",
    fontWeight: 700,
  },
};

export default App;
