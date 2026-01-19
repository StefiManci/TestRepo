import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserManager from "../components/admin/UserManager";
import ProjectManager from "../components/admin/ProjectManager";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("welcome");

  const tabs = [
    { id: "user", label: "Manage Users" },
    { id: "project", label: "Manage Projects" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="w-60 bg-white shadow-lg p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <nav className="flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left px-4 py-2 rounded font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-100 text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 p-6">
        <AnimatePresence exitBeforeEnter>
          {activeTab === "user" && (
            <motion.div
              key="user"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-4">User Management</h2>
              <UserManager />
            </motion.div>
          )}

          {activeTab === "project" && (
            <motion.div
              key="project"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Project Management</h2>
              <ProjectManager />
            </motion.div>
          )}

          {activeTab === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Welcome!</h2>
              <p className="text-gray-700">
                Welcome to the Admin Dashboard. Use the sidebar to manage users,
                tasks, and projects efficiently.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
