import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../../config/api";

export default function Tasks({ selectedProject }) {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    async function getProjectTasks() {
      try {
        const response = await api.get(
          `/task/get-project-tasks/${selectedProject}`
        );

        if (response.data.success) {
          const userTasks = response.data.tasks.filter((task) =>
            task.assignedUserIds.includes(userId)
          );
          setTasks(userTasks);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    }

    if (selectedProject) getProjectTasks();
  }, [selectedProject, userId]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="h-full w-1/2 flex flex-col items-center justify-start gap-4">
      <h1 className="text-3xl font-bold">Tasks</h1>

      <button
        onClick={handleOpenModal}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        + Create Task
      </button>

      <div className="bg-white p-4 rounded-lg shadow w-5/6 mt-4 mb-4">
        <h2 className="text-xl font-semibold">
          Selected Project ID: {selectedProject}
        </h2>
      </div>

      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-5/6 overflow-y-auto">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <span
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
                </span>
              </div>
              <p className="text-gray-600 mb-2">
                {task.description || "No description provided."}
              </p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  Created: {new Date(task.createdAt).toLocaleDateString()}
                </span>
                <span>
                  Due:{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No deadline"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-4">
          No tasks assigned to you in this project.
        </p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-1/3 rounded-lg shadow-lg p-6 relative">
            <h2 className="text-2xl font-bold mb-4">Create Task</h2>

            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Task Title"
                className="border p-2 rounded w-full"
              />
              <textarea
                placeholder="Task Description"
                className="border p-2 rounded w-full"
              />
              <input type="date" className="border p-2 rounded w-full" />

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
