import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Upload, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { applyForJob, clearError, clearSuccess } from '../../store/slices/application.slice';
import { getMyResumes, selectResumes, selectResumeLoading } from '../../store/slices/user.slice';

const ApplyForm = ({ job, isOpen, onClose }) => {
  const dispatch = useDispatch();

  // ✅ Get data from Redux
  const { actionLoading, error, success } = useSelector(state => state.application);
  const resumes = useSelector(selectResumes);  // ✅ Memoized selector
  const resumeLoading = useSelector(selectResumeLoading);

  const [formData, setFormData] = useState({
    resumeId: '',
    coverLetter: '',
    portfolio: '',
    phone: '',
    availableFrom: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [resumesLoaded, setResumesLoaded] = useState(false);

  // ✅ Fetch resumes when modal opens
  useEffect(() => {
    if (isOpen && !resumesLoaded && resumes.length === 0) {
      console.log('Fetching resumes...');
      dispatch(getMyResumes());
      setResumesLoaded(true);
    }
  }, [isOpen, dispatch, resumes.length, resumesLoaded]);

  // ✅ Clear messages on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  // ✅ Close modal on success
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        onClose();
        dispatch(clearSuccess());
        setResumesLoaded(false);  // Reset for next time
      }, 1500);
    }
  }, [success, onClose, dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.resumeId) {
      newErrors.resumeId = 'Please select a resume';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.availableFrom) {
      newErrors.availableFrom = 'Availability date is required';
    } else if (new Date(formData.availableFrom) < new Date()) {
      newErrors.availableFrom = 'Date must be in the future';
    }

    if (formData.coverLetter && formData.coverLetter.length > 1000) {
      newErrors.coverLetter = 'Cover letter must be less than 1000 characters';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const applicationData = {
      jobId: job._id,
      resumeId: formData.resumeId,
      coverLetter: formData.coverLetter,
      portfolio: formData.portfolio,
      phone: formData.phone,
      availableFrom: formData.availableFrom
    };

    dispatch(applyForJob(applicationData));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between rounded-t-xl z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Apply to {job.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {job.company} • {job.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"
            title="Close"
          >
            <X size={24} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Loading Resumes */}
        {resumeLoading && (
          <div className="mx-6 mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-2">
            <Loader size={18} className="text-blue-600 dark:text-blue-400 animate-spin" />
            <p className="text-sm text-blue-700 dark:text-blue-300">Loading your resumes...</p>
          </div>
        )}

        {/* Error Messages */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
            <AlertCircle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Success Messages */}
        {success && (
          <div className="mx-6 mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-2">
            <CheckCircle size={18} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Resume Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Select Resume <span className="text-red-500">*</span>
            </label>

            {/* ✅ Show loading state */}
            {resumeLoading ? (
              <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <Loader size={16} className="animate-spin text-teal-500" />
                <span className="text-sm text-slate-600 dark:text-slate-300">Loading resumes...</span>
              </div>
            ) : (
              <>
                {/* ✅ Resume dropdown */}
                <select
                  name="resumeId"
                  value={formData.resumeId}
                  onChange={handleInputChange}
                  disabled={resumes.length === 0}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.resumeId ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                  } bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <option value="">-- Select a resume --</option>
                  {resumes.map(resume => (
                    <option key={resume._id} value={resume._id}>
                      {resume.title}
                      {resume.isDefault ? ' (Default)' : ''}
                    </option>
                  ))}
                </select>

                {/* Error message */}
                {errors.resumeId && (
                  <div className="flex items-center gap-2 text-red-500 text-xs mt-1">
                    <AlertCircle size={14} />
                    {errors.resumeId}
                  </div>
                )}

                {/* Helper text */}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {resumes.length === 0 ? (
                    <>⚠️ You need to <a href="/resumes" className="text-teal-500 hover:underline">upload a resume</a> first</>
                  ) : (
                    <>✓ {resumes.length} resume(s) available - {resumes.find(r => r.isDefault)?.title || 'No default set'}</>
                  )}
                </p>
              </>
            )}
          </div>

          {/* Other form fields remain the same */}
          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Cover Letter (Optional)
            </label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              placeholder="Tell the employer why you're interested in this position..."
              rows="4"
              maxLength="1000"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm resize-none"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {formData.coverLetter.length} / 1000 characters
            </p>
          </div>

          {/* Portfolio URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Portfolio / GitHub URL (Optional)
            </label>
            <input
              type="url"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleInputChange}
              placeholder="https://portfolio.com or https://github.com/username"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+91 98765 43210"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.phone ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
              } bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm`}
            />
            {errors.phone && (
              <div className="flex items-center gap-2 text-red-500 text-xs mt-1">
                <AlertCircle size={14} />
                {errors.phone}
              </div>
            )}
          </div>

          {/* Available From Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Available From <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="availableFrom"
              value={formData.availableFrom}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.availableFrom ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
              } bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm`}
            />
            {errors.availableFrom && (
              <div className="flex items-center gap-2 text-red-500 text-xs mt-1">
                <AlertCircle size={14} />
                {errors.availableFrom}
              </div>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="w-5 h-5 mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-2 focus:ring-teal-500 cursor-pointer"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                I have reviewed the job requirements and confirm that I meet them. I understand that submitting a false application may result in permanent removal from this platform.
              </span>
            </label>
            {errors.agreeToTerms && (
              <div className="flex items-center gap-2 text-red-500 text-xs">
                <AlertCircle size={14} />
                {errors.agreeToTerms}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              disabled={actionLoading}
              className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading || resumes.length === 0 || resumeLoading}
              className="flex-1 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-400 dark:disabled:bg-slate-600 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {actionLoading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyForm;
