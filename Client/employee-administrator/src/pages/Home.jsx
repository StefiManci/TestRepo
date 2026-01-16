import Projects from "../components/Home/Projects";
import Tasks from "../components/Home/Task/Tasks";
import { useState } from "react";

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(0);

  return (
    <>
      <div className="flex-1 flex justify-center items-start">
        <Projects setSelectedProject={setSelectedProject}></Projects>
        <Tasks
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        ></Tasks>
      </div>
    </>
  );
}
