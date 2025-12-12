import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
   
      <nav style={{ padding: "1rem", display: "flex", gap: "1rem" }}>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </nav>

      <Routes>
      
        <Route path="/" element={<Navigate to="/register" replace />} />
        
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="*" element={<h2 style={{ padding: "2rem" }}>404 Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
