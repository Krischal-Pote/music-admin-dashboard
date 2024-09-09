import React, { useState } from "react";
import { Modal, Button } from "antd";
import ArtistForm from "./ArtistForm";
import { createArtist, updateArtist } from "../../utils/artist";

interface ArtistModalProps {
  artist?: any;
  onUpdate: () => void;
}

const ArtistModal: React.FC<ArtistModalProps> = ({ artist, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (artistData: any) => {
    try {
      if (artist) {
        await updateArtist(artist._id, artistData);
      } else {
        await createArtist(artistData);
      }
      setIsModalOpen(false);
      onUpdate();
    } catch (error) {
      console.error("Error handling artist:", error);
    }
  };

  React.useEffect(() => {
    if (artist) {
      showModal();
    }
  }, [artist]);

  return (
    <>
      <Button type="primary" onClick={showModal}>
        {artist ? "Edit Artist" : "Add Artist"}
      </Button>
      <Modal
        title={artist ? "Edit Artist" : "Add New Artist"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <ArtistForm onSubmit={handleSubmit} initialValues={artist} />
      </Modal>
    </>
  );
};

export default ArtistModal;
