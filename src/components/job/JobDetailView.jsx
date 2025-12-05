
import React, { useEffect } from 'react';
import { X, MapPin, DollarSign, Briefcase, Calendar, Users, Share2, Heart, AlertCircle, Loader } from 'lucide-react';

const JobDetailView = ({ 
  job, 
  isOpen, 
  onClose, 
  onApply, 
  isSaved = false, 
  onSave, 
  loading = false 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !job) return null;

  const isJobClosed = job.status === 'CLOSED';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto pt-4 pb-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl max-w-4xl w-full mx-4 shadow-2xl">
        {/* Header with Company Info */}
        <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-8 flex items-start justify-between gap-4 z-10 rounded-t-xl">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {job.companyImage ? (
              <img 
                src={job.companyImage} 
                alt={job.company}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Briefcase size={32} className="text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 line-clamp-2">{job.title}</h1>
              <p className="text-teal-100 text-lg font-medium">{job.company}</p>
              <p className="text-teal-100 text-sm mt-2">
                Posted {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'Recently'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-all text-white flex-shrink-0"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mb-1">
                <MapPin size={16} />
                Location
              </div>
              <p className="font-semibold text-slate-900 dark:text-white">{job.location || 'N/A'}</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mb-1">
                <DollarSign size={16} />
                Salary
              </div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {job.salary?.min ? `$${job.salary.min}K` : 'N/A'} - {job.salary?.max ? `$${job.salary.max}K` : 'N/A'}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mb-1">
                <Briefcase size={16} />
                Type
              </div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {job.jobType === 'FULL_TIME' ? 'Full Time' : 
                 job.jobType === 'PART_TIME' ? 'Part Time' : job.jobType || 'N/A'}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mb-1">
                <Calendar size={16} />
                Level
              </div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {job.level === 'ENTRY' ? 'Entry Level' : 
                 job.level === 'INTERMEDIATE' ? 'Intermediate' : job.level || 'N/A'}
              </p>
            </div>
          </div>

          {/* Main Description */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">About This Job</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {job.description || 'No description available'}
            </p>
          </div>

          {/* Required Skills */}
          {job.skills && job.skills.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Responsibilities</h2>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-700 dark:text-slate-300">
                    <span className="text-teal-500 font-bold mt-1 flex-shrink-0">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-700 dark:text-slate-300">
                    <span className="text-green-500 font-bold mt-1 flex-shrink-0">✓</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {job.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <span className="text-2xl flex-shrink-0 mt-[-2px]">🎁</span>
                    <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Open Positions */}
          {job.openings && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-center gap-4">
              <Users size={24} className="text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Open Positions</p>
                <p className="font-bold text-slate-900 dark:text-white">{job.openings} position(s) available</p>
              </div>
            </div>
          )}

          {/* Warning if Closed */}
          {isJobClosed && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 dark:text-red-300 text-sm">
                This job posting is no longer accepting applications.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-700 sticky bottom-0 bg-white dark:bg-slate-800 -m-6 p-6 rounded-b-xl">
            <button
              onClick={() => onSave(job._id)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm ${
                isSaved
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30'
                  : 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title={isSaved ? 'Unsave job' : 'Save job'}
            >
              <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
              {isSaved ? 'Saved' : 'Save'}
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: job.title,
                    text: `Check out this job: ${job.title} at ${job.company}`,
                    url: window.location.href
                  }).catch(err => console.log('Share failed:', err));
                } else {
                  // Fallback: Copy link to clipboard
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
              className="px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-sm"
              title="Share job"
            >
              <Share2 size={18} />
            </button>

            <button
              onClick={onApply}
              disabled={loading || isJobClosed}
              className="flex-1 px-4 py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-400 dark:disabled:bg-slate-600 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              title={isJobClosed ? 'Job is closed' : 'Apply for this job'}
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Processing...
                </>
              ) : isJobClosed ? (
                'Job Closed'
              ) : (
                'Apply Now'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailView;
