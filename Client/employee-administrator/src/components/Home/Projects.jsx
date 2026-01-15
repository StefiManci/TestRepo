import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function Projects({ setSelectedProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const userRole = useSelector((state) => state.auth.userRole);
  const userId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    console.log("AUTH STATE CHECK");
    console.log("token:", token);
    console.log("userId:", userId, typeof userId);
    console.log("userRole:", userRole);

    if (!token || userId == null || !userRole) {
      console.log("Auth not ready yet — waiting");
      return;
    }

    const fetchProjects = async () => {
      console.log("Fetching projects...");

      const response = await fetch(
        "http://localhost:5000/api/project/get-projects",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      let result = [];

      if (String(userRole).toLowerCase() !== "Admin") {
        result = data.projects.filter((p) =>
          p.assignedUserIds?.some((id) => String(id) === String(userId))
        );
      } else {
        result = data.projects;
      }

      setProjects(result);
      setLoading(false);
    };

    fetchProjects();
  }, [token, userId, userRole]);

  const handleProjectClick = (projectId) => {
    setSelectedProject(projectId);
  };

  return (
    <div className="h-150 w-1/2 flex flex-col items-center justify-start gap-4">
      <h1 className="text-3xl font-bold">Projects</h1>

      {loading && <p className="text-gray-500 mt-4">Loading projects...</p>}

      {!loading && projects.length === 0 && (
        <p className="text-gray-500 mt-4">No projects available.</p>
      )}

      {!loading &&
        projects.map((project) => (
          <div
            key={project.id}
            className="bg-white p-4 rounded-lg shadow w-5/6 flex flex-col justify-center items-center cursor-pointer hover:shadow-md transition"
            onClick={() => handleProjectClick(project.id)}
          >
            <h2 className="text-xl font-semibold">{project.name}</h2>
            <p className="text-gray-600">{project.description}</p>
          </div>
        ))}
    </div>
  );
}
