import React, { useState } from "react";
import { Modal, Button } from "antd";
import ArtistForm from "./ArtistForm";
import { createArtist } from "../../utils/artist"; // Import your createArtist function

const ArtistModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (artistData: any) => {
    try {
      await createArtist(artistData); // Call the createArtist function
      setIsModalOpen(false); // Close modal after submission
      console.log("Artist created successfully:", artistData);
    } catch (error) {
      console.error("Error creating artist:", error);
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add Artist
      </Button>
      <Modal
        title="Add New Artist"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null} // Remove the default footer with "OK" and "Cancel" buttons
      >
        <ArtistForm onSubmit={handleSubmit} />
      </Modal>
    </>
  );
};

export default ArtistModal;
