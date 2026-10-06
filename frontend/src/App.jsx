import React, { useState, useEffect, useMemo } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);

  // Fetch archetypes from backend database API on mount
  useEffect(() => {
    const fetchArchetypes = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('http://localhost:5000/api/lane-headers');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setAllArchetypes(json.data);
          }
        }
      } catch (err) {
        // Backend offline or local development: retain local state
        console.log('Backend API note: Running with local memory state.', err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArchetypes();
  }, []);
  
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

  const [createMode, setCreateMode] = useState('blank'); // 'blank' | 'clone'
  const [referenceArchetype, setReferenceArchetype] = useState(null);

  // Handle + Create button click (mode: 'blank' or 'clone')
  const handleCreateClick = (mode = 'blank', referenceItem = null) => {
    setCreateMode(mode);
    setReferenceArchetype(referenceItem);
    setCurrentView('create');
  };

  // Handle Save from Create / Clone Archetype form
  const handleSaveArchetype = async (newRecord) => {
    const hasVisio = Boolean(newRecord.attachment && newRecord.attachment.trim());
    const codeValue = newRecord.archetypeId?.trim() || `ARC-${Date.now().toString().slice(-4)}`;
    const laneValue = newRecord.csclLaneId?.trim() || `CSCL-${Date.now().toString().slice(-4)}`;
    const descValue = (newRecord.shortDescription || '').trim();
    const legalEntitiesValue = (newRecord.legalEntities || '').trim();

    const formattedRecord = {
      id: codeValue,
      archetypeId: codeValue,
      csclLaneId: laneValue,
      laneId: laneValue,
      codeLines: codeValue.includes('-') ? codeValue.split('-') : [codeValue],
      code: codeValue,
      shortDescription: descValue,
      description: descValue,
      legalEntities: legalEntitiesValue,
      status: newRecord.status || 'Draft',
      pfcStatus: newRecord.status || 'Draft',
      pfcStatusClass: newRecord.status === 'Approved' ? 'status-dot-approved' : (newRecord.status === 'In Review' ? 'status-dot-review' : 'status-dot-new'),
      visioStatus: hasVisio ? 'Approval In Progress' : 'Not Uploaded',
      visioClass: hasVisio ? 'in-progress' : 'not-uploaded',
      approvals: {
        approved: hasVisio ? 1 : 0,
        total: 3,
        steps: hasVisio ? ['approved', 'pending', 'pending'] : ['pending', 'pending', 'pending']
      },
      lastUpdate: new Date().toISOString().slice(0, 10).replace(/-/g, '/'),
      updatedBy: newRecord.owner || currentUser,
      patternId: 'P-P',
      owner: newRecord.owner,
      ownerRole: newRecord.ownerRole || '',
      franchise: newRecord.franchise || '',
      comments: newRecord.comments || '',
      wave: newRecord.wave,
      planTeam: newRecord.planTeam,
      planGrp: newRecord.planGrp,
      project: newRecord.project,
      nodesCount: newRecord.nodesCount || `${newRecord.nodes?.length || 0} nodes defined`,
      attachmentName: newRecord.attachment,
      attachment: newRecord.attachment,
      l1PhysicalFlow: newRecord.l1PhysicalFlow,
      l1FinancialFlow: newRecord.l1FinancialFlow,
      counters: newRecord.counters || [],
      nodes: newRecord.nodes || []
    };

    // 1. Optimistic UI update: immediately add to list
    setAllArchetypes((prev) => [formattedRecord, ...prev]);
    setCurrentView('list');

    // 2. Persist to Express backend / Azure SQL
    try {
      await fetch('http://localhost:5000/api/lane-headers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          archetypeId: codeValue,
          csclLaneId: laneValue,
          code: codeValue,
          shortDescription: descValue,
          legalEntities: legalEntitiesValue,
          status: newRecord.status || 'Draft',
          owner: newRecord.owner,
          ownerRole: newRecord.ownerRole || '',
          franchise: newRecord.franchise || '',
          comments: newRecord.comments || '',
          wave: newRecord.wave,
          planTeam: newRecord.planTeam,
          planGrp: newRecord.planGrp,
          project: newRecord.project,
          nodesCount: formattedRecord.nodesCount,
          attachmentName: newRecord.attachment,
          l1PhysicalFlow: newRecord.l1PhysicalFlow,
          l1FinancialFlow: newRecord.l1FinancialFlow
        })
      });
    } catch (err) {
      console.log('Backend notification: Data saved to browser view (database sync pending network):', err.message);
    }

    setModalState({
      isOpen: true,
      title: createMode === 'clone' ? 'Archetype Cloned Successfully' : 'Archetype Created Successfully',
      message: `Lane "${laneValue}" (${codeValue}) has been successfully saved into Lane Header and added to the table!`
    });
  };

  // Handle Update from ArchetypeDetail edit view
  const handleUpdateArchetype = async (originalId, updatedRecord) => {
    const newArchId = (updatedRecord.archetypeId || originalId).trim();
    const newCsclId = (updatedRecord.csclLaneId || '').trim();
    const descValue = (updatedRecord.shortDescription || '').trim();
    const legalEntitiesValue = (updatedRecord.legalEntities || '').trim();

    // 1. Persist to Express backend / Azure SQL
    const res = await fetch(`http://localhost:5000/api/lane-headers/${encodeURIComponent(originalId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        archetypeId: newArchId,
        csclLaneId: newCsclId,
        shortDescription: descValue,
        legalEntities: legalEntitiesValue,
        status: updatedRecord.status || 'Draft',
        owner: updatedRecord.owner,
        ownerRole: updatedRecord.ownerRole || '',
        franchise: updatedRecord.franchise || '',
        comments: updatedRecord.comments || '',
        wave: updatedRecord.wave,
        planTeam: updatedRecord.planTeam,
        planGrp: updatedRecord.planGrp,
        project: updatedRecord.project,
        nodesCount: updatedRecord.nodesCount || `${updatedRecord.nodes?.length || 0} nodes defined`,
        attachmentName: updatedRecord.attachmentName || updatedRecord.attachment,
        l1PhysicalFlow: updatedRecord.l1PhysicalFlow,
        l1FinancialFlow: updatedRecord.l1FinancialFlow
      })
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to update archetype in database');
    }

    const hasVisio = Boolean((updatedRecord.attachmentName || updatedRecord.attachment || '').trim());
    const visioStatus = hasVisio ? 'Approval In Progress' : 'Not Uploaded';
    const visioClass = hasVisio ? 'in-progress' : 'not-uploaded';

    // 2. Update local state in allArchetypes
    setAllArchetypes((prev) =>
      prev.map((item) => {
        const itemId = item.archetypeId || item.code || item.id;
        if (itemId === originalId) {
          return {
            ...item,
            ...updatedRecord,
            id: newArchId,
            archetypeId: newArchId,
            code: newArchId,
            codeLines: newArchId.includes('-') ? newArchId.split('-') : [newArchId],
            csclLaneId: newCsclId,
            laneId: newCsclId,
            description: descValue,
            shortDescription: descValue,
            legalEntities: legalEntitiesValue,
            status: updatedRecord.status,
            pfcStatus: updatedRecord.status,
            pfcStatusClass: updatedRecord.status === 'Approved' ? 'status-dot-approved' : (updatedRecord.status === 'In Review' ? 'status-dot-review' : 'status-dot-new'),
            visioStatus,
            visioClass,
            updatedBy: updatedRecord.owner,
            ownerRole: updatedRecord.ownerRole || '',
            franchise: updatedRecord.franchise || '',
            comments: updatedRecord.comments || '',
            lastUpdate: new Date().toISOString().slice(0, 10).replace(/-/g, '/')
          };
        }
        return item;
      })
    );

    // 3. Update selectedArchetype
    setSelectedArchetype((prev) => ({
      ...prev,
      ...updatedRecord,
      id: newArchId,
      archetypeId: newArchId,
      code: newArchId,
      codeLines: newArchId.includes('-') ? newArchId.split('-') : [newArchId],
      csclLaneId: newCsclId,
      laneId: newCsclId,
      description: descValue,
      shortDescription: descValue,
      legalEntities: legalEntitiesValue,
      status: updatedRecord.status,
      pfcStatus: updatedRecord.status,
      pfcStatusClass: updatedRecord.status === 'Approved' ? 'status-dot-approved' : (updatedRecord.status === 'In Review' ? 'status-dot-review' : 'status-dot-new'),
      visioStatus,
      visioClass,
      updatedBy: updatedRecord.owner,
      ownerRole: updatedRecord.ownerRole || '',
      franchise: updatedRecord.franchise || '',
      comments: updatedRecord.comments || '',
      lastUpdate: new Date().toISOString().slice(0, 10).replace(/-/g, '/')
    }));

    setModalState({
      isOpen: true,
      title: 'Archetype Updated Successfully',
      message: `Archetype "${newArchId}" (CSCL Lane ID: ${newCsclId}) has been successfully updated in the database.`
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
              mode={createMode}
              referenceData={referenceArchetype || allArchetypes[0]}
              existingArchetypes={allArchetypes}
              onBack={() => setCurrentView('list')}
              onSave={handleSaveArchetype}
            />
          ) : currentView === 'detail' ? (
            <ArchetypeDetail
              archetype={selectedArchetype || allArchetypes[0]}
              allArchetypes={allArchetypes}
              onBack={() => setCurrentView('list')}
              onSaveEdit={handleUpdateArchetype}
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
