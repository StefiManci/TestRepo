export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 p-6 text-center mt-10">
      <p className="text-sm">
        © {new Date().getFullYear()} My Website
      </p>
    </footer>
  );
}
