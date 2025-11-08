import React from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';
import Spinner from './Spinner';

/**
 * The header component for the dashboard.
 */
const DashboardHeader = ({ setSidebarOpen }) => {
  const { authUser, logOut, isLoading } = useAuthStore();

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-600">
        <Menu className="w-6 h-6" />
      </button>
      <div className="text-lg font-semibold text-gray-800 hidden md:block">
        Welcome back, {authUser?.name}!
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-blue-600">
          <Bell className="w-6 h-6" />
        </button>
        <button
          onClick={logOut}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-100"
        >
          {isLoading ? <Spinner size="sm" /> : <LogOut className="w-4 h-4" />}
          Logout
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;