import React, { useState } from 'react';
import TopBanner from './components/TopBanner';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import ArchetypeTable from './components/ArchetypeTable';
import ActionModal from './components/ActionModal';
import SearchCard from './components/SearchCard';
import AdvancedSearchModal from './components/AdvancedSearchModal';
import { Search, Download } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState('Andres Simar');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  
  // Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: ''
  });

  const handleActionClick = (actionName, itemCode = '') => {
    setModalState({
      isOpen: true,
      title: `${actionName} Action`,
      message: `Action "${actionName}" clicked${
        itemCode ? ` for Archetype code ${itemCode}` : ''
      }. Ready for backend API integration.`
    });
  };

  const handleBasicSearch = (searchData) => {
    const activeFilters = Object.entries(searchData)
      .filter(([_, val]) => val && val !== 'All Statuses' && val !== 'All Patterns')
      .map(([k, v]) => `${k}="${v}"`)
      .join(', ');

    handleActionClick(
      'Search Archetypes',
      activeFilters ? `with criteria: ${activeFilters}` : 'for all archetypes'
    );
  };

  const handleApplyAdvancedFilters = (filters) => {
    const activeFilters = Object.entries(filters)
      .filter(([_, val]) => val && val !== 'Any')
      .map(([k, v]) => `${k}="${v}"`)
      .join(', ');

    handleActionClick(
      'Advanced Filters Applied',
      activeFilters ? `Filters: ${activeFilters}` : 'all criteria reset'
    );
  };

  const closeModal = () => {
    setModalState({ isOpen: false, title: '', message: '' });
  };

  return (
    <div className="app-container">
      {/* Top Demo Banner */}
      <TopBanner
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onUserSwitch={(user) =>
          handleActionClick('User Switched', `Logged in as ${user}`)
        }
      />

      <div className="main-layout">
        {/* Left Sidebar Navigation */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Workspace */}
        <main className="content-area">
          {/* Page Title & Top Header Controls */}
          <div className="page-header">
            <div className="page-title-box">
              <h1>
                {activeTab === 'all'
                  ? 'Archetype List'
                  : 'My Approval Actions'}
              </h1>
              <p>
                {activeTab === 'all'
                  ? 'Select an archetype to view its L3 Visio diagram'
                  : 'Archetypes requiring your approval or action'}
              </p>
            </div>

            <div className="header-controls">
              <select
                className="status-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All Statuses">All Statuses</option>
                <option value="New">New</option>
                <option value="Draft">Draft</option>
                <option value="Approval In Progress">Approval In Progress</option>
                <option value="Ready for Approval">Ready for Approval</option>
                <option value="Approved">Approved</option>
                <option value="Reopened">Reopened</option>
              </select>

              <div className="search-input-wrapper">
                <Search className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search code, title, lane ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="stat-cards-grid">
            <div className="stat-card-container">
              <StatCard label="Total Archetypes" value="12" variant="total" />
              <StatCard label="Not Generated" value="1" variant="not-generated" />
              <StatCard label="In Approval" value="3" variant="in-approval" />
              <StatCard label="Approved" value="6" variant="approved" />
              <StatCard label="Reopened" value="1" variant="reopened" />
            </div>

            <button
              className="btn-export"
              onClick={() => handleActionClick('Export List')}
            >
              <Download size={16} />
              <span>Export List</span>
            </button>
          </div>

          {/* MSCL Archetype Search Card */}
          <SearchCard
            onOpenAdvancedSearch={() => setIsAdvancedSearchOpen(true)}
            onSearch={handleBasicSearch}
            onReset={() => handleActionClick('Search Filters Reset')}
          />

          {/* Table Component */}
          <ArchetypeTable onActionClick={handleActionClick} />
        </main>
      </div>

      {/* Action Notification Modal */}
      <ActionModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
      />

      {/* Advanced Search Modal */}
      <AdvancedSearchModal
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        onApplyFilters={handleApplyAdvancedFilters}
      />
    </div>
  );
}
