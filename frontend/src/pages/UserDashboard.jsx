import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FilePlus, Eye, Clock, CheckCircle } from "lucide-react";
import useUserStore from "../store/useUserStore";
import useAuthStore from "../store/authStore";
import Spinner from "../components/Spinner";

/**
 * The main "User" dashboard page.
 * Displays stat cards and a list of the user's consultations.
 */
const UserDashboard = () => {
  const { authUser } = useAuthStore();
  const {
    consultations,
    isLoading,
    fetchConsultations,
    getConsultationStats,
  } = useUserStore();

  useEffect(() => {
    // Fetch consultations when the component mounts
    fetchConsultations();
  }, [fetchConsultations]);

  const { total, pending, resolved } = getConsultationStats();

  // Helper to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper to get status badge styles
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case "assigned":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Assigned
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* --- Welcome Banner --- */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {authUser?.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's a summary of your health consultations. You can create a new
          one or review your past history.
        </p>
      </div>

      {/* --- Stat Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Consultations" value={total} color="blue" />
        <StatCard title="Pending" value={pending} color="yellow" />
        <StatCard title="Resolved" value={resolved} color="green" />
      </div>

      {/* --- Consultation List --- */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">
            Your Consultations
          </h2>
          <Link
            to="/app/user/new"
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FilePlus className="w-4 h-4 mr-2" />
            New Consultation
          </Link>
        </div>

        {/* --- Table --- */}
        {isLoading ? (
          <div className="flex justify-center p-10">
            <Spinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            {consultations.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Symptoms
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {consultations.map((consult) => (
                    <tr key={consult._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(consult.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <p className="truncate w-48" title={consult.symptoms}>
                          {consult.symptoms}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(consult.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/app/user/view/${consult._id}`}
                          className="flex items-center justify-end text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="p-6 text-center text-gray-500">
                You have no consultations yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- StatCard Component ---
const StatCard = ({ title, value, color }) => {
  const colors = {
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-full ${colors[color]} text-white mb-4`}
      >
        <span className="text-xl font-bold">{value}</span>
      </div>
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
    </div>
  );
};

export default UserDashboard;