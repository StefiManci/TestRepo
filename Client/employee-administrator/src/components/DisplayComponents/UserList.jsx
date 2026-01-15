import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../config/api";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [change, setChange] = useState(0);

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get("/auth/get-users");

        console.log("Fetch users response:", response.data.users);

        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          console.error("Failed to fetch users:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchUsers();
    }
  }, [token, change]);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await api.delete(`/Auth/delete-user/${userId}`);

      console.log("Delete user response:", response.data);

      if (response.data.success) {
        setChange((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (!users.length) return <p>No users found.</p>;

  return (
    <div className="w-full h-full mt-8 flex flex-col items-start">
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
          {users.map(({ user, userRoles, customer }) => (
            <tr key={user.id} className="text-center border-t">
              <td className="py-2 px-4 border">{user.id}</td>
              <td className="py-2 px-4 border">{user.userName}</td>
              <td className="py-2 px-4 border">{user.email}</td>
              <td className="py-2 px-4 border">{userRoles.join(", ")}</td>
              <td className="py-2 px-4 border">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                  onClick={() => setEditingUser({ user, userRoles, customer })}
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
      {editingUser && (
        <div className="w-full mt-6 p-6 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">
            Edit User: {editingUser.user.userName}
          </h3>

          <EditUserForm
            user={editingUser.user}
            onCancel={() => setEditingUser(null)}
            customer={editingUser.customer}
          />
        </div>
      )}
    </div>
  );
}

function EditUserForm({ user, onCancel, customer }) {
  const [userName, setUserName] = useState(user.userName);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? "");
  const [fullName, setFullName] = useState(customer?.fullName ?? "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);


  const handleSave = async () => {
    setSaving(true);

    try {
      const payload = {
        UserId: user.id,
        UserName: userName,
        Email: email,
        PhoneNumber: phoneNumber,
        FullName: fullName,
        ...(password.trim() && { Password: password }),
      };

      const response = await api.post("/auth/edit-user", payload);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update user");
      }
      onCancel();
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
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Full Name"
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
