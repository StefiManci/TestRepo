import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();

  const userName = useSelector((state) => state.auth.userName);
  const userRole = useSelector((state) => state.auth.userRole[0]);

  const onLogout = () => {
    dispatch(logout());
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-600 after:w-full"
      : "text-gray-700 after:w-0";

  const initials = userName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link
        to="/"
        className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
      >
        ProjectManager
      </Link>

      <div className="flex gap-8 font-medium">
        <Link
          to="/"
          className={`relative pb-1 transition-all after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-blue-600 after:transition-all ${isActive(
            "/"
          )}`}
        >
          Projects
        </Link>

        <Link
          to="/profile"
          className={`relative pb-1 transition-all after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-blue-600 after:transition-all ${isActive(
            "/profile"
          )}`}
        >
          Profile
        </Link>

        {userRole === "Admin" && (
          <Link
            to="/admin"
            className={`relative pb-1 transition-all after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-blue-600 after:transition-all ${isActive(
              "/admin"
            )}`}
          >
            Admin
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          {initials}
        </div>

        <div className="leading-tight text-right">
          <div className="font-semibold text-gray-800">{userName}</div>
          <div className="text-sm text-gray-500">{userRole}</div>
        </div>

        <button
          onClick={onLogout}
          className="ml-3 px-4 py-2 rounded-lg border border-red-500 text-red-600
                     hover:bg-red-500 hover:text-white transition-all"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
