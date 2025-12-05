import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Briefcase, MapPin, Calendar, Clock, MessageSquare,
  Trash2, Eye, Filter, Search, AlertCircle, CheckCircle,
  XCircle, TrendingUp, ChevronDown
} from 'lucide-react';
import { getMyApplications, withdrawApplication } from '../store/slices/application.slice';
import HomeLayout from '../components/HomeLayout';
import Toast from '../components/Toast/Toast';
import ApplicationCard from '../components/ApplicationCard';
import ApplicationStats from '../components/ApplicationStats';
import './ApplicationsPage.css';

const ApplicationsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // ✅ Correct destructuring
  const { myApplications = [], loading, error, success, pagination } = useSelector(state => state.application || {});
  const { isAuthenticated } = useSelector(state => state.user || {});

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getMyApplications({ page: currentPage, limit: 10 }));
    }
  }, [dispatch, isAuthenticated, currentPage]);

  // ✅ FIXED: Use correct property names (jobId, not job)
  const filteredApplications = myApplications.filter(app => {
    // ✅ Status filter
    const statusMatch = statusFilter === 'ALL' || app.status === statusFilter;
    
    // ✅ Search filter - use jobId instead of job
    const searchMatch = 
      app.jobId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobId?.locations?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobId?.locations?.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.employerId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  // ✅ Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'salary-high':
        // ✅ Use jobId.salary instead of job.salary
        return (b.jobId?.salary?.max || 0) - (a.jobId?.salary?.max || 0);
      default:
        return 0;
    }
  });

  const handleWithdraw = (appId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      dispatch(withdrawApplication(appId));
    }
  };

  const statusOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Applied', value: 'APPLIED' },
    { label: 'Shortlisted', value: 'SHORTLISTED' },
    { label: 'Reviewing', value: 'REVIEWING' },
    { label: 'Accepted', value: 'ACCEPTED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  // ✅ Stats calculation
  const stats = {
    total: myApplications.length,
    shortlisted: myApplications.filter(a => a.status === 'SHORTLISTED').length,
    reviewing: myApplications.filter(a => a.status === 'REVIEWING').length,
    rejected: myApplications.filter(a => a.status === 'REJECTED').length,
  };

  // ✅ DEBUG: Log to verify data is loading
  console.log('myApplications:', myApplications);
  console.log('filteredApplications:', filteredApplications);
  console.log('sortedApplications:', sortedApplications);

  return (
    <HomeLayout>
      <div className="text-white applications-page">
        {success && <Toast type="success" message={success} duration={3000} />}
        {error && <Toast type="error" message={error} duration={4000} />}

        {/* Header */}
        <div className="applications-header">
          <div className="applications-header__content">
            <h1 className="applications-title">My Applications</h1>
            <p className="applications-subtitle">Track and manage your job applications</p>
          </div>
        </div>

        {/* Stats */}
        <ApplicationStats stats={stats} />

        {/* Controls */}
        <div className="applications-controls">
          {/* Search */}
          <div className="applications-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by job title, location, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="applications-search__input"
            />
          </div>

          {/* Filters */}
          <div className="applications-filters">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="applications-filter__select"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="applications-filter__select"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="salary-high">Highest Salary</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="applications-list">
          {loading && (
            <div className="applications-loading">
              <div className="spinner"></div>
              <p>Loading your applications...</p>
            </div>
          )}

          {!loading && sortedApplications.length === 0 && (
            <div className="applications-empty">
              <FileText size={48} />
              <h3>No applications yet</h3>
              <p>
                {statusFilter !== 'ALL' 
                  ? 'No applications match your filter' 
                  : 'Start applying to jobs to see them here'}
              </p>
              <button
                onClick={() => navigate('/jobs/search')}
                className="btn btn--primary"
              >
                Browse Jobs
              </button>
            </div>
          )}

          {!loading && sortedApplications.map(application => (
            <ApplicationCard
              key={application._id}
              application={application}
              onViewDetails={() => navigate(`/applications/${application._id}`)}
              onWithdraw={() => handleWithdraw(application._id)}
              onMessage={() => navigate(`/applications/${application._id}`)}
            />
          ))}
        </div>

        {/* Pagination */}
        {!loading && pagination?.totalPages > 1 && (
          <div className="applications-pagination">
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

export default ApplicationsPage;
