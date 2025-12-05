import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompanyById } from '../../store/slices/company.slice';
import CompanyBanner from './CompanyBanner';
import CompanyJobs from './CompanyJobs';
import './company.css';

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCompany, companyLoading, error } = useSelector(
    (state) => state.company
  );
  const { user } = useSelector((state) => state.user);

  const isOwner = user?._id === currentCompany?.employer;

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

  useEffect(() => {
    dispatch(getCompanyById(id));
  }, [id, dispatch]);

  if (companyLoading) {
    return <div className="loading-spinner">Loading company...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!currentCompany) {
    return <div className="error-message">Company not found</div>;
  }

  return (
    <div className="company-detail">
      <CompanyBanner
        company={currentCompany}
        isOwner={isOwner}
        onEdit={() => navigate(`/companies/${id}/edit`)}
      />

      <div className="company-detail__container">
        <div className="company-detail__main">
          <section className="company-detail__section">
            <h2>About</h2>
            <p>{currentCompany.description}</p>
          </section>

          <section className="company-detail__section">
            <h2>Details</h2>
            <div className="company-detail__info">
              <div className="company-detail__info-item">
                <span className="label">Location:</span>
                {/* ✅ FIX: Use helper function */}
                <span>{getLocationString(currentCompany.location)}</span>
              </div>
              <div className="company-detail__info-item">
                <span className="label">Industry:</span>
                <span>{currentCompany.industry}</span>
              </div>
              <div className="company-detail__info-item">
                <span className="label">Company Size:</span>
                <span>{currentCompany.companySize}</span>
              </div>
              <div className="company-detail__info-item">
                <span className="label">Email:</span>
                <span>{currentCompany.email}</span>
              </div>
              {currentCompany.website && (
                <div className="company-detail__info-item">
                  <span className="label">Website:</span>
                  <a href={currentCompany.website} target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </section>

          <CompanyJobs companyId={id} />
        </div>

        <aside className="company-detail__sidebar">
          <div className="company-detail__card">
            <h3>Company Info</h3>
            <p>Jobs Posted: <strong>{currentCompany.jobsPosted || 0}</strong></p>
            <p>Rating: <strong>{currentCompany.averageRating?.toFixed(1) || 'N/A'}</strong></p>
            <button className="btn btn--primary btn--full-width">
              Follow Company
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
