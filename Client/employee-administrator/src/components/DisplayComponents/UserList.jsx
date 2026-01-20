import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../config/api";
import { motion, AnimatePresence } from "framer-motion";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [change, setChange] = useState(0);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

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

      <div className="w-full overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="min-w-full border-collapse">
          <thead className="bg-gradient-to-r from-slate-800 to-slate-700 text-white sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Username
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Roles
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {users.map(({ user, userRoles, customer }) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-b last:border-b-0 hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">
                    #{user.id.slice(0, 6)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {user.userName}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {userRoles.map((role) => (
                        <span
                          key={role}
                          className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          setEditingUser({ user, userRoles, customer })
                        }
                        className="px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-1.5 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

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
