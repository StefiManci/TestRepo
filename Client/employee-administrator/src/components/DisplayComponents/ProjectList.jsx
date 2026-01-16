import { useState, useEffect } from "react";
import api from "../../config/api";
import ManageProjectTasksModal from "../Admin/TaskComponents/ManageProjectTasks";
import ManageProjectUsers from "../Admin/TaskComponents/ManageProjectUsers";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [change, setChange] = useState(0);
  const [isTaskManagerOpen, setIsTaskManagerOpen] = useState(false);
  const [isUserManagerOpen, setIsUserManagerOpen] = useState(false);

  //Edit Project State
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [assignedUserIds, setAssignedUserIds] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);

  //Edit Project Function
  useEffect(() => {
    if (selectedProject) {
      setProjectName(selectedProject.name ?? "");
      setDescription(selectedProject.description ?? "");
      setIsCompleted(!!selectedProject.isCompleted);
      setDueDate(
        selectedProject.dueDate ? selectedProject.dueDate.split("T")[0] : ""
      );
      setAssignedUserIds(selectedProject.assignedUserIds ?? []);
      setProjectTasks(selectedProject.projectTasks ?? []);
    }
  }, [selectedProject]);

  const handleEditProject = async () => {
    const payload = {
      id: selectedProject.id,
      name: projectName,
      description,
      isCompleted,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      assignedUserIds,
      projectTasks,
    };

    try {
      const response = await api.post("/project/edit-project", payload);
      console.log("Project updated:", response);

      handleProjectModalClose();
    } catch (err) {
      console.error("Error saving project:", err);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await api.get("/project/get-projects");

      console.log("Fetch projects response:", response.data);

      setProjects(response.data.projects);
    };
    fetchProjects();
  }, [change]);

  const handleEdit = (index) => {
    const project = projects[index];
    setSelectedProject({
      ...project,
      assignedUserIdsStr: project.assignedUserIds.join(", "),
      projectTasksStr: project.projectTasks.join(", "),
    });
    setIsProjectModalOpen(true);
  };

  const handleDelete = async (index) => {
    try {
      const project = projects[index];
      const response = await api.delete(
        `/project/delete-project/${project.id}`
      );

      console.log("Delete project response:", response.data);
      setChange((prev) => prev + 1);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleProjectModalClose = () => {
    setIsProjectModalOpen(false);
    setSelectedProject(null);
  };

  const handleTaskManager = (projectId) => {
    setIsTaskManagerOpen((prev) => !prev);
    setSelectedProject(projects.find((proj) => proj.id === projectId));
  };

  const handleUserManager = (projectId) => {
    setIsUserManagerOpen((prev) => !prev);
    setSelectedProject(projects.find((proj) => proj.id === projectId));
  };

  return (
    <>
      {isTaskManagerOpen && (
        <ManageProjectTasksModal
          closeModal={handleTaskManager}
          project={selectedProject}
        />
      )}
      {isUserManagerOpen && (
        <ManageProjectUsers
          closeModal={handleUserManager}
          project={selectedProject}
        />
      )}
      <div className="w-3/4 h-full p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-5">
          {projects.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              No projects available
            </div>
          ) : (
            projects.map((project, index) => (
              <div
                key={project.id}
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
                    {project.assignedUserIds.length > 0
                      ? project.assignedUserIds.join(", ")
                      : "None"}
                  </div>

                  <div className="col-span-2">
                    <span className="font-medium">Tasks:</span>{" "}
                    {project.projectTasks.length > 0
                      ? project.projectTasks.join(", ")
                      : "No tasks assigned"}
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t">
                  <button
                    onClick={() => handleEdit(index)}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(index)}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => handleTaskManager(project.id)}
                    className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Manage Tasks
                  </button>

                  <button
                    onClick={() => handleUserManager(project.id)}
                    className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Manage Employees
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isProjectModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-xl p-6">
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
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  />
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
                onClick={handleProjectModalClose}
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
          </div>
        </div>
      )}
    </>
  );
}
