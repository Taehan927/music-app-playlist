import React, { useEffect, useMemo, useState } from "react";
import api from "../api";

// extract a YouTube videoId from common URL formats
function getYouTubeVideoId(url) {
  try {
    const u = new URL(url);

    // youtu.be/<id>
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "");
    }

    // youtube.com/watch?v=<id>
    if (u.searchParams.get("v")) {
      return u.searchParams.get("v");
    }

    // youtube.com/embed/<id>
    if (u.pathname.startsWith("/embed/")) {
      return u.pathname.split("/embed/")[1];
    }

    return "";
  } catch {
    return "";
  }
}

function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");


  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

 
  const [songInputs, setSongInputs] = useState({}); 

  const [error, setError] = useState("");

 
  useEffect(() => {
    fetchPlaylists();

  }, []);

  const fetchPlaylists = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/api/playlists");
      setPlaylists(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load playlists");
    } finally {
      setLoading(false);
    }
  };

  const createPlaylist = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/playlists", { name, description });

      setPlaylists((prev) => [...prev, res.data]);
      setName("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create playlist");
    }
  };

  const startEdit = (playlist) => {
    setEditingId(playlist._id);
    setEditName(playlist.name);
    setEditDescription(playlist.description || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  const saveEdit = async (playlistId) => {
    setError("");

    try {
      const res = await api.put(`/api/playlists/${playlistId}`, {
        name: editName,
        description: editDescription,
      });


      setPlaylists((prev) =>
        prev.map((p) => (p._id === playlistId ? res.data : p))
      );

      cancelEdit();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update playlist");
    }
  };

  const deletePlaylist = async (playlistId) => {
    const ok = window.confirm("Delete this playlist? This cannot be undone.");
    if (!ok) return;

    setError("");

    try {
      await api.delete(`/api/playlists/${playlistId}`);
      setPlaylists((prev) => prev.filter((p) => p._id !== playlistId));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete playlist");
    }
  };

  const updateSongInput = (playlistId, field, value) => {
    setSongInputs((prev) => ({
      ...prev,
      [playlistId]: {
        title: prev[playlistId]?.title || "",
        artist: prev[playlistId]?.artist || "",
        youtubeUrl: prev[playlistId]?.youtubeUrl || "",
        [field]: value,
      },
    }));
  };

  const addSong = async (playlistId) => {
    const title = songInputs[playlistId]?.title || "";
    const artist = songInputs[playlistId]?.artist || "";
    const youtubeUrl = songInputs[playlistId]?.youtubeUrl || "";

    if (!title || !youtubeUrl) {
      setError("Song title and YouTube URL are required.");
      return;
    }

    setError("");

    try {

      const res = await api.post(`/api/playlists/${playlistId}/songs`, {
        title,
        artist,
        youtubeUrl,
      });

      setPlaylists((prev) =>
        prev.map((p) => (p._id === playlistId ? res.data : p))
      );

 
      setSongInputs((prev) => ({ ...prev, [playlistId]: { title: "", artist: "", youtubeUrl: "" } }));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add song");
    }
  };

  const removeSong = async (playlistId, songIndex) => {
    setError("");

    try {

      const res = await api.delete(`/api/playlists/${playlistId}/songs/${songIndex}`);
      setPlaylists((prev) =>
        prev.map((p) => (p._id === playlistId ? res.data : p))
      );
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to remove song");
    }
  };

  const playlistCount = useMemo(() => playlists.length, [playlists]);

  return (
    <div style={ui.page}>
      <div style={ui.container}>
        <div style={ui.headerRow}>
          <div>
            <h1 style={ui.h1}>Playlists</h1>
            <p style={ui.sub}>You have {playlistCount} playlist{playlistCount === 1 ? "" : "s"} in Music Vault.</p>
          </div>
          <button onClick={fetchPlaylists} style={ui.refreshBtn}>Refresh</button>
        </div>


        <div style={ui.card}>
          <h2 style={ui.h2}>Create a new playlist</h2>

          <form onSubmit={createPlaylist} style={ui.formRow}>
            <input
              style={ui.input}
              placeholder="Playlist name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              style={ui.input}
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button style={ui.primaryBtn} type="submit">
              Create
            </button>
          </form>

          {error && <div style={ui.errorBox}>{error}</div>}
        </div>


        {loading ? (
          <div style={ui.card}>Loading playlists...</div>
        ) : playlists.length === 0 ? (
          <div style={ui.card}>No playlists yet — create your first one above.</div>
        ) : (
          <div style={ui.grid}>
            {playlists.map((p) => {
              const isEditing = editingId === p._id;
              const songTitle = songInputs[p._id]?.title || "";
              const songArtist = songInputs[p._id]?.artist || "";
              const songUrl = songInputs[p._id]?.youtubeUrl || "";

              return (
                <div key={p._id} style={ui.playlistCard}>
                  <div style={ui.playlistTop}>
                    <div>
                      {isEditing ? (
                        <>
                          <input
                            style={ui.input}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                          <input
                            style={ui.input}
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Description"
                          />
                        </>
                      ) : (
                        <>
                          <h3 style={ui.playlistTitle}>{p.name}</h3>
                          <p style={ui.playlistDesc}>{p.description || "No description"}</p>
                        </>
                      )}
                    </div>

                    <div style={ui.actions}>
                      {isEditing ? (
                        <>
                          <button style={ui.smallPrimary} onClick={() => saveEdit(p._id)}>
                            Save
                          </button>
                          <button style={ui.smallBtn} onClick={cancelEdit}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button style={ui.smallBtn} onClick={() => startEdit(p)}>
                            Edit
                          </button>
                          <button style={ui.smallDanger} onClick={() => deletePlaylist(p._id)}>
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <hr style={ui.hr} />


                  <div style={{ marginBottom: 10 }}>
                    <div style={ui.sectionTitle}>Add song</div>
                    <div style={ui.songRow}>
                      <input
                        style={ui.input}
                        placeholder="Title"
                        value={songTitle}
                        onChange={(e) => updateSongInput(p._id, "title", e.target.value)}
                      />
                      <input
                        style={ui.input}
                        placeholder="Artist (optional)"
                        value={songArtist}
                        onChange={(e) => updateSongInput(p._id, "artist", e.target.value)}
                      />
                      <input
                        style={ui.input}
                        placeholder="YouTube URL"
                        value={songUrl}
                        onChange={(e) => updateSongInput(p._id, "youtubeUrl", e.target.value)}
                      />
                      <button style={ui.smallPrimary} onClick={() => addSong(p._id)}>
                        Add
                      </button>
                    </div>
                  </div>


                  <div>
                    <div style={ui.sectionTitle}>Songs</div>
                    {p.songs.length === 0 ? (
                      <div style={ui.muted}>No songs yet.</div>
                    ) : (
                      <div style={ui.songsList}>
                        {p.songs.map((s, idx) => {
                          const vid = getYouTubeVideoId(s.youtubeUrl);
                          return (
                            <div key={idx} style={ui.songItem}>
                              <div style={{ flex: 1 }}>
                                <div style={ui.songTitle}>
                                  {s.title}{" "}
                                  {s.artist ? <span style={ui.songArtist}>— {s.artist}</span> : null}
                                </div>
                                <a href={s.youtubeUrl} target="_blank" rel="noreferrer" style={ui.songLink}>
                                  Open YouTube
                                </a>

                                {vid ? (
                                  <div style={ui.embedWrap}>
                                    <iframe
                                      title={`yt-${p._id}-${idx}`}
                                      width="100%"
                                      height="220"
                                      src={`https://www.youtube.com/embed/${vid}`}
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      style={ui.iframe}
                                    />
                                  </div>
                                ) : (
                                  <div style={ui.muted}>Preview unavailable (invalid YouTube URL)</div>
                                )}
                              </div>

                              <button style={ui.smallDanger} onClick={() => removeSong(p._id, idx)}>
                                Remove
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const ui = {
  page: {
    minHeight: "calc(100vh - 64px)",
    background: "#050816",
    color: "white",
    padding: "1.5rem",
  },
  container: { maxWidth: 1100, margin: "0 auto" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, marginBottom: 18 },
  h1: { margin: 0, fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em" },
  sub: { marginTop: 6, color: "rgba(255,255,255,0.72)" },

  card: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  h2: { margin: 0, marginBottom: 10, fontSize: 16, fontWeight: 800 },
  formRow: { display: "flex", gap: 10, flexWrap: "wrap" },

  input: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.25)",
    color: "white",
    outline: "none",
    minWidth: 200,
    flex: 1,
  },

  primaryBtn: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    color: "white",
    fontWeight: 900,
    cursor: "pointer",
  },

  refreshBtn: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.9)",
    cursor: "pointer",
    fontWeight: 800,
  },

  errorBox: {
    marginTop: 12,
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(239,68,68,0.10)",
    border: "1px solid rgba(239,68,68,0.35)",
    color: "rgba(255,255,255,0.92)",
  },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 },

  playlistCard: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 16,
    padding: 16,
  },

  playlistTop: { display: "flex", justifyContent: "space-between", gap: 12 },
  playlistTitle: { margin: 0, fontSize: 18, fontWeight: 900 },
  playlistDesc: { marginTop: 6, marginBottom: 0, color: "rgba(255,255,255,0.72)" },

  actions: { display: "flex", gap: 8, alignItems: "flex-start", flexWrap: "wrap" },

  smallBtn: {
    padding: "8px 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.9)",
    cursor: "pointer",
    fontWeight: 800,
  },

  smallPrimary: {
    padding: "8px 10px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    cursor: "pointer",
    fontWeight: 900,
  },

  smallDanger: {
    padding: "8px 10px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "white",
    cursor: "pointer",
    fontWeight: 900,
  },

  hr: { border: 0, borderTop: "1px solid rgba(255,255,255,0.10)", margin: "12px 0" },

  sectionTitle: { fontWeight: 900, fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 8 },
  songRow: { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" },

  muted: { color: "rgba(255,255,255,0.62)", fontSize: 13 },

  songsList: { display: "flex", flexDirection: "column", gap: 12 },

  songItem: {
    display: "flex",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.20)",
    alignItems: "flex-start",
  },

  songTitle: { fontWeight: 900, marginBottom: 6 },
  songArtist: { color: "rgba(255,255,255,0.75)", fontWeight: 700 },
  songLink: { color: "#60a5fa", textDecoration: "none", fontWeight: 800, fontSize: 13 },

  embedWrap: { marginTop: 10, borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.10)" },
  iframe: { border: "none", display: "block" },
};

export default Playlists;
