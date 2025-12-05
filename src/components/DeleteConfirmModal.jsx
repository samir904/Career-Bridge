

import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onConfirm, onCancel, loading }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title-section">
            <AlertCircle size={24} className="modal-icon-alert" />
            <h2 className="modal-title">Delete Resume?</h2>
          </div>
          <button onClick={onCancel} className="modal-close" disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <p className="modal-message">
          This action cannot be undone. This will permanently delete your resume.
        </p>

        <div className="modal-actions">
          <button
            onClick={onCancel}
            className="btn btn--outline"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn btn--danger"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}