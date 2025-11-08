import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Stethoscope, User, Clock, CheckCircle } from "lucide-react";
import useDoctorStore from "../store/useDoctorStore";
import useAuthStore from "../store/authStore";
import Spinner from "../components/Spinner";

/**
 * The main "Doctor" dashboard page.
 * Displays stat cards and a list of the doctor's assigned consultations.
 */
const DoctorDashboard = () => {
  const { authUser } = useAuthStore();
  const {
    assignedConsultations,
    isLoading,
    fetchAssignedConsultations,
  } = useDoctorStore();

  useEffect(() => {
    // Fetch assigned consultations when the component mounts
    fetchAssignedConsultations();
  }, [fetchAssignedConsultations]);

  // Helper to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const pendingCount = useDoctorStore.getState().pendingConsultations.length;

  return (
    <div className="space-y-8">
      {/* --- Welcome Banner --- */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, Dr. {authUser?.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here is a summary of your assigned cases. You can view pending cases
          from the sidebar.
        </p>
      </div>

      {/* --- Stat Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="My Active Cases"
          value={assignedConsultations.length}
          color="blue"
        />
        <StatCard title="Pending Review" value={pendingCount} color="yellow" />
      </div>

      {/* --- Assigned Consultation List --- */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">
            Your Assigned Cases
          </h2>
        </div>

        {/* --- Table --- */}
        {isLoading ? (
          <div className="flex justify-center p-10">
            <Spinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            {assignedConsultations.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date Assigned
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Patient
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Symptoms
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Resolve</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignedConsultations.map((consult) => (
                    <tr key={consult._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(consult.updatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {consult.patient?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <p className="truncate w-48" title={consult.symptoms}>
                          {consult.symptoms}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/app/doctor/resolve/${consult._id}`}
                          className="flex items-center justify-end text-blue-600 hover:text-blue-900"
                        >
                          <Stethoscope className="w-4 h-4 mr-1" />
                          Review & Resolve
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="p-6 text-center text-gray-500">
                You have no active cases assigned.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- StatCard Component (Re-used) ---
const StatCard = ({ title, value, color }) => {
  const colors = {
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
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

export default DoctorDashboard;