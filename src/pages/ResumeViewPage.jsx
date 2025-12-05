import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Download, Edit2, Trash2, Star,
  MapPin, Calendar, Briefcase, User
} from 'lucide-react';
import { getResumeById, deleteResume, setDefaultResume } from '../store/slices/user.slice';
import { selectCurrentResume, selectLoading, selectError } from '../store/slices/user.slice';
import HomeLayout from '../components/HomeLayout';
import Toast from '../components/Toast/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import './ResumeViewPage.css';

export default function ResumeViewPage() {
  const { resumeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resume = useSelector(selectCurrentResume);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    if (resumeId) {
      dispatch(getResumeById(resumeId));
    }
  }, [dispatch, resumeId]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      const result = await dispatch(deleteResume(resumeId));
      if (result.payload) {
        navigate('/resumes');
      }
    }
  };

  const handleSetDefault = () => {
    dispatch(setDefaultResume(resumeId));
  };

  if (loading) {
    return (
      <HomeLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      </HomeLayout>
    );
  }

  if (!resume) {
    return (
      <HomeLayout>
        <div className="resume-not-found">
          <h2>Resume not found</h2>
          <button onClick={() => navigate('/resumes')} className="btn btn--primary">
            Back to Resumes
          </button>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="resume-view-page">
        {error && <Toast type="error" message={error} duration={4000} />}

        {/* Header */}
        <div className="resume-view-header">
          <button
            onClick={() => navigate('/resumes')}
            className="resume-view-back"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="resume-view-title-section">
            <h1 className="resume-view-title">{resume?.title || 'Resume'}</h1>
            {resume?.isDefault && (
              <span className="resume-view-badge">
                <Star size={12} fill="currentColor" /> Default
              </span>
            )}
          </div>

          <div className="resume-view-actions">
            <button
              onClick={() => window.open(resume?.fileUrl, '_blank')}
              className="btn btn--secondary"
              title="Download"
            >
              <Download size={18} />
              Download
            </button>
            <button
              onClick={() => navigate(`/resumes/${resumeId}/edit`)}
              className="btn btn--primary"
              title="Edit"
            >
              <Edit2 size={18} />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="btn btn--danger"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="resume-view-content">
          {/* Meta Info */}
          <div className="resume-view-meta">
            <div className="resume-meta-item">
              <Calendar size={16} />
              <div>
                <span className="meta-label">Created</span>
                <span className="meta-value">
                  {new Date(resume?.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="resume-meta-item">
              <span className="meta-label">File Type</span>
              <span className="meta-value">
                {resume?.filename?.split('.').pop()?.toUpperCase() || 'PDF'}
              </span>
            </div>
          </div>

          {/* Description */}
          {resume?.description && (
            <div className="resume-view-description">
              <h3>Description</h3>
              <p>{resume.description}</p>
            </div>
          )}

          {/* PDF Preview */}
          <div className="resume-view-preview">
            <h3>Preview</h3>
            {resume?.fileUrl?.endsWith('.pdf') ? (
              <embed
                src={resume.fileUrl}
                type="application/pdf"
                className="resume-embed"
              />
            ) : (
              <div className="resume-preview-placeholder">
                <Briefcase size={48} />
                <p>Document preview not available</p>
                <button
                  onClick={() => window.open(resume?.fileUrl, '_blank')}
                  className="btn btn--primary"
                >
                  Open Document
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="resume-view-stats">
            <div className="stat">
              <span className="stat-label">Views</span>
              <span className="stat-value">{resume?.views || 0}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Downloads</span>
              <span className="stat-value">{resume?.downloads || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}