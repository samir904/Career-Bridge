import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  MessageSquare, Download, CheckCircle, X,
  FileText, Calendar, Phone, Mail
} from 'lucide-react';
import { getMyJobs } from '../store/slices/job.slice';
import Toast from '../components/Toast/Toast';
import HomeLayout from '../components/HomeLayout';

const EmployerApplicantsPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const { jobs, loading, error, success } = useSelector(state => state.job || {});
  const [selectedJobId, setSelectedJobId] = useState(searchParams.get('job') || null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(getMyJobs({ page: 1, limit: 100 }));
  }, [dispatch]);

  const selectedJob = jobs.find(j => j._id === selectedJobId) || jobs[0];
  const applicants = selectedJob?.applications || [];

  const filteredApplicants = applicants.filter(app =>
    filterStatus === 'all' ? true : app.status === filterStatus
  );

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
      marginBottom: '32px',
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 8px 0',
    },
    subtitle: {
      fontSize: '16px',
      color: '#64748b',
      margin: 0,
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '250px 1fr',
      gap: '24px',
      marginBottom: '32px',
    },
    sidebar: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    jobOption: {
      padding: '12px',
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '600',
      textAlign: 'left',
      transition: 'all 0.2s',
    },
    applicantsSection: {
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      padding: '24px',
    },
    filterBar: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid #e2e8f0',
      flexWrap: 'wrap',
    },
    filterBtn: {
      padding: '6px 12px',
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '600',
      transition: 'all 0.2s',
    },
    applicantCard: {
      background: '#f8fafc',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardHover: {
      background: '#f0fdfa',
      borderColor: '#14b8a6',
    },
    applicantInfo: {
      flex: 1,
    },
    applicantName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0 0 4px 0',
    },
    applicantMeta: {
      fontSize: '12px',
      color: '#64748b',
      margin: '0 0 8px 0',
    },
    applicantEmail: {
      fontSize: '12px',
      color: '#14b8a6',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    statusBadge: {
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: '600',
      marginRight: '12px',
    },
    actionButtons: {
      display: 'flex',
      gap: '8px',
    },
    actionBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '6px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      transition: 'all 0.2s',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
    },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SHORTLISTED':
        return { background: '#d1fae5', color: '#047857' };
      case 'REJECTED':
        return { background: '#fee2e2', color: '#991b1b' };
      case 'ACCEPTED':
        return { background: '#dbeafe', color: '#1e40af' };
      default:
        return { background: '#fef3c7', color: '#92400e' };
    }
  };

  return (
    <HomeLayout>
    <div style={styles.container}>
      {success && <Toast type="success" message={success} duration={3000} />}
      {error && <Toast type="error" message={error} duration={4000} />}

      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Applicants</h1>
          <p style={styles.subtitle}>Review and manage job applications</p>
        </div>

        {/* Main Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        ) : jobs.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <p style={{ fontSize: '16px', color: '#64748b' }}>
              No job postings yet
            </p>
          </div>
        ) : (
          <div style={styles.mainGrid}>
            {/* Sidebar - Job List */}
            <div style={styles.sidebar}>
              {jobs.map(job => (
                <button
                  key={job._id}
                  style={{
                    ...styles.jobOption,
                    ...(selectedJobId === job._id ? {
                      background: '#14b8a6',
                      color: 'white',
                      borderColor: '#14b8a6',
                    } : {}),
                  }}
                  onClick={() => setSelectedJobId(job._id)}
                >
                  {job.title}
                  <div style={{
                    fontSize: '11px',
                    opacity: 0.7,
                    marginTop: '4px',
                  }}>
                    {job.applications?.length || 0} applications
                  </div>
                </button>
              ))}
            </div>

            {/* Applicants Section */}
            {selectedJob && (
              <div style={styles.applicantsSection}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>
                  {selectedJob.title}
                </h2>

                {/* Filter Bar */}
                <div style={styles.filterBar}>
                  {['all', 'PENDING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'].map(status => (
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
                      onClick={() => setFilterStatus(status)}
                    >
                      {status === 'all' ? 'All' : status}
                    </button>
                  ))}
                </div>

                {/* Applicants List */}
                {filteredApplicants.length === 0 ? (
                  <div style={styles.emptyState}>
                    <p style={{ fontSize: '14px', color: '#64748b' }}>
                      No applicants found
                    </p>
                  </div>
                ) : (
                  filteredApplicants.map(applicant => (
                    <div
                      key={applicant._id}
                      style={styles.applicantCard}
                      onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.cardHover)}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      <div style={styles.applicantInfo}>
                        <p style={styles.applicantName}>
                          {applicant.jobSeekerName || 'Anonymous'}
                        </p>
                        <p style={styles.applicantMeta}>
                          Applied on {new Date(applicant.createdAt).toLocaleDateString()}
                        </p>
                        <p style={styles.applicantEmail}>
                          <Mail size={12} />
                          {applicant.jobSeekerEmail}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            ...getStatusColor(applicant.status),
                          }}
                        >
                          {applicant.status}
                        </span>

                        <div style={styles.actionButtons}>
                          <button
                            style={{
                              ...styles.actionBtn,
                              color: '#14b8a6',
                              background: '#f0fdfa',
                            }}
                            title="Download Resume"
                          >
                            <Download size={14} />
                          </button>

                          <button
                            style={{
                              ...styles.actionBtn,
                              color: '#3b82f6',
                              background: '#dbeafe',
                            }}
                            title="Send Message"
                          >
                            <MessageSquare size={14} />
                          </button>

                          {applicant.status !== 'SHORTLISTED' && (
                            <button
                              style={{
                                ...styles.actionBtn,
                                color: '#10b981',
                                background: '#d1fae5',
                              }}
                              title="Shortlist"
                            >
                              <CheckCircle size={14} />
                            </button>
                          )}

                          {applicant.status !== 'REJECTED' && (
                            <button
                              style={{
                                ...styles.actionBtn,
                                color: '#ef4444',
                                background: '#fee2e2',
                              }}
                              title="Reject"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </HomeLayout>
  );
};

export default EmployerApplicantsPage;
