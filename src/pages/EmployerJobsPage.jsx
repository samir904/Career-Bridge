import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Plus, Trash2, Edit, Eye, Copy, ChevronDown,
  AlertCircle, Check, Clock
} from 'lucide-react';
import { getMyJobs, deleteJob, publishJob, closeJob } from '../store/slices/job.slice';
import Toast from '../components/Toast/Toast';
import HomeLayout from '../components/HomeLayout';

const EmployerJobsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { jobs, loading, error, success, pagination } = useSelector(state => state.job || {});
  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || 'all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getMyJobs({
      page: currentPage,
      limit: 10,
      status: filterStatus !== 'all' ? filterStatus : undefined,
    }));
  }, [dispatch, currentPage, filterStatus]);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f1f5f9, #f8fafc)',
      padding: '32px 16px',
    },
    maxWidth: {
      maxWidth: '1280px',
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
      flexWrap: 'wrap',
      gap: '16px',
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0,
    },
    createBtn: {
      padding: '12px 24px',
      background: '#14b8a6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s',
    },
    filterBar: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
      flexWrap: 'wrap',
    },
    filterBtn: {
      padding: '8px 16px',
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '600',
      transition: 'all 0.2s',
    },
    table: {
      width: '100%',
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
    },
    tableHeader: {
      background: '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
      display: 'grid',
      gridTemplateColumns: '2fr 1.5fr 1fr 1.5fr 1fr',
      gap: '16px',
      padding: '16px',
      fontWeight: '600',
      fontSize: '13px',
      color: '#64748b',
    },
    tableRow: {
      borderBottom: '1px solid #e2e8f0',
      display: 'grid',
      gridTemplateColumns: '2fr 1.5fr 1fr 1.5fr 1fr',
      gap: '16px',
      padding: '16px',
      alignItems: 'center',
      transition: 'all 0.2s',
    },
    rowHover: {
      background: '#f0fdfa',
    },
    jobTitle: {
      fontWeight: '600',
      color: '#1e293b',
      margin: 0,
      fontSize: '14px',
    },
    jobMeta: {
      fontSize: '12px',
      color: '#64748b',
      margin: '4px 0 0 0',
    },
    badge: {
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: '600',
    },
    badgeActive: {
      background: '#d1fae5',
      color: '#047857',
    },
    badgeDraft: {
      background: '#fef3c7',
      color: '#92400e',
    },
    badgeClosed: {
      background: '#fee2e2',
      color: '#991b1b',
    },
    stats: {
      display: 'flex',
      gap: '16px',
      fontSize: '12px',
    },
    actionButtons: {
      display: 'flex',
      gap: '8px',
    },
    actionBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px 8px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      fontWeight: '500',
      transition: 'all 0.2s',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
    },
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return { ...styles.badge, ...styles.badgeActive };
      case 'DRAFT':
        return { ...styles.badge, ...styles.badgeDraft };
      case 'CLOSED':
        return { ...styles.badge, ...styles.badgeClosed };
      default:
        return styles.badge;
    }
  };

  const handleDelete = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      dispatch(deleteJob(jobId));
    }
  };

  const handlePublish = (jobId) => {
    dispatch(publishJob(jobId));
  };

  const handleClose = (jobId) => {
    dispatch(closeJob(jobId));
  };

  return (
    <HomeLayout>
    <div style={styles.container}>
      {success && <Toast type="success" message={success} duration={3000} />}
      {error && <Toast type="error" message={error} duration={4000} />}

      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>My Job Postings</h1>
          <button
            style={styles.createBtn}
            onClick={() => navigate('/create-job')}
            onMouseOver={(e) => e.target.style.background = '#0d9488'}
            onMouseOut={(e) => e.target.style.background = '#14b8a6'}
          >
            <Plus size={18} />
            Create Job
          </button>
        </div>

        {/* Filter Bar */}
        <div style={styles.filterBar}>
          {['all', 'ACTIVE', 'DRAFT', 'CLOSED'].map(status => (
            <button
              key={status}
              style={{
                ...styles.filterBtn,
                ...(filterStatus === status ? {
                  background: '#14b8a6',
                  color: 'white',
                  borderColor: '#14b8a6',
                } : {}),
              }}
              onClick={() => {
                setFilterStatus(status);
                setCurrentPage(1);
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Jobs Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        ) : jobs.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '20px' }}>
              No job postings found
            </p>
            <button
              style={styles.createBtn}
              onClick={() => navigate('/create-job')}
              onMouseOver={(e) => e.target.style.background = '#0d9488'}
              onMouseOut={(e) => e.target.style.background = '#14b8a6'}
            >
              <Plus size={18} />
              Create Job
            </button>
          </div>
        ) : (
          <>
            <div style={styles.table}>
              <div style={styles.tableHeader}>
                <div>Job Title</div>
                <div>Status</div>
                <div>Stats</div>
                <div>Applications</div>
                <div>Actions</div>
              </div>

              {jobs.map(job => (
                <div
                  key={job._id}
                  style={styles.tableRow}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f0fdfa'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                >
                  <div>
                    <p style={styles.jobTitle}>{job.title}</p>
                    <p style={styles.jobMeta}>{job.location} • {job.jobType}</p>
                  </div>

                  <div>
                    <span style={getStatusBadge(job.status)}>
                      {job.status}
                    </span>
                  </div>

                  <div style={styles.stats}>
                    <div>
                      <Eye size={14} style={{ marginRight: '4px' }} />
                      {job.views || 0}
                    </div>
                    <div>
                      👁 {job.applicants || 0}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#14b8a6' }}>
                      {job.applications?.length || 0} new
                    </span>
                  </div>

                  <div style={styles.actionButtons}>
                    <button
                      style={{
                        ...styles.actionBtn,
                        color: '#14b8a6',
                        background: '#f0fdfa',
                      }}
                      onClick={() => navigate(`/employer/jobs/${job._id}`)}
                      title="View"
                    >
                      <Eye size={14} />
                    </button>

                    {job.status === 'DRAFT' && (
                      <button
                        style={{
                          ...styles.actionBtn,
                          color: '#10b981',
                          background: '#d1fae5',
                        }}
                        onClick={() => handlePublish(job._id)}
                        title="Publish"
                      >
                        <Check size={14} />
                      </button>
                    )}

                    {job.status === 'ACTIVE' && (
                      <button
                        style={{
                          ...styles.actionBtn,
                          color: '#f59e0b',
                          background: '#fef3c7',
                        }}
                        onClick={() => handleClose(job._id)}
                        title="Close"
                      >
                        <Clock size={14} />
                      </button>
                    )}

                    <button
                      style={{
                        ...styles.actionBtn,
                        color: '#3b82f6',
                        background: '#dbeafe',
                      }}
                      onClick={() => navigate(`/employer/jobs/${job._id}/edit`)}
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>

                    <button
                      style={{
                        ...styles.actionBtn,
                        color: '#ef4444',
                        background: '#fee2e2',
                      }}
                      onClick={() => handleDelete(job._id)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination?.totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '24px',
              }}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1,
                  }}
                >
                  Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      background: currentPage === page ? '#14b8a6' : 'white',
                      color: currentPage === page ? 'white' : '#1e293b',
                      cursor: 'pointer',
                    }}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    cursor: currentPage === pagination.totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage === pagination.totalPages ? 0.5 : 1,
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </HomeLayout>
  );
};

export default EmployerJobsPage;
