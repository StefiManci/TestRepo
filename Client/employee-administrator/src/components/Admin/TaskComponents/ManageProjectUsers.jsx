import { useState } from "react";

export default function ManageProjectUsers({ closeModal, project }) {
  const [isAddingUser, setIsAddingUser] = useState(false);
  

  const handleAddUser = () => {
    setIsAddingUser((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-[75vw] h-[75vh] bg-white rounded-lg shadow-lg flex flex-col">
        <div className="border-b px-6 py-4 flex justify-between items-center shrink-0">
          <h1 className="text-2xl font-bold">
            Manage Project Users for{" "}
            <span className="text-red-500">{project?.name}</span>
          </h1>

          <button
            onClick={handleAddUser}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add User
          </button>
        </div>

        {isAddingUser && (
          <div className="border-b bg-gray-50 px-6 py-4 shrink-0">
            <div className="border-2 border-dashed rounded-lg p-4 text-center text-gray-500">
              User assignment form will appear here
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {project?.assignedUserIds?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {project.assignedUserIds.map((user) => (
                <div
                  key={user.id ?? user}
                  className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-lg">
                      {user.name
                        ? user.name.charAt(0).toUpperCase()
                        : String(user).charAt(0)}
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg">
                        {user.name ?? `User #${user}`}
                      </h3>
                      {user.email && (
                        <p className="text-sm text-gray-600">{user.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Role: {user.role ?? "Member"}</span>
                    <span>Status: Active</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No users assigned to this project.
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
