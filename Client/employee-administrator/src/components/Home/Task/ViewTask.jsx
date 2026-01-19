import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import api from "../../../config/api";

export default function ViewTask({ task, onClose }) {
  const userRole = useSelector((state) => state.auth.userRole);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  const [newUserId, setNewUserId] = useState("");

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
    }
  }, [task]);

  if (!task || !editedTask) return null;

  const handleChange = (field, value) => {
    setEditedTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Saved locally:", editedTask);
    setIsEditMode(false);
  };

  const handleRemoveUser = (userId) => {
    setEditedTask((prev) => ({
      ...prev,
      assignedUserIds: prev.assignedUserIds.filter((id) => id !== userId),
    }));
  };

  const handleAddUser = () => {
    if (!newUserId.trim()) return;

    if (editedTask.assignedUserIds.includes(newUserId)) return;

    setEditedTask((prev) => ({
      ...prev,
      assignedUserIds: [...prev.assignedUserIds, newUserId],
    }));

    setNewUserId("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-1/2 h-4/5 rounded-lg shadow-lg p-6 relative overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {userRole[0] === "Admin" && (
          <button
            onClick={() => (isEditMode ? handleSave() : setIsEditMode(true))}
            className="absolute top-4 right-12 text-blue-600 hover:text-blue-800 font-semibold"
          >
            {isEditMode ? "Save" : "Edit"}
          </button>
        )}

        <h2 className="text-2xl font-semibold mb-4">Task Details</h2>

        <div className="space-y-4">
          <div>
            <span className="font-semibold">Title:</span>
            {isEditMode ? (
              <input
                className="w-full border rounded px-2 py-1 mt-1"
                value={editedTask.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            ) : (
              <p>{task.title}</p>
            )}
          </div>

          <div>
            <span className="font-semibold">Description:</span>
            {isEditMode ? (
              <textarea
                className="w-full border rounded px-2 py-1 mt-1"
                rows={3}
                value={editedTask.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            ) : (
              <p>{task.description}</p>
            )}
          </div>

          <div className="flex gap-8">
            <div>
              <span className="font-semibold">Status:</span>
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
                <input
                  type="date"
                  className="border rounded px-2 py-1"
                  value={
                    editedTask.dueDate ? editedTask.dueDate.split("T")[0] : ""
                  }
                  onChange={(e) => handleChange("dueDate", e.target.value)}
                />
              ) : (
                <p>{new Date(task.dueDate).toLocaleDateString()}</p>
              )}
            </div>
          </div>
          <div>
            <span className="font-semibold">Assigned Users:</span>

            {editedTask.assignedUserIds?.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {editedTask.assignedUserIds.map((userId) => (
                  <li
                    key={userId}
                    className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
                  >
                    <span className="text-sm text-gray-700">{userId}</span>

                    {userRole[0] === "Admin" && isEditMode && (
                      <button
                        onClick={() => handleRemoveUser(userId)}
                        className="text-red-600 hover:text-red-800 font-bold"
                        title="Remove user"
                      >
                        −
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mt-2">No users assigned</p>
            )}

            {userRole[0] === "Admin" && isEditMode && (
              <div className="mt-3 flex gap-2">
                <input
                  className="border rounded px-2 py-1 flex-1"
                  placeholder="User ID"
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                />
                <button
                  onClick={handleAddUser}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
