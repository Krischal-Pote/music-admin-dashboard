// Fetch songs for a specific artist
export const getSongsForArtist = async (artistId: string) => {
  const response = await fetch(`/api/artists/${artistId}/songs`);
  if (!response.ok) {
    throw new Error("Failed to fetch songs");
  }
  return await response.json();
};

// Create a new song for an artist
export const createSong = async (artistId: string, songData: any) => {
  const response = await fetch(`/api/artists/${artistId}/songs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(songData),
  });
  if (!response.ok) {
    throw new Error("Failed to create song");
  }
  return await response.json();
};

// Update a song for an artist
export const updateSong = async (
  artistId: string,
  songId: string,
  songData: any
) => {
  const response = await fetch(`/api/artists/${artistId}/songs/${songId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(songData),
  });
  if (!response.ok) {
    throw new Error("Failed to update song");
  }
  return await response.json();
};

// Delete a song for an artist
export const deleteSong = async (artistId: string, songId: string) => {
  const response = await fetch(`/api/artists/${artistId}/songs/${songId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete song");
  }
  return await response.json();
};
export const getSongsByArtist = async (artistId: string) => {
  const response = await fetch(`/api/artists/?artistId=${artistId}`);
  return response.json();
};
