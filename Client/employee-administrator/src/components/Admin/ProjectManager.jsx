import { useState } from "react";
import ProjectList from "../DisplayComponents/ProjectList";
import axios from "axios";
import { useSelector } from "react-redux";

const initialState = {
  name: "",
  description: "",
  isCompleted: false,
  dueDate: "",
  assignedUserIds: "",
  projectTasks: "",
};

export default function ProjectManager() {
  const [form, setForm] = useState(initialState);
  const [selectedMethod, setSelectedMethod] = useState("");
  const token = useSelector((state) => state.auth.token);

  const changeMethod = (method) => {
    setSelectedMethod(method);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      description: form.description,
      isCompleted: form.isCompleted,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      assignedUserIds: form.assignedUserIds
        ? form.assignedUserIds.split(",").map((x) => x.trim())
        : [],
      projectTasks: form.projectTasks
        ? form.projectTasks.split(",").map((x) => x.trim())
        : [],
    };

    var response = await axios.post(
      "http://localhost:5000/api/project/create-project",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);
  };

  const renderContent = () => {
    switch (selectedMethod) {
      case "":
        return (
          <>
            <div className="w-3/4 h-full flex items-center justify-center">
              <h1>Please select an action from the left side to continue!</h1>
            </div>
          </>
        );

      case "add":
        return (
          <>
            <div className="w-3/4 h-full flex items-center justify-center">
              <form
                className="w-full max-w-xl p-6 bg-white rounded-lg shadow"
                onSubmit={handleSubmit}
              >
                <h2 className="text-xl font-semibold mb-6">Create Task</h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                    rows={3}
                  />
                </div>

                <div className="mb-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isCompleted"
                    checked={form.isCompleted}
                    onChange={handleChange}
                  />
                  <label className="text-sm font-medium">Completed</label>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Assigned User IDs (comma separated)
                  </label>
                  <input
                    type="text"
                    name="assignedUserIds"
                    value={form.assignedUserIds}
                    onChange={handleArrayChange}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="user1,user2,user3"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">
                    Project Tasks (comma separated)
                  </label>
                  <input
                    type="text"
                    name="projectTasks"
                    value={form.projectTasks}
                    onChange={handleArrayChange}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="task1,task2"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Task
                </button>
              </form>
            </div>
          </>
        );

      case "view":
        return (
          <>
            <ProjectList></ProjectList>
          </>
        );
    }
  };

  return (
    <div className="w-full h-full flex justify-start items-center">
      <div className="w-1/4 h-full flex flex-col p-5 justify-start items-center gap-4 border-r-2 border-gray-300">
        <div
          onClick={() => changeMethod("add")}
          className="w-full h-10 border-b-2  border-gray-300 flex justify-center items-center"
        >
          Add Project
        </div>
        <div
          onClick={() => changeMethod("view")}
          className="w-full h-10 border-b-2 border-t-2 border-gray-300 flex justify-center items-center"
        >
          View Projects
        </div>
      </div>
      {renderContent()}
    </div>
  );
}
