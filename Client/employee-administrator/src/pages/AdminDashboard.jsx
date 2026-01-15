import { useState } from "react";
import UserManager from "../components/admin/UserManager";
import TaskManager from "../components/admin/TaskManager";
import ProjectManager from "../components/admin/ProjectManager";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="w-full h-150 flex flex-col justify-center items-start">
        <div className="w-full h-20 flex flex-row justify-start items-center gap-4 mb-4 border-b-2 border-gray-300 pb-4">
          <div className="w-1/4 h-full">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          </div>
          <div className="w-3/4 h-full flex flex-row justify-center items-center gap-4">
            <button
              onClick={() => handleTabClick("user")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Manage Users
            </button>
            <button
              onClick={() => handleTabClick("project")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Manage Projects
            </button>
          </div>
        </div>
        <div className="w-full h-130 flex flex-col justify-center items-center">
          {activeTab === "user" ? (
            <UserManager />
          ) : activeTab === "project" ? (
            <ProjectManager />
          ) : (
            <p className="text-lg text-black">
              Welcome to the Admin Dashboard. Here you can manage users,tasks
              and projects.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
