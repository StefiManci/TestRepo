import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/Auth/get-users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/Auth/delete-user/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prev) => prev.filter((u) => u.user.id !== userId));

      if (editingUser?.user.id === userId) {
        setEditingUser(null);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (!users.length) return <p>No users found.</p>;

  return (
    <div className="w-full h-full mt-8 flex flex-col items-start">
      {/* USERS TABLE */}
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Username</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Roles</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map(({ user, userRoles }) => (
            <tr key={user.id} className="text-center border-t">
              <td className="py-2 px-4 border">{user.id}</td>
              <td className="py-2 px-4 border">{user.userName}</td>
              <td className="py-2 px-4 border">{user.email}</td>
              <td className="py-2 px-4 border">{userRoles.join(", ")}</td>
              <td className="py-2 px-4 border">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                  onClick={() => setEditingUser({ user, userRoles })}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EDIT SECTION BELOW TABLE */}
      {editingUser && (
        <div className="w-full mt-6 p-6 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">
            Edit User: {editingUser.user.userName}
          </h3>

          <EditUserForm
            user={editingUser.user}
            token={token}
            onCancel={() => setEditingUser(null)}
            onSaved={(updatedUser) => {
              setUsers((prev) =>
                prev.map((u) =>
                  u.user.id === updatedUser.user.id ? updatedUser : u
                )
              );
              setEditingUser(null);
            }}
          />
        </div>
      )}
    </div>
  );
}

function EditUserForm({ user, token, onCancel, onSaved }) {
  const [userName, setUserName] = useState(user.userName);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    const formData = new FormData();
    formData.append("userId", user.id);

    if (userName.trim()) formData.append("userName", userName);
    if (email.trim()) formData.append("email", email);
    if (phoneNumber.trim()) formData.append("phoneNumber", phoneNumber);
    if (password.trim()) formData.append("password", password);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/Auth/edit-user",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const data = await response.json();
      onSaved(data);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        className="border rounded p-2"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Username"
      />

      <input
        className="border rounded p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <input
        className="border rounded p-2"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone Number"
      />

      <input
        type="password"
        className="border rounded p-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New Password (optional)"
      />

      <div className="col-span-full flex gap-3 mt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
