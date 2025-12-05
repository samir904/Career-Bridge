
import React, { useEffect, useState } from 'react';
import { X, MapPin, DollarSign, Briefcase, Clock, Users, Share2, Heart, AlertCircle, Loader } from 'lucide-react';

const JobDetailView = ({ job, isOpen, onClose, onApply, isSaved = false, onSave, loading = false }) => {
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    // Scroll to top when modal opens
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto pt-4 pb-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-3xl w-full mx-4 shadow-xl">
        {/* Header with Company Info & Close Button */}
        <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-6 flex items-start justify-between z-10">
          <div className="flex items-start gap-4">
            {job.image ? (
              <img 
                src={job.image} 
                alt={job.company}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center">
                <Briefcase size={32} className="text-white" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
              <p className="text-teal-100 text-lg font-medium">{job.company}</p>
              <p className="text-teal-100 text-sm mt-1">Posted {new Date(job.postedDate).toLocaleDateString()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mb-1">
                <MapPin size={16} />
                Location
              </div>
              <p className="font-semibold text-slate-900 dark:text-white">{job.location}</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mb-1">
                <DollarSign size={16} />
                Salary
              </div>
              <p className="font-semibold text-slate-900 dark:text-white">
                ${job.salary?.min?.toLocaleString()}K - ${job.salary?.max?.toLocaleString()}K
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mb-1">
                <Briefcase size={16} />
                Type
              </div>
              <p className="font-semibold text-slate-900 dark:text-white">{job.jobType}</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mb-1">
                <Clock size={16} />
                Level
              </div>
              <p className="font-semibold text-slate-900 dark:text-white">{job.level}</p>
            </div>
          </div>

          {/* Main Description */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">About This Job</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {job.description}
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
                    <span className="text-teal-500 font-bold mt-1">•</span>
                    {resp}
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
                    <span className="text-teal-500 font-bold mt-1">✓</span>
                    {req}
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
                  <div key={idx} className="flex gap-3">
                    <span className="text-green-500 text-xl mt-[-4px]">🎁</span>
                    <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience & Openings */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 flex items-center gap-4">
            <Users size={24} className="text-teal-500" />
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Positions Open</p>
              <p className="font-bold text-slate-900 dark:text-white">{job.openings || 1} position(s)</p>
            </div>
          </div>

          {/* Warning if Closed */}
          {job.status === 'CLOSED' && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 dark:text-red-300">This job posting is no longer accepting applications.</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 sticky bottom-0 bg-white dark:bg-slate-800">
            <button
              onClick={() => onSave(job._id)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                isSaved
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  : 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
              {isSaved ? 'Saved' : 'Save Job'}
            </button>

            <button
              onClick={() => {
                // Share functionality
                if (navigator.share) {
                  navigator.share({
                    title: job.title,
                    text: `Check out this job: ${job.title} at ${job.company}`,
                    url: window.location.href
                  });
                }
              }}
              className="px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Share2 size={18} />
            </button>

            <button
              onClick={onApply}
              disabled={loading || job.status === 'CLOSED' || isApplied}
              className="flex-1 px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Processing...
                </>
              ) : isApplied ? (
                '✓ Applied'
              ) : job.status === 'CLOSED' ? (
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