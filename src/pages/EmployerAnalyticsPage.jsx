import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TrendingUp, BarChart3, PieChart, Activity,
  Eye, Users, Download, Share2
} from 'lucide-react';
import { getMyJobs, getJobStats } from '../store/slices/job.slice';
import HomeLayout from '../components/HomeLayout';

const EmployerAnalyticsPage = () => {
  const dispatch = useDispatch();
  const { jobs, stats, statsLoading } = useSelector(state => state.job || {});

  useEffect(() => {
    dispatch(getMyJobs({ page: 1, limit: 100 }));
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
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '32px',
    },
    metricCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s',
    },
    metricCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    metricLabel: {
      fontSize: '12px',
      color: '#64748b',
      margin: '0 0 8px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    metricValue: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0,
    },
    metricChange: {
      fontSize: '12px',
      color: '#10b981',
      marginTop: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    chartsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '24px',
      marginBottom: '32px',
    },
    chart: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #e2e8f0',
    },
    chartTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 20px 0',
    },
    chartPlaceholder: {
      height: '300px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc',
      borderRadius: '8px',
      color: '#94a3b8',
      fontSize: '14px',
    },
    jobsTable: {
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
    },
    tableHeader: {
      background: '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
      gap: '16px',
      padding: '16px',
      fontWeight: '600',
      fontSize: '12px',
      color: '#64748b',
    },
    tableRow: {
      borderBottom: '1px solid #e2e8f0',
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
      gap: '16px',
      padding: '16px',
      alignItems: 'center',
      transition: 'all 0.2s',
    },
    rowHover: {
      background: '#f0fdfa',
    },
  };

  const topMetrics = [
    { label: 'Total Views', value: stats?.totalViews || 0, icon: Eye },
    { label: 'Total Applicants', value: stats?.totalApplicants || 0, icon: Users },
    { label: 'Shortlisted', value: stats?.shortlisted || 0, icon: Activity },
    { label: 'Active Jobs', value: jobs?.filter(j => j.status === 'ACTIVE').length || 0, icon: BarChart3 },
  ];

  return (
    <HomeLayout>
    <div  className='' style={styles.container}>
      <div   style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Analytics Dashboard</h1>
        </div>

        {/* Top Metrics */}
        <div style={styles.metricsGrid}>
          {topMetrics.map((metric, idx) => (
            <div
              key={idx}
              style={styles.metricCard}
              onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.metricCardHover)}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <p style={styles.metricLabel}>
                <metric.icon size={16} color="#14b8a6" />
                {metric.label}
              </p>
              <h3 style={styles.metricValue}>{metric.value}</h3>
              <p style={styles.metricChange}>
                <TrendingUp size={12} />
                +5% this week
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={styles.chartsGrid}>
          <div style={styles.chart}>
            <h3 style={styles.chartTitle}>📊 Applications Trend</h3>
            <div style={styles.chartPlaceholder}>
              Chart visualization would go here
            </div>
          </div>

          <div style={styles.chart}>
            <h3 style={styles.chartTitle}>📈 Job Performance</h3>
            <div style={styles.chartPlaceholder}>
              Chart visualization would go here
            </div>
          </div>
        </div>

        {/* Top Performing Jobs */}
        <div style={styles.jobsTable}>
          <div style={styles.tableHeader}>
            <div>Job Title</div>
            <div>Views</div>
            <div>Applicants</div>
            <div>Shortlisted</div>
            <div>Conversion</div>
          </div>

          {jobs.map(job => {
            const conversionRate = job.applicants ? Math.round((stats?.shortlisted / job.applicants) * 100) : 0;
            return (
              <div
                key={job._id}
                style={styles.tableRow}
                onMouseOver={(e) => e.currentTarget.style.background = '#f0fdfa'}
                onMouseOut={(e) => e.currentTarget.style.background = 'white'}
              >
                <div style={{ fontWeight: '600', color: '#1e293b' }}>
                  {job.title}
                </div>
                <div style={{ color: '#64748b' }}>
                  {job.views || 0}
                </div>
                <div style={{ color: '#64748b' }}>
                  {job.applicants || 0}
                </div>
                <div style={{ color: '#14b8a6', fontWeight: '600' }}>
                  {stats?.shortlisted || 0}
                </div>
                <div>
                  <div style={{
                    width: '40px',
                    height: '24px',
                    background: '#f0fdfa',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#14b8a6',
                  }}>
                    {conversionRate}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </HomeLayout>
  );
};

export default EmployerAnalyticsPage;
