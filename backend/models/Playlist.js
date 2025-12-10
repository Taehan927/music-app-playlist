// import mongoose for schemas and models
const mongoose = require("mongoose");

// define the structure of a Song inside a playlist
const songSchema = new mongoose.Schema(
  {
    // title of the song (required)
    title: { type: String, required: true },

    // artist name (optional)
    artist: { type: String },

    // youTube URL (required)
    youtubeUrl: { type: String, required: true },
  },
  {
    // don't need an _id for each song when embedded, set by { _id: false }
    _id: false,
  }
);

// define the structure of a playlist document
const playlistSchema = new mongoose.Schema(
  {
    // playlist name (required)
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // playlist description (optional)
    description: { type: String },

    // user who owns this playlist 
    owner: {
      type: mongoose.Schema.Types.ObjectId, // stores a MongoDB ObjectId
      ref: "User",                          // references the "User" model
      required: true,
    },

    // array of songs stored using the songSchema defined above
    songs: [songSchema],
  },
  {
    // automatically add createdAt and updatedAt
    timestamps: true,
  }
);

// create and export the playlist model
module.exports = mongoose.model("Playlist", playlistSchema);

