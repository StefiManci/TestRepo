import { useState, useEffect } from "react";
import api from "../../config/api";
import ManageProjectTasksModal from "../Admin/TaskComponents/ManageProjectTasks";
import ManageProjectUsers from "../Admin/TaskComponents/ManageProjectUsers";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectList({ change, setChange }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskManagerOpen, setIsTaskManagerOpen] = useState(false);
  const [isUserManagerOpen, setIsUserManagerOpen] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [dueDate, setDueDate] = useState("");

  const [editErrors, setEditErrors] = useState({});
  const [editSuccess, setEditSuccess] = useState("");
  const [editError, setEditError] = useState("");

  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);

  useEffect(() => {
    if (selectedProject) {
      setProjectName(selectedProject.name ?? "");
      setDescription(selectedProject.description ?? "");
      setIsCompleted(!!selectedProject.isCompleted);
      setDueDate(
        selectedProject.dueDate ? selectedProject.dueDate.split("T")[0] : "",
      );
    }
  }, [selectedProject]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/project/get-projects");

        console.log(response.data);
        setProjects(response.data.projects);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, [change]);

  const handleEditProject = async () => {
    setEditErrors({});
    setEditSuccess("");
    setEditError("");

    if (!validateEditProject()) return;

    const payload = {
      id: selectedProject.id,
      name: projectName,
      description,
      isCompleted,
      dueDate: new Date(dueDate).toISOString(),
    };

    try {
      const response = await api.post("/project/edit-project", payload);

      if (response.data?.success) {
        setEditSuccess(response.data.message);
        setChange((prev) => prev + 1);
        setTimeout(() => setIsProjectModalOpen(false), 2000);
        setTimeout(() => setEditSuccess(null), 2000);
        setTimeout(() => setSelectedProject(null), 2000);
      } else {
        setEditError(response.data?.message || "Failed to update project.");
      }
    } catch (err) {
      setEditError(
        err.response?.data?.message || "Server error while updating project.",
      );
      console.error("Error editing project:", err);
    }
  };

  const validateEditProject = () => {
    const errors = {};

    if (!projectName || projectName.trim().length < 3) {
      errors.name = "Project name must be at least 3 characters.";
    }

    if (!dueDate) {
      errors.dueDate = "Due date is required.";
    } else {
      const selectedDate = new Date(dueDate);
      if (selectedDate <= new Date()) {
        errors.dueDate = "Due date must be in the future.";
      }
    }

    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDelete = async (projectId) => {
    try {
      const response = await api.delete(`/project/delete-project/${projectId}`);

      if (response.data.success) {
        setChange((prev) => prev + 1);
        setDeleteSuccess(
          response.data.message || "Project deleted successfully.",
        );
        setDeleteError(null);
        setTimeout(() => setDeleteSuccess(null), 3000);
      } else {
        setDeleteError(response.data.message || "Failed to delete project.");
        setDeleteSuccess(null);
        setTimeout(() => setDeleteError(null), 3000);
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      setDeleteError("Server error while deleting project.");
      setDeleteSuccess(null);
      setTimeout(() => setDeleteError(null), 3000);
    }
  };

  const handleTaskManager = (project) => {
    setIsTaskManagerOpen((prev) => !prev);
    setSelectedProject(project);
  };

  const handleUserManager = (project) => {
    setIsUserManagerOpen((prev) => !prev);
    setSelectedProject(project);
  };

  return (
    <div className="w-3/4 h-full p-6 overflow-y-auto">
      {isTaskManagerOpen && selectedProject && (
        <ManageProjectTasksModal
          closeModal={handleTaskManager}
          project={selectedProject}
          changed={setChange}
        />
      )}
      {isUserManagerOpen && selectedProject && (
        <ManageProjectUsers
          closeModal={handleUserManager}
          project={selectedProject}
          changed={setChange}
        />
      )}

      <div className="max-w-5xl mx-auto space-y-5">
        <AnimatePresence>
          {deleteError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 rounded bg-red-100 text-red-700 px-4 py-2 text-center"
            >
              {deleteError}
            </motion.div>
          )}
          {deleteSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 rounded bg-green-100 text-green-700 px-4 py-2 text-center"
            >
              {deleteSuccess}
            </motion.div>
          )}
        </AnimatePresence>

        {projects?.length === 0 || projects == null ? (
          <div className="text-center text-gray-500 py-20">
            No projects available
          </div>
        ) : (
          projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {project.description || "No description"}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    project.isCompleted
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {project.isCompleted ? "Completed" : "Pending"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                <div>
                  <span className="font-medium">Due Date:</span>{" "}
                  {project.dueDate
                    ? new Date(project.dueDate).toLocaleDateString()
                    : "N/A"}
                </div>
                <div>
                  <span className="font-medium">Assigned Users:</span>{" "}
                  {project.assignedUserIds.length || "None"}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Tasks:</span>{" "}
                  {project.projectTasks.length || "No tasks assigned"}
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t">
                <button
                  onClick={() => {
                    setSelectedProject(project);
                    setIsProjectModalOpen(true);
                  }}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleTaskManager(project)}
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Manage Tasks
                </button>
                <button
                  onClick={() => handleUserManager(project)}
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Manage Employees
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isProjectModalOpen && selectedProject && (
          <motion.div
            key="edit-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-xl rounded-xl shadow-xl p-6"
            >
              {editSuccess && (
                <div className="mb-4 rounded bg-green-100 text-green-700 px-4 py-2">
                  {editSuccess}
                </div>
              )}

              {editError && (
                <div className="mb-4 rounded bg-red-100 text-red-700 px-4 py-2">
                  {editError}
                </div>
              )}
              <h2 className="text-2xl font-semibold mb-5">Edit Project</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  />
                  {editErrors.name && (
                    <p className="text-sm text-red-600 mt-1">
                      {editErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Due Date
                    </label>
                    <input
                      type="datetime-local"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                      className="w-full border rounded px-3 py-2"
                    />

                    {editErrors.dueDate && (
                      <p className="text-sm text-red-600 mt-1">
                        {editErrors.dueDate}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={(e) => setIsCompleted(e.target.checked)}
                    />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditProject}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
