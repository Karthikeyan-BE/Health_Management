import React, { useEffect, useState } from "react";
import { Trash, Loader2, AlertTriangle } from "lucide-react";
import useAdminStore from "../../store/useAdminStore";
import useAuthStore from "../../store/authStore";
import Spinner from "../Spinner";

/**
 * Page for Admins to view and delete patients (users).
 * Path: /app/admin/users
 */
const ManageUsersPage = () => {
  const { authUser } = useAuthStore();
  const { users, isLoading, fetchAllUsers, deleteUser } = useAdminStore();
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const patientUsers = users.filter((user) => user.role === "user");

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // --- Modal Handling ---
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete._id);
      closeDeleteModal();
    }
  };

  return (
    <div className="space-y-8">
      {/* --- Header --- */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">
          Manage Users
        </h1>
        <p className="mt-2 text-gray-600">
          View and manage all patient (user) accounts in the system.
        </p>
      </div>

      {/* --- User List --- */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">
            All Patient Accounts
          </h2>
        </div>

        {/* --- Table --- */}
        {isLoading && users.length === 0 ? (
          <div className="flex justify-center p-10">
            <Spinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            {patientUsers.length > 0 ? (
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
                      Joined
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patientUsers.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openDeleteModal(user)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="p-6 text-center text-gray-500">
                No patient users found.
              </p>
            )}
          </div>
        )}
      </div>

      {/* --- Delete Confirmation Modal --- */}
      {showModal && userToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeDeleteModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4 text-left">
                <h3 className="text-lg font-medium text-gray-900">
                  Delete User
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Are you sure you want to delete this user?
                  <br />
                  <strong>{userToDelete.name}</strong> ({userToDelete.email})
                  <br />
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleDelete}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-red-400"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
              <button
                type="button"
                onClick={closeDeleteModal}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;