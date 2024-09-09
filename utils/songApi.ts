// Fetch songs for a specific artist
export const getSongsForArtist = async (artistId: string) => {
  const response = await fetch(`  `);
  if (!response.ok) {
    throw new Error("Failed to fetch songs");
  }
  return await response.json();
};

// Create a new song for an artist// Create a new song for an artist
export const createSong = async (songData: any) => {
  try {
    console.log("Creating song with data:", songData);

    const response = await fetch(`/api/songs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: songData.title,
        album_name: songData.album_name,
        genre: songData.genre,
        artistId: songData.artistId, // Make sure to include artistId
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      throw new Error(`Failed to create song: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log("Song created successfully:", responseData);

    return responseData;
  } catch (error) {
    console.error("Error while creating song:", error);
    throw error;
  }
};

// Update a song for an artist
export const updateSong = async (
  artistId: string,
  songId: string,
  songData: any
) => {
  const response = await fetch(`/api/songs`, {
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
