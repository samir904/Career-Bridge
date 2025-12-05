import React from 'react';
import { useNavigate } from 'react-router-dom';
import './company.css';

export default function CompanyCard({ company, onDelete, onEdit }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/companies/${company._id}`);
  };

  // ✅ FIX: Extract location string from object
  const getLocationString = (location) => {
    if (!location) return 'Location not specified';
    
    if (typeof location === 'string') {
      return location;
    }
    
    if (typeof location === 'object') {
      const { city, state, country } = location;
      const parts = [city, state, country].filter(Boolean);
      return parts.length > 0 ? parts.join(', ') : 'Location not specified';
    }
    
    return 'Location not specified';
  };

  return (
    <div className="company-card">
      {/* Logo */}
      <div className="company-card__logo">
        {company.logo ? (
          <img src={company.logo} alt={company.name} />
        ) : (
          <div className="company-card__logo-placeholder">
            {company.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Verification Badge */}
      {company.isVerified && (
        <div className="company-card__badge">✅ Verified</div>
      )}

      {/* Company Info */}
      <div className="company-card__body">
        <h3 className="company-card__name">{company.name}</h3>
        
        <p className="company-card__industry">
          {company.industry || 'Industry not specified'}
        </p>

        <div className="company-card__details">
          <span className="company-card__location">
            {/* ✅ FIX: Use helper function */}
            📍 {getLocationString(company.location)}
          </span>
          <span className="company-card__size">
            👥 {company.companySize || 'Size not specified'}
          </span>
        </div>

        <p className="company-card__description">
          {company.description?.substring(0, 100)}
          {company.description?.length > 100 ? '...' : ''}
        </p>

        <div className="company-card__stats">
          <div className="company-card__stat">
            <span className="company-card__stat-label">Jobs Posted</span>
            <span className="company-card__stat-value">
              {company.jobsPosted || 0}
            </span>
          </div>
          <div className="company-card__stat">
            <span className="company-card__stat-label">Rating</span>
            <span className="company-card__stat-value">
              {company.averageRating ? `⭐ ${company.averageRating.toFixed(1)}` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="company-card__actions">
        <button
          className="btn btn--primary btn--sm"
          onClick={handleViewDetails}
        >
          View Details
        </button>

        {onEdit && (
          <button
            className="btn btn--secondary btn--sm"
            onClick={() => onEdit(company._id)}
          >
            Edit
          </button>
        )}

        {onDelete && (
          <button
            className="btn btn--danger btn--sm"
            onClick={() => onDelete(company._id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
