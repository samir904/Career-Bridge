import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Loader, AlertCircle } from 'lucide-react';
import {
  getAllJobs,
  searchJobs,
  getJobById,
  saveJob,
  unsaveJob,
  trackJobView,
  clearError,
  clearSuccess
} from '../../store/slices/job.slice';
import { selectJobState } from '../../store/slices/job.slice';
import JobFilter from '../../components/job/JobFilter';
import JobCard from '../../components/job/JobCard';
import JobDetailView from '../../components/job/JobDetailView';
import ApplyForm from '../../components/job/ApplyForm';
import HomeLayout from '../../components/HomeLayout';

const JobsListPage = () => {
  // ============================================
  // HOOKS & STATE
  // ============================================
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { jobs, currentJob, loading, error, success, savedJobs, pagination } = useSelector(selectJobState);
  const { isAuthenticated, user } = useSelector(state => ({
    isAuthenticated: state.user?.isAuthenticated,
    user: state.user?.user
  }));

  // Local UI state
  const [showDetailView, setShowDetailView] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');

  // ============================================
  // EFFECTS
  // ============================================

  // Fetch jobs on component mount
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 12,
      sortBy,
      ...filters
    };
    
    if (searchTerm) {
      dispatch(searchJobs(params));
    } else {
      dispatch(getAllJobs(params));
    }
  }, [dispatch, currentPage, sortBy, filters, searchTerm]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        if (error) dispatch(clearError());
        if (success) dispatch(clearSuccess());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, dispatch]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleViewDetail = async (job) => {
    setSelectedJob(job);
    setShowDetailView(true);
    
    // Track job view
    dispatch(trackJobView(job._id));
    
    // Fetch full job details if needed
    if (!job.responsibilities) {
      dispatch(getJobById(job._id));
    }
  };

  const handleSaveJob = (jobId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const isSaved = savedJobs.some(j => j._id === jobId);
    
    if (isSaved) {
      dispatch(unsaveJob(jobId));
    } else {
      dispatch(saveJob(jobId));
    }
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'JOB_SEEKER') {
      alert('Only job seekers can apply for jobs');
      return;
    }

    setShowDetailView(false);
    setShowApplyForm(true);
  };

  const handleApplySubmit = async (formData) => {
    try {
      // This would dispatch a createApplication action from your application slice
      // For now, we'll just show success and close
      console.log('Application submitted:', formData);
      setShowApplyForm(false);
      // Show success toast
    } catch (err) {
      console.error('Failed to submit application:', err);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <HomeLayout>
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Find Your Next Opportunity
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Browse thousands of job listings from top companies
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-700 dark:text-green-300 font-medium">{success}</p>
          </div>
        )}

        {/* Filter Bar */}
        <JobFilter 
          onFilter={handleFilter}
          onSearch={handleSearch}
          onSort={handleSortChange}
          loading={loading}
        />

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader size={48} className="text-teal-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 text-lg">Loading jobs...</p>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-12 text-center border border-slate-200 dark:border-slate-700">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              No jobs found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={() => {
                setFilters({});
                setSearchTerm('');
              }}
              className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {jobs.map(job => (
                <JobCard
                  key={job._id}
                  job={job}
                  onViewDetail={handleViewDetail}
                  onSave={handleSaveJob}
                  isSaved={savedJobs.some(j => j._id === job._id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination?.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === page
                          ? 'bg-teal-500 text-white'
                          : 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Job Detail Modal */}
      <JobDetailView
        job={selectedJob}
        isOpen={showDetailView}
        onClose={() => setShowDetailView(false)}
        onApply={handleApply}
        isSaved={selectedJob ? savedJobs.some(j => j._id === selectedJob._id) : false}
        onSave={handleSaveJob}
        loading={false}
      />

      {/* Application Form Modal */}
      <ApplyForm
        job={selectedJob}
        isOpen={showApplyForm}
        onClose={() => setShowApplyForm(false)}
        onSubmit={handleApplySubmit}
        loading={false}
      />
    </div>
    </HomeLayout>
  );
};

export default JobsListPage;