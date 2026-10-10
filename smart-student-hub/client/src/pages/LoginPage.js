import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

/**
 * Login Page
 */
const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const response = await login(formData);
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else if (response.user.role === 'faculty') {
        navigate('/faculty');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4">
      {/* Background Gradient Animation */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl"></div>
        <div className="absolute -bottom-28 -left-24 h-96 w-96 rounded-full bg-sky-100/70 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/[0.06] sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-4 inline-flex rounded-2xl bg-indigo-600 p-4 shadow-lg shadow-indigo-200">
              <FiLock className="text-white" size={32} />
            </div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-950">Welcome back</h1>
            <p className="text-gray-500">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && <ErrorMessage message={error} onClose={() => setError('')} />}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative group">
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 transition-colors bg-white/50 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 transition-colors bg-white/50 backdrop-blur-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-lg font-bold text-white transition hover:bg-indigo-700 hover:shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoadingSpinner /> Signing In...
                </>
              ) : (
                <>
                  Sign In <FiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-700 mb-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-indigo-600 transition-colors hover:text-indigo-800">
              Create one now
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
            <p className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
              💡 Demo Credentials:
            </p>
            <div className="space-y-2 text-xs text-blue-800">
              <p className="font-mono bg-white/50 p-2 rounded border border-blue-200">Student: <span className="font-bold">student@example.com</span> / <span className="font-bold">password</span></p>
              <p className="font-mono bg-white/50 p-2 rounded border border-blue-200">Admin: <span className="font-bold">admin@example.com</span> / <span className="font-bold">password</span></p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-500">
          © 2024 Student Activity Record System
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
