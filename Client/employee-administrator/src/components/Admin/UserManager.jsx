import { useState } from "react";
import UserList from "../DisplayComponents/UserList";
import api from "../../config/api";
import { motion, AnimatePresence } from "framer-motion";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

export default function UserManager() {
  const [form, setForm] = useState(initialState);
  const [activeTab, setActiveTab] = useState("welcome");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userName: form.userName,
        email: form.email,
        password: form.password,
      };
      const response = await api.post("/Auth/create-user", payload);
      if (response.data.isSuccess) {
        setForm(initialState);
        setActiveTab("view");
      }
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  const renderContent = () => (
    <AnimatePresence exitBeforeEnter>
      {activeTab === "add" && (
        <motion.div
          key="add-user"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex-1 flex items-center justify-center"
        >
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-6">Create User</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                name="userName"
                value={form.userName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              />
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
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex-1 flex items-center justify-center"
        >
          <UserList />
        </motion.div>
      )}

      {activeTab === "welcome" && (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex-1 flex items-center justify-center"
        >
          <h2 className="text-gray-600 text-xl">
            Select an action from the sidebar to manage users.
          </h2>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="flex min-h-screen">

      <div className="w-60 bg-white shadow-md p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-4">Users</h2>
        <button
          className={`px-4 py-2 rounded font-medium text-left transition-colors ${
            activeTab === "add"
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-100 text-gray-700"
          }`}
          onClick={() => setActiveTab("add")}
        >
          Add User
        </button>
        <button
          className={`px-4 py-2 rounded font-medium text-left transition-colors ${
            activeTab === "view"
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-100 text-gray-700"
          }`}
          onClick={() => setActiveTab("view")}
        >
          View Users
        </button>
      </div>

      {renderContent()}
    </div>
  );
}
