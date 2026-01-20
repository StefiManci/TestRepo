import { useState, useEffect } from "react";
import ProjectList from "../DisplayComponents/ProjectList";
import { useSelector } from "react-redux";
import api from "../../config/api";
import { motion, AnimatePresence } from "framer-motion";

const initialState = {
  name: "",
  description: "",
  isCompleted: false,
  dueDate: "",
  assignedUserIds: [],
  projectTasks: "",
};

export default function ProjectManager() {
  const [form, setForm] = useState(initialState);
  const [activeTab, setActiveTab] = useState("welcome");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [change, setChange] = useState(0);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get("/auth/get-users");
        if (response.data.success) setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    }

    if (token) fetchUsers();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddUser = (userId) => {
    if (!form.assignedUserIds.includes(userId)) {
      setForm((prev) => ({
        ...prev,
        assignedUserIds: [...prev.assignedUserIds, userId],
      }));
    }
  };

  const handleRemoveUser = (userId) => {
    setForm((prev) => ({
      ...prev,
      assignedUserIds: prev.assignedUserIds.filter((id) => id !== userId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) return;

    const payload = {
      ...form,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      projectTasks: form.projectTasks
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    };

    try {
      const response = await api.post("/project/create-project", payload);

      if (response.data.success) {
        setForm(initialState);
        setChange((prev) => prev + 1);
        setSuccessMessage(response.data.message);
        setTimeout(() => setIsAddModalOpen(false), 1000);
        setTimeout(() => setSuccessMessage(null), 1000);
      } else {
        setErrorMessage(response.data.message || "Failed to create project.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Server error while creating project.",
      );
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name || form.name.trim().length < 3) {
      newErrors.name = "Project name must be at least 3 characters.";
    }

    if (form.description && form.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters.";
    }

    if (!form.dueDate) {
      newErrors.dueDate = "Due date is required.";
    } else {
      const selectedDate = new Date(form.dueDate);
      if (selectedDate <= new Date()) {
        newErrors.dueDate = "Due date must be in the future.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-60 bg-white shadow-md p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-4">Projects</h2>
        <button
          className={`px-4 py-2 rounded font-medium text-left transition-colors ${
            activeTab === "add"
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-100 text-gray-700"
          }`}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Project
        </button>
        <button
          className={`px-4 py-2 rounded font-medium text-left transition-colors ${
            activeTab === "view"
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-100 text-gray-700"
          }`}
          onClick={() => setActiveTab("view")}
        >
          View Projects
        </button>
      </div>
      <div className="flex-1 p-6">
        <AnimatePresence exitBeforeEnter>
          {activeTab === "view" && (
            <motion.div
              key="project-list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectList change={change} setChange={setChange} />
            </motion.div>
          )}

          {activeTab === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Welcome!</h2>
              <p className="text-gray-700">
                Select an action from the sidebar to manage projects.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div
              className="relative z-10 w-full max-w-xl bg-white rounded-xl shadow-xl p-6"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-6">Create Project</h2>
              {successMessage && (
                <div className="mb-4 rounded bg-green-100 text-green-700 px-4 py-2">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="mb-4 rounded bg-red-100 text-red-700 px-4 py-2">
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Project Name"
                  className="w-full border rounded px-3 py-2"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                )}

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Project Description"
                  className="w-full border rounded px-3 py-2"
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.description}
                  </p>
                )}

                <div>
                  <label className="block mb-1 font-medium">Assign Users</label>
                  <select
                    onChange={(e) => handleAddUser(e.target.value)}
                    defaultValue=""
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="" disabled>
                      Select user
                    </option>
                    {users.map(({ user }) => (
                      <option key={user.id} value={user.id}>
                        {user.userName} ({user.email})
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.assignedUserIds.map((id) => {
                      const u = users.find((x) => x.user.id === id)?.user;
                      if (!u) return null;
                      return (
                        <span
                          key={id}
                          className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {u.userName}
                          <button
                            type="button"
                            onClick={() => handleRemoveUser(id)}
                            className="text-blue-600 hover:text-red-600"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-medium">Due Date</label>
                  <input
                    type="datetime-local"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                  {errors.dueDate && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.dueDate}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
