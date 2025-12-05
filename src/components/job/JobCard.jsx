
import React from 'react';
import { Heart, MapPin, Briefcase, Clock, DollarSign } from 'lucide-react';

const JobCard = ({ job, onViewDetail, onSave, isSaved = false }) => {
  if (!job) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
      {/* Header with Logo & Save Button */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          {job.companyImage ? (
            <img 
              src={job.companyImage} 
              alt={job.company} 
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0">
              <Briefcase size={24} className="text-white" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm truncate">
              {job.company}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'Recently posted'}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave(job._id);
          }}
          className={`p-2 rounded-lg transition-all flex-shrink-0 ml-2 ${
            isSaved
              ? 'bg-red-100 dark:bg-red-900/20 text-red-500'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-500'
          }`}
          title={isSaved ? 'Unsave job' : 'Save job'}
        >
          <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Job Title */}
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
        {job.title}
      </h2>

      {/* Location */}
      <div className="flex items-center gap-2 mb-4 text-slate-600 dark:text-slate-400 text-sm">
        <MapPin size={16} className="text-teal-500 flex-shrink-0" />
        <span className="truncate">{job.location || 'Location not specified'}</span>
      </div>

      {/* Job Meta Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.jobType && (
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
            {job.jobType === 'FULL_TIME' ? 'Full Time' : 
             job.jobType === 'PART_TIME' ? 'Part Time' : 
             job.jobType === 'CONTRACT' ? 'Contract' : job.jobType}
          </span>
        )}
        {job.level && (
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
            {job.level === 'ENTRY' ? 'Entry Level' : 
             job.level === 'INTERMEDIATE' ? 'Intermediate' : 
             job.level === 'ADVANCED' ? 'Advanced' : job.level}
          </span>
        )}
        {job.experience && (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium flex items-center gap-1">
            <Clock size={12} />
            {job.experience}+ yrs
          </span>
        )}
      </div>

      {/* Salary Range */}
      {job.salary && (
        <div className="flex items-center gap-2 mb-4 text-slate-700 dark:text-slate-300 font-semibold">
          <DollarSign size={16} className="text-green-500" />
          <span className="text-sm">
            ${job.salary.min ? job.salary.min.toLocaleString() : '0'}K - ${job.salary.max ? job.salary.max.toLocaleString() : '0'}K
          </span>
        </div>
      )}

      {/* Description Preview */}
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 flex-grow">
        {job.description || 'No description available'}
      </p>

      {/* Footer - Skills & Button */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700 mt-auto">
        {job.skills && job.skills.length > 0 && (
          <div className="flex gap-1 flex-wrap min-w-0">
            {job.skills.slice(0, 2).map((skill, idx) => (
              <span 
                key={idx}
                className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs truncate"
                title={skill}
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 2 && (
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs font-medium">
                +{job.skills.length - 2}
              </span>
            )}
          </div>
        )}
        <button
          onClick={() => onViewDetail(job)}
          className="ml-auto px-4 py-2 bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 text-white rounded-lg font-medium text-sm transition-all flex-shrink-0"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default JobCard;
