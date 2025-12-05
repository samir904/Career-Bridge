import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Upload, X, ArrowRight, AlertCircle } from 'lucide-react';
import { uploadResume } from '../store/slices/user.slice';
import { selectLoading, selectError, selectSuccess } from '../store/slices/user.slice';
import HomeLayout from '../components/HomeLayout';
import Toast from '../components/Toast/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import './UploadResumePage.css';

export default function UploadResumePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // ✅ Handle file selection
  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        alert('Please upload a PDF or Word document');
      }
    }
  };

  // ✅ Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  // ✅ Handle upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file');
      return;
    }

    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    const formData = new FormData();
    formData.append('fileDetails', file);
    formData.append('title', title);
    formData.append('description', description);

    const result = await dispatch(uploadResume(formData));
    
    if (result.payload) {
      setTimeout(() => {
        navigate('/resumes');
      }, 2000);
    }
  };

  return (
    <HomeLayout>
      <div className="upload-resume-page">
        {error && <Toast type="error" message={error} duration={4000} />}
        {success && <Toast type="success" message={success} duration={3000} />}

        <div className="upload-container">
          {/* Header */}
          <div className="upload-header">
            <button onClick={() => navigate('/resumes')} className="upload-back-btn">
              ← Back to Resumes
            </button>
            <h1 className="upload-title">📤 Upload Resume</h1>
            <p className="upload-subtitle">Upload a PDF or Word document</p>
          </div>

          <form onSubmit={handleUpload} className="upload-form">
            {/* File Upload Area */}
            <div
              className={`upload-zone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-input"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="upload-zone__input"
                disabled={loading}
              />
              <label htmlFor="file-input" className="upload-zone__label">
                <Upload size={48} />
                <h3>Drag and drop your resume here</h3>
                <p>or click to select a file</p>
                <span className="upload-zone__hint">
                  Supported formats: PDF, DOC, DOCX
                </span>
              </label>
            </div>

            {/* Selected File */}
            {file && (
              <div className="selected-file">
                <div className="selected-file__info">
                  <span className="selected-file__name">{file.name}</span>
                  <span className="selected-file__size">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="selected-file__remove"
                  disabled={loading}
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Form Fields */}
            <div className="upload-fields">
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Resume Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Senior Developer Resume"
                  className="form-control"
                  disabled={loading}
                  maxLength="100"
                />
                <p className="form-hint">{title.length}/100 characters</p>
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description (optional)"
                  className="form-control form-control--textarea"
                  disabled={loading}
                  maxLength="500"
                  rows="4"
                />
                <p className="form-hint">{description.length}/500 characters</p>
              </div>

              {/* Tips */}
              <div className="upload-tips">
                <h4 className="upload-tips__title">💡 Tips for best results:</h4>
                <ul className="upload-tips__list">
                  <li>Use a clear, readable font</li>
                  <li>Include relevant keywords for your industry</li>
                  <li>Keep it to 1-2 pages</li>
                  <li>Use standard formatting</li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="upload-actions">
              <button
                type="button"
                onClick={() => navigate('/resumes')}
                className="btn btn--outline btn--lg"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn--primary btn--lg"
                disabled={loading || !file}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Upload Resume
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </HomeLayout>
  );
}