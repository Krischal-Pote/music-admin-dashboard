"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserTab from "../../components/dashboard/UserTab";
import ArtistTab from "../../components/dashboard/ArtistTab";
import MusicTab from "../../components/dashboard/MusicTab";
import { getCurrentUser } from "@/utils/auth"; // Utility to get the current user
import { UserRole } from "../../types"; // Define user roles as a type

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("");
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const fetchUser = () => {
      const user = getCurrentUser();
      if (!user) {
        router.push("/");
      } else {
        setUserRole(user.role);
        // Set the initial active tab based on user role
        if (user.role === "super_admin") {
          setActiveTab("user");
        } else if (user.role === "artist_manager") {
          setActiveTab("artist");
        } else if (user.role === "artist") {
          setActiveTab("music");
        }
      }
    };

    fetchUser();
  }, [router]);

  const renderTabContent = () => {
    if (activeTab === "user" && userRole === "super_admin") {
      return <UserTab />;
    }

    if (
      activeTab === "artist" &&
      (userRole === "super_admin" || userRole === "artist_manager")
    ) {
      return <ArtistTab />;
    }

    if (
      activeTab === "music" &&
      (userRole === "super_admin" ||
        userRole === "artist_manager" ||
        userRole === "artist")
    ) {
      return <MusicTab userRole={userRole} />;
    }

    return null; // Default return if no conditions are met
  };

  if (!userRole) {
    return null;
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/5 bg-gray-100 p-4 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <div className="flex flex-col space-y-4">
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
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-[90%] p-8">
        <div className="w-[100%] flex justify-end">
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

        {renderTabContent()}
      </div>
    </div>
  );
};

export default DashboardPage;
