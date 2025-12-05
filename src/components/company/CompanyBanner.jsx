import React from 'react';
import './company.css';

export default function CompanyBanner({ company, isOwner, onEdit }) {
  return (
    <div className="company-banner">
      {/* Background */}
      <div className="company-banner__background">
        {company.bannerImage ? (
          <img src={company.bannerImage} alt="banner" />
        ) : (
          <div className="company-banner__bg-placeholder"></div>
        )}
      </div>

      {/* Content */}
      <div className="company-banner__content">
        {/* Logo */}
        <div className="company-banner__logo">
          {company.logo ? (
            <img src={company.logo} alt={company.name} />
          ) : (
            <div className="company-banner__logo-placeholder">
              {company.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="company-banner__info">
          <div className="company-banner__header">
            <h1 className="company-banner__name">{company.name}</h1>
            {company.isVerified && (
              <span className="company-banner__verified">✅ Verified</span>
            )}
          </div>

          <p className="company-banner__industry">{company.industry}</p>

          <div className="company-banner__meta">
            <span>📍 {company.location}</span>
            <span>👥 {company.companySize}</span>
            <span>📧 {company.email}</span>
          </div>

          <p className="company-banner__description">{company.description}</p>

          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="company-banner__link"
            >
              🌐 Visit Website
            </a>
          )}
        </div>

        {/* Edit Button */}
        {isOwner && (
          <button
            className="btn btn--primary"
            onClick={onEdit}
          >
            Edit Company
          </button>
        )}
      </div>
    </div>
  );
}
