import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";

/**
 * Main layout for all authenticated dashboard pages.
 * Includes a sidebar (desktop), header (mobile), and content area.
 * Now includes a mobile sidebar state.
 */
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* --- Desktop Sidebar --- */}
      <DashboardSidebar />
      {/* --- End Desktop Sidebar --- */}

      {/* --- Mobile Sidebar Backdrop --- */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      {/* --- End Mobile Sidebar Backdrop --- */}

      {/* --- Mobile Sidebar --- */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-gray-900 text-white transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <DashboardSidebar />
      </div>
      {/* --- End Mobile Sidebar --- */}

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* --- Mobile Header --- */}
        <header className="flex items-center justify-between p-4 bg-white shadow-md lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-blue-600">HealthSys</h1>
          <div className="w-6"></div>{" "}
          {/* Spacer to balance the header */}
        </header>
        {/* --- End Mobile Header --- */}

        {/* --- Main Content (includes header for desktop) --- */}
        <div className="flex-1 flex flex-col overflow-auto">
          {/* --- Desktop Header --- */}
          <DashboardHeader />
          {/* --- End Desktop Header --- */}

          {/* --- Page Content --- */}
          <main className="flex-1 p-6 md:p-8">
            <Outlet />
          </main>
          {/* --- End Page Content --- */}
        </div>
      </div>
      {/* --- End Main Content Area --- */}
    </div>
  );
};

export default DashboardLayout;