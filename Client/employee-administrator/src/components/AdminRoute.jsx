import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role != "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
