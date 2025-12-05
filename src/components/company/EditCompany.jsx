import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompanyById, updateCompany } from '../../store/slices/company.slice';
import Toast from '../Toast/Toast';
import './company.css';

export default function EditCompany() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentCompany, companyLoading, error, success } = useSelector((state) => state.company);

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    companySize: '',
    email: '',
    website: '',
    description: ''
  });

  useEffect(() => {
    dispatch(getCompanyById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (currentCompany) {
      setFormData(currentCompany);
    }
  }, [currentCompany]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateCompany({ companyId: id, updateData: formData }));
    if (result.payload) {
      setTimeout(() => navigate(`/companies/${id}`), 2000);
    }
  };

  if (companyLoading && !currentCompany) {
    return <div className="loading-spinner">Loading company...</div>;
  }

  return (
    <div className="edit-company">
      {success && <Toast type="success" message={success} duration={3000} />}
      {error && <Toast type="error" message={error} duration={4000} />}

      <div className="edit-company__container">
        <h1 className="edit-company__title">Edit Company</h1>

        <form className="edit-company__form" onSubmit={handleSubmit}>
          {/* Same form fields as CreateCompany */}
          <div className="form-group">
            <label className="form-label">Company Name *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Industry *</label>
              <input
                type="text"
                name="industry"
                className="form-control"
                value={formData.industry}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company Size *</label>
              <select
                name="companySize"
                className="form-control"
                value={formData.companySize}
                onChange={handleChange}
                required
              >
                <option value="">Select size</option>
                <option value="1-50">1-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="501-1000">501-1000</option>
                <option value="1000+">1000+</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Website</label>
            <input
              type="url"
              name="website"
              className="form-control"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="5"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--lg btn--full-width"
            disabled={companyLoading}
          >
            {companyLoading ? 'Updating...' : 'Update Company'}
          </button>
        </form>
      </div>
    </div>
  );
}
