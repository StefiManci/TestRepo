import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../config/api";
import { motion } from "framer-motion";

export default function Projects({
  setSelectedProject,
  setProjectDueDate,
  setProjectName,
}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const userRole = useSelector((state) => state.auth.userRole);
  const userId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get(`/project/get-user-projects/${userId}`);
        if (response.data.success) {
          setProjects(response.data.projects);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token, userId, userRole]);

  const handleProjectClick = (projectId, dueDate, projectName) => {
    setSelectedProject(projectId);
    setProjectDueDate(dueDate);
    setProjectName(projectName);
  };

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Projects</h1>

      {loading && <p className="text-gray-500">Loading projects...</p>}
      {!loading && projects.length === 0 && (
        <p className="text-gray-500">No projects available.</p>
      )}

      <div className="w-full overflow-x-auto pb-4">
        <div className="flex gap-6 px-4 min-w-max">
          {!loading &&
            projects.map((project, index) => {
              const status = project.isCompleted
                ? "Completed"
                : project.dueDate && new Date(project.dueDate) < new Date()
                  ? "Overdue"
                  : "In Progress";

              return (
                <motion.div
                  key={project.id}
                  onClick={() =>
                    handleProjectClick(
                      project.id,
                      project.dueDate,
                      project.name,
                    )
                  }
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0px 15px 25px rgba(0,0,0,0.15)",
                  }}
                  className="min-w-[300px] max-w-[300px] bg-white rounded-xl p-6 shadow cursor-pointer flex-shrink-0 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-semibold text-gray-800 truncate">
                      {project.name}
                    </h2>
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

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex justify-between text-sm text-gray-500 mt-auto">
                    <span>
                      Created:{" "}
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      Due:{" "}
                      {project.dueDate
                        ? new Date(project.dueDate).toLocaleDateString()
                        : "No deadline"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
