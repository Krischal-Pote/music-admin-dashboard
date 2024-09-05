"use client";

import React, { useState } from "react";

interface ArtistFormProps {
  initialData?: {
    name: string;
    genre: string;
  };
  onSubmit: (data: { name: string; genre: string }) => void;
}

const ArtistForm: React.FC<ArtistFormProps> = ({
  initialData = { name: "", genre: "" },
  onSubmit,
}) => {
  const [artistData, setArtistData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setArtistData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(artistData);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-2">
        <label htmlFor="name" className="block mb-1 font-bold">
          Artist Name:
        </label>
        <input
          id="name"
          name="name"
          value={artistData.name}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
          required
        />
      </div>

      <div className="mb-2">
        <label htmlFor="genre" className="block mb-1 font-bold">
          Genre:
        </label>
        <input
          id="genre"
          name="genre"
          value={artistData.genre}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
          required
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        {initialData ? "Update Artist" : "Create Artist"}
      </button>
    </form>
  );
};

export default ArtistForm;
