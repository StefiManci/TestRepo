import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../../config/api";
import ViewTask from "./ViewTask";
import CreateTask from "./CreateTask";
import { motion } from "framer-motion";

export default function Tasks({ selectedProject, setSelectedProject }) {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewTaskModal, setViewTaskModal] = useState(false);
  const [taskInView, setTaskInView] = useState(null);
  const userId = useSelector((state) => state.auth.userId);
  const [taskAdded, setTaskAdded] = useState(0);

  useEffect(() => {
    async function getProjectTasks() {
      try {
        const response = await api.get(
          `/task/get-project-tasks/${selectedProject}`,
        );

        if (response.data.success) {
          const userTasks = response.data.tasks.filter((task) =>
            task.assignedUserIds.includes(userId),
          );
          setTasks(userTasks);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    }

    if (selectedProject) getProjectTasks();
  }, [selectedProject, userId, taskAdded]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleViewModal = (task) => {
    setTaskInView(task);
    setViewTaskModal((prev) => !prev);
  };

  const handleRemoveSelectedProject = () => {
    setSelectedProject(0);
    setTasks([]);
  };

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold"
      >
        Tasks
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-5/6 mt-4 mb-4 px-6 py-4 rounded-lg shadow flex items-center justify-between"
      >
        {selectedProject !== 0 ? (
          <>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRemoveSelectedProject}
                className="ml-2 text-gray-400 hover:text-red-600 transition"
                title="Unselect project"
              >
                ✕
              </button>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Selected Project
                </h2>
                <p className="text-sm text-gray-500">
                  Project ID: {selectedProject}
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
            >
              + Create Task
            </button>
          </>
        ) : (
          <h1 className="text-gray-500 font-medium">Please select a project</h1>
        )}
      </motion.div>

      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-5/6 overflow-y-auto">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              onClick={() => handleViewModal(task)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
              }}
              className="bg-gray-50 p-4 rounded-lg shadow cursor-pointer flex flex-col transition-all"
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
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-gray-500 mt-4"
        >
          {selectedProject !== 0 && (
            <h1>No tasks assigned to you in this project.</h1>
          )}
        </motion.p>
      )}

      {isModalOpen && (
        <CreateTask
          projectId={selectedProject}
          close={handleCloseModal}
          setTaskAdded={setTaskAdded}
        />
      )}
      {viewTaskModal && (
        <ViewTask task={taskInView} onClose={handleViewModal} />
      )}
    </div>
  );
}
