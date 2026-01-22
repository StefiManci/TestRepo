import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import api from "../../../config/api";
import { motion } from "framer-motion";

export default function ViewTask({
  task,
  onClose,
  setChange,
  setTaskInView,
  projectDueDate,
}) {
  const userRole = useSelector((state) => state.auth.userRole);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  const [newUserId, setNewUserId] = useState("");
  const [users, setUsers] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchProjectUsers() {
      try {
        const response = await api.get(
          `project/get-project-users/${task.projectId}`,
        );
        if (response.data.success) setUsers(response.data.users);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProjectUsers();
  }, [task]);

  useEffect(() => {
    if (task) setEditedTask({ ...task });
  }, [task]);

  if (!task || !editedTask) return null;

  const availableUsers =
    users?.filter((u) => !editedTask.assignedUserIds.includes(u.id)) || [];

  const handleChange = (field, value) =>
    setEditedTask((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const errs = {};

    if (!editedTask.title?.trim()) {
      errs.title = "Title is required";
    } else if (editedTask.title.length < 3 || editedTask.title.length > 100) {
      errs.title = "Title must be between 3 and 100 characters";
    }

    if (!editedTask.description?.trim()) {
      errs.description = "Description is required";
    } else if (editedTask.description.length > 500) {
      errs.description = "Description cannot exceed 500 characters";
    }

    if (!editedTask.dueDate) {
      errs.dueDate = "Due date is required";
    } else if (new Date(editedTask.dueDate) > new Date(projectDueDate)) {
      errs.dueDate = "Due date cannot be after project deadline.";
    }

    if (!editedTask.projectId || editedTask.projectId < 1) {
      errs.projectId = "ProjectId must be a valid positive number";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const response = await api.post("/task/edit-task", editedTask);
      if (response.data.success) {
        setTaskInView(editedTask);
        setChange((prev) => prev + 1);
        setIsEditMode(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveUser = (userId) =>
    setEditedTask((prev) => ({
      ...prev,
      assignedUserIds: prev.assignedUserIds.filter((id) => id !== userId),
    }));

  const handleAddUser = () => {
    if (!newUserId) return;
    setEditedTask((prev) => ({
      ...prev,
      assignedUserIds: [...prev.assignedUserIds, newUserId],
    }));
    setNewUserId("");
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white w-1/2 h-4/5 rounded-lg shadow-lg p-6 relative overflow-y-auto"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
        >
          ✕
        </button>

          <motion.button
            onClick={() => (isEditMode ? handleSave() : setIsEditMode(true))}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-4 right-12 text-blue-600 hover:text-blue-800 font-semibold"
          >
            {isEditMode ? "Save" : "Edit"}
          </motion.button>

        <h2 className="text-2xl font-semibold mb-4">Task Details</h2>

        <div className="space-y-4">
          <div>
            <span className="font-semibold">Title:</span>
            {isEditMode ? (
              <>
                <input
                  className="w-full border rounded px-2 py-1 mt-1"
                  value={editedTask.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                )}
              </>
            ) : (
              <p>{task.title}</p>
            )}
          </div>
          <div>
            <span className="font-semibold">Description:</span>
            {isEditMode ? (
              <>
                <textarea
                  className="w-full border rounded px-2 py-1 mt-1"
                  rows={3}
                  value={editedTask.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </>
            ) : (
              <p>{task.description}</p>
            )}
          </div>
          <div className="flex gap-8">
            <div>
              <span className="font-semibold">Is Completed:</span>
              {isEditMode ? (
                <input
                  type="checkbox"
                  className="ml-2"
                  checked={editedTask.isCompleted}
                  onChange={(e) =>
                    handleChange("isCompleted", e.target.checked)
                  }
                />
              ) : (
                <p
                  className={`text-xs px-2 py-1 rounded-full ${
                    task.isCompleted
                      ? "bg-green-100 text-green-700"
                      : task.dueDate && new Date(task.dueDate) < new Date()
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {task.isCompleted
                    ? "Completed"
                    : task.dueDate && new Date(task.dueDate) < new Date()
                      ? "Overdue"
                      : "In Progress"}
                </p>
              )}
            </div>

            <div>
              <span className="font-semibold">Project ID:</span>
              <p>{task.projectId}</p>
            </div>
          </div>
          <div className="flex gap-8">
            <div>
              <span className="font-semibold">Created At:</span>
              <p>{new Date(task.createdAt).toLocaleString()}</p>
            </div>

            <div>
              <span className="font-semibold">Due Date:</span>
              {isEditMode ? (
                <>
                  <input
                    type="date"
                    className="border rounded px-2 py-1"
                    value={
                      editedTask.dueDate ? editedTask.dueDate.split("T")[0] : ""
                    }
                    onChange={(e) => handleChange("dueDate", e.target.value)}
                  />
                  {errors.dueDate && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.dueDate}
                    </p>
                  )}
                </>
              ) : (
                <p>{new Date(task.dueDate).toLocaleDateString()}</p>
              )}
            </div>
          </div>
          <div>
            <span className="font-semibold">Assigned Users:</span>
            {editedTask.assignedUserIds?.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {editedTask.assignedUserIds.map((userId) => {
                  const user = users?.find((u) => u.id === userId);
                  return (
                    <li
                      key={userId}
                      className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
                    >
                      <span className="text-sm text-gray-700">
                        {user ? user.userName : userId}
                      </span>

                      {userRole[0] === "Admin" && isEditMode && (
                        <motion.button
                          onClick={() => handleRemoveUser(userId)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-red-600 hover:text-red-800 font-bold"
                        >
                          −
                        </motion.button>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500 mt-2">No users assigned</p>
            )}

            {userRole[0] === "Admin" && isEditMode && (
              <div className="mt-3 flex gap-2">
                <select
                  className="border rounded px-2 py-1 flex-1"
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                >
                  <option value="">Select user to add</option>
                  {availableUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.userName} ({user.email})
                    </option>
                  ))}
                </select>

                <motion.button
                  onClick={handleAddUser}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!newUserId}
                  className="text-blue-600 hover:text-blue-800 font-semibold disabled:text-gray-400"
                >
                  Add
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
