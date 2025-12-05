import React from 'react';
import { Briefcase, CheckCircle, Clock, XCircle } from 'lucide-react';

const ApplicationStats = ({ stats }) => {
  const statCards = [
    {
      icon: Briefcase,
      label: 'Total Applications',
      value: stats.total,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      icon: CheckCircle,
      label: 'Shortlisted',
      value: stats.shortlisted,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      icon: Clock,
      label: 'Under Review',
      value: stats.reviewing,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    },
    {
      icon: XCircle,
      label: 'Rejected',
      value: stats.rejected,
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    }
  ];

  return (
    <div className="application-stats">
      {statCards.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="stat-card"
            style={{ backgroundColor: stat.bgColor }}
          >
            <div className="stat-icon" style={{ color: stat.color }}>
              <Icon size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ApplicationStats;
