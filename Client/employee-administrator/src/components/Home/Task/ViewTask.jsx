import { useSelector } from "react-redux";

export default function ViewTask({ task, onClose }) {
  const userRole = useSelector((state) => state.auth.userRole);

  if (!task) return null;

  console.log(userRole);

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
              <ul className="mt-2 space-y-2">
                {task.assignedUserIds.map((userId) => (
                  <li
                    key={userId}
                    className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
                  >
                    <span className="text-sm text-gray-700">{userId}</span>

                    {userRole[0] === "Admin" && (
                      <button
                        className="text-red-600 hover:text-red-800 font-bold"
                        title="Remove user"
                      >
                        −
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mt-2">No users assigned</p>
            )}
            {userRole[0] === "Admin" && (
              <button className="mt-3 flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold">
                <span className="text-lg">+</span>
                <span>Add user</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
