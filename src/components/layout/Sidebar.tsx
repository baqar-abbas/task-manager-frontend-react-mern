import React from "react";
import { NavLink } from "react-router-dom";
import { FaTasks, FaChartBar, FaCog, FaHome } from "react-icons/fa";

const Sidebar: React.FC = () => {
  const navItems = [
    { to: "/dashboard", icon: <FaHome />, label: "Dashboard" },
    { to: "/tasks", icon: <FaTasks />, label: "Tasks" },
    { to: "/stats", icon: <FaChartBar />, label: "Statistics" },
    { to: "/settings", icon: <FaCog />, label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg min-h-[calc(100vh-80px)]">
      <nav className="p-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-600 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
