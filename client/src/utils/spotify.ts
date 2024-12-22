const clientId = "b882678eade24632875c7239a44956c0";
const redirectUri = "http://localhost:3000/spotify";

let accessToken: string;
let tokenExpirationTime: number;

// Types
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

interface SpotifyUser {
  id: string;
}

export function getAccessToken(): string {
  const currentTime = Date.now();

  if (accessToken && currentTime < tokenExpirationTime) {
    return accessToken;
  }

  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const tokenFromHash = hashParams.get("access_token");
  const expiresIn = hashParams.get("expires_in");

  if (tokenFromHash && expiresIn) {
    accessToken = tokenFromHash;
    tokenExpirationTime = currentTime + Number(expiresIn) * 1000;
    window.history.pushState("Access Token", "", "/");
    return accessToken;
  } else {
    const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public%20playlist-modify-private%20user-read-private%20user-read-email&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;
    window.location.href = accessUrl;
  }
  return "";
}

export function search(term: string): Promise<Track[]> {
  const accessToken = getAccessToken();
  return fetch(
    `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(
      term
    )}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )
    .then((response) => response.json())
    .then((data) =>
      data.tracks.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        uri: track.uri,
      }))
    );
}

export function deletePlaylist(playlistId: string): Promise<void> {
  const accessToken = getAccessToken();
  const headers = { Authorization: `Bearer ${accessToken}` };

  return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
    headers,
    method: "DELETE",
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to delete playlist");
    }
  });
}
export function savePlaylist(name: string, trackUris: string[]): Promise<void> {
  const accessToken = getAccessToken();
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  return fetch("https://api.spotify.com/v1/me", { headers })
    .then((response) => response.json())
    .then((user: SpotifyUser) =>
      fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
        headers,
        method: "POST",
        body: JSON.stringify({ name }),
      })
    )
    .then((response) => response.json())
    .then((playlist) =>
      fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
        headers,
        method: "POST",
        body: JSON.stringify({ uris: trackUris }),
      })
    )
    .then(() => {});
}

export async function getUserPlaylists(): Promise<Playlist[]> {
  const accessToken = getAccessToken();
  console.log("HEY YOU: TOKEN BABY", accessToken);
  try {
    const firstResponse = await fetch(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    ).then((response) => response.json());

    console.log("Got some response data", firstResponse);
    return firstResponse.items.map((playlist: any) => ({
      id: playlist.id,
      name: playlist.name,
    }));
  } catch (error) {
    console.error("Did a very sad job", error);
    return [];
  }
}

export function getPlaylistTracks(playlistId: string): Promise<Track[]> {
  const accessToken = getAccessToken();
  return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
    .then((response) => response.json())
    .then((data) =>
      data.items.map((item: any) => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists[0].name,
      }))
    );
}

export function deleteTrackFromPlaylist(
  playlistId: string,
  trackUri: string
): Promise<void> {
  const accessToken = getAccessToken();
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers,
    method: "DELETE",
    body: JSON.stringify({ tracks: [{ uri: trackUri }] }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to delete track");
    }
  });
}
export function addTracksToPlaylist(
  playlistId: string,
  trackUris: string[]
): Promise<void> {
  const accessToken = getAccessToken();
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers,
    method: "POST",
    body: JSON.stringify({ uris: trackUris }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to add tracks to playlist");
    }
  });
}
