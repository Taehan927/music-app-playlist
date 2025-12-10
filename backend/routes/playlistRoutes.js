// import express to create a router
const express = require("express");

// create a new router instance
const router = express.Router();

// import middleware that checks if the user is authenticated
const authMiddleware = require("../middleware/authMiddleware");

// import playlist controller functions
const {
  getPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSong,
  removeSong,
} = require("../controllers/playlistController");

// apply authMiddleware to all routes in this router

router.use(authMiddleware);

// GET /api/playlists - get all playlists for the logged-in user
router.get("/", getPlaylists);

// POST /api/playlists - create a new playlist
router.post("/", createPlaylist);

// PUT /api/playlists/:id - update a specific playlist by ID
router.put("/:id", updatePlaylist);

// DELETE /api/playlists/:id - delete a specific playlist by ID
router.delete("/:id", deletePlaylist);

// POST /api/playlists/:id/songs - add a new song to a playlist
router.post("/:id/songs", addSong);

// DELETE /api/playlists/:id/songs/:songIndex - remove a song from playlist by index
router.delete("/:id/songs/:songIndex", removeSong);

// Export the router so server.js can mount it at /api/playlists
module.exports = router;
