import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Select, DatePicker } from "antd";
import moment from "moment";
import { User } from "../../types";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../utils/api";

const { Option } = Select;

const UserTab: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<Partial<User>>({});
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editingUserData, setEditingUserData] = useState<Partial<User>>({});
  const [isCreateModalVisible, setIsCreateModalVisible] =
    useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
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
        await createUser(newUser);

        // Fetch the updated list of users after creating a new user
        const response = await fetchUsers();
        setUsers(response.data);

        setNewUser({});
        setIsCreateModalVisible(false); // Close modal
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
        await updateUser(id, editingUserData);

        // Update the user in the local state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, ...editingUserData } : user
          )
        );
        setEditingUser(null); // Reset editing state
        setEditingUserData({});
        setIsEditModalVisible(false); // Close modal
      } else {
        setError("Name and email are required for updating");
      }
    } catch (err) {
      setError("Failed to update user");
    }
  };

  const handleCreateModalOk = () => {
    handleCreateUser();
  };

  const handleEditModalOk = () => {
    if (editingUser) {
      handleUpdateUser(editingUser);
    }
  };

  const handleCancel = () => {
    setIsCreateModalVisible(false);
    setIsEditModalVisible(false);
    setEditingUser(null);
    setEditingUserData({});
    setNewUser({});
  };

  const showEditModal = (user: User) => {
    setEditingUser(user._id);
    setEditingUserData({
      first_name: user.first_name,
      email: user.email,
      phone: user.phone || "",
      gender: user.gender || "",
      dob: user.dob ? new Date(user.dob).toISOString().substring(0, 10) : "",
      role: user.role || "",
      address: user.address || "",
    });
    setIsEditModalVisible(true);
  };

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const showDeleteModal = (id: string) => {
    setUserToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteUser = async () => {
    try {
      if (userToDelete) {
        await deleteUser(userToDelete);
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userToDelete)
        );
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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Or use another format you prefer
  };

  return (
    <div>
      <div className="mt-4">
        <Button onClick={showCreateModal} type="primary" className="mb-4">
          Create New User
        </Button>
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
            {users.map((user) => (
              <tr key={user._id}>
                <td className="border px-4 py-2 text-black">
                  {user.first_name}
                </td>
                <td className="border px-4 py-2 text-black">{user.email}</td>
                <td className="border px-4 py-2 text-black">{user.phone}</td>
                <td className="border px-4 py-2 text-black">
                  {user.gender === "m"
                    ? "Male"
                    : user.gender === "f"
                    ? "Female"
                    : "Other"}
                </td>
                <td className="border px-4 py-2 text-black">
                  {formatDate(user.dob)}
                </td>
                <td className="border px-4 py-2 text-black">{user.role}</td>
                <td className="border px-4 py-2 text-black">{user.address}</td>
                <td className="border px-4 py-2 text-black">
                  <Button
                    onClick={() => showEditModal(user)}
                    type="primary"
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => showDeleteModal(user._id)}
                    type="danger"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Create User Modal */}
      <Modal
        title="Create User"
        visible={isCreateModalVisible}
        onOk={handleCreateModalOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="First Name"
          value={newUser.first_name || ""}
          onChange={(e) =>
            setNewUser({ ...newUser, first_name: e.target.value })
          }
        />
        <Input
          placeholder="Email"
          type="email"
          value={newUser.email || ""}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <Input
          placeholder="Password"
          type="password"
          value={newUser.password || ""}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <Input
          placeholder="Phone"
          value={newUser.phone || ""}
          onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
        />
        <Select
          placeholder="Select Gender"
          value={newUser.gender || ""}
          onChange={(value) => setNewUser({ ...newUser, gender: value })}
          style={{ width: "100%", marginBottom: 10 }}
        >
          <Option value="m">Male</Option>
          <Option value="f">Female</Option>
          <Option value="o">Other</Option>
        </Select>
        <DatePicker
          format="YYYY-MM-DD"
          placeholder="Date of Birth"
          value={newUser.dob ? moment(newUser.dob) : null}
          onChange={(date) =>
            setNewUser({ ...newUser, dob: date?.format("YYYY-MM-DD") })
          }
          style={{ width: "100%", marginBottom: 10 }}
        />
        <Select
          placeholder="Select Role"
          value={newUser.role || ""}
          onChange={(value) => setNewUser({ ...newUser, role: value })}
          style={{ width: "100%", marginBottom: 10 }}
        >
          <Option value="Admin">Admin</Option>
          <Option value="User">User</Option>
          <Option value="Manager">Manager</Option>
        </Select>
        <Input
          placeholder="Address"
          value={newUser.address || ""}
          onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
        />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        visible={isEditModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="First Name"
          value={editingUserData.first_name || ""}
          onChange={(e) =>
            setEditingUserData({
              ...editingUserData,
              first_name: e.target.value,
            })
          }
        />
        <Input
          placeholder="Email"
          type="email"
          value={editingUserData.email || ""}
          onChange={(e) =>
            setEditingUserData({
              ...editingUserData,
              email: e.target.value,
            })
          }
        />
        <Input
          placeholder="Phone"
          value={editingUserData.phone || ""}
          onChange={(e) =>
            setEditingUserData({
              ...editingUserData,
              phone: e.target.value,
            })
          }
        />
        <Select
          placeholder="Select Gender"
          value={editingUserData.gender || ""}
          onChange={(value) =>
            setEditingUserData({
              ...editingUserData,
              gender: value,
            })
          }
          style={{ width: "100%", marginBottom: 10 }}
        >
          <Option value="m">Male</Option>
          <Option value="f">Female</Option>
          <Option value="o">Other</Option>
        </Select>
        <DatePicker
          format="YYYY-MM-DD"
          placeholder="Date of Birth"
          value={editingUserData.dob ? moment(editingUserData.dob) : null}
          onChange={(date) =>
            setEditingUserData({
              ...editingUserData,
              dob: date?.format("YYYY-MM-DD"),
            })
          }
          style={{ width: "100%", marginBottom: 10 }}
        />
        <Select
          placeholder="Select Role"
          value={editingUserData.role || ""}
          onChange={(value) =>
            setEditingUserData({
              ...editingUserData,
              role: value,
            })
          }
          style={{ width: "100%", marginBottom: 10 }}
        >
          <Option value="Admin">Admin</Option>
          <Option value="User">User</Option>
          <Option value="Manager">Manager</Option>
        </Select>
        <Input
          placeholder="Address"
          value={editingUserData.address || ""}
          onChange={(e) =>
            setEditingUserData({
              ...editingUserData,
              address: e.target.value,
            })
          }
        />
      </Modal>

      {/* Delete User Confirmation Modal */}
      <Modal
        title="Delete User"
        visible={isDeleteModalVisible}
        onOk={handleDeleteUser}
        onCancel={handleCancelDelete}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>
    </div>
  );
};

export default UserTab;
