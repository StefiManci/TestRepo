import Projects from "../components/Home/Projects";
import Tasks from "../components/Home/Task/Tasks";
import { useState, useEffect} from "react";
import axios from "axios";
import ViewTask from "../components/Home/Task/ViewTask";
import { useSelector } from "react-redux";

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [isViewingTask, setIsViewingTask] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userRole = useSelector((state) => state.auth.userRole);
  const userId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/task/get-tasks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let tasksData = response.data.tasks;

        if (userRole !== "Admin") {
          tasksData = tasksData.filter((task) =>
            task.assignedUserIds?.some((id) => id === userId)
          );
        }

        setTasks(tasksData);
        console.log("Filtered tasks:", tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [isViewingTask, userRole, userId]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex-1 flex justify-center items-center">
        <Projects setSelectedProject={setSelectedProject}></Projects>
        <Tasks
          openModal={openModal}
          selectedProject={selectedProject}
          tasks={tasks}
          setIsViewingTask={setIsViewingTask}
        ></Tasks>
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
