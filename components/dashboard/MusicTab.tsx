"use client";

import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Select, Form } from "antd";
import { useSearchParams } from "next/navigation";
import {
  getSongsByArtist,
  createSong,
  updateSong,
  deleteSong,
  getSongsForArtist,
} from "../../utils/songApi"; // API functions
import { getArtists } from "@/utils/artist";
import { getCurrentUser } from "@/utils/auth";

const { Option } = Select;

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
  artistId?: string; // Expect artistId as a prop or passed from parent
}

const MusicTab: React.FC<MusicTabProps> = ({ userRole }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const user = getCurrentUser();
  const artistId = user?.id;

  const [newSong, setNewSong] = useState({
    title: "",
    album_name: "",
    genre: "rnb",
    artistId: artistId,
  });
  const [editingSong, setEditingSong] = useState<{
    id: string;
    title: string;
    album_name?: string;
    genre: "rnb" | "country" | "classic" | "rock" | "jazz";
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    fetchSongs();
  }, [artistId]);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      if (artistId) {
        const data = await getSongsForArtist(artistId);
        setSongs(data.songs);
      }
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSong = async () => {
    try {
      if (newSong.artistId && newSong.title && newSong.genre) {
        const newSongData = await createSong(newSong);
        setSongs([...songs, newSongData.song]); // Add the new song to the state
        setNewSong({
          title: "",
          album_name: "",
          genre: "rnb",
          artistId: artistId,
        });
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

  const handleUpdateSong = async () => {
    if (editingSong) {
      try {
        const updatedSong = await updateSong(editingSong._id, {
          title: editingSong.title,
          album_name: editingSong.album_name,
          genre: editingSong.genre,
        });
        setSongs(
          songs.map((s) => (s.id === editingSong.id ? updatedSong.updated : s))
        );
        setEditingSong(null); // Close the modal
        setIsEditModalVisible(false); // Close the edit modal
      } catch (error) {
        console.error("Error updating song:", error);
      }
    }
  };

  const handleDeleteSong = async (deleteSongId: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this song?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteSong(deleteSongId);
          setSongs((prevSongs) =>
            prevSongs.filter((song) => song._id !== deleteSongId)
          );
        } catch (error) {
          console.error("Error while deleting song:", error);
        }
      },
      onCancel() {
        setIsDeleteModalVisible(false);
      },
    });
  };

  const handleCancel = () => {
    setNewSong({ title: "", album_name: "", genre: "rnb", artistId: "" });
    setIsModalVisible(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Music Management</h2>

      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Create New Song
      </Button>

      <Modal
        title="Create New Song"
        open={isModalVisible}
        onOk={handleCreateSong}
        onCancel={handleCancel}
        okText="Create"
        cancelText="Cancel"
      >
        <Form layout="vertical">
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
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table-auto w-full mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Album</th>
              <th className="px-4 py-2">Genre</th>
              {(userRole === "artist" || userRole === "artist_manager") && (
                <th className="px-4 py-2">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {songs.map((song, idx) => (
              <tr key={idx} className="border-b">
                <td className="border px-4 py-2">{song.title}</td>
                <td className="border px-4 py-2">{song.album_name}</td>
                <td className="border px-4 py-2">{song.genre}</td>
                {(userRole === "artist" || userRole === "artist_manager") && (
                  <td className="border px-4 py-2">
                    <Button
                      className="mt-2 mr-2"
                      type="primary"
                      onClick={() => {
                        setEditingSong(song); // Set the current song in the editing state
                        setIsEditModalVisible(true); // Open the edit modal
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      className="mt-2"
                      danger
                      onClick={() => handleDeleteSong(song._id)}
                    >
                      Delete
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal
        title="Edit Song"
        open={isEditModalVisible}
        onOk={handleUpdateSong} // Handle the update when clicking OK
        onCancel={() => setIsEditModalVisible(false)} // Close the modal on cancel
        okText="Update"
        cancelText="Cancel"
      >
        <Form layout="vertical">
          <Form.Item label="Song Title">
            <Input
              value={editingSong?.title}
              onChange={(e) =>
                setEditingSong({ ...editingSong, title: e.target.value })
              }
              placeholder="Song Title"
            />
          </Form.Item>

          <Form.Item label="Album Name (Optional)">
            <Input
              value={editingSong?.album_name}
              onChange={(e) =>
                setEditingSong({ ...editingSong, album_name: e.target.value })
              }
              placeholder="Album Name (Optional)"
            />
          </Form.Item>

          <Form.Item label="Genre">
            <Select
              value={editingSong?.genre}
              onChange={(value) =>
                setEditingSong({
                  ...editingSong,
                  genre: value as
                    | "rnb"
                    | "country"
                    | "classic"
                    | "rock"
                    | "jazz",
                })
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
    </div>
  );
};

export default MusicTab;
