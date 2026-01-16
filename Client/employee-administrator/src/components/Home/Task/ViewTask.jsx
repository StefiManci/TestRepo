export default function ViewTask({ task, onClose }) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-1/2 h-4/5 rounded-lg shadow-lg p-6 relative overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-4">Task Details</h2>

        <div className="space-y-4">
          <div>
            <span className="font-semibold">Title:</span>
            <p>{task.title}</p>
          </div>

          <div>
            <span className="font-semibold">Description:</span>
            <p>{task.description}</p>
          </div>

          <div className="flex gap-8">
            <div>
              <span className="font-semibold">Status:</span>
              <p
                className={`text-xs px-2 py-1 rounded-full ${
                  task.isCompleted
                    ? "bg-green-100 text-green-700"
                    : task.dueDate && new Date(task.dueDate) < new Date()
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {task.isCompleted
                  ? "Completed"
                  : task.dueDate && new Date(task.dueDate) < new Date()
                  ? "Overdue"
                  : "In Progress"}
              </p>
            </div>

            <div>
              <span className="font-semibold">Project ID:</span>
              <p>{task.projectId}</p>
            </div>
          </div>

          <div className="flex gap-8">
            <div>
              <span className="font-semibold">Created At:</span>
              <p>{new Date(task.createdAt).toLocaleString()}</p>
            </div>

            <div>
              <span className="font-semibold">Due Date:</span>
              <p>{new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <span className="font-semibold">Assigned Users:</span>
            {task.assignedUserIds?.length > 0 ? (
              <ul className="list-disc list-inside mt-2">
                {task.assignedUserIds.map((userId) => (
                  <li key={userId} className="text-sm text-gray-700">
                    {userId}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No users assigned</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
