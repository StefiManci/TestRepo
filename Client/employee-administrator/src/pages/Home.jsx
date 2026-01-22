import Projects from "../components/Home/Projects";
import Tasks from "../components/Home/Task/Tasks";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(0);
  const [projectDueDate, setProjectDueDate] = useState(null);

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-lg shadow border border-gray-200 p-4"
        >
          <h1 className="text-xl font-semibold mb-4 text-gray-800">Projects</h1>
          <Projects
            setSelectedProject={setSelectedProject}
            setProjectDueDate={setProjectDueDate}
          />
        </motion.div>

        <div className="border-t border-gray-300" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="bg-white rounded-lg shadow border border-gray-200 p-4"
        >
          <h1 className="text-xl font-semibold mb-4 text-gray-800">Tasks</h1>
          <Tasks
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            projectDueDate={projectDueDate}
          />
        </motion.div>
      </div>
    </div>
  );
}
