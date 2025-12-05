import React from 'react';
import { CheckCircle, Clock, AlertCircle, XCircle, TrendingUp } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    APPLIED: {
      icon: Clock,
      label: 'Applied',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: '#3b82f6'
    },
    SHORTLISTED: {
      icon: TrendingUp,
      label: 'Shortlisted',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: '#10b981'
    },
    REVIEWING: {
      icon: Clock,
      label: 'Under Review',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      borderColor: '#f59e0b'
    },
    ACCEPTED: {
      icon: CheckCircle,
      label: 'Accepted',
      color: '#059669',
      bgColor: 'rgba(5, 150, 105, 0.1)',
      borderColor: '#059669'
    },
    REJECTED: {
      icon: XCircle,
      label: 'Rejected',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: '#ef4444'
    },
    WITHDRAWN: {
      icon: AlertCircle,
      label: 'Withdrawn',
      color: '#6b7280',
      bgColor: 'rgba(107, 114, 128, 0.1)',
      borderColor: '#6b7280'
    }
  };

  const config = statusConfig[status] || statusConfig.APPLIED;
  const Icon = config.icon;

  return (
    <span
      className="status-badge"
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
        borderColor: config.borderColor,
        borderWidth: '1px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '600'
      }}
    >
      <Icon size={14} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
