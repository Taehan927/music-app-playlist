const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");





const authRoutes = require("./routes/authRoutes");
const playlistRoutes = require("./routes/playlistRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("API is running");
});

// All auth-related routes (register, login) will start with /api/auth
app.use("/api/auth", authRoutes);

// All playlist-related routes will start with /api/playlists
app.use("/api/playlists", playlistRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
