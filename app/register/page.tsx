"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/utils/auth";

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    gender: "m",
    address: "",
    role: "artist",
  });
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<any>({});
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors: any = {};

    // Check required fields
    if (!formData.first_name) errors.first_name = "First name is required";
    if (!formData.last_name) errors.last_name = "Last name is required";
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.password) errors.password = "Password is required";
    if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";

    // Validate Date of Birth
    if (formData.dob) {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      if (dobDate > today) errors.dob = "Date of birth cannot be in the future";
    }

    // Validate Address
    if (!formData.address) errors.address = "Address is required";

    // Check role
    if (!formData.role) errors.role = "Role is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/");
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while registering");
    }
  };

  if (currentUser) {
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-red-500">
          Register
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
              className={`w-full p-2 border border-gray-300 rounded mt-1 ${
                validationErrors.first_name ? "border-red-500" : ""
              } text-black`}
            />
            {validationErrors.first_name && (
              <p className="text-red-500 text-sm">
                {validationErrors.first_name}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              className={`w-full p-2 border border-gray-300 rounded mt-1 ${
                validationErrors.last_name ? "border-red-500" : ""
              } text-black`}
            />
            {validationErrors.last_name && (
              <p className="text-red-500 text-sm">
                {validationErrors.last_name}
              </p>
            )}
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={`w-full p-2 border border-gray-300 rounded mt-1 ${
                validationErrors.email ? "border-red-500" : ""
              } text-black`}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-sm">{validationErrors.email}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={`w-full p-2 border border-gray-300 rounded mt-1 ${
                validationErrors.password ? "border-red-500" : ""
              } text-black`}
            />
            {validationErrors.password && (
              <p className="text-red-500 text-sm">
                {validationErrors.password}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
            />
          </div>
          <div>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={`w-full p-2 border border-gray-300 rounded mt-1 ${
                validationErrors.dob ? "border-red-500" : ""
              } text-black`}
            />
            {validationErrors.dob && (
              <p className="text-red-500 text-sm">{validationErrors.dob}</p>
            )}
          </div>
          <div>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
            >
              <option value="m">Male</option>
              <option value="f">Female</option>
              <option value="o">Other</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className={`w-full p-2 border border-gray-300 rounded mt-1 ${
                validationErrors.address ? "border-red-500" : ""
              } text-black`}
            />
            {validationErrors.address && (
              <p className="text-red-500 text-sm">{validationErrors.address}</p>
            )}
          </div>
          <div>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full p-2 border border-gray-300 rounded mt-1 ${
                validationErrors.role ? "border-red-500" : ""
              } text-black`}
            >
              <option value="super_admin">Super Admin</option>
              <option value="artist_manager">Artist Manager</option>
              <option value="artist">Artist</option>
            </select>
            {validationErrors.role && (
              <p className="text-red-500 text-sm">{validationErrors.role}</p>
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
