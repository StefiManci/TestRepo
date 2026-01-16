import { useState } from "react";

export default function ManageProjectTasksModal({ closeModal, project }) {
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleAddTask = () => {
    setIsAddingTask((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-[75vw] h-[75vh] bg-white rounded-lg shadow-lg flex flex-col">
        <div className="border-b px-6 py-4 flex justify-between items-center shrink-0">
          <h1 className="text-2xl font-bold">
            Manage Project Tasks for{" "}
            <span className="text-red-500">{project?.name}</span>
          </h1>

          <button
            onClick={handleAddTask}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Task
          </button>
        </div>
        {isAddingTask && (
          <div className="border-b bg-gray-50 px-6 py-4 shrink-0">
            <div className="border-2 border-dashed rounded-lg p-4 text-center text-gray-500">
              Task creation form will appear here
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-6">
          {project?.projectTasks?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {project.projectTasks.map((task) => (
                <div
                  key={task.id}
                  className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        task.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : task.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {task.description || "No description provided."}
                  </p>

                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Priority: {task.priority}</span>
                    <span>Due: {task.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No tasks found for this project.
            </div>
          )}
        </div>
        <div className="border-t px-6 py-4 flex justify-end shrink-0">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
