import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Trash,
  UserPlus,
  Loader2,
  AlertTriangle,
  Clock,
  CheckCircle,
  Eye,
} from "lucide-react";
import useAdminStore from "../../store/useAdminStore";
import Spinner from "../Spinner";

/**
 * Page for Admins to view, delete, and assign consultations.
 * Path: /app/admin/consultations
 */
const ManageConsultationsPage = () => {
  const {
    consultations,
    doctors, // <-- We get the verified doctor list from the store
    isLoading,
    fetchAllConsultations,
    fetchAllUsers, // <-- Need to call this to populate doctors list
    deleteConsultation,
    adminAssignConsultation,
  } = useAdminStore();

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    consult: null,
  });
  const [assignModal, setAssignModal] = useState({
    isOpen: false,
    consult: null,
  });

  useEffect(() => {
    fetchAllConsultations();
    fetchAllUsers(); // Fetch all users to get the doctor list
  }, [fetchAllConsultations, fetchAllUsers]);

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // --- Delete Modal ---
  const openDeleteModal = (consult) => setDeleteModal({ isOpen: true, consult });
  const closeDeleteModal = () =>
    setDeleteModal({ isOpen: false, consult: null });
  const handleDelete = async () => {
    if (deleteModal.consult) {
      await deleteConsultation(deleteModal.consult._id);
      closeDeleteModal();
    }
  };

  // --- Assign Modal ---
  const openAssignModal = (consult) => setAssignModal({ isOpen: true, consult });
  const closeAssignModal = () =>
    setAssignModal({ isOpen: false, consult: null });

  // Status Badge Helper
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
      {/* --- Header --- */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">
          Manage Consultations
        </h1>
        <p className="mt-2 text-gray-600">
          View, assign, and delete all consultations in the system.
        </p>
      </div>

      {/* --- Consultation List --- */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">
            All Consultations
          </h2>
        </div>

        {/* --- Table --- */}
        {isLoading && consultations.length === 0 ? (
          <div className="flex justify-center p-10">
            <Spinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            {consultations.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {consultations.map((consult) => (
                    <tr key={consult._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(consult.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {consult.patient?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {consult.doctor?.name || "Unassigned"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(consult.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                        <Link
                          to={`/app/admin/consultations/view/${consult._id}`}
                          className="text-gray-500 hover:text-blue-600"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        {consult.status === "pending" && (
                          <button
                            onClick={() => openAssignModal(consult)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Assign Doctor"
                          >
                            <UserPlus className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => openDeleteModal(consult)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Delete Consultation"
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
                No consultations found.
              </p>
            )}
          </div>
        )}
      </div>

      {/* --- Delete Confirmation Modal --- */}
      {deleteModal.isOpen && (
        <DeleteModal
          consult={deleteModal.consult}
          onClose={closeDeleteModal}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      )}

      {/* --- Assign Doctor Modal --- */}
      {assignModal.isOpen && (
        <AssignModal
          consult={assignModal.consult}
          doctors={doctors} // Pass the list of verified doctors
          onClose={closeAssignModal}
          onAssign={adminAssignConsultation}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

// --- Sub-Component: Delete Modal ---
const DeleteModal = ({ consult, onClose, onDelete, isLoading }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    onClick={onClose}
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
            Delete Consultation
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Are you sure you want to delete this consultation?
            <br />
            Patient: <strong>{consult.patient?.name}</strong>
            <br />
            This action cannot be undone.
          </p>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          disabled={isLoading}
          onClick={onDelete}
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
          onClick={onClose}
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

// --- Sub-Component: Assign Modal ---
const AssignModal = ({ consult, doctors, onClose, onAssign, isLoading }) => {
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    const success = await onAssign(consult._id, selectedDoctor);
    if (success) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Assign Doctor
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          Assign this case to a verified doctor.
        </p>
        <p className="text-sm text-gray-700 mb-4">
          Patient: <strong>{consult.patient?.name}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="doctor"
              className="block text-sm font-medium text-gray-700"
            >
              Select Doctor
            </label>
            <select
              id="doctor"
              name="doctor"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="" disabled>
                -- Select a doctor --
              </option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} ({doc.specialization})
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              disabled={isLoading || !selectedDoctor}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-blue-400"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Assign"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageConsultationsPage;