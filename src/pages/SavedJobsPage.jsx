import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Heart, Briefcase, MapPin, Clock, DollarSign, Trash2,
  ArrowRight, Search, Filter, AlertCircle
} from 'lucide-react';
import { getSavedJobs, unsaveJob } from '../store/slices/job.slice';
import { applyForJob } from '../store/slices/application.slice';
import HomeLayout from '../components/HomeLayout';
import Toast from '../components/Toast/Toast';
import './SavedJobsPage.css';

const SavedJobsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { savedJobs = [], loading, error, success, pagination = {} } = useSelector(state => state.job || {});
  const { isAuthenticated } = useSelector(state => state.user || {});

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getSavedJobs({ page: currentPage, limit: 10 }));
    }
  }, [dispatch, isAuthenticated, currentPage]);

  // ✅ FIXED: Better filtering with fallbacks
  const filteredJobs = (savedJobs || []).filter(job =>
    (job?.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (job?.company?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (job?.location?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // ✅ FIXED: Better sorting with fallbacks
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
      case 'salary-high': {
        const bSalary = b?.salary?.min || 0;
        const aSalary = a?.salary?.min || 0;
        return bSalary - aSalary;
      }
      default:
        return 0;
    }
  });

  const handleUnsave = (jobId) => {
    dispatch(unsaveJob(jobId));
  };

  const handleApply = (e, jobId) => {
    e.stopPropagation();
    dispatch(applyForJob({ jobId })).then(() => {
      navigate(`/jobs/${jobId}/apply`);
    });
  };

  // ✅ FIXED: Format salary display
  const formatSalary = (salaryObj) => {
    if (!salaryObj) return 'Not specified';
    const { min, max, currency = 'INR' } = salaryObj;
    if (!min || !max) return 'Not specified';
    return `${currency === 'INR' ? '₹' : '$'}${(min / 100000).toFixed(1)}L - ${(max / 100000).toFixed(1)}L`;
  };

  return (
    <HomeLayout>
      <div className=" text-white saved-jobs-page">
        {success && <Toast type="success" message={success} duration={3000} />}
        {error && <Toast type="error" message={error} duration={4000} />}

        {/* Header */}
        <div className="saved-jobs-header">
          <h1 className="saved-jobs-title">Saved Jobs</h1>
          <p className="saved-jobs-subtitle">
            {(savedJobs || []).length} job{(savedJobs || []).length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {/* Controls */}
        <div className="saved-jobs-controls">
          <div className="saved-jobs-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search saved jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="saved-jobs-search__input"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="saved-jobs-sort"
          >
            <option value="recent">Most Recent</option>
            <option value="salary-high">Highest Salary</option>
          </select>
        </div>

        {/* Jobs Grid */}
        <div className="saved-jobs-container">
          {loading && (
            <div className="saved-jobs-loading">
              <div className="spinner"></div>
              <p>Loading saved jobs...</p>
            </div>
          )}

          {!loading && (sortedJobs || []).length === 0 && (
            <div className="saved-jobs-empty">
              <Heart size={48} />
              <h3>No saved jobs yet</h3>
              <p>Start saving jobs you're interested in</p>
              <button
                onClick={() => navigate('/jobs/search')}
                className="btn btn--primary"
              >
                Browse Jobs
              </button>
            </div>
          )}

          {!loading && (sortedJobs || []).map(job => (
            <div
              key={job?._id}
              className="saved-job-card"
              onClick={() => navigate(`/jobs/${job?._id}`)}
            >
              {/* Header */}
              <div className="saved-job-header">
                <div className="saved-job-company">
                  {job?.companyLogo || job?.company?.charAt(0).toUpperCase() || '🏢'}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnsave(job?._id);
                  }}
                  className="saved-job-unsave"
                  title="Remove from saved"
                >
                  <Heart size={20} fill="currentColor" />
                </button>
              </div>

              {/* Content */}
              <div className="saved-job-content">
                <h3 className="saved-job-title">{job?.title || 'Untitled Job'}</h3>
                <p className="saved-job-company-name">{job?.company || 'Unknown Company'}</p>

                <div className="saved-job-meta">
                  {job?.location && (
                    <div className="meta-item">
                      <MapPin size={16} />
                      <span>{job.location}</span>
                    </div>
                  )}
                  {job?.experience && (
                    <div className="meta-item">
                      <Clock size={16} />
                      <span>{job.experience}</span>
                    </div>
                  )}
                  <div className="meta-item">
                    <DollarSign size={16} />
                    <span className="font-semibold">
                      {formatSalary(job?.salary)}
                    </span>
                  </div>
                </div>

                {job?.skills && Array.isArray(job.skills) && job.skills.length > 0 && (
                  <div className="saved-job-skills">
                    {job.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="skill-more">+{job.skills.length - 3}</span>
                    )}
                  </div>
                )}

                {job?.description && (
                  <p className="saved-job-description">{job.description}</p>
                )}

                {job?.type && (
                  <div className="saved-job-type">{job.type}</div>
                )}
              </div>

              {/* Actions */}
              <div className="saved-job-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/jobs/${job?._id}`);
                  }}
                  className="btn btn--outline btn--full-width"
                >
                  View Details
                </button>
                <button
                  onClick={(e) => handleApply(e, job?._id)}
                  className="btn btn--primary btn--full-width"
                >
                  Apply Now <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {!loading && pagination?.totalPages > 1 && (
          <div className="saved-jobs-pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="btn btn--outline"
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={currentPage === pagination.totalPages}
              className="btn btn--outline"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </HomeLayout>
  );
};

export default SavedJobsPage;
