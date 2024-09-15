"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getSongsForArtist } from "../../../../utils/songApi";
import { Button } from "antd";
import { getCurrentUser } from "@/utils/auth";

const SongsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const artistId = params?.id;
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const data = await getSongsForArtist(artistId);
      console.log("data", data);
      setSongs(data.songs);
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">The Artist's Songs</h2>

      {loading ? (
        <p>Loading songs...</p>
      ) : (
        <div>
          {songs.length === 0 ? (
            <p>No songs available</p>
          ) : (
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Artist</th>
                  <th className="px-4 py-2">Album</th>
                  <th className="px-4 py-2">Release Date</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song) => (
                  <tr key={song._id}>
                    <td className="border px-4 py-2">{song.title}</td>
                    <td className="border px-4 py-2">{song.artist_name}</td>
                    <td className="border px-4 py-2">{song.album_name}</td>
                    <td className="border px-4 py-2">
                      {song.releaseDate
                        ? new Date(song.released_date).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default SongsPage;
