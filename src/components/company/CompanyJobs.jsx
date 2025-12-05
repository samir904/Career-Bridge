import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// aimport { getJobsByCompany } from '../../store/slices/job.slice'; // Adjust path
import './company.css';

export default function CompanyJobs({ companyId }) {
  const dispatch = useDispatch();
  const { jobs = [], loading, error } = useSelector((state) => state.job || {});

  useEffect(() => {
    if (companyId) {
    //   dispatch(getJobsByCompany(companyId));
    }
  }, [companyId, dispatch]);

  if (loading) {
    return <div className="loading-spinner">Loading jobs...</div>;
  }

  if (error) {
    return <div className="error-message">Error loading jobs: {error}</div>;
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="empty-state">
        <p>No jobs posted yet</p>
      </div>
    );
  }

  return (
    <div className="company-jobs">
      <h2 className="company-jobs__title">Open Positions ({jobs.length})</h2>

      <div className="company-jobs__list">
        {jobs.map((job) => (
          <div key={job._id} className="company-jobs__item">
            <div className="company-jobs__header">
              <h3 className="company-jobs__job-title">{job.title}</h3>
              <span className="company-jobs__job-type">{job.jobType}</span>
            </div>

            <div className="company-jobs__details">
              <span>💰 {job.salaryRange?.min} - {job.salaryRange?.max}</span>
              <span>📍 {job.location}</span>
              <span>⏰ {job.experience} years</span>
            </div>

            <p className="company-jobs__description">
              {job.description?.substring(0, 150)}...
            </p>

            <button className="btn btn--primary btn--sm">
              View Job & Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
