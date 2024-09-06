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
import ArtistModal from "./ArtistModal";

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
    const data = await getArtists(page);
    console.log("data", data);
    setArtists(data.artists);
    setTotalPages(data.totalPages);
    setLoading(false);
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
    const response = await fetch(`/api/artists/export`, {
      method: "GET",
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "artists.csv"; // Name of the file
    document.body.appendChild(a);
    a.click();
    a.remove(); // Clean up
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Artist Management</h2>

      {/* Create Artist */}
      <ArtistModal />

      {/* CSV Import/Export */}
      <div className="my-4 flex justify-between">
        <div>
          Import the artists data form a CSV file<br></br>
          <input
            type="file"
            onChange={(e) => handleCSVImport(e.target.files[0])}
          />
        </div>
        <div>
          <button
            className="mr-4 px-4 py-2 bg-blue-500 text-white"
            onClick={handleCSVExport}
          >
            Export Artists CSV
          </button>
        </div>
      </div>

      {/* Artist List */}
      {loading ? (
        <p>Loading artists...</p>
      ) : (
        <div>
          {artists.length === 0 ? (
            <p>No data available</p>
          ) : (
            <div>
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Date of Birth</th>
                    <th className="px-4 py-2">Gender</th>
                    <th className="px-4 py-2">Address</th>
                    <th className="px-4 py-2">First Release Year</th>
                    <th className="px-4 py-2">No. of Albums Released</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {artists.map((artist) => (
                    <tr key={artist._id} className="mb-4">
                      <td className="border px-4 py-2">{artist.name}</td>
                      <td className="border px-4 py-2">
                        {artist.dob
                          ? new Date(artist.dob).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        {artist.gender === "m"
                          ? "Male"
                          : artist.gender === "f"
                          ? "Female"
                          : "Other"}
                      </td>
                      <td className="border px-4 py-2">
                        {artist.address || "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        {artist.first_release_year || "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        {artist.no_of_albums_released || "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          className="mr-2 px-4 py-2 bg-blue-500 text-white"
                          onClick={() =>
                            router.push(
                              `/dashboard/artists/${artist._id}/songs`
                            )
                          }
                        >
                          View Songs
                        </button>
                        <button
                          className="mr-2 px-4 py-2 bg-green-500 text-white"
                          onClick={() => handleUpdateArtist(artist._id, artist)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-4 py-2 bg-red-500 text-white"
                          onClick={() => handleDeleteArtist(artist._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArtistTab;
