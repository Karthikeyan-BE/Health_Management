import { create } from "zustand";
import toast from "react-hot-toast";
import api from "../lib/axios.js";

const useDoctorStore = create((set, get) => ({
  // --- STATE ---
  pendingConsultations: [],
  assignedConsultations: [],
  currentConsultation: null, // <-- ADDED: To hold the single case being viewed
  isLoading: false,
  error: null,

  // --- ACTIONS ---

  /**
   * Fetches all pending consultations.
   * Calls GET /api/doctor/pending
   */
  fetchPendingConsultations: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/doctor/pending");
      set({ pendingConsultations: res.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching pending consultations:", error);
      const message =
        error.response?.data?.Error || "Failed to fetch pending cases";
      toast.error(message);
      set({ isLoading: false, error: message });
    }
  },

  /**
   * Fetches all consultations assigned to this doctor.
   * Calls GET /api/doctor/assigned
   */
  fetchAssignedConsultations: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/doctor/assigned");
      set({ assignedConsultations: res.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching assigned consultations:", error);
      const message =
        error.response?.data?.Error || "Failed to fetch assigned cases";
      toast.error(message);
      set({ isLoading: false, error: message });
    }
  },

  /**
   * Assigns a consultation to the logged-in doctor.
   * Calls PUT /api/doctor/assign/:id
   */
  assignConsultation: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/doctor/assign/${id}`);
      toast.success("Case assigned successfully!");
      // Refresh both lists
      get().fetchPendingConsultations();
      get().fetchAssignedConsultations();
    } catch (error) {
      console.error("Error assigning consultation:", error);
      const message = error.response?.data?.Error || "Failed to assign case";
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * NEW: Fetches a single consultation by ID (for the doctor).
   * Calls GET /api/doctor/consultation/:id
   */
  fetchConsultationById: async (id) => {
    set({ isLoading: true, currentConsultation: null, error: null });
    try {
      const res = await api.get(`/doctor/consultation/${id}`);
      set({ currentConsultation: res.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching consultation:", error);
      const message = error.response?.data?.Error || "Consultation not found";
      toast.error(message);
      set({ isLoading: false, error: message });
    }
  },

  /**
   * Resolves a consultation by adding a solution.
   * Calls PUT /api/doctor/solve/:id
   */
  resolveConsultation: async (id, solution) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/doctor/solve/${id}`, { solution });
      toast.success("Solution submitted successfully!");
      // Refresh assigned list
      get().fetchAssignedConsultations();
      return true; // Return success
    } catch (error) {
      console.error("Error resolving consultation:", error);
      const message = error.response?.data?.Error || "Failed to submit solution";
      toast.error(message);
      set({ isLoading: false, error: message });
      return false; // Return failure
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Clears all doctor data from the store on logout.
   */
  clearDoctorState: () => {
    set({
      pendingConsultations: [],
      assignedConsultations: [],
      currentConsultation: null,
      error: null,
    });
  },

  /**
   * Clears just the 'currentConsultation'.
   */
  clearCurrentConsultation: () => {
    set({ currentConsultation: null });
  },
}));

export default useDoctorStore;