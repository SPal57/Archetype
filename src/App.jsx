import React, { useState, useMemo } from 'react';
import TopBanner from './components/TopBanner';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import ArchetypeTable from './components/ArchetypeTable';
import ActionModal from './components/ActionModal';
import SearchCard from './components/SearchCard';
import AdvancedSearchModal from './components/AdvancedSearchModal';
import CreateArchetype from './components/CreateArchetype';
import ArchetypeDetail from './components/ArchetypeDetail';
import { initialArchetypesData } from './data/archetypesData';
import { Download } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState('Andres Simar');
  const [activeTab, setActiveTab] = useState('all');
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'create' | 'detail'
  const [selectedArchetype, setSelectedArchetype] = useState(null);
  const [allArchetypes, setAllArchetypes] = useState(initialArchetypesData);
  const [activeSearchCriteria, setActiveSearchCriteria] = useState(null);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  
  // Modal State for notifications/actions
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
        itemCode ? ` for Archetype ${itemCode}` : ''
      }. Ready for backend API integration.`
    });
  };

  // Filter archetypes based on search card criteria
  const filteredArchetypes = useMemo(() => {
    if (!activeSearchCriteria) return allArchetypes;

    return allArchetypes.filter((item) => {
      // Pattern ID
      if (
        activeSearchCriteria.patternId &&
        activeSearchCriteria.patternId !== 'All Patterns' &&
        item.patternId !== activeSearchCriteria.patternId
      ) {
        return false;
      }

      // Status (matching either visioStatus or pfcStatus)
      if (
        activeSearchCriteria.status &&
        activeSearchCriteria.status !== 'All Statuses'
      ) {
        const queryStatus = activeSearchCriteria.status.toLowerCase();
        const visioMatch = item.visioStatus?.toLowerCase().includes(queryStatus);
        const pfcMatch = item.pfcStatus?.toLowerCase().includes(queryStatus);
        if (!visioMatch && !pfcMatch) return false;
      }

      // Lane ID
      if (activeSearchCriteria.laneId) {
        const queryLane = activeSearchCriteria.laneId.trim().toLowerCase();
        if (!item.laneId?.toLowerCase().includes(queryLane)) {
          return false;
        }
      }

      // Archetype ID / Code
      if (activeSearchCriteria.archetypeId) {
        const queryCode = activeSearchCriteria.archetypeId.trim().toLowerCase();
        const codeMatch = item.code?.toLowerCase().includes(queryCode);
        const codeLinesMatch = item.codeLines?.some((part) =>
          part.toLowerCase().includes(queryCode)
        );
        if (!codeMatch && !codeLinesMatch) return false;
      }

      // Description / Title
      if (activeSearchCriteria.description) {
        const queryDesc = activeSearchCriteria.description.trim().toLowerCase();
        const descMatch = item.description?.toLowerCase().includes(queryDesc);
        const titleMatch = item.title?.toLowerCase().includes(queryDesc);
        if (!descMatch && !titleMatch) return false;
      }

      // Owner
      if (activeSearchCriteria.owner) {
        const queryOwner = activeSearchCriteria.owner.trim().toLowerCase();
        const ownerMatch = item.owner?.toLowerCase().includes(queryOwner);
        const updatedByMatch = item.updatedBy?.toLowerCase().includes(queryOwner);
        if (!ownerMatch && !updatedByMatch) return false;
      }

      return true;
    });
  }, [allArchetypes, activeSearchCriteria]);

  // Handle Basic Search Submission
  const handleBasicSearch = (searchData) => {
    setActiveSearchCriteria(searchData);
  };

  // Handle Reset Filters
  const handleResetSearch = () => {
    setActiveSearchCriteria(null);
  };

  // Handle Advanced Search Filters
  const handleApplyAdvancedFilters = (filters) => {
    setActiveSearchCriteria((prev) => ({
      ...(prev || {}),
      ...filters
    }));
  };

  // Handle Code click on row (specifically redirects to detail for row 1)
  const handleCodeClick = (row) => {
    setSelectedArchetype(row);
    setCurrentView('detail');
  };

  // Handle + Create button click
  const handleCreateClick = () => {
    setCurrentView('create');
  };

  // Handle Save from Create Archetype form
  const handleSaveArchetype = (newRecord) => {
    const formattedRecord = {
      id: String(Date.now()),
      codeLines: [
        newRecord.archetypeId || 'L3NEW',
        newRecord.csclLaneId || 'CSCL',
        'GL'
      ],
      code: newRecord.archetypeId || `L3-${newRecord.csclLaneId}`,
      laneId: newRecord.csclLaneId || '0000099999',
      title: newRecord.shortDescription || 'New Archetype Definition',
      legalEntities: 'Johnson & Johnson Global Supply Chain',
      pfcStatus: newRecord.status || 'Draft',
      pfcStatusClass: 'status-dot-new',
      visioStatus: newRecord.status === 'Approved' ? 'Approved' : 'Draft',
      visioClass: newRecord.status === 'Approved' ? 'approved' : 'draft',
      approvals: { approved: 0, total: 3, steps: ['pending', 'pending', 'pending'] },
      lastUpdate: new Date().toISOString().slice(0, 10).replace(/-/g, '/'),
      updatedBy: newRecord.owner || currentUser,
      patternId: 'P-P',
      owner: newRecord.owner,
      description: newRecord.shortDescription
    };

    setAllArchetypes((prev) => [formattedRecord, ...prev]);
    setCurrentView('list');
    setModalState({
      isOpen: true,
      title: 'Archetype Created Successfully',
      message: `Lane "${newRecord.csclLaneId}" has been saved and added to the archetype repository.`
    });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, title: '', message: '' });
  };

  // Calculate dynamic metrics
  const totalCount = filteredArchetypes.length;
  const newCount = filteredArchetypes.filter((a) => a.pfcStatus === 'New' || a.visioStatus === 'New').length;
  const inReviewCount = filteredArchetypes.filter(
    (a) => a.pfcStatus === 'In Review' || a.visioStatus === 'Approval In Progress'
  ).length;
  const approvedCount = filteredArchetypes.filter(
    (a) => a.pfcStatus === 'Approved' || a.visioStatus === 'Approved'
  ).length;

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
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setCurrentView('list');
          }}
        />

        {/* Main Content Workspace */}
        <main className="content-area">
          {currentView === 'create' ? (
            <CreateArchetype
              onBack={() => setCurrentView('list')}
              onSave={handleSaveArchetype}
            />
          ) : currentView === 'detail' ? (
            <ArchetypeDetail
              archetype={selectedArchetype || allArchetypes[0]}
              onBack={() => setCurrentView('list')}
            />
          ) : (
            <>
              {/* Page Title - Top search and status filter field REMOVED per user request */}
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
              </div>

              {/* MSCL Archetype Search Card (above table) */}
              <SearchCard
                onOpenAdvancedSearch={() => setIsAdvancedSearchOpen(true)}
                onSearch={handleBasicSearch}
                onReset={handleResetSearch}
              />

              {/* Metric KPI Cards (Matching Screenshot 3) */}
              <div className="stat-cards-grid">
                <div className="stat-card-container">
                  <StatCard label="Total Archetypes" value={String(totalCount)} variant="total" />
                  <StatCard label="New" value={String(newCount)} variant="not-generated" />
                  <StatCard label="In Review" value={String(inReviewCount)} variant="in-approval" />
                  <StatCard label="Approved" value={String(approvedCount)} variant="approved" />
                </div>

                <button
                  className="btn-export"
                  onClick={() => handleActionClick('Export List')}
                >
                  <Download size={16} />
                  <span>Export List</span>
                </button>
              </div>

              {/* Table Component with Initial Hardcoded Data & only + Create button */}
              <ArchetypeTable
                archetypes={filteredArchetypes}
                onActionClick={handleActionClick}
                onCodeClick={handleCodeClick}
                onCreateClick={handleCreateClick}
              />
            </>
          )}
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
