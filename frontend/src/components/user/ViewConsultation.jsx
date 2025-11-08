import React, { useEffect } from "react"; // Removed useState
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Stethoscope, Clock, CheckCircle } from "lucide-react";
import useUserStore from "../../store/useUserStore";
import Spinner from "../Spinner";

/**
 * Page for viewing the details of a single consultation.
 * Path: /app/user/view/:id
 */
const ViewConsultation = () => {
  const { id } = useParams();
  
  // --- (FIX 1) ---
  // Read state directly from the store.
  // Remove local state: const [consultation, setConsultation] = useState(null);
  const { 
    currentConsultation, 
    fetchConsultationById, 
    isLoading,
    clearCurrentConsultation // Import the new cleanup function
  } = useUserStore();
  // --- (END FIX 1) ---

  useEffect(() => {
    // --- (FIX 2) ---
    // The function just needs to be called. It doesn't return data.
    if (id) {
      fetchConsultationById(id);
    }
    // --- (END FIX 2) ---

    // --- (FIX 3) ---
    // When the component unmounts, clear the data from the store
    // so the next user doesn't see a flash of old data.
    return () => {
      clearCurrentConsultation();
    };
    // --- (END FIX 3) ---
  }, [id, fetchConsultationById, clearCurrentConsultation]); // Add dependencies

  // Helper to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --- (FIX 4) ---
  // The loading condition now checks the store's 'currentConsultation'
  if (isLoading || !currentConsultation) {
  // --- (END FIX 4) ---
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  // Read data from the store variable
  const { status, symptoms, solution, createdAt, doctor } = currentConsultation;

  return (
    <div className="max-w-3xl mx-auto">
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

      {/* --- Main Content Card --- */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* --- Header --- */}
        <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">
            Consultation Details
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Submitted on {formatDate(createdAt)}
          </p>
        </div>

        {/* --- Body --- */}
        <div className="p-6 space-y-8">
          {/* --- Status --- */}
          <StatusSection status={status} />

          {/* --- Symptoms --- */}
          <DetailSection
            icon={User}
            title="Your Symptoms"
            content={symptoms}
            color="blue"
          />

          {/* --- Doctor's Solution --- */}
          <DetailSection
            icon={Stethoscope}
            title="Doctor's Solution"
            content={
              solution || "A doctor has not provided a solution yet."
            }
            color="green"
            isPlaceholder={!solution}
          />

          {/* --- Assigned Doctor --- */}
          {doctor && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Assigned Doctor
              </h4>
              <div className="flex items-center">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full text-blue-600">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {doctor.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {doctor.specialization}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- DetailSection Component ---
const DetailSection = ({ icon: Icon, title, content, color, isPlaceholder }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
  };
  return (
    <div>
      <div className="flex items-center mb-3">
        <div
          className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${colors[color]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="ml-3 text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <p
        className={`text-base leading-relaxed ${
          isPlaceholder ? "text-gray-500 italic" : "text-gray-700"
        } whitespace-pre-wrap`}
      >
        {content}
      </p>
    </div>
  );
};

// --- StatusSection Component ---
const StatusSection = ({ status }) => {
  let text, Icon, color;
  switch (status) {
    case "resolved":
      text = "This consultation has been resolved.";
      Icon = CheckCircle;
      color = "green";
      break;
    case "assigned":
      text = "A doctor is currently reviewing your case.";
      Icon = Clock;
      color = "blue";
      break;
    default:
      text = "This consultation is pending review.";
      Icon = Clock;
      color = "yellow";
  }

  const colors = {
    blue: "bg-blue-100 text-blue-800",
    yellow: "bg-yellow-100 text-yellow-800",
    green: "bg-green-100 text-green-800",
  };

  return (
    <div
      className={`flex items-center p-4 rounded-lg ${colors[color]}`}
      role="alert"
    >
      <Icon className="w-5 h-5" />
      <span className="ml-3 text-sm font-medium">{text}</span>
    </div>
  );
};

export default ViewConsultation;