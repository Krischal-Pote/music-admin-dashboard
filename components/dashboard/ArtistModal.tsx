import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import ArtistForm from "./ArtistForm";
import { createArtist, updateArtist } from "../../utils/artist";

interface ArtistModalProps {
  artist?: any;
  visible: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const ArtistModal: React.FC<ArtistModalProps> = ({
  artist,
  visible,
  onClose,
  onUpdate,
}) => {
  const [formKey, setFormKey] = useState(0); // Key to reset form

  useEffect(() => {
    if (!artist) {
      setFormKey((prevKey) => prevKey + 1); // Reset form if adding a new artist
    }
  }, [artist]);

  const handleSubmit = async (artistData: any) => {
    try {
      if (artist) {
        await updateArtist(artist._id, artistData);
      } else {
        await createArtist(artistData);
      }
      onClose(); // Close modal after submit
      onUpdate(); // Trigger update in the parent component
    } catch (error) {
      console.error("Error handling artist:", error);
    }
  };

  return (
    <Modal
      title={artist ? "Edit Artist" : "Add New Artist"}
      visible={visible}
      onCancel={onClose}
      footer={null}
      afterClose={() => setFormKey((prevKey) => prevKey + 1)}
    >
      <ArtistForm
        key={formKey}
        onSubmit={handleSubmit}
        initialValues={artist}
      />
    </Modal>
  );
};

export default ArtistModal;
