"use client";

import React, { useState } from "react";

interface ArtistFormProps {
  initialData?: {
    name: string;
    dob?: string;
    gender?: "m" | "f" | "o";
    address?: string;
    first_release_year?: number;
    no_of_albums_released?: number;
  };
  onSubmit: (data: {
    name: string;
    dob?: string;
    gender?: "m" | "f" | "o";
    address?: string;
    first_release_year?: number;
    no_of_albums_released?: number;
  }) => void;
}

const ArtistForm: React.FC<ArtistFormProps> = ({
  initialData = {
    name: "",
    dob: "",
    gender: "m",
    address: "",
    first_release_year: undefined,
    no_of_albums_released: undefined,
  },
  onSubmit,
}) => {
  const [artistData, setArtistData] = useState(initialData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
        <label htmlFor="dob" className="block mb-1 font-bold">
          Date of Birth:
        </label>
        <input
          type="date"
          id="dob"
          name="dob"
          value={artistData.dob}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        />
      </div>

      <div className="mb-2">
        <label htmlFor="gender" className="block mb-1 font-bold">
          Gender:
        </label>
        <select
          id="gender"
          name="gender"
          value={artistData.gender}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        >
          <option value="m">Male</option>
          <option value="f">Female</option>
          <option value="o">Other</option>
        </select>
      </div>

      <div className="mb-2">
        <label htmlFor="address" className="block mb-1 font-bold">
          Address:
        </label>
        <input
          id="address"
          name="address"
          value={artistData.address}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        />
      </div>

      <div className="mb-2">
        <label htmlFor="first_release_year" className="block mb-1 font-bold">
          First Release Year:
        </label>
        <input
          type="number"
          id="first_release_year"
          name="first_release_year"
          value={artistData.first_release_year}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        />
      </div>

      <div className="mb-2">
        <label htmlFor="no_of_albums_released" className="block mb-1 font-bold">
          Number of Albums Released:
        </label>
        <input
          type="number"
          id="no_of_albums_released"
          name="no_of_albums_released"
          value={artistData.no_of_albums_released}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        {initialData ? "Update Artist" : "Create Artist"}
      </button>
    </form>
  );
};

export default ArtistForm;
