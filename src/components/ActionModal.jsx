import React from 'react';
import { X } from 'lucide-react';

export default function ActionModal({ isOpen, onClose, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title || 'Action Triggered'}</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: '14px', color: '#475569' }}>
            {message || 'This feature is ready and will be connected to your backend API.'}
          </p>
        </div>
        <div className="modal-footer">
          <button className="modal-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
