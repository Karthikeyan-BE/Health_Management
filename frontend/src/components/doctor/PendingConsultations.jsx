import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Clock, Download } from "lucide-react";
import useDoctorStore from "../../store/useDoctorStore";
import Spinner from "../Spinner";

/**
 * Page for doctors to view and assign pending consultations.
 * Path: /app/doctor/pending
 */
const PendingConsultations = () => {
  const {
    pendingConsultations,
    isLoading,
    fetchPendingConsultations,
    assignConsultation,
  } = useDoctorStore();

  useEffect(() => {
    fetchPendingConsultations();
  }, [fetchPendingConsultations]);

  const handleAssign = async (id) => {
    await assignConsultation(id);
    // The store refreshes the lists automatically
  };

  // Helper to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* --- Header --- */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">
          Pending Consultations
        </h1>
        <p className="mt-2 text-gray-600">
          Review new cases and assign them to yourself.
        </p>
      </div>

      {/* --- Pending List --- */}
      <div className="bg-white rounded-lg shadow-md">
        {isLoading && pendingConsultations.length === 0 ? (
          <div className="flex justify-center p-10">
            <Spinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            {pendingConsultations.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date Submitted
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
                      <span className="sr-only">Assign</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingConsultations.map((consult) => (
                    <tr key={consult._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(consult.createdAt)}
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
                        <button
                          onClick={() => handleAssign(consult._id)}
                          disabled={isLoading}
                          className="flex items-center justify-end text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Assign to Me
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="p-6 text-center text-gray-500">
                There are no pending consultations.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingConsultations;