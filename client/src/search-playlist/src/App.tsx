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

  const handleAddTracksToPlaylist = () => {
    if (!selectedPlaylistForAdding || trackUris.length === 0) {
      setErrorMessage("Please select a playlist and tracks to add.");
      return;
    }

    // Assuming you have a function to add tracks to a playlist
    addTracksToPlaylist(selectedPlaylistForAdding, trackUris)
    .then(() => {
      setTrackUris([]);
      setTracks([]);
      setErrorMessage("");
      // Optionally, refresh the playlist tracks
      getPlaylistTracks(selectedPlaylistForAdding).then(setPlaylistTracks);
  }).catch(() => {
      setErrorMessage("Failed to add tracks to the playlist.");
  });
}

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
  const handleDeleteTrack = (trackUri: string) => {
    if (!selectedPlaylist) return;
  
    const playlist = playlists.find((p) => p.name === selectedPlaylist);
    if (!playlist) return;
  
    console.log(`Deleting track with URI: ${trackUri} from playlist: ${playlist.id}`);
  
    deleteTrackFromPlaylist(playlist.id, trackUri)
      .then(() => {
        setPlaylistTracks((prevTracks) => prevTracks.filter((t) => t.uri !== trackUri));
        console.log(`Track with URI: ${trackUri} deleted successfully.`);
      })
      .catch((error) => {
        console.error("Error deleting track:", error);
      });
  };

  const handleCreateNewPlaylist = () => {
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
              style={{ marginRight: "5px", height:"30px" }} // Add margin to the right
              size={40} // Add size attribute
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <div style={{ marginTop: "5px" }}>

          
          </div>

          {/* New section for adding tracks to an existing playlist */}
        <div style={{ marginTop: "20px" }}>
          <select
            value={selectedPlaylistForAdding}
            onChange={(e) => setSelectedPlaylistForAdding(e.target.value)}
            style={{ 
              marginRight: "5px", // Add margin to the right of the select element
              fontSize: "16px", // Adjust the font size
              padding: "10px" // Adjust the padding for better appearance
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
          <div style={{ marginBottom: "10px" }}>
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
          </div>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
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
      <button onClick={() => handleDeleteTrack(track.id)}>Delete</button>
                
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;