import { create } from "zustand";
import toast from "react-hot-toast";
import api from "../lib/axios.js";
import useUserStore from "./useUserStore.js";
import useDoctorStore from "./useDoctorStore.js"; // <-- 1. IMPORT DOCTOR STORE
import useAdminStore from "./useAdminStore.js"; // <-- 2. IMPORT ADMIN STORE

const useAuthStore = create((set) => ({
  // --- STATE ---
  authUser: null,
  isLoading: false,
  isCheckingAuth: true,
  isAdmin: false,
  isDoctor: false,
  isUser: false,

  // --- ACTIONS ---

  verifyAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await api.get("/auth/verify");
      const user = res.data;
      if (user) {
        set({
          authUser: user,
          isAdmin: user.role === "admin",
          isDoctor: user.role === "doctor",
          isUser: user.role === "user",
        });
      } else {
        set({ authUser: null, isAdmin: false, isDoctor: false });
      }
    } catch (error) {
      console.log("User not authenticated");
      set({ authUser: null, isAdmin: false, isDoctor: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/auth/signup", data);
      const user = res.data;
      set({
        authUser: user,
        isAdmin: user.role === "admin",
        isDoctor: user.role === "doctor",
        isUser: user.role === "user",
      });
      toast.success("Signup successful! Welcome.");
      return user;
    } catch (error) {
      console.error("Signup Error:", error);
      const message = error.response?.data?.Error || "Signup failed";
      toast.error(message);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (data) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/auth/login", data);
      const user = res.data;
      set({
        authUser: user,
        isAdmin: user.role === "admin",
        isDoctor: user.role === "doctor",
        isUser: user.role === "user",
      });
      toast.success("Login successful!");
      return user;
    } catch (error) {
      console.error("Login Error:", error);
      const message =
        error.response?.data?.Error || "Invalid email or password";
      toast.error(message);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  logOut: async () => {
    set({ isLoading: true });
    try {
      const res = await api.post("/auth/logout");
      toast.success(res.data.message);
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      // Clear all auth state
      set({
        authUser: null,
        isAdmin: false,
        isDoctor: false,
        isUser: false,
        isLoading: false,
      });

      // ---
      // 3. CLEAR ALL DATA STORES
      useUserStore.getState().clearUserState();
      useDoctorStore.getState().clearDoctorState();
      useAdminStore.getState().clearAdminState();
      // ---
    }
  },
}));

export default useAuthStore;
