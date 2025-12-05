import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Upload, Plus, Search, Filter, Download, Trash2, Edit2,
  Star, Eye, Clock, ArrowRight, AlertCircle
} from 'lucide-react';
import { getMyResumes, deleteResume, setDefaultResume } from '../store/slices/user.slice';
import {
  selectResumes,
  selectLoading,
  selectError,
  selectSuccess,
  selectPagination,
  selectIsAuthenticated
} from '../store/slices/user.slice';
import HomeLayout from '../components/HomeLayout';
import Toast from '../components/Toast/Toast';
import ResumeCard from '../components/ResumeCard';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import './ResumesPage.css';

export default function ResumesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resumes = useSelector(selectResumes);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const pagination = useSelector(selectPagination);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ✅ Fetch resumes on mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getMyResumes({ page: currentPage, limit: 10 }));
    }
  }, [dispatch, isAuthenticated, currentPage]);

  // ✅ Filter resumes by search term
  const filteredResumes = (resumes || []).filter(resume =>
    (resume?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (resume?.filename || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Handle delete resume
  const handleDeleteResume = async (resumeId) => {
    await dispatch(deleteResume(resumeId));
    setDeleteConfirm(null);
  };

  // ✅ Handle set default resume
  const handleSetDefault = async (resumeId) => {
    await dispatch(setDefaultResume(resumeId));
  };

  // ✅ Handle download resume
  const handleDownload = (resume) => {
    if (resume?.fileUrl) {
      window.open(resume.fileUrl, '_blank');
    }
  };

  if (!isAuthenticated) {
    return (
      <HomeLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Not Authenticated</h2>
            <p className="text-gray-600 mt-2">Please login to manage resumes</p>
          </div>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="resumes-page">
        {/* Notifications */}
        {error && <Toast type="error" message={error} duration={4000} />}
        {success && <Toast type="success" message={success} duration={3000} />}

        {/* Header */}
        <div className="resumes-header">
          <div className="resumes-header__content">
            <h1 className="resumes-header__title">📄 My Resumes</h1>
            <p className="resumes-header__subtitle">
              Manage your resumes and keep them up to date
            </p>
          </div>
          <button
            onClick={() => navigate('/resumes/upload')}
            className="btn btn--primary btn--lg"
          >
            <Plus size={18} />
            Upload Resume
          </button>
        </div>

        {/* Controls */}
        <div className="resumes-controls">
          <div className="resumes-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search resumes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="resumes-search__input"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="resumes-loading">
            <LoadingSpinner />
            <p>Loading resumes...</p>
          </div>
        ) : filteredResumes.length === 0 ? (
          <div className="resumes-empty">
            <Upload size={48} />
            <h3>No resumes yet</h3>
            <p>Upload your first resume to get started</p>
            <button
              onClick={() => navigate('/resumes/upload')}
              className="btn btn--primary"
            >
              Upload Resume
            </button>
          </div>
        ) : (
          <>
            {/* Resume Stats */}
            <div className="resumes-stats">
              <div className="resume-stat">
                <span className="resume-stat__label">Total Resumes</span>
                <span className="resume-stat__value">{resumes.length}</span>
              </div>
              <div className="resume-stat">
                <span className="resume-stat__label">Default</span>
                <span className="resume-stat__value">
                  {resumes.find(r => r.isDefault)?._id ? '✓' : 'None'}
                </span>
              </div>
            </div>

            {/* Resumes Grid */}
            <div className="resumes-grid">
              {filteredResumes.map((resume) => (
                <ResumeCard
                  key={resume._id}
                  resume={resume}
                  onEdit={() => navigate(`/resumes/${resume._id}/edit`)}
                  onView={() => navigate(`/resumes/${resume._id}`)}
                  onDelete={() => setDeleteConfirm(resume._id)}
                  onDownload={() => handleDownload(resume)}
                  onSetDefault={() => handleSetDefault(resume._id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination?.totalPages > 1 && (
              <div className="resumes-pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="btn btn--outline"
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="btn btn--outline"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={!!deleteConfirm}
          onConfirm={() => handleDeleteResume(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
          loading={loading}
        />
      </div>
    </HomeLayout>
  );
}