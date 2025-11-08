import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";
import FullPageSpinner from "./FullPageSpinner";

/**
 * Runs `verifyAuth` on app load to check for existing session.
 * Shows a full-page spinner while checking.
 * This should wrap your entire <Routes> in App.jsx
 */
export const AppInitializer = ({ children }) => {
  const { isCheckingAuth, verifyAuth } = useAuthStore();

  useEffect(() => {
    // This runs once when the app loads
    verifyAuth();
  }, [verifyAuth]);

  // Show a spinner while the initial auth check is running
  return isCheckingAuth ? <FullPageSpinner /> : children;
};

/**
 * For "Guests Only" (e.g., Login, Signup).
 * Redirects to the correct dashboard if the user is already logged in.
 */
export const GuestRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();

  // Don't render anything until auth is checked
  if (isCheckingAuth) {
    return <FullPageSpinner />;
  }

  // If user is logged in, redirect them away from guest pages
  if (authUser) {
    if (authUser.role === "admin") return <Navigate to="/app/admin" replace />;
    if (authUser.role === "doctor") return <Navigate to="/app/doctor" replace />;
    // --- THIS IS THE FIX ---
    // Was "/app/doctor", now correctly redirects to "/app/user"
    if (authUser.role === "user") return <Navigate to="/app/user" replace />;
    
    // Fallback
    return <Navigate to="/" replace />;
  }

  // User is not logged in, so show the guest page (Login, Signup)
  return <Outlet />;
};

/**
 * Protects routes for a *specific* role (e.loc.
 * This is the main component for securing your dashboards.
 */
export const RoleProtectedRoute = ({ role }) => {
  const { authUser, isCheckingAuth } = useAuthStore();

  // 1. Wait until auth status is verified
  if (isCheckingAuth) {
    return <FullPageSpinner />;
  }

  // 2. Check for authentication
  // If user is NOT logged in, redirect to the login page.
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  // 3. Check for the correct role
  // If user is logged in but their role doesn't match, redirect to their own dashboard.
  if (authUser.role !== role) {
    if (authUser.role === "admin") return <Navigate to="/app/admin" replace />;
    if (authUser.role === "doctor") return <Navigate to="/app/doctor" replace />;
    if (authUser.role === "user") return <Navigate to="/app/user" replace />;
    
    // Fallback if role is unknown
    return <Navigate to="/" replace />;
  }

  // 4. If all checks pass, render the child routes
  // The <DashboardLayout> will be nested inside this Outlet
  return <Outlet />;
};