import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Briefcase, MapPin, Clock, DollarSign, Building2,
  MessageSquare, Trash2, Share2, AlertCircle, CheckCircle,
  Calendar, User, Mail, Phone, FileText, Send
} from 'lucide-react';
import {
  getApplicationById,
  withdrawApplication,
  sendMessage,
  getConversation
} from '../store/slices/application.slice';
import HomeLayout from '../components/HomeLayout';
import Toast from '../components/Toast/Toast';
import ApplicationTimeline from '../components/ApplicationTimeline';
import StatusBadge from '../components/StatusBadge';
import ConversationThread from '../components/ConversationThread';
import './ApplicationDetailPage.css';

const ApplicationDetailPage = () => {
  const { appId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentApplication, loading, error, success } = useSelector(state => state.application || {});
  const { user } = useSelector(state => state.user || {});

  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (appId) {
      dispatch(getApplicationById(appId));
      dispatch(getConversation(appId));
    }
  }, [dispatch, appId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setSendingMessage(true);
    try {
      await dispatch(sendMessage({ applicationId: appId, message })).unwrap();
      setMessage('');
      dispatch(getConversation(appId)); // Refresh conversation
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleWithdraw = () => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      dispatch(withdrawApplication(appId)).then(() => {
        navigate('/applications');
      });
    }
  };

  if (loading) {
    return (
      <HomeLayout>
        <div className="app-detail-loading">
          <div className="spinner"></div>
          <p>Loading application details...</p>
        </div>
      </HomeLayout>
    );
  }

  if (!currentApplication) {
    return (
      <HomeLayout>
        <div className="app-detail-error">
          <AlertCircle size={48} />
          <h3>Application not found</h3>
          <button onClick={() => navigate('/applications')} className="btn btn--primary">
            Back to Applications
          </button>
        </div>
      </HomeLayout>
    );
  }

  // ✅ FIXED: Use jobId instead of job
  const job = currentApplication.jobId;
  const location = job?.locations;
  const employer = currentApplication.employerId;
  const salary = job?.salary;
  const canWithdraw = ['APPLIED', 'SHORTLISTED'].includes(currentApplication.status);

  return (
    <HomeLayout>
      <div className="app-detail-page">
        {success && <Toast type="success" message={success} duration={3000} />}
        {error && <Toast type="error" message={error} duration={4000} />}

        {/* Header */}
        <div className="app-detail-header">
          <button onClick={() => navigate('/applications')} className="app-detail-back">
            <ArrowLeft size={20} /> Back
          </button>
          <div className="app-detail-header-info">
            <h1>{job?.title}</h1>
            {/* ✅ FIXED: Use employerId.fullName */}
            <p>{employer?.fullName}</p>
          </div>
          <StatusBadge status={currentApplication.status} />
        </div>

        <div className="app-detail-container">
          {/* Main Content */}
          <div className="app-detail-main">
            {/* Job Overview */}
            <div className="app-detail-section">
              <h2>Job Overview</h2>
              <div className="job-overview">
                {/* Location */}
                <div className="job-overview-item">
                  <MapPin size={18} />
                  <div>
                    <p className="label">Location</p>
                    {/* ✅ FIXED: Use locations array */}
                    <p className="value">
                      {location 
                        ? `${location.city}, ${location.state}, ${location.country}${location.isRemote ? ' (Remote)' : ''}`
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>

                {/* Salary */}
                <div className="job-overview-item">
                  <DollarSign size={18} />
                  <div>
                    <p className="label">Salary</p>
                    {/* ✅ FIXED: Use salary min-max */}
                    <p className="value">
                      {salary 
                        ? `₹${(salary.min / 100000).toFixed(1)}L - ₹${(salary.max / 100000).toFixed(1)}L ${salary.currency}`
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>

                {/* Job Type */}
                <div className="job-overview-item">
                  <Briefcase size={18} />
                  <div>
                    <p className="label">Type</p>
                    <p className="value">{job?.jobType || 'N/A'}</p>
                  </div>
                </div>

                {/* Experience */}
                <div className="job-overview-item">
                  <Clock size={18} />
                  <div>
                    <p className="label">Experience</p>
                    <p className="value">
                      {job?.experienceRequired 
                        ? `${job.experienceRequired} years`
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Timeline */}
            <div className="app-detail-section">
              <h2>Application Timeline</h2>
              <ApplicationTimeline application={currentApplication} />
            </div>

            {/* Job Description */}
            <div className="app-detail-section">
              <h2>Job Description</h2>
              <div className="job-description">
                {job?.description || 'No description provided'}
              </div>

              {/* Required Skills */}
              {job?.requiredSkills && job.requiredSkills.length > 0 && (
                <div className="job-skills">
                  <h3>Required Skills</h3>
                  <div className="skills-list">
                    {job.requiredSkills.map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Conversation Thread */}
            <div className="app-detail-section">
              <h2>Messages</h2>
              <ConversationThread applicationId={appId} />

              {/* Message Input */}
              {currentApplication.status !== 'REJECTED' && (
                <div className="message-input-section">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="message-input"
                    rows={3}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || sendingMessage}
                    className="btn btn--primary"
                  >
                    <Send size={16} />
                    {sendingMessage ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="app-detail-sidebar">
            {/* Application Info */}
            <div className="sidebar-card">
              <h3>Application Info</h3>
              <div className="info-item">
                <span className="label">Applied on</span>
                <span className="value">
                  {new Date(currentApplication.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Status</span>
                <StatusBadge status={currentApplication.status} />
              </div>
              {currentApplication.updatedAt && (
                <div className="info-item">
                  <span className="label">Last updated</span>
                  <span className="value">
                    {new Date(currentApplication.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {/* ✅ ADDED: Resume Info */}
              {currentApplication.resumeId?.title && (
                <div className="info-item">
                  <span className="label">Resume Used</span>
                  <span className="value">{currentApplication.resumeId.title}</span>
                </div>
              )}
              {/* ✅ ADDED: Cover Letter Info */}
              {currentApplication.coverLetter && (
                <div className="info-item">
                  <span className="label">Cover Letter</span>
                  <p className="value cover-letter-text">"{currentApplication.coverLetter}"</p>
                </div>
              )}
            </div>

            {/* Company Info */}
            {employer && (
              <div className="sidebar-card">
                <h3>Company</h3>
                <div className="company-info">
                  <p className="company-name">{employer.fullName}</p>
                  {employer.email && (
                    <div className="company-contact">
                      <Mail size={16} />
                      <a href={`mailto:${employer.email}`}>{employer.email}</a>
                    </div>
                  )}
                  {employer.phone && (
                    <div className="company-contact">
                      <Phone size={16} />
                      <a href={`tel:${employer.phone}`}>{employer.phone}</a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="sidebar-card">
              <h3>Actions</h3>
              <div className="actions-list">
                <button
                  onClick={() => window.open(`/jobs/${job?._id}`, '_blank')}
                  className="action-btn action-btn--secondary"
                >
                  <Briefcase size={16} />
                  View Job
                </button>
                {canWithdraw && (
                  <button
                    onClick={handleWithdraw}
                    className="action-btn action-btn--danger"
                  >
                    <Trash2 size={16} />
                    Withdraw
                  </button>
                )}
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `${job?.title} at ${employer?.fullName}`,
                        text: 'Check out this job opportunity',
                        url: window.location.href
                      });
                    } else {
                      // Fallback for browsers that don't support Web Share API
                      alert('Share link: ' + window.location.href);
                    }
                  }}
                  className="action-btn action-btn--secondary"
                >
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default ApplicationDetailPage;
