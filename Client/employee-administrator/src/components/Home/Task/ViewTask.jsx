import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function ViewTask({ closeModal, task, setIsViewingTask }) {
  if (!task) return null;
  const [showAssignInput, setShowAssignInput] = useState(false);
  const [userId, setUserId] = useState("");
  const token = useSelector((state) => state.auth.token);

  const handleAssignUser = async () => {
    if (task.assignedUserIds.includes(userId)) {
      return;
    }

    const updatedTask = {
      ...task,
      assignedUserIds: [...task.assignedUserIds, userId],
    };

    setIsViewingTask(updatedTask);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/Task/edit-task",
        updatedTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={closeModal}
      ></div>

      <div className="bg-white h-80 w-150 p-20 rounded-lg shadow-xl  relative z-10">
        <div className="mb-4 border-b pb-3">
          <h2 className="text-2xl font-semibold text-gray-800">{task.title}</h2>
          <p className="text-sm text-gray-500 mt-1">Task ID: {task.id}</p>
        </div>

        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <span className="font-medium">Description:</span>
            <p className="mt-1 text-gray-600">{task.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Status:</span>
              <p
                className={`mt-1 font-semibold ${
                  task.isCompleted ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {task.isCompleted ? "Completed" : "Pending"}
              </p>
            </div>

            <div>
              <span className="font-medium">Project ID:</span>
              <p className="mt-1">{task.projectId}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Created At:</span>
              <p className="mt-1">
                {new Date(task.createdAt).toLocaleString()}
              </p>
            </div>

            <div>
              <span className="font-medium">Due Date:</span>
              <p className="mt-1">{new Date(task.dueDate).toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-4">
            <span className="font-medium text-gray-800">Assigned Users:</span>

            {task.assignedUserIds.length > 0 ? (
              <div className="mt-1 max-h-20 overflow-y-auto border border-gray-200 rounded-md p-2">
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {task.assignedUserIds.map((id) => (
                    <li key={id}>User ID: {id}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-1 text-gray-500 italic">No users assigned</p>
            )}
          </div>
        </div>

        <div className="mt-20 flex justify-center gap-6">
          <button
            onClick={() => setShowAssignInput((prev) => !prev)}
            className="text-sm px-3 py-1.5 rounded-md border border-gray-300
                 text-gray-700 hover:bg-gray-100 hover:border-gray-400
                 transition"
          >
            + Assign User
          </button>
          <button
            onClick={closeModal}
            className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition"
          >
            Close
          </button>
          {showAssignInput && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <input
                type="text"
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-32 px-3 py-1.5 border border-gray-300 rounded-md
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={handleAssignUser}
                className="px-4 py-1.5 rounded-md bg-blue-600 text-white
                 hover:bg-blue-700 disabled:opacity-50 transition"
              >
                Assign
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
