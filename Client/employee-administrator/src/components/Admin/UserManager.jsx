import { useState } from "react";
import UserList from "../DisplayComponents/UserList";
import axios from "axios";
import { useSelector } from "react-redux";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

export default function UserManager() {
  const [form, setForm] = useState(initialState);
  const [selectedMethod, setSelectedMethod] = useState("");
  const token = useSelector((state) => state.auth.token);

  const changeMethod = (method) => {
    setSelectedMethod(method);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      userName: form.userName,
      email: form.email,
      password: form.password,
    };

    var response = await axios.post(
      "http://localhost:5000/api/Auth/create-user",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
                className="w-full max-w-md p-6 bg-white rounded-lg shadow"
                onSubmit={handleSubmit}
              >
                <h2 className="text-xl font-semibold mb-6">
                  Create User Account
                </h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="userName"
                    value={form.userName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Submit
                </button>
              </form>
            </div>
          </>
        );

      case "view":
        return (
          <>
            <div className="w-3/4 h-full flex items-center justify-center">
              <UserList></UserList>
            </div>
          </>
        );
    }
  };

  return (
    <div className="w-full h-full flex justify-start items-center">
      <div className="w-1/4 h-full flex flex-col p-5 justify-start items-center gap-4 border-r-2 border-gray-300">
        <div
          onClick={() => changeMethod("add")}
          className="w-full h-10 border-b-2 border-gray-300 flex justify-center items-center"
        >
          Add User
        </div>
        <div
          onClick={() => changeMethod("view")}
          className="w-full h-10 border-b-2 border-t-2 border-gray-300 flex justify-center items-center"
        >
          View Users
        </div>
      </div>
      {renderContent()}
    </div>
  );
}
