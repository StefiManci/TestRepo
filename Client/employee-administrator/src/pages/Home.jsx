import Projects from "../components/Home/Projects";
import Tasks from "../components/Home/Task/Tasks";
import { useState } from "react";
import ViewTask from "../components/Home/Task/ViewTask";

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(0);
  const [isViewingTask, setIsViewingTask] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex-1 flex justify-center items-start">
        <Projects setSelectedProject={setSelectedProject}></Projects>
        <Tasks selectedProject={selectedProject}></Tasks>
      </div>

      {isModalOpen && (
        <ViewTask
          setIsViewingTask={setIsViewingTask}
          closeModal={closeModal}
          task={isViewingTask}
        ></ViewTask>
      )}
    </>
  );
}
