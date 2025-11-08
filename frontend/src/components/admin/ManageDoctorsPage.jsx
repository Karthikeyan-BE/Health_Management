import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash,
  Edit,
  UserPlus,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import useAdminStore from "../../store/useAdminStore";
import useAuthStore from "../../store/authStore";
import Spinner from "../Spinner";

/**
 * Page for Admins to view, add, edit, and delete Doctors.
 * Path: /app/admin/doctors
 */
const ManageDoctorsPage = () => {
  const { users, isLoading, fetchAllUsers, deleteUser } = useAdminStore();
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const doctorUsers = users.filter((user) => user.role === "doctor");

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
          Manage Doctors
        </h1>
        <p className="mt-2 text-gray-600">
          Add, edit, and manage all doctor accounts in the system.
        </p>
      </div>

      {/* --- Doctor List --- */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">
            All Doctor Accounts
          </h2>
          <Link
            to="/app/admin/doctors/add"
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add New Doctor
          </Link>
        </div>

        {/* --- Table --- */}
        {isLoading && users.length === 0 ? (
          <div className="flex justify-center p-10">
            <Spinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            {doctorUsers.length > 0 ? (
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
                      Specialization
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctorUsers.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.specialization || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.isVerified ? (
                          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                        <button
                          onClick={() =>
                            navigate(`/app/admin/doctors/edit/${user._id}`)
                          }
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
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
                No doctor users found.
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
                  Delete Doctor
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Are you sure you want to delete this doctor?
                  <br />
                  <strong>{userToDelete.name}</strong>
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

export default ManageDoctorsPage;