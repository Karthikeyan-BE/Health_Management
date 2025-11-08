import React, { useEffect } from "react";
import { UserCheck, Loader2 } from "lucide-react";
import useAdminStore from "../../store/useAdminStore";
import Spinner from "../Spinner";

/**
 * Page for Admins to view and verify pending doctor registrations.
 * Path: /app/admin/verify
 */
const VerifyDoctors = () => {
  const { users, isLoading, fetchAllUsers, verifyDoctor } = useAdminStore();

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const pendingDoctors = users.filter(
    (user) => user.role === "doctor" && !user.isVerified
  );

  const handleVerify = async (id) => {
    // Call the store action to verify
    await verifyDoctor(id);
    // The store action will automatically refresh the user list
  };

  return (
    <div className="space-y-8">
      {/* --- Header --- */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">
          Verify Doctors
        </h1>
        <p className="mt-2 text-gray-600">
          Review and approve new doctor registrations to grant them system
          access.
        </p>
      </div>

      {/* --- Pending Doctors List --- */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">
            Pending Approvals
          </h2>
        </div>

        {/* --- Table --- */}
        {isLoading && users.length === 0 ? (
          <div className="flex justify-center p-10">
            <Spinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            {pendingDoctors.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Specialization
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Verify</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingDoctors.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.specialization || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleVerify(user._id)}
                          disabled={isLoading}
                          className="flex items-center justify-end px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full hover:bg-green-200 disabled:opacity-50"
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <UserCheck className="w-4 h-4 mr-1" />
                              Verify
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="p-6 text-center text-gray-500">
                There are no pending doctor verifications.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyDoctors;