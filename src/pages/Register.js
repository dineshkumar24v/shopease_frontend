import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      toast.success("Account created successfully!");
      navigate("/");
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/98 p-8 rounded-2xl shadow-2xl border border-indigo-100/50">
        <div>
          <h2 className="mt-6 text-center text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Create your account
          </h2>
          <p className="mt-3 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* inputs block with modern styling */}
          <div className="rounded-xl space-y-5 bg-gradient-to-b from-slate-50 to-slate-100 p-6 border border-slate-200">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaUser className="text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="appearance-none rounded-lg w-full pl-11 pr-4 py-3 bg-white border border-slate-300 placeholder-slate-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all sm:text-sm shadow-sm hover:border-slate-400"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Email address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none rounded-lg w-full pl-11 pr-4 py-3 bg-white border border-slate-300 placeholder-slate-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all sm:text-sm shadow-sm hover:border-slate-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none rounded-lg w-full pl-11 pr-4 py-3 bg-white border border-slate-300 placeholder-slate-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all sm:text-sm shadow-sm hover:border-slate-400"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none rounded-lg w-full pl-11 pr-4 py-3 bg-white border border-slate-300 placeholder-slate-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all sm:text-sm shadow-sm hover:border-slate-400"
                  placeholder="Re-enter your password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center pt-2">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-5 w-5 text-primary-600 focus:ring-2 focus:ring-primary-500/30 border-slate-300 rounded-md cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="ml-3 block text-sm text-gray-700 font-medium"
            >
              I agree to the{" "}
              <button
                type="button"
                onClick={() => window.open("/terms", "_blank")}
                className="text-primary-600 font-semibold hover:text-primary-700 transition-colors cursor-pointer bg-none border-none p-0"
              >
                Terms and Conditions
              </button>
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        {/* Demo Credentials panel with modern styling */}
        <div className="mt-6 p-5 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 border border-indigo-200/50 rounded-xl shadow-sm">
          <p className="text-sm font-bold text-indigo-900 mb-3">
            🔐 Demo Credentials
          </p>
          <div className="text-xs text-indigo-800 space-y-2">
            <p className="flex items-start gap-2">
              <span className="font-semibold min-w-fit">User:</span>
              <span>john@example.com / password123</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-semibold min-w-fit">Admin:</span>
              <span>admin@shopease.com / admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
