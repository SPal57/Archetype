import React from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-section-title">WORKSPACE</div>
        <ul className="nav-list">
          <li
            className={`nav-item ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <div className="nav-item-left">
              <span className="radio-indicator"></span>
              <span>All Archetypes</span>
            </div>
          </li>

          <li
            className={`nav-item ${activeTab === 'approvals' ? 'active' : ''}`}
            onClick={() => setActiveTab('approvals')}
          >
            <div className="nav-item-left">
              <span className="radio-indicator"></span>
              <span>My Approval Actions</span>
            </div>
            <span className="badge-count">1</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
