import { useState, useEffect } from "react";
import ProjectList from "../DisplayComponents/ProjectList";
import { useSelector } from "react-redux";
import api from "../../config/api";

const initialState = {
  name: "",
  description: "",
  isCompleted: false,
  dueDate: "",
  assignedUserIds: [],
  projectTasks: "",
};

export default function ProjectManager() {
  const [form, setForm] = useState(initialState);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get("/auth/get-users");
        if (response.data.success) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    }

    if (token) fetchUsers();
  }, [token]);

  const changeMethod = (method) => {
    if (method === "add") {
      setIsAddModalOpen(true);
    } else {
      setSelectedMethod(method);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddUser = (userId) => {
    if (!form.assignedUserIds.includes(userId)) {
      setForm((prev) => ({
        ...prev,
        assignedUserIds: [...prev.assignedUserIds, userId],
      }));
    }
  };

  const handleRemoveUser = (userId) => {
    setForm((prev) => ({
      ...prev,
      assignedUserIds: prev.assignedUserIds.filter((id) => id !== userId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      description: form.description,
      isCompleted: form.isCompleted,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      assignedUserIds: form.assignedUserIds,
      projectTasks: form.projectTasks
        ? form.projectTasks.split(",").map((x) => x.trim())
        : [],
    };

    try {
      const response = await api.post("/project/create-project", payload);
      console.log("Project creation response:", response);

      setForm(initialState);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const renderContent = () => {
    if (selectedMethod === "view") return <ProjectList />;

    return (
      <div className="w-3/4 h-full flex items-center justify-center">
        <h1 className="text-gray-600">
          Please select an action from the left side to continue
        </h1>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex">
      <div className="w-1/4 h-full flex flex-col p-5 gap-4 border-r-2 border-gray-300">
        <button
          onClick={() => changeMethod("add")}
          className="w-full h-10 border-b hover:bg-gray-100"
        >
          Add Project
        </button>
        <button
          onClick={() => changeMethod("view")}
          className="w-full h-10 border-y hover:bg-gray-100"
        >
          View Projects
        </button>
      </div>

      {renderContent()}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsAddModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-xl bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Create Project</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
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
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Assign Users
                </label>

                <select
                  className="w-full border rounded px-3 py-2"
                  onChange={(e) => handleAddUser(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select user
                  </option>

                  {users.map(({ user }) => (
                    <option key={user.id} value={user.id}>
                      {user.userName} ({user.email})
                    </option>
                  ))}
                </select>

                <div className="flex flex-wrap gap-2 mt-3">
                  {form.assignedUserIds.map((id) => {
                    const u = users.find((x) => x.user.id === id)?.user;
                    if (!u) return null;

                    return (
                      <span
                        key={id}
                        className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {u.userName}
                        <button
                          type="button"
                          onClick={() => handleRemoveUser(id)}
                          className="text-blue-600 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
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

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
