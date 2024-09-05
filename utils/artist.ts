interface Artist {
  id: number;
  name: string;
  dob: string;
  gender: string;
  address: string;
  // Add other fields as per your artist schema
}

// Function to get the list of artists
export const getArtists = async (): Promise<Artist[]> => {
  try {
    const response = await fetch("/api/artists", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch artists");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching artists:", error);
    return [];
  }
};

// Function to create a new artist
export const createArtist = async (artist: Artist): Promise<void> => {
  try {
    const response = await fetch("/api/artists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(artist),
    });

    if (!response.ok) {
      throw new Error("Failed to create artist");
    }
  } catch (error) {
    console.error("Error creating artist:", error);
  }
};

// Function to update an existing artist
export const updateArtist = async (
  id: number,
  artist: Artist
): Promise<void> => {
  try {
    const response = await fetch(`/api/artists/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(artist),
    });

    if (!response.ok) {
      throw new Error("Failed to update artist");
    }
  } catch (error) {
    console.error("Error updating artist:", error);
  }
};

// Function to delete an artist
export const deleteArtist = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`/api/artists/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete artist");
    }
  } catch (error) {
    console.error("Error deleting artist:", error);
  }
};

// Function to import artists via CSV
export const importCSV = async (file: File): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/artists/import-csv", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to import CSV");
    }
  } catch (error) {
    console.error("Error importing CSV:", error);
  }
};

// Function to export artists to CSV
export const exportCSV = async (): Promise<void> => {
  try {
    const response = await fetch("/api/artists/export-csv", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to export CSV");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "artists.csv");
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error("Error exporting CSV:", error);
  }
};
