import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, FileText, UserCheck, Stethoscope } from 'lucide-react';
import useAuthStore from '../store/authStore';

/**
 * The main public-facing navbar for the portfolio.
 */
const PortfolioNavbar = () => {
  const { authUser } = useAuthStore();

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-sm fixed w-full z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="shrink-0 flex items-center gap-2">
            <HeartPulse className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">HealthSys</span>
          </Link>
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {authUser ? (
              <Link
                to={
                  authUser.role === 'admin' ? '/app/admin' :
                  authUser.role === 'doctor' ? '/app/doctor' :
                  '/app/user'
                }
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

/**
 * The Portfolio Page at `/`
 */
const PortfolioPage = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      <PortfolioNavbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-white flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Smarter Healthcare,
            <br />
            <span className="text-blue-600">Connected Instantly.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Get expert medical advice from verified doctors based on your symptoms.
            Secure, fast, and reliable.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-100"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">
              A simple 3-step process to get you the help you need.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="flex items-center justify-center h-16 w-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-6">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Describe Symptoms</h3>
              <p className="text-gray-600">
                Securely submit your symptoms and health concerns through our easy-to-use form.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="flex items-center justify-center h-16 w-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-6">
                <UserCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Get Matched</h3>
              <p className="text-gray-600">
                Our system (or admin) assigns your case to a verified, specialized doctor.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="flex items-center justify-center h-16 w-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-6">
                <Stethoscope className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Receive Advice</h3>
              <p className="text-gray-600">
                Receive a professional solution and peace of mind directly from a healthcare expert.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} HealthSys. All rights reserved.</p>
          <p className="mt-2">Not a real medical service. Project for demonstration only.</p>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioPage;