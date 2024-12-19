import React, { useState, useEffect } from "react";
import "./App.css";
import { search, savePlaylist, getUserPlaylists, getPlaylistTracks, deletePlaylist, deleteTrackFromPlaylist, addTracksToPlaylist } from "./utils/spotify";

// Define types for tracks and playlists
interface Track {
  id: string;
  name: string;
  artist: string;
  uri: string;
}

interface Playlist {
  id: string;
  name: string;
}

function App() {
  // State variables for managing application data
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlistName, setPlaylistName] = useState<string>("");
  const [trackUris, setTrackUris] = useState<string[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentView, setCurrentView] = useState<string>("home");
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedPlaylistForAdding, setSelectedPlaylistForAdding] = useState<string>("");
  const [addTracksErrorMessage, setAddTracksErrorMessage] = useState<string>("");

  // Fetch user playlists when the component mounts
  useEffect(() => {
    getUserPlaylists().then(setPlaylists);
  }, []);

  // Clear error messages after they are set
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 2000); // Clear after 1 second
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Clear add tracks error messages after they are set
  useEffect(() => {
    if (addTracksErrorMessage) {
      const timer = setTimeout(() => setAddTracksErrorMessage(""), 2000); // Clear after 1 second
      return () => clearTimeout(timer);
    }
  }, [addTracksErrorMessage]);

  // Handle search functionality
  const handleSearch = () => {
    setErrorMessage(""); // Clear previous error message
    if (!searchTerm) {
      setErrorMessage("Search field cannot be empty. Type in an artist or song name to begin.");
      return;
    }
    search(searchTerm)
      .then(setTracks)
      .catch(() => setErrorMessage("Failed to fetch search results."));
  };

  // Handle adding tracks to a selected playlist
  const handleAddTracksToPlaylist = () => {
    setAddTracksErrorMessage(""); // Clear add tracks error message
    if (!selectedPlaylistForAdding || trackUris.length === 0) {
      setAddTracksErrorMessage("Please select a playlist and tracks to add.");
      return;
    }

    addTracksToPlaylist(selectedPlaylistForAdding, trackUris)
      .then(() => {
        setTrackUris([]);
        setTracks([]);
        setAddTracksErrorMessage("");
        getPlaylistTracks(selectedPlaylistForAdding).then(setPlaylistTracks);
      })
      .catch(() => {
        setAddTracksErrorMessage("Failed to add tracks to the playlist.");
      });
  };

  // Handle track selection for adding to a playlist
  const handleTrackSelection = (uri: string) => {
    setErrorMessage(""); // Clear error message
    setTrackUris((prevUris) =>
      prevUris.includes(uri) ? prevUris.filter((t) => t !== uri) : [...prevUris, uri]
    );
  };

  // Handle clicking on a playlist to view its tracks
  const handlePlaylistClick = (playlistId: string, playlistName: string) => {
    setErrorMessage(""); // Clear error message
    setSelectedPlaylist(playlistName);
    getPlaylistTracks(playlistId).then((tracks) => {
      setPlaylistTracks(tracks);
      setCurrentView("playlistTracks");
    });
  };

  // Handle deleting a playlist
  const handleDeletePlaylist = (playlistId: string) => {
    setErrorMessage(""); // Clear error message
    deletePlaylist(playlistId)
      .then(() => {
        setPlaylists((prevPlaylists) => prevPlaylists.filter((p) => p.id !== playlistId));
      })
      .catch((error) => {
        console.error("Error deleting playlist:", error);
      });
  };

  // Handle deleting a track from a playlist
  const handleDeleteTrack = (trackUri: string) => {
    setErrorMessage(""); // Clear error message
    deleteTrackFromPlaylist(selectedPlaylist, trackUri)
      .then(() => {
        setPlaylistTracks((prevTracks) => prevTracks.filter((track) => track.uri !== trackUri));
      })
      .catch((error) => {
        console.error("Error deleting track:", error);
      });
  };

  // Handle creating a new playlist
  const handleCreateNewPlaylist = () => {
    setErrorMessage(""); // Clear error message
    if (!playlistName) {
      setErrorMessage("Please provide a playlist name.");
      return;
    }

    const playlistExists = playlists.some(
      (playlist) => playlist.name.toLowerCase() === playlistName.toLowerCase()
    );

    if (playlistExists) {
      setErrorMessage("A playlist with this name already exists.");
      return;
    }

    savePlaylist(playlistName, []).then(() => {
      setPlaylistName("");
      getUserPlaylists().then(setPlaylists);
      setErrorMessage("");
    });
  };

  return (
    <div className="App">
      {currentView === "home" ? (
        <>
          <h1>TuneSphere Playlist Manager</h1>
          <img src="images/tunespherelogo.png" alt="TuneSphere Logo" style={{ width: "150px", marginBottom: "20px" }} />
          <h2>Discover Artists, Build Playlists, Fuel Your Vibe</h2>
          <div>
            <input
              type="text"
              className="text-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for artists, songs..."
              style={{ marginRight: "5px", height: "30px" }}
              size={40}
            />
            <button onClick={handleSearch}>Search</button>
            {errorMessage && <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>}
          </div>
          <div style={{ marginTop: "5px" }}></div>

          {/* New section for adding tracks to an existing playlist */}
          <div style={{ marginTop: "20px" }}>
            <select
              value={selectedPlaylistForAdding}
              onChange={(e) => setSelectedPlaylistForAdding(e.target.value)}
              style={{
                marginRight: "5px",
                fontSize: "16px",
                padding: "10px"
              }}
            >
              <option value="">Select a playlist to add tracks</option>
              {playlists.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </option>
              ))}
            </select>
            <button onClick={handleAddTracksToPlaylist}>Add Tracks to Playlist</button>
            {addTracksErrorMessage && <p style={{ color: "red", marginTop: "10px" }}>{addTracksErrorMessage}</p>}
          </div>

          <h2>Search Results</h2>
          <ul style={{ listStyleType: "none", marginBottom: "100px" }}>
            {tracks.map((track) => (
              <li key={track.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={trackUris.includes(track.uri)}
                    onChange={() => handleTrackSelection(track.uri)}
                  />
                  {track.name} by {track.artist}
                </label>
              </li>
            ))}
          </ul>

          <h2>Your Playlists</h2>
          <h4>Click on a playlist to view tracks</h4>
          <div style={{ marginBottom: "50px" }}>
            <input
              type="text"
              className="text-input"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="New Playlist Name"
              style={{ marginRight: "5px", height: "30px" }}
              size={40}
            />
            <button onClick={handleCreateNewPlaylist}>Create Playlist</button>

            {errorMessage && <p style={{ color: "red", marginTop: "30px" }}>{errorMessage}</p>}
          </div>
          <ul style={{ listStyleType: "none" }}>
            {playlists.map((playlist) => (
              <li
                key={playlist.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  color: "black",
                  marginBottom: "10px",
                  border: "4px solid #ccc", // Add this line for the border
                  padding: "10px", // Optional: Add padding for better spacing
                  borderRadius: "10px" // Optional: Add border-radius for rounded corners
                }}
                onClick={() => handlePlaylistClick(playlist.id, playlist.name)} // Add onClick event here
              >
                <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "center" }}>
                <span style={{ flexGrow: 1, textAlign: "center", fontSize: "15px" }}> {/* Add fontSize here */}
                 {playlist.name}
                 </span>
                  <button
                   onClick={(e) => {
                    e.stopPropagation(); // Prevent the click event from bubbling up to the <li>
                    handleDeletePlaylist(playlist.id);
                  }}
                    style={{ fontSize: "16px", padding: "5px 10px" }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h1>{selectedPlaylist}</h1>
          <button onClick={() => setCurrentView("home")}>Back to Playlists</button>
          <ul>
            {playlistTracks.map((track) => (
              <li key={track.id} style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
                <span style={{ flexGrow: 1 }}>
                  {track.name} by {track.artist}
                </span>
                <button onClick={() => handleDeleteTrack(track.uri)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;