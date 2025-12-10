// import the Playlist model to interact with the playlists collection
const Playlist = require("../models/Playlist");


// handles GET /api/playlists
const getPlaylists = async (req, res) => {
  try {
    // find all playlists where owner matches the logged-in user ID
    const playlists = await Playlist.find({ owner: req.user.id }).sort({
      createdAt: -1, // Newest first
    });

    // send the list of playlists back to the client
    res.json(playlists);
  } catch (err) {
    console.error("Get playlists error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// handles POST /api/playlists
const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // create a new playlist document in MongoDB
    const playlist = await Playlist.create({
      name,
      description: description || "",
      owner: req.user.id,
      songs: [],
    });

    res.status(201).json(playlist);
  } catch (err) {
    console.error("Create playlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// handles PUT /api/playlists/:id
const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const playlist = await Playlist.findOneAndUpdate(
      { _id: id, owner: req.user.id }, 
      { name, description },
      { new: true } 
    );

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.json(playlist);
  } catch (err) {
    console.error("Update playlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// handles DELETE /api/playlists/:id
const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Playlist.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.json({ message: "Playlist deleted" });
  } catch (err) {
    console.error("Delete playlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// handles POST /api/playlists/:id/songs
const addSong = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, artist, youtubeUrl } = req.body;

    if (!title || !youtubeUrl) {
      return res
        .status(400)
        .json({ message: "title and youtubeUrl are required" });
    }

    const playlist = await Playlist.findOne({ _id: id, owner: req.user.id });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    playlist.songs.push({ title, artist, youtubeUrl });
    await playlist.save();

    res.status(201).json(playlist);
  } catch (err) {
    console.error("Add song error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// handles DELETE /api/playlists/:id/songs/:songIndex
const removeSong = async (req, res) => {
  try {
    const { id, songIndex } = req.params;

    const playlist = await Playlist.findOne({ _id: id, owner: req.user.id });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const index = parseInt(songIndex, 10);

    if (isNaN(index) || index < 0 || index >= playlist.songs.length) {
      return res.status(400).json({ message: "Invalid song index" });
    }

    playlist.songs.splice(index, 1);
    await playlist.save();

    res.json(playlist);
  } catch (err) {
    console.error("Remove song error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// export all controller functions so routes can use them
module.exports = {
  getPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSong,
  removeSong,
};
