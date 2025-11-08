import { create } from 'zustand';
import toast from 'react-hot-toast';
import api from '../lib/axios.js'; // Assumes your axios instance is here

const useUserStore = create((set, get) => ({
  // --- STATE ---
  consultations: [],
  currentConsultation: null, // Holds a single consultation when viewed
  isLoading: false,
  error: null,

  // --- ACTIONS ---

  /**
   * Fetches all consultations for the logged-in user.
   * Calls GET /api/consultations/my
   */
  fetchConsultations: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/user/my');
      set({ consultations: res.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching consultations:", error);
      const message = error.response?.data?.Error || "Failed to fetch consultations";
      toast.error(message);
      set({ isLoading: false, error: message });
    }
  },

  /**
   * Submits a new consultation.
   * Calls POST /api/consultations
   */
  submitConsultation: async (symptoms) => { // Updated to accept symptoms string directly
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/user', { symptoms }); // Pass as object
      toast.success('Consultation submitted successfully!');
      get().fetchConsultations();
      return res.data;
    } catch (error) {
      console.error("Error submitting consultation:", error);
      const message = error.response?.data?.Error || "Failed to submit consultation";
      toast.error(message);
      set({ error: message });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Fetches a single consultation by its ID.
   * Calls GET /api/consultations/:id
   */
  fetchConsultationById: async (id) => {
    set({ isLoading: true, currentConsultation: null, error: null });
    try {
      const res = await api.get(`/user/${id}`);
      set({ currentConsultation: res.data, isLoading: false });
      // This function does not return, it sets state.
    } catch (error) {
      console.error("Error fetching consultation:", error);
      const message = error.response?.data?.Error || "Consultation not found";
      toast.error(message);
      set({ isLoading: false, error: message });
    }
  },

  /**
   * Clears all user data from the store.
   */
  clearUserState: () => {
    set({ consultations: [], currentConsultation: null, error: null });
  },

  /**
   * NEW FUNCTION: Clears just the 'currentConsultation'.
   * We call this when the user navigates away from the view page.
   */
  clearCurrentConsultation: () => {
    set({ currentConsultation: null });
  },

  // --- GETTERS ---
  
  getConsultationStats: () => {
    const { consultations } = get();
    const total = consultations.length;
    const pending = consultations.filter(c => c.status === 'pending' || c.status === 'assigned').length;
    const resolved = consultations.filter(c => c.status === 'resolved').length;
    
    return { total, pending, resolved };
  },
}));

export default useUserStore;