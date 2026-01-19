import { useState, useEffect } from "react";
import api from "../../../config/api";
import { motion, AnimatePresence } from "framer-motion";

export default function ManageProjectUsers({ closeModal, project }) {
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [users, setUsers] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [change, setChange] = useState(0);

  const handleAddUserToggle = () => setIsAddingUser((prev) => !prev);

  useEffect(() => {
    async function fetchProjectUsers() {
      try {
        const response = await api.get(
          `project/get-project-users/${project.id}`,
        );
        if (response.data.success) setUsers(response.data.users);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProjectUsers();
  }, [project, change]);

  useEffect(() => {
    async function fetchAllUsers() {
      try {
        const response = await api.get("/auth/get-users");
        if (response.data.success) setAllUsers(response.data.users);
      } catch (err) {
        console.error(err);
      }
    }
    fetchAllUsers();
  }, [project]);

  const handleAssignUser = async () => {
    if (!selectedUserId) return;
    try {
      const response = await api.post(
        `/project/add-user/${selectedUserId}/to-project/${project.id}`,
      );
      if (response.data.success) {
        setIsAddingUser(false);
        setChange((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveUser = async (userId, projectId) => {
    try {
      const response = await api.post(
        `/project/remove-user/${userId}/from-project/${projectId}`,
      );
      if (response.data.success) setChange((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  if (!users || !allUsers) return null;

  const availableUsers = allUsers.filter(
    (user) => !project.assignedUserIds.includes(String(user.user.id)),
  );

  return (
    <AnimatePresence>
      <motion.div
        key="project-users-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-[75vw] h-[75vh] bg-white rounded-lg shadow-lg flex flex-col"
        >
          {/* Header */}
          <div className="border-b px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              Manage Users for{" "}
              <span className="text-red-500">{project?.name}</span>
            </h1>
            <button
              onClick={handleAddUserToggle}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isAddingUser ? "Close" : "+ Add User"}
            </button>
          </div>

          {/* Add User Form */}
          <AnimatePresence>
            {isAddingUser && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="border-b bg-gray-50 px-6 py-4"
              >
                <div className="p-4">
                  {availableUsers.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold">
                        Select a user to add:
                      </label>
                      <select
                        className="border p-2 rounded"
                        onChange={(e) => setSelectedUserId(e.target.value)}
                      >
                        <option value="">-- Select User --</option>
                        {availableUsers.map((u) => (
                          <option key={u.user.id} value={u.user.id}>
                            {u.user.userName} ({u.user.email})
                          </option>
                        ))}
                      </select>
                      <button
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={handleAssignUser}
                      >
                        Add User
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-500">No available users to add.</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User List */}
          <div className="flex-1 overflow-y-auto p-6">
            {users.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {users.map((user) => (
                  <motion.div
                    key={user.id ?? user}
                    whileHover={{ scale: 1.03 }}
                    className="border rounded-xl p-4 bg-white shadow cursor-pointer transition-all duration-200"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
                        {user.userName
                          ? user.userName.charAt(0).toUpperCase()
                          : String(user).charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {user.userName ?? `User #${user}`}
                        </h3>
                        {user.email && (
                          <p className="text-sm text-gray-500">{user.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleRemoveUser(user.id, project.id)}
                        className="flex-1 text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No users assigned to this project.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex justify-end">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
