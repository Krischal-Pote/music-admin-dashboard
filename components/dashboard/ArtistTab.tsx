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
import ArtistForm from "./ArtistForm";
import Pagination from "../dashboard/Pagination";

const ArtistTab: React.FC = () => {
  const [artists, setArtists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchArtists(currentPage);
  }, [currentPage]);

  const fetchArtists = async (page: number) => {
    setLoading(true);
    const data = await getArtists(page); // Fetch paginated artist data
    setArtists(data.artists);
    setTotalPages(data.totalPages);
    setLoading(false);
  };

  const handleCreateArtist = async (artistData) => {
    await createArtist(artistData);
    fetchArtists(currentPage); // Refresh artist list
  };

  const handleUpdateArtist = async (artistId, updatedData) => {
    await updateArtist(artistId, updatedData);
    fetchArtists(currentPage); // Refresh artist list
  };

  const handleDeleteArtist = async (artistId) => {
    await deleteArtist(artistId);
    fetchArtists(currentPage); // Refresh artist list
  };

  const handleCSVImport = async (file) => {
    await importCSV(file);
    fetchArtists(currentPage); // Refresh artist list
  };

  const handleCSVExport = async () => {
    await exportCSV();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Artist Management</h2>

      {/* Create Artist */}
      <ArtistForm onSubmit={handleCreateArtist} />

      {/* CSV Import/Export */}
      <div className="my-4">
        <button
          className="mr-4 px-4 py-2 bg-blue-500 text-white"
          onClick={handleCSVExport}
        >
          Export Artists CSV
        </button>
        <input
          type="file"
          onChange={(e) => handleCSVImport(e.target.files[0])}
        />
      </div>

      {/* Artist List */}
      {loading ? (
        <p>Loading artists...</p>
      ) : (
        <div>
          <ul>
            {artists.map((artist) => (
              <li key={artist.id} className="mb-4">
                <p>{artist.name}</p>
                <div>
                  <button
                    onClick={() =>
                      router.push(`/dashboard/artists/${artist.id}/songs`)
                    }
                  >
                    View Songs
                  </button>
                  <button onClick={() => handleUpdateArtist(artist.id, artist)}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteArtist(artist.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default ArtistTab;
