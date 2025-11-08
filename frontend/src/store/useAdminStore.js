import { create } from "zustand";
import toast from "react-hot-toast";
import api from "../lib/axios.js";

const useAdminStore = create((set, get) => ({
  // --- STATE ---
  users: [], // All users (patients, doctors, admins)
  doctors: [], // Just doctors (for assignment)
  consultations: [], // All consultations
  currentUser: null, // For editing a specific user/doctor
  currentConsultation: null, // <-- ADDED: To hold the single case
  isLoading: false,
  error: null,

  // --- ACTIONS ---

  /**
   * Fetches all users from the backend.
   * Calls GET /admin/users
   */
  fetchAllUsers: async (role = null) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/admin/users");
      set({ users: res.data, isLoading: false });

      // Pre-filter a list of verified doctors for the assign modal
      const verifiedDoctors = res.data.filter(
        (u) => u.role === "doctor" && u.isVerified
      );
      set({ doctors: verifiedDoctors });
    } catch (error) {
      console.error("Error fetching users:", error);
      const message = error.response?.data?.Error || "Failed to fetch users";
      toast.error(message);
      set({ isLoading: false, error: message });
    }
  },

  /**
   * Fetches all consultations from the backend.
   * Calls GET /admin/consultations
   */
  fetchAllConsultations: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/admin/consultations");
      set({ consultations: res.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching consultations:", error);
      const message =
        error.response?.data?.Error || "Failed to fetch consultations";
      toast.error(message);
      set({ isLoading: false, error: message });
    }
  },

  /**
   * Verifies a doctor.
   * Calls PUT /admin/doctors/verify/:id
   */
  verifyDoctor: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/admin/doctors/verify/${id}`);
      toast.success("Doctor verified successfully!");
      get().fetchAllUsers();
    } catch (error) {
      console.error("Error verifying doctor:", error);
      const message =
        error.response?.data?.Error || "Failed to verify doctor";
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Deletes any user (patient, doctor, or admin).
   * Calls DELETE /admin/users/:id
   */
  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted successfully!");
      get().fetchAllUsers();
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      const message = error.response?.data?.Error || "Failed to delete user";
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  /**
   * Adds a new doctor.
   * Calls POST /admin/doctors
   */
  addDoctor: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/admin/doctors", data);
      toast.success("Doctor added successfully!");
      get().fetchAllUsers();
      return true;
    } catch (error) {
      console.error("Error adding doctor:", error);
      const message = error.response?.data?.Error || "Failed to add doctor";
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  /**
   * Fetches a single user/doctor's details (for editing).
   * Calls GET /admin/doctors/:id
   */
  fetchUserById: async (id) => {
    set({ isLoading: true, currentUser: null, error: null });
    try {
      const res = await api.get(`/admin/doctors/${id}`);
      set({ currentUser: res.data, isLoading: false });
      return res.data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      const message =
        error.response?.data?.Error || "Failed to fetch user details";
      toast.error(message);
      set({ isLoading: false, error: message });
      return null;
    }
  },

  /**
   * Updates a doctor's details.
   * Calls PUT /admin/doctors/:id
   */
  updateDoctor: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/admin/doctors/${id}`, data);
      toast.success("Doctor updated successfully!");
      get().fetchAllUsers();
      return true;
    } catch (error) {
      console.error("Error updating doctor:", error);
      const message =
        error.response?.data?.Error || "Failed to update doctor";
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  /**
   * Deletes any consultation.
   * Calls DELETE /admin/consultations/:id
   */
  deleteConsultation: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/admin/consultations/${id}`);
      toast.success("Consultation deleted successfully!");
      get().fetchAllConsultations();
      return true;
    } catch (error)
    {
      console.error("Error deleting consultation:", error);
      const message =
        error.response?.data?.Error || "Failed to delete consultation";
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  /**
   * Assigns a doctor to a consultation.
   * Calls PUT /admin/consultations/assign/:id
   */
  adminAssignConsultation: async (consultationId, doctorId) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/admin/consultations/assign/${consultationId}`, {
        doctorId,
      });
      toast.success("Doctor assigned successfully!");
      get().fetchAllConsultations();
      return true;
    } catch (error) {
      console.error("Error assigning doctor:", error);
      const message = error.response?.data?.Error || "Failed to assign doctor";
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  // --- (FIX 1) ADD THE MISSING FUNCTION ---
  /**
   * Fetches a single consultation's details (for Admin).
   * Calls GET /admin/consultations/:id
   */
  fetchConsultationByIdForAdmin: async (id) => {
    set({ isLoading: true, currentConsultation: null, error: null });
    try {
      const res = await api.get(`/admin/consultations/${id}`);
      set({ currentConsultation: res.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching consultation:", error);
      const message =
        error.response?.data?.Error || "Failed to fetch consultation";
      toast.error(message);
      set({ isLoading: false, error: message });
    }
  },

  // --- (FIX 2) ADD THE MISSING FUNCTION ---
  /**
   * Clears just the 'currentConsultation'.
   */
  clearCurrentConsultation: () => {
    set({ currentConsultation: null });
  },


  /**
   * Clears all admin data from the store on logout.
   */
  clearAdminState: () => {
    set({
      users: [],
      doctors: [],
      consultations: [],
      currentUser: null,
      currentConsultation: null, // <-- Also add to clear
      error: null,
    });
  },
}));

export default useAdminStore;