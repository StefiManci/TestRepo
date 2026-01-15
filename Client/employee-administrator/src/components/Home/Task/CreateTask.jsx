import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function CreateTask({ selectedProject, onCreate, closeModal }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const userId = useSelector((state) => state.auth.userId);
  const [assignedUserIds, setAssignedUserIds] = useState([userId]);
  const token = useSelector((state) => state.auth.token);

  const addAssignedUser = () => setAssignedUserIds([...assignedUserIds, ""]);

  const handleAssignedUserChange = (index, value) => {
    const updated = [...assignedUserIds];
    updated[index] = value;
    setAssignedUserIds(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      title,
      description,
      isCompleted: false,
      dueDate: dueDate || new Date().toISOString(),
      projectId: selectedProject,
      assignedUserIds: assignedUserIds.filter((id) => id.trim() !== ""),
    };

    console.log("New Task:", newTask);

    var response = await axios.post(
      "http://localhost:5000/api/task/create-task",
      newTask,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Response:", response.data);

    if (onCreate) onCreate(newTask);

    setTitle("");
    setDescription("");
    setDueDate("");
    setAssignedUserIds([""]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full mt-4 mb-4 flex flex-col justify-start items-start">
      <h1 className="text-xl font-semibold mb-4">Create Task</h1>
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block font-medium">Title:</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="block font-medium">Description:</label>
          <textarea
            className="border p-2 w-full rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="block font-medium">Due Date:</label>
          <input
            type="datetime-local"
            className="border p-2 w-full rounded"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="block font-medium">Assigned Users:</label>
          {assignedUserIds.map((id, index) => (
            <input
              key={index}
              type="text"
              className="border p-2 w-full rounded mb-2"
              placeholder="User ID"
              value={id}
              onChange={(e) => handleAssignedUserChange(index, e.target.value)}
            />
          ))}
          <button
            type="button"
            className="text-blue-500 underline mb-3"
            onClick={addAssignedUser}
          >
            + Add another user
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Task
        </button>
        <button onClick={closeModal}>Close</button>
      </form>
    </div>
  );
}
