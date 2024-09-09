"use client";

import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Select, Form } from "antd";
import { useSearchParams } from "next/navigation";
import {
  getSongsByArtist,
  createSong,
  updateSong,
  deleteSong,
} from "../../utils/songApi"; // API functions
import { getArtists } from "@/utils/artist";

interface Song {
  id: string;
  title: string;
  album_name?: string;
  genre: "rnb" | "country" | "classic" | "rock" | "jazz";
  created_at: Date;
  updated_at: Date;
}

interface MusicTabProps {
  userRole: string; // Expect userRole as a prop
}

const MusicTab: React.FC<MusicTabProps> = ({ userRole }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [newSong, setNewSong] = useState({
    title: "",
    album_name: "",
    genre: "rnb",
    artistId: "",
  });
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [artists, setArtists] = useState<any[]>([]);

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      const data = await getArtists();
      setArtists(data.artists);
      setLoading(false);
    };

    fetchArtists();
  }, []);
  const handleCreateSong = async () => {
    try {
      if (newSong.artistId && newSong.title && newSong.genre) {
        const newSongData = await createSong({ ...newSong });
        setSongs([...songs, newSongData.song]);
        setNewSong({ title: "", album_name: "", genre: "rnb", artistId: "" });
        setIsModalVisible(false);
      } else {
        console.error(
          "All fields, including artistId, are required to create a new song"
        );
      }
    } catch (err) {
      console.log("Error while creating song:", err);
    }
  };

  const handleUpdateSong = async (song: Song) => {
    if (userRole === "artist") {
      const updatedSong = await updateSong(song.id, song);
      setSongs(songs.map((s) => (s.id === song.id ? updatedSong : s)));
      setEditingSong(null);
    }
  };

  const handleDeleteSong = async (songId: string) => {
    if (userRole === "artist") {
      await deleteSong(songId); // Only artist can delete songs
      setSongs(songs.filter((song) => song.id !== songId));
    }
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setNewSong({ title: "", album_name: "", genre: "rnb", artistId: "" });
    setIsModalVisible(false);
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Music Management </h2>

      <Button type="primary" onClick={showModal}>
        Create New Song
      </Button>

      <Modal
        title="Create New Song"
        visible={isModalVisible}
        onOk={handleCreateSong}
        onCancel={handleCancel}
        okText="Create"
        cancelText="Cancel"
      >
        <Form layout="vertical">
          <Form.Item label="Artist Name">
            <Select
              value={newSong.artistId} // Bind selected artistId to state
              onChange={(value) => setNewSong({ ...newSong, artistId: value })}
              placeholder="Select Artist"
            >
              {artists.map((artist) => (
                <Option key={artist._id} value={artist._id}>
                  {artist.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Song Title">
            <Input
              value={newSong.title}
              onChange={(e) =>
                setNewSong({ ...newSong, title: e.target.value })
              }
              placeholder="Song Title"
            />
          </Form.Item>

          <Form.Item label="Album Name (Optional)">
            <Input
              value={newSong.album_name}
              onChange={(e) =>
                setNewSong({ ...newSong, album_name: e.target.value })
              }
              placeholder="Album Name (Optional)"
            />
          </Form.Item>

          <Form.Item label="Genre">
            <Select
              value={newSong.genre}
              onChange={(value) =>
                setNewSong({ ...newSong, genre: value as Song["genre"] })
              }
            >
              <Option value="rnb">RNB</Option>
              <Option value="country">Country</Option>
              <Option value="classic">Classic</Option>
              <Option value="rock">Rock</Option>
              <Option value="jazz">Jazz</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <ul className="mt-4">
        {songs.map((song) => (
          <li key={song.id} className="p-4 border-b">
            <p>Title: {song.title}</p>
            <p>Album: {song.album_name || "N/A"}</p>
            <p>Genre: {song.genre}</p>
            <p>Created At: {new Date(song.created_at).toLocaleDateString()}</p>
            <p>Updated At: {new Date(song.updated_at).toLocaleDateString()}</p>

            {userRole === "artist" && (
              <>
                <button
                  className="mt-2 px-4 py-2 bg-yellow-500 text-white"
                  onClick={() => setEditingSong(song)}
                >
                  Edit
                </button>
                <button
                  className="mt-2 px-4 py-2 bg-red-500 text-white"
                  onClick={() => handleDeleteSong(song.id)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      {editingSong && (
        <div className="mt-4">
          <h3 className="text-xl font-bold">Edit Song</h3>
          <input
            type="text"
            value={editingSong.title}
            onChange={(e) =>
              setEditingSong({ ...editingSong, title: e.target.value })
            }
            placeholder="Song Title"
            className="px-4 py-2 border"
          />
          <input
            type="text"
            value={editingSong.album_name || ""}
            onChange={(e) =>
              setEditingSong({ ...editingSong, album_name: e.target.value })
            }
            placeholder="Album Name (Optional)"
            className="ml-2 px-4 py-2 border"
          />
          <select
            value={editingSong.genre}
            onChange={(e) =>
              setEditingSong({
                ...editingSong,
                genre: e.target.value as
                  | "rnb"
                  | "country"
                  | "classic"
                  | "rock"
                  | "jazz",
              })
            }
            className="ml-2 px-4 py-2 border"
          >
            <option value="rnb">RNB</option>
            <option value="country">Country</option>
            <option value="classic">Classic</option>
            <option value="rock">Rock</option>
            <option value="jazz">Jazz</option>
          </select>
          <button
            onClick={() => handleUpdateSong(editingSong)}
            className="ml-2 px-4 py-2 bg-green-500 text-white"
          >
            Update Song
          </button>
          <button
            onClick={() => setEditingSong(null)}
            className="ml-2 px-4 py-2 bg-gray-500 text-white"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default MusicTab;
