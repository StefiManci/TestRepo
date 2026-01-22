import { useState } from "react";
import UserList from "../DisplayComponents/UserList";
import api from "../../config/api";
import { motion, AnimatePresence } from "framer-motion";

const initialState = {
  userName: "",
  email: "",
  password: "",
  phoneNumber: "",
  fullName: "",
};

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

const phoneRegex = /^[+]?[0-9\s\-()]{7,20}$/;

const fullNameRegex = /^[a-zA-Z\s]{3,100}$/;

export default function UserManager() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("welcome");
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    const isGmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

    if (!form.userName.trim()) {
      newErrors.userName = "Username is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isGmail(form.email)) {
      newErrors.email = "Only Gmail addresses are allowed";
    }

    if (!passwordRegex.test(form.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number, and symbol (min 8 characters)";
    }

    if (form.phoneNumber.trim() && !phoneRegex.test(form.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number";
    }

    if (form.fullName.trim() && !fullNameRegex.test(form.fullName)) {
      newErrors.fullName =
        "Full name must contain only letters and spaces (min 3 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const payload = {
        userName: form.userName,
        email: form.email,
        password: form.password,
        phoneNumber: form.phoneNumber || null,
        fullName: form.fullName || null,
      };

      const response = await api.post("/Auth/create-user", payload);

      if (response.data.isSuccess) {
        setForm(initialState);
        setErrors({});
        setSuccess(response.data.message);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setErrors({ apiError: response.data.message });
      }
    } catch {
      setErrors({ apiError: "Unexpected error occurred" });
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const renderContent = () => (
    <AnimatePresence mode="wait">
      {activeTab === "add" && (
        <motion.div
          key="add-user"
          variants={tabVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="flex-1 flex items-center justify-center p-6"
        >
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg"
          >
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-4 p-3 text-green-700 bg-green-100 rounded text-center font-medium shadow-md"
              >
                {success}
              </motion.div>
            )}

            {errors.apiError && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center font-medium shadow-md"
              >
                {errors.apiError}
              </motion.div>
            )}

            <h2 className="text-2xl font-semibold mb-6">Create User</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                name="userName"
                value={form.userName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              />
              {errors.userName && (
                <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        </motion.div>
      )}

      {activeTab === "view" && (
        <motion.div
          key="view-user"
          variants={tabVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="flex-1 flex items-center justify-center p-6"
        >
          <UserList />
        </motion.div>
      )}

      {activeTab === "welcome" && (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex items-center justify-center p-6"
        >
          <h2 className="text-gray-600 text-xl">
            Select an action from the sidebar to manage users.
          </h2>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-60 bg-white shadow-md p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-4">Users</h2>

        <button
          onClick={() => setActiveTab("add")}
          className={`px-4 py-2 rounded font-medium text-left transition-colors ${
            activeTab === "add"
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-100 text-gray-700"
          }`}
        >
          Add User
        </button>

        <button
          onClick={() => setActiveTab("view")}
          className={`px-4 py-2 rounded font-medium text-left transition-colors ${
            activeTab === "view"
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-100 text-gray-700"
          }`}
        >
          View Users
        </button>
      </div>

      <motion.div layout className="flex-1">
        {renderContent()}
      </motion.div>
    </div>
  );
}
