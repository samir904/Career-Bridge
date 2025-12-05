import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMyCompanies, deleteCompany } from '../../store/slices/company.slice';
import CompanyCard from './CompanyCard';
import Toast from '../Toast/Toast';
import './company.css';

export default function CompanyDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myCompanies, loading, error, success } = useSelector(
    (state) => state.company
  );

  useEffect(() => {
    dispatch(getMyCompanies({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleDelete = (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      dispatch(deleteCompany(companyId));
    }
  };

  const handleEdit = (companyId) => {
    navigate(`/companies/${companyId}/edit`);
  };

  if (loading && myCompanies.length === 0) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="company-dashboard">
      {success && <Toast type="success" message={success} duration={3000} />}
      {error && <Toast type="error" message={error} duration={4000} />}

      <div className="company-dashboard__header">
        <h1>My Companies</h1>
        <button
          className="btn btn--primary"
          onClick={() => navigate('/create-company')}
        >
          + Create Company
        </button>
      </div>

      {myCompanies.length === 0 ? (
        <div className="empty-state">
          <p>No companies yet. Create one to get started!</p>
          <button
            className="btn btn--primary"
            onClick={() => navigate('/create-company')}
          >
            Create Company
          </button>
        </div>
      ) : (
        <div className="company-dashboard__grid">
          {myCompanies.map((company) => (
            <CompanyCard
              key={company._id}
              company={company}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
