export const getArtists = async (page: number) => {
  // Make an API call to fetch paginated artists
  const response = await fetch(`/api/artists?page=${page}`);
  return await response.json();
};

export const createArtist = async (artistData) => {
  const response = await fetch(`/api/artists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(artistData), // Send all form data
  });

  if (!response.ok) {
    throw new Error("Failed to create artist");
  }

  return await response.json(); // Return the parsed JSON response
};

export const updateArtist = async (artistId, updatedData) => {
  // API call to update an artist
  const response = await fetch(`/api/artists/${artistId}`, {
    method: "PUT",
    body: JSON.stringify(updatedData),
  });
  return await response.json();
};

export const deleteArtist = async (artistId) => {
  // API call to delete an artist
  const response = await fetch(`/api/artists/${artistId}`, {
    method: "DELETE",
  });
  return await response.json();
};

export const importCSV = async (file) => {
  // API call to import CSV
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`/api/artists/import`, {
    method: "POST",
    body: formData,
  });
  return await response.json();
};

export const exportCSV = async () => {
  // API call to export artists as CSV
  const response = await fetch(`/api/artists/export`);
  return await response.json();
};
