import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../config/api";
import { motion, AnimatePresence } from "framer-motion";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [change, setChange] = useState(0);
  const [message, setMessage] = useState(null); // success or error
  const [messageType, setMessageType] = useState("success"); // "success" | "error"

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get("/auth/get-users");

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

    if (token) fetchUsers();
  }, [token, change]);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await api.delete(`/Auth/delete-user/${userId}`);

      if (response.data.success) {
        setMessageType("success");
        setMessage("User deleted successfully!");
        setChange((prev) => prev + 1);
      } else {
        setMessageType("error");
        setMessage(response.data.message || "Failed to delete user");
      }

      // Hide message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessageType("error");
      setMessage("Unexpected error occurred");
      setTimeout(() => setMessage(null), 3000);
      console.error("Error deleting user:", error);
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (!users.length) return <p>No users found.</p>;

  return (
    <div className="w-full h-full mt-8 flex flex-col items-start relative">
      {/* Animated Success/Error Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-md text-center ${
              messageType === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

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
                <div className="flex justify-center gap-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    onClick={() =>
                      setEditingUser({ user, userRoles, customer })
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </div>
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
            setChange={setChange}
          />
        </div>
      )}
    </div>
  );
}

function EditUserForm({ user, onCancel, customer, setChange }) {
  const [userName, setUserName] = useState(user.userName);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? "");
  const [fullName, setFullName] = useState(customer?.fullName ?? "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
  const phoneRegex = /^[+]?[0-9\s\-()]{7,20}$/;
  const isGmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const validateForm = () => {
    const newErrors = {};

    if (!userName.trim()) newErrors.userName = "Username is required";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!isGmail(email))
      newErrors.email = "Only Gmail addresses are allowed";

    if (password.trim() && !passwordRegex.test(password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number, and symbol (min 8 characters)";
    }

    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    else if (!phoneRegex.test(phoneNumber))
      newErrors.phoneNumber = "Invalid phone number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

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
        setErrors({
          apiError: response.data.message || "Failed to update user",
        });
        return;
      }

      setSuccess("User updated successfully!");
      setChange((prev) => prev + 1);
      setTimeout(() => setSuccess(null), 3000);
      setTimeout(() => onCancel(), 3000);
      setErrors({});
    } catch (err) {
      setErrors({ apiError: "Unexpected error occurred" });
    } finally {
      setSaving(false);
    }
  };

  const renderError = (message) => (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="mt-1 p-2 bg-red-100 text-red-700 rounded text-sm font-medium shadow-sm"
    >
      {message}
    </motion.div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="col-span-full mb-4 p-3 text-green-700 bg-green-100 rounded text-center font-medium shadow-md"
        >
          {success}
        </motion.div>
      )}

      {errors.apiError && renderError(errors.apiError)}

      <div>
        <input
          className="border rounded p-2 w-full"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
        />
        {errors.userName && renderError(errors.userName)}
      </div>

      <div>
        <input
          className="border rounded p-2 w-full"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
        />
      </div>

      <div>
        <input
          className="border rounded p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        {errors.email && renderError(errors.email)}
      </div>

      <div>
        <input
          className="border rounded p-2 w-full"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Number"
        />
        {errors.phoneNumber && renderError(errors.phoneNumber)}
      </div>

      <div>
        <input
          type="password"
          className="border rounded p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password (optional)"
        />
        {errors.password && renderError(errors.password)}
      </div>

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
