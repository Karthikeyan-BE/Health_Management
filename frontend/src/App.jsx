import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./store/authStore";

// Route Protectors
import {
  GuestRoute,
  RoleProtectedRoute,
} from "./components/ProtectedRoutes";

// Helper
import FullPageSpinner from "./components/FullPageSpinner";
import DashboardLayout from "./components/DashboardLayout";

// Public Pages
import PortfolioPage from "./pages/PortfolioPage";
import LoginPage from "./pages/LoginPage"; // Corrected typo here
import SignupPage from "./pages/SignupPage";

// Dashboard Pages
import UserDashboard from "./pages/UserDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Import user sub-pages
import NewConsultation from "./components/user/NewConsultation";
import ViewConsultation from "./components/user/ViewConsultation";

// Import Doctor sub-pages
import PendingConsultations from "./components/doctor/PendingConsultations";
import ResolveConsultation from "./components/doctor/ResolveConsultation";

// --- 1. Import Admin sub-pages ---
import VerifyDoctors from "./components/admin/VerifyDoctors";
import ManageUsersPage from "./components/admin/ManageUsersPage";
import ManageDoctorsPage from "./components/admin/ManageDoctorsPage";
import AddDoctorPage from "./components/admin/AddDoctorPage";
import EditDoctorPage from "./components/admin/EditDoctorPage";
import ManageConsultationsPage from "./components/admin/ManageConsultationsPage";
import ViewConsultationAdmin from "./components/admin/ViewConsultationAdmin"; // <-- 2. Import new page

function App() {
  const { verifyAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  if (isCheckingAuth) {
    return <FullPageSpinner />;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        {/*
          =================================
          PUBLIC & GUEST ROUTES
          =================================
        */}
        <Route path="/" element={<PortfolioPage />} />
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/*
          =================================
          AUTHENTICATED & ROLE ROUTES
          =================================
        */}

        {/* --- User Dashboard --- */}
        <Route element={<RoleProtectedRoute role="user" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/app/user" element={<UserDashboard />} />
            <Route path="/app/user/new" element={<NewConsultation />} />
            <Route path="/app/user/view/:id" element={<ViewConsultation />} />
          </Route>
        </Route>

        {/* --- Doctor Dashboard --- */}
        <Route element={<RoleProtectedRoute role="doctor" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/app/doctor" element={<DoctorDashboard />} />
            <Route
              path="/app/doctor/pending"
              element={<PendingConsultations />}
            />
            <Route
              path="/app/doctor/resolve/:id"
              element={<ResolveConsultation />}
            />
          </Route>
        </Route>

        {/* --- Admin Dashboard --- */}
        <Route element={<RoleProtectedRoute role="admin" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/app/admin" element={<AdminDashboard />} />
            <Route path="/app/admin/verify" element={<VerifyDoctors />} />
            <Route
              path="/app/admin/users"
              element={<ManageUsersPage />}
            />
            <Route
              path="/app/admin/doctors"
              element={<ManageDoctorsPage />}
            />
            <Route
              path="/app/admin/doctors/add"
              element={<AddDoctorPage />}
            />
            <Route
              path="/app/admin/doctors/edit/:id"
              element={<EditDoctorPage />}
            />
            <Route
              path="/app/admin/consultations"
              element={<ManageConsultationsPage />}
            />
            {/* --- 3. Add new route --- */}
            <Route
              path="/app/admin/consultations/view/:id"
              element={<ViewConsultationAdmin />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;