import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Send, ArrowLeft, Loader2 } from "lucide-react";
import useUserStore from "../../store/useUserStore";

/**
 * Form for creating a new consultation.
 * Path: /app/user/new
 */
const NewConsultation = () => {
  const [symptoms, setSymptoms] = useState("");
  const [error, setError] = useState("");
  
  // --- THIS IS THE FIX (Line 1) ---
  // Renamed `createConsultation` to `submitConsultation` to match the store
  const { submitConsultation, isLoading } = useUserStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (symptoms.trim().length < 10) {
      setError("Please describe your symptoms in at least 10 characters.");
      return;
    }
    setError("");

    // --- THIS IS THE FIX (Line 2) ---
    // Renamed `createConsultation` to `submitConsultation`
    const newConsultation = await submitConsultation(symptoms);

    if (newConsultation) {
      // On success, redirect to the new consultation's "view" page
      navigate(`/app/user/view/${newConsultation._id}`);
    }
    // The store handles the error toast
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* --- Back Link --- */}
      <div className="mb-4">
        <Link
          to="/app/user"
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      {/* --- Form Card --- */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          New Consultation
        </h1>
        <p className="mb-6 text-gray-600">
          Please describe your symptoms in detail. A doctor will be assigned to
          review your case.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="symptoms"
                className="block text-sm font-medium text-gray-700"
              >
                Describe your symptoms
              </label>
              <textarea
                id="symptoms"
                name="symptoms"
                rows="8"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g., I've had a persistent cough and fever for three days..."
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
                disabled={isLoading}
                className="flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Consultation
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

export default NewConsultation;