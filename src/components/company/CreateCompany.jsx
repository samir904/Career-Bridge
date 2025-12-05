import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createCompany } from '../../store/slices/company.slice';
import Toast from '../Toast/Toast';
import './company.css';

export default function CreateCompany() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companyLoading, error, success } = useSelector((state) => state.company);

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    companySize: '',
    email: '',
    website: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createCompany(formData));
    if (result.payload) {
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  };

  return (
    <div className="create-company text-black ">
      {success && <Toast type="success" message={success} duration={3000} />}
      {error && <Toast type="error" message={error} duration={4000} />}

      <div className="create-company__container">
        <h1 className="create-company__title">Create Your Company</h1>

        <form className="create-company__form text-black " onSubmit={handleSubmit}>
          <div className="form-group text-black">
            <label className="form-label ">Company Name *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter company name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label text-black">Industry *</label>
              <input
                type="text"
                name="industry"
                className="form-control"
                placeholder="e.g., Technology, Finance"
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
                placeholder="City, Country"
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
                placeholder="company@example.com"
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
              placeholder="https://yourcompany.com"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              placeholder="Tell us about your company"
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
            {companyLoading ? 'Creating...' : 'Create Company'}
          </button>
        </form>
      </div>
    </div>
  );
}
