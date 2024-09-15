import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, Button } from "antd";
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
import Papa from "papaparse";
import { getCurrentUser } from "@/utils/auth";

const ArtistTab: React.FC = () => {
  const [artists, setArtists] = useState<any[]>([]);
  console.log("artists", artists);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [isArtistModalVisible, setIsArtistModalVisible] = useState(false); // Control modal visibility
  const router = useRouter();
  const user = getCurrentUser();
  useEffect(() => {
    fetchArtists(currentPage);
  }, [currentPage]);

  const fetchArtists = async (page: number) => {
    setLoading(true);
    const data = await getArtists(page);
    setArtists(data.artists);
    setTotalPages(data.totalPages);
    setLoading(false);
  };

  // Function to handle adding a new artist
  const handleAddArtist = () => {
    setSelectedArtist(null); // Clear selected artist for new artist creation
    setIsArtistModalVisible(true); // Show the modal for adding a new artist
  };

  const handleEditArtist = (artist: any) => {
    setSelectedArtist(artist); // Set the selected artist for editing
    setIsArtistModalVisible(true); // Show the modal for editing
  };

  const handleUpdateArtist = async (artistId, updatedData) => {
    await updateArtist(artistId, updatedData);
    fetchArtists(currentPage); // Refresh artist list
  };

  const handleDeleteArtist = async (artistId) => {
    const cleanedArtistId = artistId;

    Modal.confirm({
      title: "Are you sure you want to delete this artist?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        await deleteArtist(cleanedArtistId);
        fetchArtists(currentPage);
      },
      onCancel() {},
    });
  };

  const handleCSVImport = async (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        const importedArtists = result.data;
        await importCSV(importedArtists);
        setArtists(importedArtists);
        fetchArtists(currentPage);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
      },
    });
  };

  const handleCSVExport = async () => {
    const response = await fetch(`/api/artists/export`, {
      method: "GET",
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "artists.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Artist Management</h2>

      {user?.role === "artist_manager" && (
        <>
          <Button type="primary" onClick={handleAddArtist}>
            Add Artist
          </Button>
          <div className="my-4 flex justify-between">
            <div>
              Import the artists data from a CSV file
              <br />
              <input
                type="file"
                accept=".csv"
                onChange={(e) => handleCSVImport(e.target.files?.[0])}
              />
            </div>
            <div>
              <Button className="mr-4" type="primary" onClick={handleCSVExport}>
                Export Artists CSV
              </Button>
            </div>
          </div>
        </>
      )}

      <ArtistModal
        artist={selectedArtist}
        visible={isArtistModalVisible} // Pass visibility control
        onClose={() => setIsArtistModalVisible(false)} // Close the modal when action completes
        onUpdate={() => fetchArtists(currentPage)} // Refresh artist list after changes
      />

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
                      <td className="border px-4 py-2">{artist.artist_name}</td>
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
                        <Button
                          className="mr-2"
                          type="primary"
                          onClick={() =>
                            router.push(`/dashboard/songs/${artist._id}`)
                          }
                        >
                          View Songs
                        </Button>
                        <Button
                          className="mr-2"
                          type="primary"
                          onClick={() => handleEditArtist(artist)}
                        >
                          Edit
                        </Button>
                        <Button
                          className="mr-2"
                          type="primary"
                          danger
                          onClick={() => handleDeleteArtist(artist._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

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
