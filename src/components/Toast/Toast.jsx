import React, { useState, useEffect } from 'react';
import './Toast.css';

export default function Toast({ 
  type = 'info',           // 'success', 'error', 'warning', 'info'
  message = '',            // Toast message
  duration = 3000,         // Auto-close duration (ms)
  onClose = null           // Callback when toast closes
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  // Icons for different toast types
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  // Colors for different toast types
  const colorClasses = {
    success: 'toast--success',
    error: 'toast--error',
    warning: 'toast--warning',
    info: 'toast--info'
  };

  return (
    <div className={`toast toast--${type} ${colorClasses[type]}`}>
      <div className="toast__content">
        <span className="toast__icon">{icons[type]}</span>
        <p className="toast__message">{message}</p>
      </div>
      <button
        className="toast__close"
        onClick={() => {
          setIsVisible(false);
          if (onClose) onClose();
        }}
        aria-label="Close toast"
      >
        ✕
      </button>
    </div>
  );
}
