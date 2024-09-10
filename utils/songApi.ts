export const getSongsForArtist = async (artistId: string) => {
  try {
    const response = await fetch(`/api/songs?artistId=${artistId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch songs");
    }
    return await response.json();
  } catch (err) {
    console.log("err", err);
  }
};

export const createSong = async (songData: any) => {
  try {
    const response = await fetch(`/api/songs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: songData.title,
        album_name: songData.album_name,
        genre: songData.genre,
        artistId: songData.artistId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      throw new Error(`Failed to create song: ${response.statusText}`);
    }

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.error("Error while creating song:", error);
    throw error;
  }
};

export const updateSong = async (songId: string, songData: any) => {
  const response = await fetch(`/api/songs/${songId}`, {
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

export const deleteSong = async (songId: string) => {
  const response = await fetch(`/api/songs/${songId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete song");
  }

  const data = await response.json();

  if (data.success) {
    return true;
  } else {
    throw new Error("Failed to delete song");
  }
};

export const getAllSongs = async () => {
  const response = await fetch(`/api/songs/all`, {
    method: "GET", // Explicitly specify the method
  });
  if (!response.ok) {
    throw new Error("Failed to fetch songs");
  }
  return await response.json();
};
