"use client";

import React, { useEffect, useState } from "react";
import {
  getMusicByArtist,
  createMusic,
  updateMusic,
  deleteMusic,
} from "@/utils/music";
import { UserRole } from "../../types";

interface Music {
  id: number;
  title: string;
  album_name: string;
  genre: string;
  artist_id: number;
  // add other fields as per your music schema
}

const MusicTab: React.FC<{ artistId: number; userRole: UserRole }> = ({
  artistId,
  userRole,
}) => {
  const [musicList, setMusicList] = useState<Music[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMusic = async () => {
      setIsLoading(true);
      const musicData = await getMusicByArtist(artistId);
      setMusicList(musicData);
      setIsLoading(false);
    };

    fetchMusic();
  }, [artistId]);

  const handleCreate = async (music: Music) => {
    await createMusic(music);
    setMusicList(await getMusicByArtist(artistId));
  };

  const handleUpdate = async (id: number, music: Music) => {
    await updateMusic(id, music);
    setMusicList(await getMusicByArtist(artistId));
  };

  const handleDelete = async (id: number) => {
    await deleteMusic(id);
    setMusicList(await getMusicByArtist(artistId));
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Music Management</h2>
      {/* Render music table */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {/* Table headers */}
            <th>Title</th>
            <th>Album Name</th>
            <th>Genre</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {musicList.map((music) => (
            <tr key={music.id}>
              <td>{music.title}</td>
              <td>{music.album_name}</td>
              <td>{music.genre}</td>
              <td>
                {/* Update and delete buttons for artist */}
                {userRole === "artist" && (
                  <>
                    <button
                      onClick={() => handleUpdate(music.id, music)}
                      className="bg-yellow-500 text-white px-2 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(music.id)}
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

export default MusicTab;
