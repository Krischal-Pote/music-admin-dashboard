export const getArtists = async (page: number) => {
  // Make an API call to fetch paginated artists
  const response = await fetch(`/api/artists?page=${page}`);
  return await response.json();
};

export const createArtist = async (artistData) => {
  try {
    const response = await fetch(`/api/artists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(artistData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create artist");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating artist:", error);
    throw error;
  }
};

export const updateArtist = async (artistId, updatedData) => {
  console.log("updateID", artistId);
  try {
    const response = await fetch(`/api/artists/${artistId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update artist");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating artist:", error);
    throw error;
  }
};

export const deleteArtist = async (artistId) => {
  // API call to delete an artist
  console.log("delete artist", artistId);
  const response = await fetch(`/api/artists/${artistId}`, {
    method: "DELETE",
  });
  return await response.json();
};

export const importCSV = async (artistsData: any[]) => {
  try {
    const response = await fetch("/api/artists/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ artists: artistsData }),
    });

    console.log("response", response);

    if (!response.ok) {
      throw Error("Failed to import artists");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error importing artists:", error);
    throw error;
  }
};

export const exportCSV = async () => {
  // API call to export artists as CSV
  const response = await fetch(`/api/artists/export`);
  return await response.json();
};
