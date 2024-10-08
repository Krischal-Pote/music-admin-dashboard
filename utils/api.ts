import { User } from "../types";

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const res = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Failed to login");
    }

    return res.json();
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};
export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch("http://localhost:3000/api/users/all", {
    method: "GET",
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const createUser = async (user: Partial<User>): Promise<User> => {
  const res = await fetch("http://localhost:3000/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
};

// Update an existing user
export async function updateUser(id: string, userData: Partial<User>) {
  const response = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return response.json();
}

// Delete a user
export const deleteUser = async (id: string): Promise<void> => {
  const res = await fetch(`/api/users/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }
};
