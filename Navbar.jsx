import { Link, useLocation } from "react-router-dom";
import logo from "/assets/logo5.png";

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Takeaway", path: "/order-takeaway" },
    { name: "Reserve", path: "/select-date-time" },
    { name: "Update/Cancel", path: "/update-or-delete-order" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Aurum Dining Logo" className="w-10 h-10 rounded-full" />
          <span className="text-xl font-semibold text-amber-700">Aurum Dining</span>
        </Link>

        <ul className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`text-sm font-medium ${
                  location.pathname === link.path
                    ? "text-amber-700 border-b-2 border-amber-600"
                    : "text-gray-600 hover:text-amber-600"
                } transition`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
