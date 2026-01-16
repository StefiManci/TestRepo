import Projects from "../components/Home/Projects";
import Tasks from "../components/Home/Task/Tasks";
import { useState } from "react";

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(0);

  return (
    <div className="flex-1 p-6 bg-gray-100">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <h1 className="text-xl font-semibold mb-4 text-gray-800">Projects</h1>
          <Projects setSelectedProject={setSelectedProject} />
        </div>
        <div className="border-t border-gray-300" />
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <h1 className="text-xl font-semibold mb-4 text-gray-800">Tasks</h1>
          <Tasks
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
          />
        </div>
      </div>
    </div>
  );
}
