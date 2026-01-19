import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { motion } from "framer-motion";

export default function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();

  const userName = useSelector((state) => state.auth.userName);
  const userRole = useSelector((state) => state.auth.userRole?.[0] ?? null);

  const onLogout = () => dispatch(logout());

  const initials = userName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const navLinks = [
    { name: "Projects", path: "/" },
    { name: "Profile", path: "/profile" },
  ];

  if (userRole === "Admin") navLinks.push({ name: "Admin", path: "/admin" });

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link
        to="/"
        className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
      >
        ProjectManager
      </Link>

      <div className="flex gap-8 font-medium">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <motion.div
              key={link.name}
              className="relative pb-1 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <Link
                to={link.path}
                className="transition-colors text-gray-700 font-medium"
              >
                {link.name}
              </Link>
              <motion.div
                layoutId="underline"
                className="absolute left-0 -bottom-1 h-0.5 bg-blue-600"
                initial={{ width: 0 }}
                animate={{ width: isActive ? "100%" : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 relative">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold cursor-pointer"
        >
          {initials}
        </motion.div>

        <div className="leading-tight text-right">
          <div className="font-semibold text-gray-800">{userName}</div>
          <div className="text-sm text-gray-500">{userRole}</div>
        </div>

        <motion.button
          onClick={onLogout}
          whileHover={{ scale: 1.05 }}
          className="ml-3 px-4 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-all"
        >
          Logout
        </motion.button>
      </div>
    </nav>
  );
}
