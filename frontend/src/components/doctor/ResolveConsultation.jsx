import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Send, Loader2 } from "lucide-react";
// --- (FIX 1) ---
// We no longer need useUserStore
// import useUserStore from "../../store/useUserStore";
import useDoctorStore from "../../store/useDoctorStore";
// --- (END FIX 1) ---
import Spinner from "../Spinner";

/**
 * Page for doctors to review symptoms and submit a solution.
 * Path: /app/doctor/resolve/:id
 */
const ResolveConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- (FIX 2) ---
  // Get all data and actions from useDoctorStore
  const {
    currentConsultation: consult,
    fetchConsultationById,
    clearCurrentConsultation,
    isLoading: isResolving, // Use the store's main loading state
    resolveConsultation,
  } = useDoctorStore();
  // --- (END FIX 2) ---

  const [solution, setSolution] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchConsultationById(id);
    }
    // On unmount, clear the consultation from the doctor store
    return () => {
      clearCurrentConsultation();
    };
  }, [id, fetchConsultationById, clearCurrentConsultation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (solution.trim().length < 10) {
      setError("Please provide a detailed solution (min. 10 characters).");
      return;
    }
    setError("");

    const success = await resolveConsultation(id, solution);
    if (success) {
      navigate("/app/doctor"); // Go back to doctor dashboard
    }
  };

  // --- (FIX 3) ---
  // Use the store's loading state
  if (!consult) {
    // --- (END FIX 3) ---
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* --- Back Link --- */}
      <div>
        <Link
          to="/app/doctor"
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      {/* --- Patient Symptoms Card --- */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <User className="w-5 h-5" />
          </div>
          <h1 className="ml-3 text-xl font-bold text-gray-800">
            Patient's Symptoms
          </h1>
        </div>
        <p className="text-base text-gray-700 whitespace-pre-wrap">
          {consult.symptoms}
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Patient: {consult.patient?.name || "N/A"}
        </p>
        <p className="text-sm text-gray-500">
          Submitted: {new Date(consult.createdAt).toLocaleString()}
        </p>
      </div>

      {/* --- Solution Form Card --- */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Your Solution
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="solution"
                className="block text-sm font-medium text-gray-700"
              >
                Provide your professional advice and solution
              </label>
              <textarea
                id="solution"
                name="solution"
                rows="8"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="e.g., Based on the symptoms, I recommend..."
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  error
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
              ></textarea>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isResolving}
                className="flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-400"
              >
                {isResolving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Solution
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResolveConsultation;