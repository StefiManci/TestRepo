import { useState, useEffect } from "react";
import ViewTask from "../../Home/Task/ViewTask";
import api from "../../../config/api";
import { motion, AnimatePresence } from "framer-motion";

export default function ManageProjectTasksModal({
  closeModal,
  project,
  changed,
}) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isViewingTask, setIsViewingTask] = useState(false);
  const [taskInView, setTaskInView] = useState(null);
  const [change, setChange] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    isCompleted: false,
    dueDate: "",
    projectId: project?.id || 0,
    assignedUserIds: [],
  });

  const [errors, setErrors] = useState({});
  const [newTaskSuccess, setNewTaskSuccess] = useState("");

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await api.get(`/task/get-project-tasks/${project.id}`);
        if (response.data.success) setTasks(response.data.tasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    }
    fetchTasks();
  }, [project, change]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get(
          `/project/get-project-users/${project.id}`,
        );
        if (response.data.success) setUsers(response.data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    }
    fetchUsers();
  }, [project]);

  const handleAddTaskToggle = () => {
    setIsAddingTask((prev) => !prev);
    setErrors({});
    setNewTaskSuccess("");
  };

  const handleViewTaskToggle = (task = null) => {
    setIsViewingTask((prev) => !prev);
    setTaskInView(task);
  };

  const handleSubmitTask = async () => {
    const currentErrors = {};

    if (!newTask.title || newTask.title.trim().length < 3) {
      currentErrors.title = "Title must be at least 3 characters.";
    }

    if (!newTask.description || newTask.description.trim().length < 10) {
      currentErrors.description = "Description must be at least 10 characters.";
    }

    if (!newTask.dueDate) {
      currentErrors.dueDate = "Due date is required.";
    } else if (
      new Date(newTask.dueDate) < new Date(new Date().toDateString())
    ) {
      currentErrors.dueDate = "Due date cannot be in the past.";
    } else if (new Date(newTask.dueDate) > new Date(project.dueDate)) {
      currentErrors.dueDate = "Due date cannot be after project deadline.";
    }

    setErrors(currentErrors);
    if (Object.keys(currentErrors).length > 0) return;

    try {
      const response = await api.post("/task/create-task", newTask);
      if (response.data.success) {
        setChange((prev) => prev + 1);
        changed((prev) => prev + 1);
        setIsAddingTask(false);
        setNewTask({
          title: "",
          description: "",
          isCompleted: false,
          dueDate: "",
          projectId: project?.id || 0,
          assignedUserIds: [],
        });
        setNewTaskSuccess("Task saved successfully!");
        setTimeout(() => setNewTaskSuccess(""), 3000);
        setErrors({});
      }
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  const handleDeleteTask = async (e, taskId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const response = await api.delete(`/task/delete-task/${taskId}`);
      if (response.data.success) {
        changed((prev) => prev + 1);
        setChange((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="task-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-[75vw] h-[75vh] bg-white rounded-lg shadow-lg flex flex-col overflow-y-auto"
        >
          <div className="border-b px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              Manage Tasks for{" "}
              <span className="text-red-500">{project?.name}</span>
            </h1>
            <div className="flex gap-2">
              <button
                onClick={handleAddTaskToggle}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isAddingTask ? "Cancel" : "+ Add Task"}
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
          <AnimatePresence>
            {isAddingTask && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="border-b bg-gray-50 px-6 py-4"
              >
                <div className="space-y-3 text-gray-700">
                  {newTaskSuccess && (
                    <p className="text-green-600 font-medium">
                      {newTaskSuccess}
                    </p>
                  )}

                  <div>
                    <input
                      type="text"
                      placeholder="Title"
                      className="w-full p-2 border rounded"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                    />
                    {errors.title && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <textarea
                      placeholder="Description"
                      className="w-full p-2 border rounded"
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                      }
                    />
                    {errors.description && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="date"
                      className="w-full p-2 border rounded"
                      value={newTask.dueDate}
                      onChange={(e) =>
                        setNewTask({ ...newTask, dueDate: e.target.value })
                      }
                    />
                    {errors.dueDate && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.dueDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Assign Users
                    </label>
                    <select
                      multiple
                      className="w-full border p-2 rounded h-32"
                      value={newTask.assignedUserIds}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          assignedUserIds: Array.from(
                            e.target.selectedOptions,
                            (opt) => opt.value,
                          ),
                        })
                      }
                    >
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.userName} ({user.email})
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
              </motion.div>
            )}
          </AnimatePresence>
          {isViewingTask && (
            <ViewTask
              task={taskInView}
              onClose={handleViewTaskToggle}
              setChange={setChange}
              projectDueDate={project.dueDate}
            />
          )}
          <div className="flex-1 p-6 overflow-y-auto">
            {tasks.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                No tasks found for this project.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {tasks.map((task) => {
                  const status = task.isCompleted
                    ? "Completed"
                    : task.dueDate && new Date(task.dueDate) < new Date()
                      ? "Overdue"
                      : "In Progress";

                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onClick={() => handleViewTaskToggle(task)}
                      className={`relative border-l-4 rounded-lg p-4 mb-4 bg-white shadow hover:shadow-lg cursor-pointer transition-all duration-200 ${
                        status === "Completed"
                          ? "border-green-500"
                          : status === "In Progress"
                            ? "border-blue-500"
                            : "border-red-500"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-800">
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-2">
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
                          <button
                            onClick={(e) => handleDeleteTask(e, task.id)}
                            className="text-xs px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
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
                              {task.assignedUserIds.length}
                            </div>
                          ))}
                          {task.assignedUserIds.length === 1
                            ? " User"
                            : " Users"}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
