"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getArtists,
  createArtist,
  updateArtist,
  deleteArtist,
  importCSV,
  exportCSV,
} from "../../utils/artist";
import { UserRole } from "../../types";

interface Artist {
  id: number;
  name: string;
  dob: string;
  gender: string;
  address: string;
  // add other fields as per your artist schema
}

const ArtistTab: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchArtists = async () => {
      setIsLoading(true);
      const artistsData = await getArtists();
      setArtists(artistsData);
      setIsLoading(false);
    };

    fetchArtists();
  }, []);

  const handleCreate = async (artist: Artist) => {
    await createArtist(artist);
    // Reload artists after creation
    setArtists(await getArtists());
  };

  const handleUpdate = async (id: number, artist: Artist) => {
    await updateArtist(id, artist);
    setArtists(await getArtists());
  };

  const handleDelete = async (id: number) => {
    await deleteArtist(id);
    setArtists(await getArtists());
  };

  const handleImportCSV = async () => {
    await importCSV();
    setArtists(await getArtists());
  };

  const handleExportCSV = async () => {
    await exportCSV();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Artist Management</h2>
      {userRole === "artist_manager" && (
        <button
          onClick={handleImportCSV}
          className="bg-green-500 text-white px-4 py-2 mb-4"
        >
          Import CSV
        </button>
      )}
      {userRole === "artist_manager" && (
        <button
          onClick={handleExportCSV}
          className="bg-blue-500 text-white px-4 py-2 mb-4"
        >
          Export CSV
        </button>
      )}
      {/* Render artists table */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {/* Table headers */}
            <th className="text-black">Name</th>
            <th className="text-black">Date of Birth</th>
            <th className="text-black">Gender</th>
            <th className="text-black">Address</th>
            <th className="text-black"> Actions</th>
          </tr>
        </thead>
        <tbody>
          {artists.map((artist) => (
            <tr key={artist.id}>
              <td>{artist.name}</td>
              <td>{artist.dob}</td>
              <td>{artist.gender}</td>
              <td>{artist.address}</td>
              <td>
                {/* Update and delete buttons for artist_manager */}
                {userRole === "artist_manager" && (
                  <>
                    <button
                      onClick={() => handleUpdate(artist.id, artist)}
                      className="bg-yellow-500 text-white px-2 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(artist.id)}
                      className="bg-red-500 text-white px-2 py-1"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArtistTab;
