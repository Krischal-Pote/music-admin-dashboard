import React, { useEffect, useState } from "react";
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
  const [editingUser, setEditingUser] = useState<Partial<
    User & { _id: string }
  > | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
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
      if (
        editingUser &&
        editingUser._id &&
        editingUser.first_name &&
        editingUser.email
      ) {
        const updatedUser = await updateUser(editingUser._id, editingUser);
        setUsers(users.map((user) => (user._id === id ? updatedUser : user)));
        setEditingUser(null);
      } else {
        setError("All fields are required for updating");
      }
    } catch (err) {
      setError("Failed to update user");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      setError("Failed to delete user");
    }
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
              <th className="px-4 py-2 text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="border px-4 py-2 text-black">
                  {user.first_name}
                </td>
                <td className="border px-4 py-2 text-black">{user.email}</td>
                <td className="border px-4 py-2 text-black">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit User Form */}
      {editingUser && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Edit User</h3>
          <input
            type="text"
            placeholder="Name"
            value={editingUser.first_name || ""}
            onChange={(e) =>
              setEditingUser({ ...editingUser, first_name: e.target.value })
            }
            className="border px-2 py-1 mr-2"
          />
          <input
            type="email"
            placeholder="Email"
            value={editingUser.email || ""}
            onChange={(e) =>
              setEditingUser({ ...editingUser, email: e.target.value })
            }
            className="border px-2 py-1 mr-2"
          />
          <button
            onClick={() => handleUpdateUser(editingUser._id!)}
            className="bg-green-500 text-white px-4 py-2"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default UserTab;
