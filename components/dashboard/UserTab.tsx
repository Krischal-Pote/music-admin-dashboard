import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { User } from "../../types";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../utils/api";

const UserTab: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<Partial<User>>({});
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editingUserData, setEditingUserData] = useState<Partial<User>>({});
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleCreateUser = async () => {
    try {
      if (newUser.first_name && newUser.email) {
        const createdUser = await createUser(newUser);
        setUsers([...users, createdUser]);
        setNewUser({});
      } else {
        setError("Name and email are required");
      }
    } catch (err) {
      setError("Failed to create user");
    }
  };

  const handleUpdateUser = async (id: string) => {
    try {
      if (editingUserData.first_name && editingUserData.email) {
        const updatedUser = await updateUser(id, editingUserData);

        // Update the user in the local state
        setUsers(
          users.map((user) =>
            user._id === id ? { ...user, ...editingUserData } : user
          )
        );
        setEditingUser(null); // Reset editing state
        setEditingUserData({});
      } else {
        setError("Name and email are required for updating");
      }
    } catch (err) {
      setError(`Failed to update user`);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user._id);
    // Pre-fill all the input fields with the current user's data
    setEditingUserData({
      first_name: user.first_name,
      email: user.email,
      phone: user.phone || "", // Default to an empty string if phone is missing
      gender: user.gender || "",
      dob: user.dob ? new Date(user.dob).toISOString().substring(0, 10) : "",
      role: user.role || "",
      address: user.address || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null); // Cancel the editing
    setEditingUserData({});
  };

  const showDeleteModal = (id: string) => {
    setUserToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteUser = async () => {
    try {
      if (userToDelete) {
        await deleteUser(userToDelete);
        setUsers(users.filter((user) => user._id !== userToDelete));
        setIsDeleteModalVisible(false);
        setUserToDelete(null);
      }
    } catch (err) {
      console.log("Error deleting user:", err);
      setError("Failed to delete user");
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setUserToDelete(null);
  };

  return (
    <div>
      {/* Create User Form */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Create New User</h3>
        <input
          type="text"
          placeholder="Name"
          value={newUser.first_name || ""}
          onChange={(e) =>
            setNewUser({ ...newUser, first_name: e.target.value })
          }
          className="border px-2 py-1 mr-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email || ""}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="border px-2 py-1 mr-2"
        />
        <button
          onClick={handleCreateUser}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Create
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-black">Name</th>
              <th className="px-4 py-2 text-black">Email</th>
              <th className="px-4 py-2 text-black">Phone</th>
              <th className="px-4 py-2 text-black">Gender</th>
              <th className="px-4 py-2 text-black">DOB</th>
              <th className="px-4 py-2 text-black">Role</th>
              <th className="px-4 py-2 text-black">Address</th>
              <th className="px-4 py-2 text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) =>
              editingUser === user._id ? (
                <tr key={user._id}>
                  {/* Inline editing form */}
                  <td className="border px-4 py-2 text-black">
                    <input
                      type="text"
                      value={editingUserData.first_name || ""}
                      onChange={(e) =>
                        setEditingUserData({
                          ...editingUserData,
                          first_name: e.target.value,
                        })
                      }
                      className="border px-2 py-1 text-black"
                    />
                  </td>
                  <td className="border px-4 py-2 text-black">
                    <input
                      type="email"
                      value={editingUserData.email || ""}
                      onChange={(e) =>
                        setEditingUserData({
                          ...editingUserData,
                          email: e.target.value,
                        })
                      }
                      className="border px-2 py-1 text-black"
                    />
                  </td>
                  <td className="border px-4 py-2 text-black">
                    <input
                      type="text"
                      value={editingUserData.phone || ""}
                      onChange={(e) =>
                        setEditingUserData({
                          ...editingUserData,
                          phone: e.target.value,
                        })
                      }
                      className="border px-2 py-1 text-black"
                    />
                  </td>
                  <td className="border px-4 py-2 text-black">
                    <select
                      value={editingUserData.gender || ""}
                      onChange={(e) =>
                        setEditingUserData({
                          ...editingUserData,
                          gender: e.target.value,
                        })
                      }
                      className="border px-2 py-1 text-black"
                    >
                      <option value="">Select Gender</option>
                      <option value="m">Male</option>
                      <option value="f">Female</option>
                      <option value="o">Other</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2 text-black">
                    <input
                      type="date"
                      value={editingUserData.dob || ""}
                      onChange={(e) =>
                        setEditingUserData({
                          ...editingUserData,
                          dob: e.target.value,
                        })
                      }
                      className="border px-2 py-1 text-black"
                    />
                  </td>
                  <td className="border px-4 py-2 text-black">
                    <select
                      value={editingUserData.role || ""}
                      onChange={(e) =>
                        setEditingUserData({
                          ...editingUserData,
                          role: e.target.value,
                        })
                      }
                      className="border px-2 py-1 text-black"
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="User">User</option>
                      <option value="Manager">Manager</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2 text-black">
                    <input
                      type="text"
                      placeholder="Address"
                      value={editingUserData.address || ""}
                      onChange={(e) =>
                        setEditingUserData({
                          ...editingUserData,
                          address: e.target.value,
                        })
                      }
                      className="border px-2 py-1 text-black"
                    />
                  </td>
                  <td className="border px-4 py-2 text-black">
                    <button
                      onClick={() => handleUpdateUser(user._id)}
                      className="text-green-500 hover:underline mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-red-500 hover:underline"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={user._id}>
                  <td className="border px-4 py-2 text-black">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="border px-4 py-2 text-black">{user.email}</td>
                  <td className="border px-4 py-2 text-black">{user.phone}</td>
                  <td className="border px-4 py-2 text-black">{user.gender}</td>
                  <td className="border px-4 py-2 text-black">
                    {new Date(user.dob).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2 text-black">{user.role}</td>
                  <td className="border px-4 py-2 text-black">
                    {user.address}
                  </td>
                  <td className="border px-4 py-2 text-black">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => showDeleteModal(user._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        visible={isDeleteModalVisible}
        onOk={handleDeleteUser}
        onCancel={handleCancelDelete}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>
    </div>
  );
};

export default UserTab;
