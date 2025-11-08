import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";
import useAdminStore from "../../store/useAdminStore";

/**
 * Form for Admins to add a new doctor.
 * Path: /app/admin/doctors/add
 */
const AddDoctorPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
  });
  const [errors, setErrors] = useState({});
  const { addDoctor, isLoading } = useAdminStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.specialization)
      newErrors.specialization = "Specialization is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = await addDoctor(formData);
    if (success) {
      navigate("/app/admin/doctors");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <Link
          to="/app/admin/doctors"
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Manage Doctors
        </Link>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Add New Doctor
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          <FormInput
            label="Specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            error={errors.specialization}
            placeholder="e.g., Cardiology"
          />

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
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Doctor
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper sub-component for form inputs
const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder = "",
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700"
    >
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
        error
          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
          : "border-gray-300"
      }`}
    />
    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
  </div>
);

export default AddDoctorPage;