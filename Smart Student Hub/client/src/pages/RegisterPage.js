import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight, FiCheck } from 'react-icons/fi';

/**
 * Register Page
 */
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    adminSecret: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === 'admin') {
        if (!formData.adminSecret) {
          throw new Error('Admin secret is required for admin registration');
        }
        payload.adminSecret = formData.adminSecret;
      }

      await register(payload);

      if (formData.role === 'faculty') {
        navigate('/faculty');
      } else if (formData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = formData.password.length > 0 
    ? formData.password.length < 6 ? 'weak' : formData.password.length < 10 ? 'medium' : 'strong'
    : 'none';

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
              <FiUser className="text-white" size={32} />
            </div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-950">Create your account</h1>
            <p className="text-gray-500">Create your account and start tracking</p>
          </div>

          {/* Error Message */}
          {error && <ErrorMessage message={error} onClose={() => setError('')} />}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="relative group">
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-4 text-gray-400 transition-colors group-focus-within:text-indigo-600" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-12 pr-4 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="relative group">
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-4 text-gray-400 transition-colors group-focus-within:text-indigo-600" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-12 pr-4 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-4 text-gray-400 transition-colors group-focus-within:text-indigo-600" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-12 pr-12 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-indigo-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2 flex gap-2">
                  <div className={`h-1 flex-1 rounded-full transition-colors ${passwordStrength !== 'none' ? 'bg-red-400' : 'bg-gray-200'}`}></div>
                  <div className={`h-1 flex-1 rounded-full transition-colors ${passwordStrength === 'strong' || passwordStrength === 'medium' ? 'bg-yellow-400' : 'bg-gray-200'}`}></div>
                  <div className={`h-1 flex-1 rounded-full transition-colors ${passwordStrength === 'strong' ? 'bg-green-400' : 'bg-gray-200'}`}></div>
                </div>
              )}
            </div>

            {/* Role Field */}
            <div className="relative group">
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Account Type</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                required
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin (requires secret)</option>
              </select>
            </div>

            {/* Admin Secret Field */}
            {formData.role === 'admin' && (
              <div className="relative group">
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Admin Secret</label>
                <input
                  type="password"
                  name="adminSecret"
                  value={formData.adminSecret}
                  onChange={handleChange}
                  placeholder="Enter admin secret"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  required
                />
              </div>
            )}

            {/* Confirm Password Field */}
            <div className="relative group">
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-4 text-gray-400 transition-colors group-focus-within:text-indigo-600" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-12 pr-12 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-indigo-600"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                  <FiCheck /> Passwords match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-lg font-bold text-white transition hover:bg-indigo-700 hover:shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoadingSpinner /> Creating Account...
                </>
              ) : (
                <>
                  Create Account <FiArrowRight />
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

          {/* Login Link */}
          <p className="text-center text-gray-700">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-600 transition-colors hover:text-indigo-800">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-500">
          © 2024 Student Activity Record System
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
