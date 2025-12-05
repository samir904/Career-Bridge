import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Briefcase, Users, TrendingUp,
  Eye, FileText, Clock, CheckCircle, AlertCircle,
  ArrowRight, Plus
} from 'lucide-react';
import { getMyJobs, getJobStats } from '../store/slices/job.slice';
import Toast from '../components/Toast/Toast';
import HomeLayout from '../components/HomeLayout';

const EmployerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, stats, loading, error, success } = useSelector(state => state.job || {});
  const { user } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(getMyJobs({ page: 1, limit: 5 }));
    dispatch(getJobStats());
  }, [dispatch]);

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
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '32px',
    },
    statCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
    },
    statCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    statIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '16px',
      fontSize: '24px',
    },
    statLabel: {
      fontSize: '14px',
      color: '#64748b',
      margin: '0 0 4px 0',
    },
    statValue: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 8px 0',
    },
    statDescription: {
      fontSize: '12px',
      color: '#94a3b8',
      margin: 0,
    },
    section: {
      marginBottom: '32px',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0,
    },
    viewAllBtn: {
      padding: '8px 16px',
      background: 'none',
      border: 'none',
      color: '#14b8a6',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      transition: 'all 0.2s',
    },
    jobsList: {
      display: 'grid',
      gap: '16px',
    },
    jobCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.2s ease',
    },
    jobCardHover: {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      borderColor: '#14b8a6',
    },
    jobInfo: {
      flex: 1,
    },
    jobTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0 0 4px 0',
    },
    jobMeta: {
      fontSize: '13px',
      color: '#64748b',
      margin: 0,
    },
    jobStats: {
      display: 'flex',
      gap: '24px',
      alignItems: 'center',
      marginRight: '20px',
    },
    jobStat: {
      textAlign: 'center',
    },
    jobStatValue: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#14b8a6',
      margin: 0,
    },
    jobStatLabel: {
      fontSize: '11px',
      color: '#64748b',
      margin: 0,
    },
    button: {
      padding: '8px 16px',
      background: '#14b8a6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '600',
      transition: 'all 0.2s',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '16px',
    },
    emptyText: {
      fontSize: '16px',
      color: '#64748b',
      margin: '0 0 20px 0',
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
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s',
    },
  };

  const statCards = [
    {
      icon: '📋',
      label: 'Total Postings',
      value: stats?.totalJobs || 0,
      description: 'Active & drafts',
      color: '#3b82f6',
    },
    {
      icon: '👥',
      label: 'Total Applicants',
      value: stats?.totalApplicants || 0,
      description: 'Across all jobs',
      color: '#14b8a6',
    },
    {
      icon: '✅',
      label: 'Shortlisted',
      value: stats?.shortlisted || 0,
      description: 'Moving forward',
      color: '#10b981',
    },
    {
      icon: '👁',
      label: 'Total Views',
      value: stats?.totalViews || 0,
      description: 'Job impressions',
      color: '#f59e0b',
    },
  ];

  return (
    <HomeLayout>
    <div style={styles.container}>
      {success && <Toast type="success" message={success} duration={3000} />}
      {error && <Toast type="error" message={error} duration={4000} />}

      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome back, {user?.fullName?.split(' ')[0]}! 👋</h1>
          <p style={styles.subtitle}>Manage your job postings and track applicants</p>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          {statCards.map((stat, idx) => (
            <div
              key={idx}
              style={styles.statCard}
              onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.statCardHover)}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{
                ...styles.statIcon,
                background: `rgba(${stat.color === '#3b82f6' ? '59, 130, 246' : stat.color === '#14b8a6' ? '20, 184, 166' : stat.color === '#10b981' ? '16, 185, 129' : '245, 158, 11'}, 0.1)`,
              }}>
                {stat.icon}
              </div>
              <p style={styles.statLabel}>{stat.label}</p>
              <h3 style={styles.statValue}>{stat.value}</h3>
              <p style={styles.statDescription}>{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Recent Jobs Section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Recent Postings</h2>
            <button
              style={styles.viewAllBtn}
              onClick={() => navigate('/employer/jobs')}
              onMouseOver={(e) => e.target.style.gap = '8px'}
              onMouseOut={(e) => e.target.style.gap = '4px'}
            >
              View All <ArrowRight size={16} />
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
          ) : jobs.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📭</div>
              <p style={styles.emptyText}>No job postings yet</p>
              <button
                style={styles.createBtn}
                onClick={() => navigate('/create-job')}
                onMouseOver={(e) => e.target.style.background = '#0d9488'}
                onMouseOut={(e) => e.target.style.background = '#14b8a6'}
              >
                <Plus size={18} />
                Create First Job
              </button>
            </div>
          ) : (
            <div style={styles.jobsList}>
              {jobs.slice(0, 5).map((job) => (
                <div
                  key={job._id}
                  style={styles.jobCard}
                  onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.jobCardHover)}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div style={styles.jobInfo}>
                    <h3 style={styles.jobTitle}>{job.title}</h3>
                    <p style={styles.jobMeta}>
                      {job.location} • {job.jobType} • {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div style={styles.jobStats}>
                    <div style={styles.jobStat}>
                      <p style={styles.jobStatValue}>{job.applicants || 0}</p>
                      <p style={styles.jobStatLabel}>Applicants</p>
                    </div>
                    <div style={styles.jobStat}>
                      <p style={styles.jobStatValue}>{job.views || 0}</p>
                      <p style={styles.jobStatLabel}>Views</p>
                    </div>
                  </div>

                  <button
                    style={styles.button}
                    onClick={() => navigate(`/employer/jobs/${job._id}`)}
                    onMouseOver={(e) => e.target.style.background = '#0d9488'}
                    onMouseOut={(e) => e.target.style.background = '#14b8a6'}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginTop: '16px',
          }}>
            {[
              { icon: Plus, label: 'Post New Job', path: '/create-job' },
              { icon: Users, label: 'View Applicants', path: '/employer/applicants' },
              { icon: TrendingUp, label: 'Analytics', path: '/employer/analytics' },
              { icon: FileText, label: 'Drafts', path: '/employer/jobs?status=draft' },
            ].map((action, idx) => (
              <button
                key={idx}
                style={{
                  padding: '16px',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1e293b',
                }}
                onClick={() => navigate(action.path)}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f0fdfa';
                  e.currentTarget.style.borderColor = '#14b8a6';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <action.icon size={20} color="#14b8a6" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
    </HomeLayout>
  );
};

export default EmployerDashboard;
