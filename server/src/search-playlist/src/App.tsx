import React, { useState, useEffect } from "react";
import "./App.css";
import { search, savePlaylist, getUserPlaylists, getPlaylistTracks, deletePlaylist } from "./utils/spotify";

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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlistName, setPlaylistName] = useState<string>("");
  const [trackUris, setTrackUris] = useState<string[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentView, setCurrentView] = useState<string>("home");
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    getUserPlaylists().then(setPlaylists);
  }, []);

  const handleSearch = () => {
    if (!searchTerm) return;
    search(searchTerm).then(setTracks);
  };

  const handleSavePlaylist = () => {
    if (!playlistName || trackUris.length === 0) {
      setErrorMessage("Please provide a playlist name and select tracks.");
      return;
    }

    const playlistExists = playlists.some(
      (playlist) => playlist.name.toLowerCase() === playlistName.toLowerCase()
    );
  
    if (playlistExists) {
      setErrorMessage("A playlist with this name already exists.");
      return;
    
    }
    savePlaylist(playlistName, trackUris).then(() => {
      setPlaylistName("");
      setTrackUris([]);
      setTracks([]);
      getUserPlaylists().then(setPlaylists);
      setErrorMessage("");
    });
  };

  const handleTrackSelection = (uri: string) => {
    setTrackUris((prevUris) =>
      prevUris.includes(uri) ? prevUris.filter((t) => t !== uri) : [...prevUris, uri]
    );
  };

  const handlePlaylistClick = (playlistId: string, playlistName: string) => {
    setSelectedPlaylist(playlistName);
    getPlaylistTracks(playlistId).then((tracks) => {
      setPlaylistTracks(tracks);
      setCurrentView("playlistTracks");
    });
  };

  const handleDeletePlaylist = (playlistId: string) => {
    deletePlaylist(playlistId)
      .then(() => {
        setPlaylists((prevPlaylists) => prevPlaylists.filter((p) => p.id !== playlistId));
      })
      .catch((error) => {
        console.error("Error deleting playlist:", error);
      });
  };

  return (
    <div className="App">
      {currentView === "home" ? (
        <>
          <h1>TuneSphere Playlist Manager</h1>
          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for artists, songs..."
              style={{ marginRight: "5px" }} // Add margin to the right
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <div style={{ marginTop: "5px" }}>

          
            <input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="Playlist Name"
              style={{ marginRight: "5px" }} // Add margin to the right
            />
            <button onClick={handleSavePlaylist}>Save Playlist</button>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </div>

          <h2>Search Results</h2>
          <ul>
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
          <ul style={{ listStyleType: "none" }}>
            {playlists.map((playlist) => (
              <li key={playlist.id} style={{ cursor: "pointer", color: "black" }}>
                <span onClick={() => handlePlaylistClick(playlist.id, playlist.name)}style={{ marginRight: "5px" }}>
                  {playlist.name}
                </span>
                <button onClick={() => handleDeletePlaylist(playlist.id)}>Delete</button>
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
              <li key={track.id}>
                {track.name} by {track.artist}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;