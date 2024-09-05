"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getSongsForArtist } from "../../../../../utils/songApi"; // API for fetching songs

const ArtistSongs: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // Get artist ID from route
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const data = await getSongsForArtist(id);
      setSongs(data.songs);
    };

    fetchSongs();
  }, [id]);

  return (
    <div>
      <h2>Songs for Artist {id}</h2>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>{song.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default ArtistSongs;
