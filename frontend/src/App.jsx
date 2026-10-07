import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

const getInitialRoute = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view') || 'list';
    const id = params.get('id');
    const mode = params.get('mode') || 'blank';
    const ref = params.get('ref');
    return { view, id, mode, ref };
  } catch {
    return { view: 'list', id: null, mode: 'blank', ref: null };
  }
};

export default function App() {
  const initialRoute = useMemo(() => getInitialRoute(), []);
  const [currentUser, setCurrentUser] = useState('Andres Simar');
  const [activeTab, setActiveTab] = useState('all');
  const [currentView, setCurrentView] = useState(initialRoute.view); // 'list' | 'create' | 'detail'
  const [selectedArchetype, setSelectedArchetype] = useState(
    initialRoute.id ? { archetypeId: initialRoute.id, archtId: initialRoute.id, id: initialRoute.id } : null
  );
  const [createMode, setCreateMode] = useState(initialRoute.mode); // 'blank' | 'clone'
  const [referenceArchetype, setReferenceArchetype] = useState(null);
  const [allArchetypes, setAllArchetypes] = useState(initialArchetypesData);
  const [activeSearchCriteria, setActiveSearchCriteria] = useState(null);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Reusable fetch archetypes from backend database API
  const fetchArchetypes = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5000/api/lane-headers');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setAllArchetypes(json.data);
          return json.data;
        }
      }
    } catch (err) {
      console.log('Backend API note: Running with local memory state.', err.message);
    } finally {
      setIsLoading(false);
    }
    return null;
  }, []);

  // Fetch archetypes from backend database API on mount
  useEffect(() => {
    fetchArchetypes().then((data) => {
      if (data) {
        if (initialRoute.view === 'detail' && initialRoute.id) {
          const match = data.find(
            (a) => (a.archtId || a.archetypeId || a.code || a.id) === initialRoute.id
          );
          if (match) setSelectedArchetype(match);
        }
        if (initialRoute.view === 'create' && initialRoute.ref) {
          const matchRef = data.find(
            (a) => (a.archtId || a.archetypeId || a.code || a.id) === initialRoute.ref
          );
          if (matchRef) setReferenceArchetype(matchRef);
        }
      }
    });
  }, [fetchArchetypes, initialRoute]);

  // Browser Navigation & History Popstate Listener (Supports Browser Back & Forward buttons)
  useEffect(() => {
    // Ensure base entry has valid state so clicking back to root works cleanly
    if (!window.history.state) {
      window.history.replaceState(
        {
          view: initialRoute.view,
          id: initialRoute.id,
          mode: initialRoute.mode,
          refId: initialRoute.ref
        },
        '',
        window.location.search || window.location.pathname
      );
    }

    const handlePopState = (event) => {
      const state = event.state;
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view') || state?.view || 'list';
      const id = params.get('id') || state?.id;
      const mode = params.get('mode') || state?.mode || 'blank';
      const refId = params.get('ref') || state?.refId;

      if (view === 'detail' && id) {
        setAllArchetypes((list) => {
          const match = list.find(
            (a) => (a.archtId || a.archetypeId || a.code || a.id) === id
          );
          setSelectedArchetype(match || { archetypeId: id, archtId: id, id });
          return list;
        });
        setCurrentView('detail');
      } else if (view === 'create') {
        setCreateMode(mode);
        if (refId) {
          setAllArchetypes((list) => {
            const matchRef = list.find(
              (a) => (a.archtId || a.archetypeId || a.code || a.id) === refId
            );
            setReferenceArchetype(matchRef || null);
            return list;
          });
        } else {
          setReferenceArchetype(null);
        }
        setCurrentView('create');
      } else {
        setCurrentView('list');
        setSelectedArchetype(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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
        const laneMatch = item.laneId?.toLowerCase().includes(queryLane) ||
          item.csclLaneId?.toLowerCase().includes(queryLane) ||
          item.prevWaveCsclId?.toLowerCase().includes(queryLane);
        if (!laneMatch) {
          return false;
        }
      }

      // Archetype ID / Code
      if (activeSearchCriteria.archetypeId) {
        const queryCode = activeSearchCriteria.archetypeId.trim().toLowerCase();
        const codeMatch = item.code?.toLowerCase().includes(queryCode) ||
          item.archetypeId?.toLowerCase().includes(queryCode) ||
          item.archtId?.toLowerCase().includes(queryCode) ||
          item.prjArchId?.toLowerCase().includes(queryCode);
        const codeLinesMatch = item.codeLines?.some((part) =>
          part.toLowerCase().includes(queryCode)
        );
        if (!codeMatch && !codeLinesMatch) return false;
      }

      // Description / Title
      if (activeSearchCriteria.description) {
        const queryDesc = activeSearchCriteria.description.trim().toLowerCase();
        const descMatch = item.description?.toLowerCase().includes(queryDesc) ||
          item.shortDesc?.toLowerCase().includes(queryDesc) ||
          item.shortDescription?.toLowerCase().includes(queryDesc) ||
          item.comments?.toLowerCase().includes(queryDesc);
        const titleMatch = item.title?.toLowerCase().includes(queryDesc);
        if (!descMatch && !titleMatch) return false;
      }

      // Owner
      if (activeSearchCriteria.owner) {
        const queryOwner = activeSearchCriteria.owner.trim().toLowerCase();
        const ownerMatch = item.owner?.toLowerCase().includes(queryOwner) ||
          item.ownerRole?.toLowerCase().includes(queryOwner) ||
          item.ownerEmail?.toLowerCase().includes(queryOwner);
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

  // Handle Code / View click on row (navigates to detail)
  const handleCodeClick = (row) => {
    const archId = row?.archtId || row?.archetypeId || row?.code || row?.id || '';
    setSelectedArchetype(row);
    setCurrentView('detail');
    const newUrl = `?view=detail&id=${encodeURIComponent(archId)}`;
    window.history.pushState({ view: 'detail', id: archId }, '', newUrl);
  };

  // Handle + Create button click (mode: 'blank' or 'clone')
  const handleCreateClick = (mode = 'blank', referenceItem = null) => {
    setCreateMode(mode);
    setReferenceArchetype(referenceItem);
    setCurrentView('create');
    const refId = referenceItem
      ? referenceItem.archtId || referenceItem.archetypeId || referenceItem.code || referenceItem.id
      : '';
    const newUrl = refId
      ? `?view=create&mode=${mode}&ref=${encodeURIComponent(refId)}`
      : `?view=create&mode=${mode}`;
    window.history.pushState({ view: 'create', mode, refId }, '', newUrl);
  };

  // Handle in-app back buttons (both breadcrumb back buttons)
  const handleInAppBack = () => {
    if (window.history.state && window.history.state.view && window.history.state.view !== 'list') {
      window.history.back();
    } else {
      setCurrentView('list');
      setSelectedArchetype(null);
      window.history.pushState({ view: 'list' }, '', window.location.pathname);
    }
  };

  // Handle Save from Create / Clone Archetype form
  const handleSaveArchetype = async (newRecord) => {
    const hasVisio = Boolean((newRecord.fileLink || newRecord.attachment || newRecord.attachmentName || '').trim());
    const codeValue = (newRecord.archetypeId || newRecord.archtId || '').trim();
    const laneValue = (newRecord.csclLaneId || newRecord.laneId || '').trim();
    const descValue = (newRecord.shortDesc || newRecord.shortDescription || '').trim();
    const projectValue = (newRecord.transcendPrj || newRecord.project || '').trim();
    const apsValue = (newRecord.ompRelevant || newRecord.apsRelevant || '').trim();

    const formattedRecord = {
      ...newRecord,
      id: codeValue,
      archetypeId: codeValue,
      archtId: codeValue,
      csclLaneId: laneValue,
      laneId: laneValue,
      codeLines: codeValue.includes('-') ? codeValue.split('-') : [codeValue],
      code: codeValue,
      shortDesc: descValue,
      shortDescription: descValue,
      description: newRecord.description || descValue,
      ownerRole: newRecord.ownerRole || '',
      owner: newRecord.owner || currentUser,
      ownerEmail: newRecord.owner || currentUser,
      wave: newRecord.wave || '',
      prevWaveCsclId: newRecord.prevWaveCsclId || '',
      planGrp: newRecord.planGrp || '',
      franchise: newRecord.franchise || '',
      planTeam: newRecord.planTeam || '',
      project: projectValue,
      transcendPrj: projectValue,
      comments: newRecord.comments || '',
      skuCount: newRecord.skuCount !== undefined && newRecord.skuCount !== null && newRecord.skuCount !== '' ? Number(newRecord.skuCount) : 0,
      salesVol: newRecord.salesVol || '',
      transactionsVol: newRecord.transactionsVol || '',
      apsRelevant: apsValue,
      ompRelevant: apsValue,
      lego: newRecord.lego || '',
      returns: newRecord.returns || '',
      physicalFlow: newRecord.physicalFlow || newRecord.l1PhysicalFlow || '',
      financialFlow: newRecord.financialFlow || newRecord.l1FinancialFlow || '',
      fileLink: newRecord.fileLink || '',
      prjArchId: newRecord.prjArchId || '',
      documentation: newRecord.documentation || '',
      status: newRecord.status || '00-New',
      pfcStatus: newRecord.status || '00-New',
      pfcStatusClass: newRecord.status === 'Approved' ? 'status-dot-approved' : (newRecord.status === 'In Review' ? 'status-dot-review' : 'status-dot-new'),
      visioStatus: hasVisio ? 'Approval In Progress' : 'Not Uploaded',
      visioClass: hasVisio ? 'in-progress' : 'not-uploaded',
      approvals: {
        approved: hasVisio ? 1 : 0,
        total: 3,
        steps: hasVisio ? ['approved', 'pending', 'pending'] : ['pending', 'pending', 'pending']
      },
      lastUpdate: new Date().toISOString().slice(0, 10),
      updatedBy: newRecord.owner || currentUser,
      nodes: Array.isArray(newRecord.nodes) ? newRecord.nodes : [],
      nodesCount: typeof newRecord.nodesCount === 'string' ? newRecord.nodesCount : `${Array.isArray(newRecord.nodes) ? newRecord.nodes.length : 0} nodes defined`,
      attachmentName: newRecord.fileLink || newRecord.attachment || '',
      attachment: newRecord.fileLink || newRecord.attachment || '',
      counters: newRecord.counters || []
    };

    // Persist to Express backend / Azure SQL
    try {
      const res = await fetch('http://localhost:5000/api/lane-headers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newRecord,
          ARCHT_ID: codeValue,
          archetypeId: codeValue,
          CSCL_Lane_ID: laneValue,
          csclLaneId: laneValue,
          Short_desc: descValue,
          shortDesc: descValue,
          shortDescription: descValue,
          Owner: newRecord.owner || currentUser,
          owner: newRecord.owner || currentUser,
          Owner_role: newRecord.ownerRole || '',
          ownerRole: newRecord.ownerRole || '',
          Wave: newRecord.wave || '',
          wave: newRecord.wave || '',
          Prev_Wave_CSCL_ID: newRecord.prevWaveCsclId || '',
          prevWaveCsclId: newRecord.prevWaveCsclId || '',
          Nodes: typeof newRecord.nodesCount === 'string' ? newRecord.nodesCount : (Array.isArray(newRecord.nodes) ? `${newRecord.nodes.length} nodes defined` : '0 nodes defined'),
          nodesCount: typeof newRecord.nodesCount === 'string' ? newRecord.nodesCount : (Array.isArray(newRecord.nodes) ? `${newRecord.nodes.length} nodes defined` : '0 nodes defined'),
          Plan_GRP: newRecord.planGrp || '',
          planGrp: newRecord.planGrp || '',
          Franchise: newRecord.franchise || '',
          franchise: newRecord.franchise || '',
          PLAN_team: newRecord.planTeam || '',
          planTeam: newRecord.planTeam || '',
          TranSCend_PRJ: projectValue,
          project: projectValue,
          transcendPrj: projectValue,
          Comments: newRecord.comments || '',
          comments: newRecord.comments || '',
          SKU_Count: newRecord.skuCount !== undefined && newRecord.skuCount !== '' ? Number(newRecord.skuCount) : 0,
          skuCount: newRecord.skuCount !== undefined && newRecord.skuCount !== '' ? Number(newRecord.skuCount) : 0,
          Sales_Vol: newRecord.salesVol || '',
          salesVol: newRecord.salesVol || '',
          Tranactions_Vol: newRecord.transactionsVol || '',
          transactionsVol: newRecord.transactionsVol || '',
          OMP_relevant: apsValue,
          ompRelevant: apsValue,
          apsRelevant: apsValue,
          LEGO: newRecord.lego || '',
          lego: newRecord.lego || '',
          Returns: newRecord.returns || '',
          returns: newRecord.returns || '',
          Physical_flow: newRecord.physicalFlow || '',
          physicalFlow: newRecord.physicalFlow || '',
          Financial_flow: newRecord.financialFlow || '',
          financialFlow: newRecord.financialFlow || '',
          Description: newRecord.description || '',
          description: newRecord.description || '',
          File_link: newRecord.fileLink || '',
          fileLink: newRecord.fileLink || '',
          prj_arch_ID: newRecord.prjArchId || '',
          prjArchId: newRecord.prjArchId || '',
          Documentation: newRecord.documentation || '',
          documentation: newRecord.documentation || '',
          Status: newRecord.status || '00-New',
          status: newRecord.status || '00-New'
        })
      });

      const resData = await res.json().catch(() => ({}));

      if (!res.ok || resData.success === false) {
        const detail = resData.error ? `\n\nDetails: ${resData.error}` : '';
        const errorMsg = (resData.message || `Server error (${res.status})`) + detail;
        console.error('Backend save error:', errorMsg, resData);
        setModalState({
          isOpen: true,
          title: 'Save Failed',
          message: errorMsg
        });
        return;
      }

      // Refresh data from database
      await fetchArchetypes();
      setCurrentView('list');
      window.history.pushState({ view: 'list' }, '', window.location.pathname);

      setModalState({
        isOpen: true,
        title: createMode === 'clone' ? 'Archetype Cloned Successfully' : 'Archetype Created Successfully',
        message: `Lane "${laneValue || codeValue}" (${codeValue}) has been successfully saved into Lane Header and added to the table!`
      });
    } catch (err) {
      console.warn('Backend connection failed:', err.message);
      // Fallback if backend service is completely unreachable
      setAllArchetypes((prev) => [formattedRecord, ...prev]);
      setCurrentView('list');
      window.history.pushState({ view: 'list' }, '', window.location.pathname);
      setModalState({
        isOpen: true,
        title: createMode === 'clone' ? 'Archetype Cloned (Local View)' : 'Archetype Created (Local View)',
        message: `Saved to browser view. Server note: ${err.message}`
      });
    }
  };

  // Handle Update from ArchetypeDetail edit view
  const handleUpdateArchetype = async (originalId, updatedRecord) => {
    const newArchId = (updatedRecord.archetypeId || updatedRecord.archtId || originalId).trim();
    const newCsclId = (updatedRecord.csclLaneId || updatedRecord.laneId || '').trim();
    const descValue = (updatedRecord.shortDesc || updatedRecord.shortDescription || '').trim();
    const projectValue = (updatedRecord.transcendPrj || updatedRecord.project || '').trim();
    const apsValue = (updatedRecord.ompRelevant || updatedRecord.apsRelevant || '').trim();

    // 1. Persist to Express backend / Azure SQL
    const res = await fetch(`http://localhost:5000/api/lane-headers/${encodeURIComponent(originalId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...updatedRecord,
        ARCHT_ID: newArchId,
        archetypeId: newArchId,
        CSCL_Lane_ID: newCsclId,
        csclLaneId: newCsclId,
        Short_desc: descValue,
        shortDesc: descValue,
        shortDescription: descValue,
        Owner: updatedRecord.owner,
        owner: updatedRecord.owner,
        Owner_role: updatedRecord.ownerRole,
        ownerRole: updatedRecord.ownerRole,
        Wave: updatedRecord.wave,
        wave: updatedRecord.wave,
        Prev_Wave_CSCL_ID: updatedRecord.prevWaveCsclId,
        prevWaveCsclId: updatedRecord.prevWaveCsclId,
        Nodes: typeof updatedRecord.nodesCount === 'string' ? updatedRecord.nodesCount : (Array.isArray(updatedRecord.nodes) ? `${updatedRecord.nodes.length} nodes defined` : '0 nodes defined'),
        nodesCount: typeof updatedRecord.nodesCount === 'string' ? updatedRecord.nodesCount : (Array.isArray(updatedRecord.nodes) ? `${updatedRecord.nodes.length} nodes defined` : '0 nodes defined'),
        Plan_GRP: updatedRecord.planGrp,
        planGrp: updatedRecord.planGrp,
        Franchise: updatedRecord.franchise,
        franchise: updatedRecord.franchise,
        PLAN_team: updatedRecord.planTeam,
        planTeam: updatedRecord.planTeam,
        TranSCend_PRJ: projectValue,
        project: projectValue,
        transcendPrj: projectValue,
        Comments: updatedRecord.comments,
        comments: updatedRecord.comments,
        SKU_Count: updatedRecord.skuCount !== undefined && updatedRecord.skuCount !== '' ? Number(updatedRecord.skuCount) : 0,
        skuCount: updatedRecord.skuCount !== undefined && updatedRecord.skuCount !== '' ? Number(updatedRecord.skuCount) : 0,
        Sales_Vol: updatedRecord.salesVol,
        salesVol: updatedRecord.salesVol,
        Tranactions_Vol: updatedRecord.transactionsVol,
        transactionsVol: updatedRecord.transactionsVol,
        OMP_relevant: apsValue,
        ompRelevant: apsValue,
        apsRelevant: apsValue,
        LEGO: updatedRecord.lego,
        lego: updatedRecord.lego,
        Returns: updatedRecord.returns,
        returns: updatedRecord.returns,
        Physical_flow: updatedRecord.physicalFlow,
        physicalFlow: updatedRecord.physicalFlow,
        Financial_flow: updatedRecord.financialFlow,
        financialFlow: updatedRecord.financialFlow,
        Description: updatedRecord.description,
        description: updatedRecord.description,
        File_link: updatedRecord.fileLink,
        fileLink: updatedRecord.fileLink,
        prj_arch_ID: updatedRecord.prjArchId,
        prjArchId: updatedRecord.prjArchId,
        Documentation: updatedRecord.documentation,
        documentation: updatedRecord.documentation,
        Status: updatedRecord.status || '00-New',
        status: updatedRecord.status || '00-New'
      })
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success) {
      const detail = json.error ? `: ${json.error}` : '';
      throw new Error((json.message || 'Failed to update archetype in database') + detail);
    }

    // Refresh database state
    fetchArchetypes();

    const hasVisio = Boolean((updatedRecord.fileLink || updatedRecord.attachmentName || updatedRecord.attachment || '').trim());
    const visioStatus = hasVisio ? 'Approval In Progress' : 'Not Uploaded';
    const visioClass = hasVisio ? 'in-progress' : 'not-uploaded';

    // 2. Update local state in allArchetypes
    setAllArchetypes((prev) =>
      prev.map((item) => {
        const itemId = item.archetypeId || item.archtId || item.code || item.id;
        if (itemId === originalId) {
          return {
            ...item,
            ...updatedRecord,
            id: newArchId,
            archetypeId: newArchId,
            archtId: newArchId,
            code: newArchId,
            codeLines: newArchId.includes('-') ? newArchId.split('-') : [newArchId],
            csclLaneId: newCsclId,
            laneId: newCsclId,
            shortDesc: descValue,
            shortDescription: descValue,
            description: updatedRecord.description || descValue,
            status: updatedRecord.status,
            pfcStatus: updatedRecord.status,
            pfcStatusClass: updatedRecord.status === 'Approved' ? 'status-dot-approved' : (updatedRecord.status === 'In Review' ? 'status-dot-review' : 'status-dot-new'),
            visioStatus,
            visioClass,
            updatedBy: updatedRecord.owner,
            owner: updatedRecord.owner,
            ownerRole: updatedRecord.ownerRole || '',
            franchise: updatedRecord.franchise || '',
            wave: updatedRecord.wave || '',
            prevWaveCsclId: updatedRecord.prevWaveCsclId || '',
            planGrp: updatedRecord.planGrp || '',
            planTeam: updatedRecord.planTeam || '',
            project: projectValue,
            transcendPrj: projectValue,
            comments: updatedRecord.comments || '',
            skuCount: updatedRecord.skuCount !== undefined ? Number(updatedRecord.skuCount) : 0,
            salesVol: updatedRecord.salesVol || '',
            transactionsVol: updatedRecord.transactionsVol || '',
            apsRelevant: apsValue,
            ompRelevant: apsValue,
            lego: updatedRecord.lego || '',
            returns: updatedRecord.returns || '',
            physicalFlow: updatedRecord.physicalFlow || '',
            financialFlow: updatedRecord.financialFlow || '',
            fileLink: updatedRecord.fileLink || '',
            prjArchId: updatedRecord.prjArchId || '',
            documentation: updatedRecord.documentation || '',
            lastUpdate: new Date().toISOString().slice(0, 10)
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
      archtId: newArchId,
      code: newArchId,
      codeLines: newArchId.includes('-') ? newArchId.split('-') : [newArchId],
      csclLaneId: newCsclId,
      laneId: newCsclId,
      shortDesc: descValue,
      shortDescription: descValue,
      description: updatedRecord.description || descValue,
      status: updatedRecord.status,
      pfcStatus: updatedRecord.status,
      pfcStatusClass: updatedRecord.status === 'Approved' ? 'status-dot-approved' : (updatedRecord.status === 'In Review' ? 'status-dot-review' : 'status-dot-new'),
      visioStatus,
      visioClass,
      updatedBy: updatedRecord.owner,
      owner: updatedRecord.owner,
      ownerRole: updatedRecord.ownerRole || '',
      franchise: updatedRecord.franchise || '',
      wave: updatedRecord.wave || '',
      prevWaveCsclId: updatedRecord.prevWaveCsclId || '',
      planGrp: updatedRecord.planGrp || '',
      planTeam: updatedRecord.planTeam || '',
      project: projectValue,
      transcendPrj: projectValue,
      comments: updatedRecord.comments || '',
      skuCount: updatedRecord.skuCount !== undefined ? Number(updatedRecord.skuCount) : 0,
      salesVol: updatedRecord.salesVol || '',
      transactionsVol: updatedRecord.transactionsVol || '',
      apsRelevant: apsValue,
      ompRelevant: apsValue,
      lego: updatedRecord.lego || '',
      returns: updatedRecord.returns || '',
      physicalFlow: updatedRecord.physicalFlow || '',
      financialFlow: updatedRecord.financialFlow || '',
      fileLink: updatedRecord.fileLink || '',
      prjArchId: updatedRecord.prjArchId || '',
      documentation: updatedRecord.documentation || '',
      lastUpdate: new Date().toISOString().slice(0, 10)
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
            if (currentView !== 'list') {
              setCurrentView('list');
              setSelectedArchetype(null);
              window.history.pushState({ view: 'list', tab }, '', window.location.pathname);
            }
          }}
        />

        {/* Main Content Workspace */}
        <main className="content-area">
          {currentView === 'create' ? (
            <CreateArchetype
              mode={createMode}
              referenceData={referenceArchetype || allArchetypes[0]}
              existingArchetypes={allArchetypes}
              onBack={handleInAppBack}
              onSave={handleSaveArchetype}
            />
          ) : currentView === 'detail' ? (
            <ArchetypeDetail
              archetype={selectedArchetype || allArchetypes[0]}
              allArchetypes={allArchetypes}
              onBack={handleInAppBack}
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
