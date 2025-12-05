import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCompanies } from '../../store/slices/company.slice';
import CompanyCard from './CompanyCard';
import './company.css';

export default function CompanyList() {
  const dispatch = useDispatch();
  const { companies, loading, error, pagination } = useSelector(
    (state) => state.company
  );

  useEffect(() => {
    dispatch(getAllCompanies({ page: 1, limit: 10 }));
  }, [dispatch]);

  if (loading) {
    return <div className="loading-spinner">Loading companies...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="company-list">
      <h2 className="company-list__title">
        Top Companies ({pagination?.totalCompanies || 0})
      </h2>

      <div className="company-list__grid">
        {companies.map((company) => (
          <CompanyCard key={company._id} company={company} />
        ))}
      </div>

      {/* Pagination */}
      {pagination?.totalPages > 1 && (
        <div className="pagination">
          <button className="btn btn--secondary">← Previous</button>
          <span>
            Page {pagination?.currentPage} of {pagination?.totalPages}
          </span>
          <button className="btn btn--secondary">Next →</button>
        </div>
      )}
    </div>
  );
}
