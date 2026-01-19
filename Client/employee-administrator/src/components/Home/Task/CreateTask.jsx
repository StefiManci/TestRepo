import { useState, useEffect } from "react";
import api from "../../../config/api";
import { motion } from "framer-motion";

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

  useEffect(() => {
    if (!projectId) return;

    const fetchProjectUsers = async () => {
      try {
        const response = await api.get(
          `/project/get-project-users/${projectId}`,
        );
        if (response.data?.success) {
          setUsers(response.data.users ?? []);
        }
      } catch (err) {
        console.error("Failed to fetch project users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchProjectUsers();
  }, [projectId]);

  const handleSubmitTask = async () => {
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
        close();
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
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

        <input
          type="text"
          placeholder="Title"
          className="mb-2 p-2 border rounded w-full"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="mb-2 p-2 border rounded w-full flex-1"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />

        <input
          type="date"
          className="mb-4 p-2 border rounded w-full"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />

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
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-auto self-start"
        >
          Save Task
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
