import { useState, useEffect } from "react";
import api from "../../../config/api";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateTask({ projectId, close, setTaskAdded }) {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    isCompleted: false,
    dueDate: "",
    projectId,
    assignedUserIds: [],
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState(null); // { text: string, type: 'success' | 'error' }

  useEffect(() => {
    if (!projectId) return;

    const fetchProjectUsers = async () => {
      try {
        const response = await api.get(
          `/project/get-project-users/${projectId}`,
        );
        if (response.data?.success) setUsers(response.data.users ?? []);
      } catch (err) {
        console.error("Failed to fetch project users:", err);
        setMessage({ text: "Failed to load project users.", type: "error" });
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchProjectUsers();
  }, [projectId]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const validate = () => {
    const newErrors = {};

    if (!newTask.title || newTask.title.trim().length < 3) {
      newErrors.title = "Title is required and must be at least 3 characters.";
    } else if (newTask.title.trim().length > 100) {
      newErrors.title = "Title cannot exceed 100 characters.";
    }

    if (!newTask.description || newTask.description.trim().length < 10) {
      newErrors.description =
        "Description is required and must be at least 10 characters.";
    } else if (newTask.description.trim().length > 1000) {
      newErrors.description = "Description cannot exceed 1000 characters.";
    }

    if (!newTask.dueDate) {
      newErrors.dueDate = "Due date is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitTask = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const response = await api.post("/task/create-task", newTask);
      if (response.data?.success) {
        setNewTask({
          title: "",
          description: "",
          isCompleted: false,
          dueDate: "",
          projectId,
          assignedUserIds: [],
        });
        setTaskAdded((prev) => prev + 1);
        setMessage({
          text: response.data.message || "Task created successfully.",
          type: "success",
        });
      } else {
        setMessage({
          text: response.data.message || "Failed to create task.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error creating task:", error);
      setMessage({
        text: "Error creating task. Please try again.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white w-1/2 h-4/5 rounded-lg shadow-lg p-6 relative flex flex-col"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Create Task</h2>
            <button
              onClick={close}
              className="text-gray-500 hover:text-gray-800 transition"
            >
              ✕
            </button>
          </div>
          {message && (
            <div
              className={`mb-4 p-2 rounded text-white text-sm ${
                message.type === "success" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="mb-2">
            <input
              type="text"
              placeholder="Title"
              className={`p-2 border rounded w-full ${errors.title ? "border-red-500" : ""}`}
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div className="mb-2">
            <textarea
              placeholder="Description"
              className={`p-2 border rounded w-full flex-1 ${errors.description ? "border-red-500" : ""}`}
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              type="date"
              className={`p-2 border rounded w-full ${errors.dueDate ? "border-red-500" : ""}`}
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
            />
            {errors.dueDate && (
              <p className="text-red-600 text-sm mt-1">{errors.dueDate}</p>
            )}
          </div>

          <div className="mb-4 flex flex-col">
            <label className="block mb-1 font-medium">Assign Users</label>
            {loadingUsers ? (
              <p className="text-sm text-gray-500">Loading users...</p>
            ) : (
              <select
                multiple
                className="w-full border p-2 rounded h-32"
                value={newTask.assignedUserIds}
                onChange={(e) => {
                  const selected = Array.from(
                    e.target.selectedOptions,
                    (opt) => opt.value,
                  );
                  setNewTask({ ...newTask, assignedUserIds: selected });
                }}
              >
                {users.length === 0 && (
                  <option disabled>No users available</option>
                )}
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.userName}
                  </option>
                ))}
              </select>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Hold Ctrl (Windows) / Cmd (Mac) to select multiple users
            </p>
          </div>
          <motion.button
            onClick={handleSubmitTask}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-auto self-start disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Task"}
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
