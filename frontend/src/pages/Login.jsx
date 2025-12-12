import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const res = await api.post("/api/auth/login", { emailOrUsername, password });


      localStorage.setItem("token", res.data.token);
      navigate("/playlists"); 
      setMessage("Logged in successfully!");
      
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brandRow}>
          <div style={styles.logoCircle}>MV</div>
          <div>
            <div style={styles.brandName}>Music Vault</div>
            <div style={styles.brandTagline}>Your playlists, organized.</div>
          </div>
        </div>

        <div style={styles.header}>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Log in to manage your playlists</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email or Username
            <input
              style={styles.input}
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="test@example.com or testuser"
              autoComplete="username"
              required
            />
          </label>

          <label style={styles.label}>
            Password
            <div style={styles.passwordRow}>
              <input
                style={{ ...styles.input, marginBottom: 0 }}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={styles.secondaryBtn}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.primaryBtn,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>

          {message && (
            <div
              style={{
                ...styles.alert,
                borderColor: message.toLowerCase().includes("success")
                  ? "#10b981"
                  : "#ef4444",
              }}
            >
              {message}
            </div>
          )}
        </form>

        <div style={styles.footer}>
          <span style={styles.footerText}>Don&apos;t have an account?</span>{" "}
          <Link to="/register" style={styles.link}>
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    background: "radial-gradient(circle at 20% 20%, #1f2937 0%, #0b1220 45%, #050816 100%)",
  },
  card: {
    width: "100%",
    maxWidth: 440,
    background: "rgba(255, 255, 255, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: 18,
    padding: "2rem",
    boxShadow: "0 20px 70px rgba(0,0,0,0.55)",
    backdropFilter: "blur(12px)",
  },
  brandRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginBottom: "1.25rem",
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    color: "white",
    fontWeight: 800,
    letterSpacing: "0.04em",
  },
  brandName: { color: "white", fontWeight: 800, fontSize: 16 },
  brandTagline: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 },
  header: { marginBottom: "1rem" },
  title: { margin: 0, color: "white", fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" },
  subtitle: { marginTop: 8, marginBottom: 0, color: "rgba(255,255,255,0.75)", fontSize: 14 },
  form: { display: "flex", flexDirection: "column", gap: "0.9rem", marginTop: "1rem" },
  label: { display: "flex", flexDirection: "column", gap: 8, color: "rgba(255,255,255,0.85)", fontSize: 13 },
  input: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.25)",
    color: "white",
    outline: "none",
    fontSize: 14,
    marginBottom: 4,
  },
  passwordRow: { display: "flex", gap: 10, alignItems: "center" },
  primaryBtn: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    color: "white",
    fontWeight: 800,
    fontSize: 14,
    marginTop: 6,
  },
  secondaryBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.25)",
    color: "rgba(255,255,255,0.85)",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  alert: {
    marginTop: 8,
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(0,0,0,0.25)",
    border: "1px solid rgba(239,68,68,0.5)",
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
  },
  footer: { marginTop: "1.25rem", textAlign: "center" },
  footerText: { color: "rgba(255,255,255,0.75)", fontSize: 13 },
  link: { color: "#60a5fa", textDecoration: "none", fontSize: 13, fontWeight: 700 },
};

export default Login;
