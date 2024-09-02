"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserTab from "../../components/dashboard/UserTab";
// import ArtistTab from "@/components/dashboard/ArtistTab";
// import MusicTab from "@/components/dashboard/MusicTab";
import { getCurrentUser } from "@/utils/auth"; // Utility to get the current user
import { UserRole } from "../../types"; // Define user roles as a type

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("user");
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const currentUser = getCurrentUser();

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const user = await getCurrentUser();
  //     if (!user) {
  //       router.push("/login");
  //     } else {
  //       setUserRole(user.role);
  //     }
  //   };

  //   fetchUser();
  // }, [router]);

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
    }
  }, [currentUser]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "user":
        return <UserTab />;
      case "artist":
      // return <ArtistTab />;
      case "music":
      // return <MusicTab />;
      default:
        return <UserTab />;
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between align-middle">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white"
          onClick={() => {
            localStorage.removeItem("accessToken");
            router.push("/");
          }}
        >
          Logout
        </button>
      </div>
      <div className="flex space-x-4 mb-6">
        {userRole === "super_admin" && (
          <button
            className={`px-4 py-2 text-white ${
              activeTab === "user" ? "bg-blue-500" : "bg-gray-500"
            }`}
            onClick={() => setActiveTab("user")}
          >
            User Management
          </button>
        )}
        {(userRole === "super_admin" || userRole === "artist_manager") && (
          <button
            className={`px-4 py-2 text-white ${
              activeTab === "artist" ? "bg-blue-500" : "bg-gray-500"
            }`}
            onClick={() => setActiveTab("artist")}
          >
            Artist Management
          </button>
        )}
        {(userRole === "super_admin" ||
          userRole === "artist_manager" ||
          userRole === "artist") && (
          <button
            className={`px-4 py-2 text-white ${
              activeTab === "music" ? "bg-blue-500" : "bg-gray-500"
            }`}
            onClick={() => setActiveTab("music")}
          >
            Music Management
          </button>
        )}
      </div>
      {renderTabContent()}
    </div>
  );
};

export default DashboardPage;
