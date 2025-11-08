import React, { useEffect } from "react";
import { Users2, Stethoscope, FileText, UserCheck } from "lucide-react";
import useAdminStore from "../store/useAdminStore";
import useAuthStore from "../store/authStore";
import Spinner from "../components/Spinner"; // Make sure this path is correct

/**
 * The main "Admin" dashboard page.
 * Displays stat cards.
 */
const AdminDashboard = () => {
  const { authUser } = useAuthStore();
  const {
    users,
    consultations,
    isLoading,
    fetchAllUsers,
    fetchAllConsultations,
  } = useAdminStore();

  useEffect(() => {
    // Fetch all data when the component mounts
    fetchAllUsers();
    fetchAllConsultations();
  }, [fetchAllUsers, fetchAllConsultations]);

  // --- Calculate Stats ---
  const stats = React.useMemo(() => {
    const totalUsers = users.length;
    const totalDoctors = users.filter((u) => u.role === "doctor").length;
    const pendingDoctors = users.filter(
      (u) => u.role === "doctor" && !u.isVerified
    ).length;
    const totalConsultations = consultations.length;
    return { totalUsers, totalDoctors, pendingDoctors, totalConsultations };
  }, [users, consultations]);

  return (
    <div className="space-y-8">
      {/* --- Welcome Banner --- */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Welcome, {authUser?.name}! Manage users, verify doctors, and monitor
          system activity.
        </p>
      </div>

      {/* --- Loading --- */}
      {isLoading && (users.length === 0 || consultations.length === 0) && (
        <div className="flex justify-center p-10">
          <Spinner size="lg" />
        </div>
      )}

      {/* --- Stat Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users2}
          color="blue"
        />
        <StatCard
          title="Total Doctors"
          value={stats.totalDoctors}
          icon={Stethoscope}
          color="green"
        />
        <StatCard
          title="Pending Doctors"
          value={stats.pendingDoctors}
          icon={UserCheck}
          color="yellow"
        />
        <StatCard
          title="Total Consultations"
          value={stats.totalConsultations}
          icon={FileText}
          color="purple"
        />
      </div>

      {/* --- Placeholder for other summaries --- */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Activity Feed</h2>
        <p className="text-gray-500">
          An activity feed or other summaries could go here.
        </p>
      </div>
    </div>
  );
};

// --- StatCard Component ---
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-md flex items-center space-x-4">
      <div
        className={`shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${colors[color]}`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;