import { useState, useEffect } from "react";
import api from "../../../config/api";

export default function ManageProjectTasksModal({ closeModal, project }) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [change, setChange] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  console.log("Project data in ManageProjectTasksModal:", project);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    isCompleted: false,
    dueDate: "",
    projectId: project?.id || 0,
    assignedUserIds: [],
  });

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await api.get(`/task/get-project-tasks/${project.id}`);
        console.log("Fetch tasks response:", response.data.tasks);

        if (response.data.success) {
          setTasks(response.data.tasks);
        } else {
          console.error("Failed to fetch tasks:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }

    fetchTasks();
  }, [project, change]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get("/auth/get-users");

        console.log("Fetch users response:", response.data.users);

        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          console.error("Failed to fetch users:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        console.log("Finished fetching users");
      }
    }

    fetchUsers();
  }, [project]);

  const handleAddTask = () => {
    setIsAddingTask((prev) => !prev);
  };

  const handleSubmitTask = async () => {
    try {
      const response = await api.post("/task/create-task", newTask);

      if (response.data.success) {
        setChange((prev) => prev + 1);
        setIsAddingTask(false);
        setNewTask({
          title: "",
          description: "",
          isCompleted: false,
          dueDate: "",
          projectId: project?.id || 0,
          assignedUserIds: [],
        });
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-[75vw] h-[75vh] bg-white rounded-lg shadow-lg flex flex-col overflow-y-auto">
        <div className="border-b px-6 py-4 flex justify-between items-center shrink-0">
          <h1 className="text-2xl font-bold">
            Manage Project Tasks for{" "}
            <span className="text-red-500">{project?.name}</span>
          </h1>

          <button
            onClick={handleAddTask}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isAddingTask ? "Cancel" : "+ Add Task"}
          </button>
        </div>
        {isAddingTask && (
          <div className="border-b bg-gray-50 px-6 py-4 shrink-0">
            <div className="border-2 border-dashed rounded-lg p-4 text-center text-gray-500">
              {isAddingTask && (
                <div className="border-b bg-gray-50 px-6 py-4 shrink-0">
                  <div className="border-2 border-dashed rounded-lg p-4 text-left text-gray-700 space-y-2">
                    <input
                      type="text"
                      placeholder="Title"
                      className="mb-2 p-2 border rounded w-full"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                    />

                    <textarea
                      placeholder="Description"
                      className="mb-2 p-2 border rounded w-full"
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                      }
                    />

                    <input
                      type="date"
                      className="mb-2 p-2 border rounded w-full"
                      value={newTask.dueDate}
                      onChange={(e) =>
                        setNewTask({ ...newTask, dueDate: e.target.value })
                      }
                    />

                    <div className="mb-2">
                      <label className="block mb-1 font-medium">
                        Assign Users
                      </label>
                      <select
                        multiple
                        className="w-full border p-2 rounded h-32"
                        value={newTask.assignedUserIds}
                        onChange={(e) => {
                          const selectedOptions = Array.from(
                            e.target.selectedOptions
                          ).map((opt) => opt.value);
                          setNewTask({
                            ...newTask,
                            assignedUserIds: selectedOptions,
                          });
                        }}
                      >
                        {users.map((user) => (
                          <option key={user.user.id} value={user.user.id}>
                            {user.user.userName} ({user.user.id})
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Hold Ctrl (Windows) / Cmd (Mac) to select multiple users
                      </p>
                    </div>

                    <button
                      onClick={handleSubmitTask}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save Task
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="flex-1 p-6">
          {tasks?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {tasks.map((task) => {
                const status = task.isCompleted
                  ? "Completed"
                  : task.dueDate && new Date(task.dueDate) < new Date()
                  ? "Overdue"
                  : "In Progress";

                return (
                  <div
                    key={task.id}
                    className={`relative border-l-4 rounded-lg p-4 mb-4 bg-white shadow hover:shadow-lg transition-all duration-200
        ${
          status === "Completed"
            ? "border-green-500"
            : status === "In Progress"
            ? "border-blue-500"
            : "border-red-500"
        }`}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-800">
                        {task.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3">
                      {task.description || "No description provided."}
                    </p>

                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>
                        Due:{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No deadline"}
                      </span>
                    </div>
                    {task.assignedUserIds.length > 0 && (
                      <div className="mt-3 flex -space-x-2">
                        {task.assignedUserIds.map((userId) => (
                          <div
                            key={userId}
                            className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-white border border-white"
                          >
                            {userId[0].toUpperCase()}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No tasks found for this project.
            </div>
          )}
        </div>
        <div className="border-t px-6 py-4 flex justify-end shrink-0">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
