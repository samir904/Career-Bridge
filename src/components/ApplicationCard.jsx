import React from 'react';
import {
  Briefcase, MapPin, DollarSign, Calendar, User,
  MessageSquare, Trash2, Eye, FileText
} from 'lucide-react';

const ApplicationCard = ({ application, onViewDetails, onWithdraw, onMessage }) => {
  // ✅ Use jobId instead of job
  const job = application.jobId;
  const location = job?.locations;
  const salary = job?.salary;

  return (
    <div className="application-card">
      {/* Header */}
      <div className="application-card__header">
        <div className="application-card__title-section">
          <h3 className="application-card__title">{job?.title}</h3>
          <span className={`application-card__status status--${application.status?.toLowerCase()}`}>
            {application.status}
          </span>
        </div>
      </div>

      {/* Company Info */}
      <div className="application-card__company">
        <User size={16} />
        <span>{application.employerId?.fullName}</span>
      </div>

      {/* Location */}
      {location && (
        <div className="application-card__location">
          <MapPin size={16} />
          <span>
            {location.city}, {location.state}, {location.country}
            {location.isRemote && ' (Remote)'}
          </span>
        </div>
      )}

      {/* Salary */}
      {salary && (
        <div className="application-card__salary">
          <DollarSign size={16} />
          <span>
            ₹{(salary.min / 100000).toFixed(1)}L - ₹{(salary.max / 100000).toFixed(1)}L
          </span>
        </div>
      )}

      {/* Applied Date */}
      <div className="application-card__date">
        <Calendar size={16} />
        <span>Applied on {new Date(application.appliedDate).toLocaleDateString()}</span>
      </div>

      {/* Resume & Cover Letter */}
      <div className="application-card__details">
        {application.resumeId?.title && (
          <div className="application-card__resume">
            <FileText size={14} />
            <span>{application.resumeId.title}</span>
          </div>
        )}
        {application.coverLetter && (
          <p className="application-card__cover-letter">"{application.coverLetter}"</p>
        )}
      </div>

      {/* Actions */}
      <div className="application-card__actions">
        <button
          onClick={onViewDetails}
          className="btn btn--secondary btn--sm"
          title="View details"
        >
          <Eye size={16} />
          View
        </button>
        <button
          onClick={onMessage}
          className="btn btn--secondary btn--sm"
          title="Send message"
        >
          <MessageSquare size={16} />
          Message
        </button>
        <button
          onClick={onWithdraw}
          className="btn btn--outline btn--sm"
          title="Withdraw application"
        >
          <Trash2 size={16} />
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
