// App.jsx
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { loadUser } from "./store/authSlice";
import UserProfile from "./pages/UserProfile";

export default function App() {
  const dispatch = useDispatch();

  dispatch(loadUser());

  const token = useSelector((state) => state.auth.token);


  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/"></Navigate> : <Login />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="/profile" element={<UserProfile></UserProfile>} />
        <Route path="/admin" element={<AdminDashboard></AdminDashboard>} />
      </Route>
    </Routes>
  );
}
