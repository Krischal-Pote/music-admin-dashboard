// utils/music.ts

interface Music {
  id: number;
  title: string;
  album_name: string;
  genre: string;
  artist_id: number;
  // Add other fields as per your music schema
}

// Function to get music by artist ID
export const getMusicByArtist = async (artistId: number): Promise<Music[]> => {
  try {
    const response = await fetch(`/api/artists/${artistId}/music`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch music");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching music:", error);
    return [];
  }
};

// Function to create a new music record
export const createMusic = async (music: Music): Promise<void> => {
  try {
    const response = await fetch("/api/music", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(music),
    });

    if (!response.ok) {
      throw new Error("Failed to create music");
    }
  } catch (error) {
    console.error("Error creating music:", error);
  }
};

// Function to update an existing music record
export const updateMusic = async (id: number, music: Music): Promise<void> => {
  try {
    const response = await fetch(`/api/music/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(music),
    });

    if (!response.ok) {
      throw new Error("Failed to update music");
    }
  } catch (error) {
    console.error("Error updating music:", error);
  }
};

// Function to delete a music record
export const deleteMusic = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`/api/music/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete music");
    }
  } catch (error) {
    console.error("Error deleting music:", error);
  }
};
