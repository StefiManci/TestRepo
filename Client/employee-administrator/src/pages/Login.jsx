import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import api from "../config/api";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidGmail(email)) {
      setError("Only Gmail addresses (@gmail.com) are allowed.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.data.success) {
        dispatch(
          login({
            token: response.data.token,
            userName: response.data.userName,
            userRole: response.data.userRole,
            userId: response.data.userId,
          }),
        );
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isValidGmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md p-10 bg-white rounded-2xl shadow-2xl flex flex-col gap-6"
      >
        <motion.h1
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-3xl font-bold text-center text-gray-800"
        >
          Welcome Back
        </motion.h1>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-2 bg-red-100 text-red-700 rounded text-center font-medium"
          >
            {error}
          </motion.div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex flex-col"
          >
            <label className="mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`border ${error ? "border-b-2 border-red-600" : ""} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
            />
          </motion.div>
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex flex-col"
          >
            <label className="mb-1 font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </motion.div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
