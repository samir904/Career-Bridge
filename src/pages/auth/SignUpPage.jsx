
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader,
  CheckCircle, AlertCircle, Building2, MapPin, Phone
} from 'lucide-react';
import { register, clearError, clearSuccess } from '../../store/slices/user.slice';

const SignUpPage = () => {
  // ============================================
  // STATE & HOOKS
  // ============================================

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success, isAuthenticated } = useSelector(state => state.user || {});

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'seeker', // 'seeker' or 'employer'
    companyName: '', // For employers
    agreeToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [step, setStep] = useState(1); // Step 1: Role selection, Step 2: Form

  // ============================================
  // EFFECTS
  // ============================================

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Clear messages on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  // ============================================
  // VALIDATION
  // ============================================

  const validateForm = () => {
    const errors = {};

    // First name
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    // Last name
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    // Phone (optional but if provided, should be valid)
    if (formData.phone && !/^[0-9+\-\s()]{10,}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and numbers';
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Company name (for employers)
    if (formData.role === 'employer' && !formData.companyName.trim()) {
      errors.companyName = 'Company name is required for employers';
    }

    // Terms agreement
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      role
    }));
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
  fullName: `${formData.firstName} ${formData.lastName}`,  // ✅ Combine names
  email: formData.email,
  phone: formData.phone || undefined,
  password: formData.password,
  role: formData.role === 'seeker' ? 'JOB_SEEKER' : 'EMPLOYER',  // ✅ Match backend
  companyName: formData.role === 'employer' ? formData.companyName : undefined
};

    await dispatch(register(submitData));
  };

  const handleBackToRole = () => {
    setStep(1);
    setFormErrors({});
  };

  const handleLoginLink = () => {
    navigate('/login');
  };

  // ============================================
  // RENDER - ROLE SELECTION
  // ============================================

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">CB</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Join CareerBridge
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Choose your role to get started
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Job Seeker Card */}
            <div
              onClick={() => handleRoleSelect('seeker')}
              className="group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl p-8 border-2 border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">👤</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Job Seeker
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Find your dream job, track applications, and advance your career
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <CheckCircle size={16} className="text-teal-500" />
                  Browse 10K+ jobs
                </li>
                <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <CheckCircle size={16} className="text-teal-500" />
                  Upload resumes
                </li>
                <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <CheckCircle size={16} className="text-teal-500" />
                  Track applications
                </li>
                <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <CheckCircle size={16} className="text-teal-500" />
                  Get recommendations
                </li>
              </ul>
              <button className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold group-hover:shadow-lg transition-all">
                Continue as Job Seeker
                <ArrowRight className="inline ml-2" size={18} />
              </button>
            </div>

            {/* Employer Card */}
            <div
              onClick={() => handleRoleSelect('employer')}
              className="group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl p-8 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">🏢</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Employer
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Post jobs, hire talent, and grow your team
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <CheckCircle size={16} className="text-blue-500" />
                  Post unlimited jobs
                </li>
                <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <CheckCircle size={16} className="text-blue-500" />
                  Access candidate pool
                </li>
                <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <CheckCircle size={16} className="text-blue-500" />
                  Manage applications
                </li>
                <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <CheckCircle size={16} className="text-blue-500" />
                  Schedule interviews
                </li>
              </ul>
              <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold group-hover:shadow-lg transition-all">
                Continue as Employer
                <ArrowRight className="inline ml-2" size={18} />
              </button>
            </div>
          </div>

          {/* Already have account */}
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <button
                onClick={handleLoginLink}
                className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER - REGISTRATION FORM
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">CB</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Create Account
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {formData.role === 'seeker' ? 'Join as a Job Seeker' : 'Join as an Employer'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-700 dark:text-green-300 text-sm">{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                First Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    formErrors.firstName
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-slate-200 dark:border-slate-700'
                  } bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all`}
                />
              </div>
              {formErrors.firstName && (
                <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Last Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    formErrors.lastName
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-slate-200 dark:border-slate-700'
                  } bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all`}
                />
              </div>
              {formErrors.lastName && (
                <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  formErrors.email
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-slate-200 dark:border-slate-700'
                } bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all`}
              />
            </div>
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Phone (Optional)
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 98765 43210"
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  formErrors.phone
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-slate-200 dark:border-slate-700'
                } bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all`}
              />
            </div>
            {formErrors.phone && (
              <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
            )}
          </div>

          {/* Company Name (for employers) */}
          {formData.role === 'employer' && (
            <div className="mb-4">
              <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Company Name
              </label>
              <div className="relative">
                <Building2 size={18} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Your Company"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    formErrors.companyName
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-slate-200 dark:border-slate-700'
                  } bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all`}
                />
              </div>
              {formErrors.companyName && (
                <p className="text-red-500 text-xs mt-1">{formErrors.companyName}</p>
              )}
            </div>
          )}

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                  formErrors.password
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-slate-200 dark:border-slate-700'
                } bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Min 8 chars, uppercase, lowercase, number
            </p>
            {formErrors.password && (
              <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-slate-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                  formErrors.confirmPassword
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-slate-200 dark:border-slate-700'
                } bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="w-5 h-5 mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-2 focus:ring-teal-500"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                I agree to the{' '}
                <a href="#" className="text-teal-600 dark:text-teal-400 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-teal-600 dark:text-teal-400 hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
            {formErrors.agreeToTerms && (
              <p className="text-red-500 text-xs mt-1">{formErrors.agreeToTerms}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={handleBackToRole}
            className="w-full mt-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            Back to Role Selection
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-6 text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <button
            onClick={handleLoginLink}
            className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;