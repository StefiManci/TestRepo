import { useState } from "react";
import CreateTask from "./CreateTask";

export default function Tasks({
  selectedProject,
  tasks,
  openModal,
  setIsViewingTask,
}) {
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const filteredTasks =
    selectedProject !== 0
      ? tasks.filter((task) => task.projectId === selectedProject)
      : [];

  const handleModal = (projectId) => {
    openModal();
    const task = filteredTasks.find((t) => t.id === projectId);
    setIsViewingTask(task);
  };

  return (
    <div className="h-150 w-1/2 flex flex-col items-center justify-start gap-4">
      <h1 className="text-3xl font-bold">Tasks</h1>

      <div className="bg-white p-4 rounded-lg shadow w-5/6 mt-4 mb-4">
        <h2 className="text-xl font-semibold">
          Selected Project ID: {selectedProject}
        </h2>
      </div>

      <div className="bg-white p-4 flex rounded-lg shadow w-5/6 mt-4 mb-4">
        <div className="h-20 w-1/2 flex justify-center items-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setIsCreatingTask(!isCreatingTask)}
          >
            {isCreatingTask ? "Cancel" : "Create New Task"}
          </button>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          Here Will Be The Task Filter
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow w-5/6 mt-4">
        {isCreatingTask ? (
          <CreateTask selectedProject={selectedProject} />
        ) : (
          <>
            {selectedProject === 0 && (
              <p>Please select a project to view its tasks.</p>
            )}
            {selectedProject !== 0 && filteredTasks.length === 0 && (
              <p>No tasks available for the selected project.</p>
            )}
            {filteredTasks.length > 0 && (
              <ul>
                {filteredTasks.map((task) => (
                  <li
                    key={task.id}
                    className="mb-2"
                    onClick={() => handleModal(task.id)}
                  >
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <p className="text-gray-600">{task.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
