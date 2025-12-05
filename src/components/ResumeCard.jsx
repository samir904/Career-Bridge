
import React from 'react';
import { Star, Download, Edit2, Trash2, Eye, Clock } from 'lucide-react';

export default function ResumeCard({
  resume,
  onEdit,
  onView,
  onDelete,
  onDownload,
  onSetDefault
}) {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="resume-card">
      {/* Header */}
      <div className="resume-card__header">
        <div className="resume-card__title-section">
          <h3 className="resume-card__title">{resume?.title || 'Untitled Resume'}</h3>
          {resume?.isDefault && (
            <span className="resume-card__badge">
              <Star size={12} fill="currentColor" /> Default
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSetDefault();
          }}
          className={`resume-card__star-btn ${resume?.isDefault ? 'active' : ''}`}
          title={resume?.isDefault ? 'Default resume' : 'Set as default'}
        >
          <Star size={18} fill={resume?.isDefault ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Meta Info */}
      <div className="resume-card__meta">
        <div className="resume-card__meta-item">
          <Clock size={14} />
          <span>{formatDate(resume?.createdAt)}</span>
        </div>
        <div className="resume-card__meta-item">
          <span className="resume-card__file-type">
            {resume?.filename?.split('.').pop()?.toUpperCase() || 'PDF'}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="resume-card__description">
        {resume?.description || 'No description'}
      </p>

      {/* Stats */}
      <div className="resume-card__stats">
        <div className="resume-card__stat">
          <span className="resume-card__stat-label">Views</span>
          <span className="resume-card__stat-value">{resume?.views || 0}</span>
        </div>
        <div className="resume-card__stat">
          <span className="resume-card__stat-label">Downloads</span>
          <span className="resume-card__stat-value">{resume?.downloads || 0}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="resume-card__actions">
        <button
          onClick={() => onView()}
          className="resume-card__btn resume-card__btn--primary"
          title="View resume"
        >
          <Eye size={16} />
          View
        </button>
        <button
          onClick={() => onEdit()}
          className="resume-card__btn resume-card__btn--secondary"
          title="Edit resume"
        >
          <Edit2 size={16} />
          Edit
        </button>
        <button
          onClick={() => onDownload()}
          className="resume-card__btn resume-card__btn--secondary"
          title="Download resume"
        >
          <Download size={16} />
        </button>
        <button
          onClick={() => onDelete()}
          className="resume-card__btn resume-card__btn--danger"
          title="Delete resume"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}