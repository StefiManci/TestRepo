import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 p-6 text-center mt-10 shadow-inner"
    >
      <p className="text-sm">
        © {new Date().getFullYear()} Project Manager. All rights reserved.
      </p>
    </motion.footer>
  );
}
