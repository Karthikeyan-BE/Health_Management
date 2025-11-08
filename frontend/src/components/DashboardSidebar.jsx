import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus,
  Shield,
  Stethoscope,
  LogOut,
  HeartPulse,
  Bell,
  Users2,
  UserCheck,
  FileText, // <-- 1. Import new icon
} from "lucide-react";
import useAuthStore from "../store/authStore";

/**
 * Sidebar navigation component.
 * Displays different links based on the user's role.
 */
const DashboardSidebar = () => {
  const { authUser, logOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate("/"); // Redirect to portfolio after logout
  };

  const role = authUser?.role;

  // ... (userLinks and doctorLinks are the same)
  const userLinks = [
    {
      icon: LayoutDashboard,
      name: "Dashboard",
      path: "/app/user",
    },
    {
      icon: FilePlus,
      name: "New Consultation",
      path: "/app/user/new",
    },
  ];

  const doctorLinks = [
    {
      icon: LayoutDashboard,
      name: "Dashboard",
      path: "/app/doctor",
    },
    {
      icon: Bell,
      name: "Pending Cases",
      path: "/app/doctor/pending",
    },
  ];

  const adminLinks = [
    {
      icon: LayoutDashboard,
      name: "Dashboard",
      path: "/app/admin",
    },
    {
      icon: Users2,
      name: "Manage Users",
      path: "/app/admin/users",
    },
    {
      icon: Stethoscope,
      name: "Manage Doctors",
      path: "/app/admin/doctors",
    },
    {
      icon: UserCheck,
      name: "Verify Doctors",
      path: "/app/admin/verify",
    },
    {
      // <-- 2. Add new Consultations link
      icon: FileText,
      name: "Consultations",
      path: "/app/admin/consultations",
    },
  ];

  // Determine which links to show
  let navLinks = [];
  if (role === "user") navLinks = userLinks;
  else if (role === "doctor") navLinks = doctorLinks;
  else if (role === "admin") navLinks = adminLinks;

  // NavLink styles
  const getNavLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      {/* Logo/Header */}
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <HeartPulse className="w-8 h-8 text-blue-500" />
        <span className="ml-3 text-2xl font-bold text-white">HealthSys</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === "/app/admin"} // Use 'end' for the Dashboard link
            className={getNavLinkClass}
          >
            <link.icon className="w-5 h-5 mr-3" />
            {link.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="px-4 py-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;