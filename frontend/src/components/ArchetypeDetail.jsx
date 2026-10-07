import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  Edit2,
  Trash2,
  FileText,
  ChevronDown,
  Plus,
  X,
  Check,
  AlertCircle,
  Search
} from 'lucide-react';

import {
  OWNER_ROLE_OPTIONS,
  FRANCHISE_OPTIONS,
  STATUS_OPTIONS,
  WAVE_OPTIONS,
  PATTERN_ID_OPTIONS,
  NODE_TYPE_OPTIONS,
  NODE_PURPOSE_OPTIONS,
  INCO_TERM_OPTIONS,
  PLAN_GRP_OPTIONS,
  PLAN_TEAM_OPTIONS,
  PROJECT_OPTIONS,
  APS_RELEVANT_OPTIONS,
  RETURNS_OPTIONS,
  PHYSICAL_FLOW_OPTIONS,
  FINANCIAL_FLOW_OPTIONS
} from '../data/lovData';

export default function ArchetypeDetail({ archetype, allArchetypes = [], onBack, onSaveEdit }) {
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState('');

  // Editable form state initialized from archetype prop
  const [formData, setFormData] = useState({
    archetypeId: archetype?.archetypeId || archetype?.archtId || archetype?.code || archetype?.id || '',
    shortDesc: archetype?.shortDesc || archetype?.shortDescription || '',
    ownerRole: archetype?.ownerRole || '',
    owner: archetype?.owner || archetype?.ownerEmail || '',
    csclLaneId: archetype?.csclLaneId || archetype?.laneId || '',
    status: archetype?.status || archetype?.pfcStatus || '00-New',
    wave: archetype?.wave || '',
    prevWaveCsclId: archetype?.prevWaveCsclId || '',
    nodes: archetype?.nodes || `${archetype?.nodesCount || '0 nodes defined'}`,
    planGrp: archetype?.planGrp || '',
    franchise: archetype?.franchise || '',
    planTeam: archetype?.planTeam || '',
    transcendPrj: archetype?.transcendPrj || archetype?.project || '',
    comments: archetype?.comments || '',
    skuCount: archetype?.skuCount !== undefined && archetype?.skuCount !== null ? archetype?.skuCount : 0,
    salesVol: archetype?.salesVol || '',
    transactionsVol: archetype?.transactionsVol || '',
    ompRelevant: archetype?.ompRelevant || archetype?.apsRelevant || '',
    lego: archetype?.lego || '',
    returns: archetype?.returns || '',
    physicalFlow: archetype?.physicalFlow || archetype?.l1PhysicalFlow || '',
    financialFlow: archetype?.financialFlow || archetype?.l1FinancialFlow || '',
    description: archetype?.description || '',
    fileLink: archetype?.fileLink || archetype?.attachmentName || '',
    prjArchId: archetype?.prjArchId || '',
    documentation: archetype?.documentation || ''
  });

  // Only show counters and nodes that the user actually defined
  const [counters, setCounters] = useState(Array.isArray(archetype?.counters) ? archetype.counters : []);
  const [nodes, setNodes] = useState(Array.isArray(archetype?.nodes) ? archetype.nodes : []);
  const [selectedCounterId, setSelectedCounterId] = useState(
    Array.isArray(archetype?.counters) ? archetype.counters[0]?.counterId || '' : ''
  );

  // Sync state whenever selected archetype changes
  useEffect(() => {
    setFormData({
      archetypeId: archetype?.archetypeId || archetype?.archtId || archetype?.code || archetype?.id || '',
      shortDesc: archetype?.shortDesc || archetype?.shortDescription || '',
      ownerRole: archetype?.ownerRole || '',
      owner: archetype?.owner || archetype?.ownerEmail || '',
      csclLaneId: archetype?.csclLaneId || archetype?.laneId || '',
      status: archetype?.status || archetype?.pfcStatus || '00-New',
      wave: archetype?.wave || '',
      prevWaveCsclId: archetype?.prevWaveCsclId || '',
      nodes: typeof archetype?.nodes === 'string' ? archetype.nodes : `${archetype?.nodesCount || '0 nodes defined'}`,
      planGrp: archetype?.planGrp || '',
      franchise: archetype?.franchise || '',
      planTeam: archetype?.planTeam || '',
      transcendPrj: archetype?.transcendPrj || archetype?.project || '',
      comments: archetype?.comments || '',
      skuCount: archetype?.skuCount !== undefined && archetype?.skuCount !== null ? archetype?.skuCount : 0,
      salesVol: archetype?.salesVol || '',
      transactionsVol: archetype?.transactionsVol || '',
      ompRelevant: archetype?.ompRelevant || archetype?.apsRelevant || '',
      lego: archetype?.lego || '',
      returns: archetype?.returns || '',
      physicalFlow: archetype?.physicalFlow || archetype?.l1PhysicalFlow || '',
      financialFlow: archetype?.financialFlow || archetype?.l1FinancialFlow || '',
      description: archetype?.description || '',
      fileLink: archetype?.fileLink || archetype?.attachmentName || '',
      prjArchId: archetype?.prjArchId || '',
      documentation: archetype?.documentation || ''
    });
    const currentCounters = Array.isArray(archetype?.counters) ? archetype.counters : [];
    setCounters(currentCounters);
    setSelectedCounterId(currentCounters[0]?.counterId || '');
    setNodes(Array.isArray(archetype?.nodes) ? archetype.nodes : []);
    setIsEditing(false);
    setEditError('');
  }, [archetype]);

  // Modals for Counter & Node Edit/Add
  const [counterModal, setCounterModal] = useState({
    isOpen: false,
    isEdit: false,
    index: -1,
    data: { counterId: '', patternId: 'P-V-P', origin: '', destination: '', laneMaster: '' }
  });

  const [nodeModal, setNodeModal] = useState({
    isOpen: false,
    isEdit: false,
    index: -1,
    data: {
      archetype: '',
      uniqueId: '',
      nodeId: '',
      type: 'P',
      typeColor: 'purple',
      purpose: 'M',
      purposeColor: 'green',
      description: '',
      incoTerm: 'EXW'
    }
  });

  // Counter Handlers
  const handleRemoveCounter = (idx, e) => {
    e.stopPropagation();
    setCounters((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleOpenAddCounter = () => {
    const nextId = `CTR-00${counters.length + 1}`;
    setCounterModal({
      isOpen: true,
      isEdit: false,
      index: -1,
      data: { counterId: nextId, patternId: 'P-V-P', origin: '', destination: '', laneMaster: '' }
    });
  };

  const handleOpenEditCounter = (ctr, idx, e) => {
    e.stopPropagation();
    setCounterModal({
      isOpen: true,
      isEdit: true,
      index: idx,
      data: { ...ctr }
    });
  };

  const handleSaveCounterModal = (e) => {
    e.preventDefault();
    if (counterModal.isEdit) {
      setCounters((prev) =>
        prev.map((item, i) => (i === counterModal.index ? counterModal.data : item))
      );
    } else {
      setCounters((prev) => [...prev, counterModal.data]);
    }
    setCounterModal({ isOpen: false, isEdit: false, index: -1, data: {} });
  };

  // Node Handlers
  const handleRemoveNode = (idx, e) => {
    e.stopPropagation();
    setNodes((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleOpenAddNode = () => {
    const nextNum = String(nodes.length + 1).padStart(2, '0');
    setNodeModal({
      isOpen: true,
      isEdit: false,
      index: -1,
      data: {
        archetype: formData.archetypeId || 'ARC-0001',
        uniqueId: `NU-1002${nodes.length + 1}`,
        nodeId: nextNum,
        type: 'P',
        typeColor: 'purple',
        purpose: 'M',
        purposeColor: 'green',
        description: '',
        incoTerm: 'EXW'
      }
    });
  };

  const handleOpenEditNode = (node, idx, e) => {
    e.stopPropagation();
    setNodeModal({
      isOpen: true,
      isEdit: true,
      index: idx,
      data: { ...node }
    });
  };

  const handleSaveNodeModal = (e) => {
    e.preventDefault();
    if (nodeModal.isEdit) {
      setNodes((prev) =>
        prev.map((item, i) => (i === nodeModal.index ? nodeModal.data : item))
      );
    } else {
      setNodes((prev) => [...prev, nodeModal.data]);
    }
    setNodeModal({ isOpen: false, isEdit: false, index: -1, data: {} });
  };

  // Handle Cancel Edit
  const handleCancelEdit = () => {
    setFormData({
      archetypeId: archetype?.archetypeId || archetype?.archtId || archetype?.code || archetype?.id || '',
      shortDesc: archetype?.shortDesc || archetype?.shortDescription || '',
      ownerRole: archetype?.ownerRole || '',
      owner: archetype?.owner || archetype?.ownerEmail || '',
      csclLaneId: archetype?.csclLaneId || archetype?.laneId || '',
      status: archetype?.status || archetype?.pfcStatus || '00-New',
      wave: archetype?.wave || '',
      prevWaveCsclId: archetype?.prevWaveCsclId || '',
      nodes: archetype?.nodes || `${archetype?.nodesCount || '0 nodes defined'}`,
      planGrp: archetype?.planGrp || '',
      franchise: archetype?.franchise || '',
      planTeam: archetype?.planTeam || '',
      transcendPrj: archetype?.transcendPrj || archetype?.project || '',
      comments: archetype?.comments || '',
      skuCount: archetype?.skuCount !== undefined && archetype?.skuCount !== null ? archetype?.skuCount : 0,
      salesVol: archetype?.salesVol || '',
      transactionsVol: archetype?.transactionsVol || '',
      ompRelevant: archetype?.ompRelevant || archetype?.apsRelevant || '',
      lego: archetype?.lego || '',
      returns: archetype?.returns || '',
      physicalFlow: archetype?.physicalFlow || archetype?.l1PhysicalFlow || '',
      financialFlow: archetype?.financialFlow || archetype?.l1FinancialFlow || '',
      description: archetype?.description || '',
      fileLink: archetype?.fileLink || archetype?.attachmentName || '',
      prjArchId: archetype?.prjArchId || '',
      documentation: archetype?.documentation || ''
    });
    setCounters(Array.isArray(archetype?.counters) ? archetype.counters : []);
    setNodes(Array.isArray(archetype?.nodes) ? archetype.nodes : []);
    setEditError('');
    setIsEditing(false);
  };

  // Handle Save Edit with Uniqueness Validation
  const handleSaveEdit = async () => {
    setEditError('');
    const newArchId = formData.archetypeId?.trim();
    const newCsclId = formData.csclLaneId?.trim();
    const newOwner = formData.owner?.trim();

    if (!newArchId) {
      setEditError('Archetype ID is a required field.');
      return;
    }
    if (!newCsclId) {
      setEditError('CSCL Lane ID is a required field.');
      return;
    }

    const originalArchId = (archetype?.archetypeId || archetype?.archtId || archetype?.code || archetype?.id || '').trim();

    // 1. Check uniqueness of Archetype ID against all other existing archetypes
    const duplicateArch = allArchetypes.find((item) => {
      const itemArchId = (item.archetypeId || item.archtId || item.code || item.id || '').trim();
      return (
        itemArchId.toUpperCase() === newArchId.toUpperCase() &&
        itemArchId.toUpperCase() !== originalArchId.toUpperCase()
      );
    });

    if (duplicateArch) {
      setEditError(
        `Archetype ID "${newArchId}" already exists in the database. Archetype ID must be unique.`
      );
      return;
    }

    // 2. Check uniqueness of CSCL Lane ID against all other existing archetypes
    const duplicateCscl = allArchetypes.find((item) => {
      const itemArchId = (item.archetypeId || item.archtId || item.code || item.id || '').trim();
      const itemCsclId = (item.csclLaneId || item.laneId || '').trim();
      return (
        itemCsclId.toUpperCase() === newCsclId.toUpperCase() &&
        itemArchId.toUpperCase() !== originalArchId.toUpperCase()
      );
    });

    if (duplicateCscl) {
      setEditError(
        `CSCL Lane ID "${newCsclId}" already exists in the database. CSCL Lane ID must be unique.`
      );
      return;
    }

    // 3. Save updates
    try {
      setIsSaving(true);
      if (onSaveEdit) {
        await onSaveEdit(originalArchId, {
          ...formData,
          archetypeId: newArchId,
          csclLaneId: newCsclId,
          owner: newOwner,
          ownerRole: formData.ownerRole,
          franchise: formData.franchise,
          comments: formData.comments,
          nodesCount: `${nodes.length} nodes defined`,
          counters,
          nodes
        });
      }
      setIsEditing(false);
    } catch (err) {
      setEditError(err.message || 'Failed to update archetype in database.');
    } finally {
      setIsSaving(false);
    }
  };

  const displayArchId = formData.archetypeId || 'Archetype';

  return (
    <div className="archetype-detail-view">
      {/* Top Breadcrumb & Actions */}
      <div className="detail-top-bar">
        <div className="create-breadcrumb">
          <button type="button" className="btn-back-breadcrumb" onClick={onBack}>
            <ArrowLeft size={14} />
            <span>Back to Results</span>
          </button>
          <span className="breadcrumb-separator">|</span>
          <span className="breadcrumb-current">{displayArchId}</span>
        </div>

        <div className="detail-top-actions">
          {isEditing ? (
            <>
              <button
                type="button"
                className="btn-detail-cancel"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                <X size={13} />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                className="btn-detail-save"
                onClick={handleSaveEdit}
                disabled={isSaving}
              >
                <Check size={13} />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn-detail-download"
                onClick={() => alert('Download options for ' + displayArchId)}
              >
                <Download size={13} />
                <span>Download</span>
                <ChevronDown size={13} />
              </button>
              <button
                type="button"
                className="btn-detail-edit"
                onClick={() => {
                  setEditError('');
                  setIsEditing(true);
                }}
              >
                <Edit2 size={13} />
                <span>Edit</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Validation / Database Error Message */}
      {editError && (
        <div className="detail-error-banner">
          <AlertCircle size={16} />
          <span>{editError}</span>
        </div>
      )}

      {/* Page Title & Subtitle */}
      <div className="detail-page-heading">
        <h1>{formData.shortDescription || displayArchId}</h1>
        <p>Define a new CSCL Lane ID and its associated patterns and nodes.</p>
      </div>

      {/* 1. LANE HEADER CARD */}
      <div className="create-card">
        <div className="create-card-section-title">LANE HEADER</div>

        {/* SECTION 1: IDENTITY & OWNERSHIP */}
        <div className="detail-section-header">
          <span className="detail-section-title">IDENTITY & OWNERSHIP</span>
        </div>

        {/* Row 1: Archetype ID, Short Description, Owner Role */}
        <div className="create-grid-3">
          <div className="form-group">
            <label>
              Archetype ID <span className="req-asterisk">*</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.archetypeId}
                onChange={(e) => setFormData((p) => ({ ...p, archetypeId: e.target.value }))}
                className="form-control-edit"
                placeholder="A10B"
                required
              />
            ) : (
              <input
                type="text"
                value={formData.archetypeId || ''}
                readOnly
                className="read-only-input"
              />
            )}
          </div>

          <div className="form-group">
            <label>Short Description</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.shortDesc}
                onChange={(e) => setFormData((p) => ({ ...p, shortDesc: e.target.value }))}
                className="form-control-edit"
                placeholder="Juarez - Megadyne Steris - HCS"
              />
            ) : (
              <input
                type="text"
                value={formData.shortDesc || ''}
                readOnly
                className="read-only-input"
              />
            )}
          </div>

          <div className="form-group">
            <label>Owner Role</label>
            {isEditing ? (
              <select
                value={formData.ownerRole}
                onChange={(e) => setFormData((p) => ({ ...p, ownerRole: e.target.value }))}
                className="form-control-edit"
              >
                <option value="">Select Owner Role</option>
                {OWNER_ROLE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.ownerRole && !OWNER_ROLE_OPTIONS.includes(formData.ownerRole) && (
                  <option value={formData.ownerRole}>{formData.ownerRole}</option>
                )}
              </select>
            ) : (
              <input
                type="text"
                value={formData.ownerRole || ''}
                readOnly
                className="read-only-input"
                placeholder="Select Owner Role"
              />
            )}
          </div>
        </div>

        {/* Row 2: Owner *, CSCL Lane ID *, Status * */}
        <div className="create-grid-3" style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label>Owner</label>
            {isEditing ? (
              <div className="input-with-icon">
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => setFormData((p) => ({ ...p, owner: e.target.value }))}
                  className="form-control-edit"
                  placeholder="EGarci47@its.jnj.com"
                />
                <Search size={14} className="inner-search-icon" />
              </div>
            ) : (
              <input
                type="text"
                value={formData.owner || ''}
                readOnly
                className="read-only-input"
              />
            )}
          </div>

          <div className="form-group">
            <label>
              CSCL Lane ID <span className="req-asterisk">*</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.csclLaneId}
                onChange={(e) => setFormData((p) => ({ ...p, csclLaneId: e.target.value }))}
                className="form-control-edit"
                placeholder="0000010095"
                required
              />
            ) : (
              <input
                type="text"
                value={formData.csclLaneId || ''}
                readOnly
                className="read-only-input"
              />
            )}
          </div>

          <div className="form-group">
            <label>
              Status <span className="req-asterisk">*</span>
            </label>
            {isEditing ? (
              <select
                value={formData.status}
                onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                className="form-control-edit"
              >
                <option value="">Select Status</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.status && !STATUS_OPTIONS.includes(formData.status) && (
                  <option value={formData.status}>{formData.status}</option>
                )}
              </select>
            ) : (
              <input
                type="text"
                value={formData.status || ''}
                readOnly
                className="read-only-input"
              />
            )}
          </div>
        </div>

        {/* Row 3: Wave, Previous Wave CSCL ID, Nodes */}
        <div className="create-grid-3" style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label>Wave</label>
            {isEditing ? (
              <select
                value={formData.wave}
                onChange={(e) => setFormData((p) => ({ ...p, wave: e.target.value }))}
                className="form-control-edit"
              >
                <option value="">Select Wave</option>
                {WAVE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.wave && !WAVE_OPTIONS.includes(formData.wave) && (
                  <option value={formData.wave}>{formData.wave}</option>
                )}
              </select>
            ) : (
              <input
                type="text"
                value={formData.wave || ''}
                readOnly
                className="read-only-input"
                placeholder="Select Wave"
              />
            )}
          </div>

          <div className="form-group">
            <label>Previous Wave CSCL ID</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.prevWaveCsclId}
                onChange={(e) => setFormData((p) => ({ ...p, prevWaveCsclId: e.target.value }))}
                className="form-control-edit"
                placeholder="CSCL-PREV-000"
              />
            ) : (
              <input
                type="text"
                value={formData.prevWaveCsclId || ''}
                readOnly
                className="read-only-input"
                placeholder="CSCL-PREV-000"
              />
            )}
          </div>

          <div className="form-group">
            <label>Nodes</label>
            <input
              type="text"
              value={`${nodes.length} nodes defined`}
              readOnly
              className="read-only-input disabled-input"
              placeholder="Enter node information"
            />
          </div>
        </div>

        {/* Row 4: Plan GRP, Franchise */}
        <div className="create-grid-3" style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label>Plan GRP</label>
            {isEditing ? (
              <select
                value={formData.planGrp}
                onChange={(e) => setFormData((p) => ({ ...p, planGrp: e.target.value }))}
                className="form-control-edit"
              >
                <option value="">Select Plan GRP</option>
                {PLAN_GRP_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.planGrp && !PLAN_GRP_OPTIONS.includes(formData.planGrp) && (
                  <option value={formData.planGrp}>{formData.planGrp}</option>
                )}
              </select>
            ) : (
              <input
                type="text"
                value={formData.planGrp || ''}
                readOnly
                className="read-only-input"
                placeholder="Select Plan GRP"
              />
            )}
          </div>

          <div className="form-group">
            <label>Franchise</label>
            {isEditing ? (
              <select
                value={formData.franchise}
                onChange={(e) => setFormData((p) => ({ ...p, franchise: e.target.value }))}
                className="form-control-edit"
              >
                <option value="">Select Franchise</option>
                {FRANCHISE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.franchise && !FRANCHISE_OPTIONS.includes(formData.franchise) && (
                  <option value={formData.franchise}>{formData.franchise}</option>
                )}
              </select>
            ) : (
              <input
                type="text"
                value={formData.franchise || ''}
                readOnly
                className="read-only-input"
                placeholder="Select Franchise"
              />
            )}
          </div>
        </div>

        {/* SECTION 2: PLANNING & PROJECT */}
        <div className="detail-section-header" style={{ marginTop: '28px' }}>
          <span className="detail-section-title">PLANNING & PROJECT</span>
        </div>

        {/* Row 1: Plan Team, Project (TranSCend_PRJ) */}
        <div className="create-grid-2">
          <div className="form-group">
            <label>Plan Team</label>
            {isEditing ? (
              <select
                value={formData.planTeam}
                onChange={(e) => setFormData((p) => ({ ...p, planTeam: e.target.value }))}
                className="form-control-edit"
              >
                <option value="">Select Plan Team</option>
                {PLAN_TEAM_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.planTeam && !PLAN_TEAM_OPTIONS.includes(formData.planTeam) && (
                  <option value={formData.planTeam}>{formData.planTeam}</option>
                )}
              </select>
            ) : (
              <input
                type="text"
                value={formData.planTeam || ''}
                readOnly
                className="read-only-input"
                placeholder="Select Plan Team"
              />
            )}
          </div>

          <div className="form-group">
            <label>Project</label>
            {isEditing ? (
              <select
                value={formData.transcendPrj}
                onChange={(e) => setFormData((p) => ({ ...p, transcendPrj: e.target.value }))}
                className="form-control-edit"
              >
                <option value="">Select Project</option>
                {PROJECT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.transcendPrj && !PROJECT_OPTIONS.includes(formData.transcendPrj) && (
                  <option value={formData.transcendPrj}>{formData.transcendPrj}</option>
                )}
              </select>
            ) : (
              <input
                type="text"
                value={formData.transcendPrj || ''}
                readOnly
                className="read-only-input"
                placeholder="Select Project"
              />
            )}
          </div>
        </div>

        {/* Row 2: Comments */}
        <div className="form-group" style={{ marginTop: '16px' }}>
          <label>Comments</label>
          {isEditing ? (
            <textarea
              rows={3}
              value={formData.comments}
              onChange={(e) => setFormData((p) => ({ ...p, comments: e.target.value }))}
              className="form-control-edit"
              placeholder="Add planning notes or comments..."
              style={{ width: '100%', resize: 'vertical' }}
            />
          ) : (
            <textarea
              rows={3}
              value={formData.comments || ''}
              readOnly
              className="read-only-input"
              placeholder="Add planning notes or comments..."
              style={{ width: '100%', resize: 'none' }}
            />
          )}
        </div>

        {/* SECTION 3: VOLUMES & FLOW */}
        <div className="detail-section-header" style={{ marginTop: '28px' }}>
          <span className="detail-section-title">VOLUMES & FLOW</span>
        </div>

        {/* Row 1: SKU Count, Sales Volume, Transactions Volume */}
        <div className="create-grid-3">
          <div className="form-group">
            <label>SKU Count</label>
            {isEditing ? (
              <input
                type="number"
                value={formData.skuCount}
                onChange={(e) => setFormData((p) => ({ ...p, skuCount: e.target.value }))}
                className="form-control-edit"
                placeholder="0"
              />
            ) : (
              <input
                type="text"
                value={formData.skuCount !== undefined && formData.skuCount !== null ? formData.skuCount : '0'}
                readOnly
                className="read-only-input"
              />
            )}
          </div>

          <div className="form-group">
            <label>Sales Volume</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.salesVol}
                onChange={(e) => setFormData((p) => ({ ...p, salesVol: e.target.value }))}
                className="form-control-edit"
                placeholder="Annual sales volume"
              />
            ) : (
              <input
                type="text"
                value={formData.salesVol || ''}
                readOnly
                className="read-only-input"
                placeholder="Annual sales volume"
              />
            )}
          </div>

          <div className="form-group">
            <label>Transactions Volume</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.transactionsVol}
                onChange={(e) => setFormData((p) => ({ ...p, transactionsVol: e.target.value }))}
                className="form-control-edit"
                placeholder="Annual transaction volume"
              />
            ) : (
              <input
                type="text"
                value={formData.transactionsVol || ''}
                readOnly
                className="read-only-input"
                placeholder="Annual transaction volume"
              />
            )}
          </div>
        </div>

        {/* Row 2: APS Relevant (OMP_relevant), LEGO, Returns */}
        <div className="create-grid-3" style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label>APS Relevant</label>
            {isEditing ? (
              <select
                value={formData.ompRelevant}
                onChange={(e) => setFormData((p) => ({ ...p, ompRelevant: e.target.value }))}
                className="form-control-edit"
              >
                <option value="">Select APS Relevant</option>
                {APS_RELEVANT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.ompRelevant && !APS_RELEVANT_OPTIONS.includes(formData.ompRelevant) && (
                  <option value={formData.ompRelevant}>{formData.ompRelevant}</option>
                )}
              </select>
            ) : (
              <input
                type="text"
                value={formData.ompRelevant || ''}
                readOnly
                className="read-only-input"
                placeholder="Select APS Relevant"
              />
            )}
          </div>

          <div className="form-group">
            <label>LEGO</label>
            <div style={{ display: 'flex', alignItems: 'center', height: '38px', gap: '8px' }}>
              <input
                type="checkbox"
                id="lego-na"
                checked={formData.lego === 'Not Applicable' || formData.lego === true || formData.lego === 'true'}
                disabled={!isEditing}
                onChange={(e) => setFormData((p) => ({ ...p, lego: e.target.checked ? 'Not Applicable' : '' }))}
                style={{ width: '16px', height: '16px', cursor: isEditing ? 'pointer' : 'default' }}
              />
              <label
                htmlFor="lego-na"
                style={{ margin: 0, fontWeight: 500, cursor: isEditing ? 'pointer' : 'default', color: '#475569', fontSize: '13px' }}
              >
                Not Applicable
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Returns</label>
            {isEditing ? (
              <select
                value={formData.returns}
                onChange={(e) => setFormData((p) => ({ ...p, returns: e.target.value }))}
                className="form-control-edit"
              >
                <option value="">Select Returns</option>
                {RETURNS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.returns && !RETURNS_OPTIONS.includes(formData.returns) && (
                  <option value={formData.returns}>{formData.returns}</option>
                )}
              </select>
            ) : (
              <input
                type="text"
                value={formData.returns || ''}
                readOnly
                className="read-only-input"
                placeholder="Select Returns"
              />
            )}
          </div>
        </div>

        {/* Row 3: Physical Flow, Financial Flow */}
        <div className="create-grid-2" style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label>Physical Flow</label>
            {isEditing ? (
              <select
                value={formData.physicalFlow}
                onChange={(e) => setFormData((p) => ({ ...p, physicalFlow: e.target.value }))}
                className="form-control-edit"
              >
                <option value="">Select Physical Flow</option>
                {PHYSICAL_FLOW_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.physicalFlow && !PHYSICAL_FLOW_OPTIONS.includes(formData.physicalFlow) && (
                  <option value={formData.physicalFlow}>{formData.physicalFlow}</option>
                )}
              </select>
            ) : (
              <input
                type="text"
                value={formData.physicalFlow || ''}
                readOnly
                className="read-only-input"
                placeholder="Select Physical Flow"
              />
            )}
          </div>

          <div className="form-group">
            <label>Financial Flow</label>
            {isEditing ? (
              <select
                value={formData.financialFlow}
                onChange={(e) => setFormData((p) => ({ ...p, financialFlow: e.target.value }))}
                className="form-control-edit"
              >
                <option value="">Select Financial Flow</option>
                {FINANCIAL_FLOW_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.financialFlow && !FINANCIAL_FLOW_OPTIONS.includes(formData.financialFlow) && (
                  <option value={formData.financialFlow}>{formData.financialFlow}</option>
                )}
              </select>
            ) : (
              <input
                type="text"
                value={formData.financialFlow || ''}
                readOnly
                className="read-only-input"
                placeholder="Select Financial Flow"
              />
            )}
          </div>
        </div>

        {/* SECTION 4: DESCRIPTION & DOCUMENTATION */}
        <div className="detail-section-header" style={{ marginTop: '28px' }}>
          <span className="detail-section-title">DESCRIPTION & DOCUMENTATION</span>
        </div>

        {/* Row 1: Description */}
        <div className="form-group">
          <label>Description</label>
          {isEditing ? (
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              className="form-control-edit"
              placeholder="Describe the lane purpose and scope..."
              style={{ width: '100%', resize: 'vertical' }}
            />
          ) : (
            <textarea
              rows={3}
              value={formData.description || ''}
              readOnly
              className="read-only-input"
              placeholder="Describe the lane purpose and scope..."
              style={{ width: '100%', resize: 'none' }}
            />
          )}
        </div>

        {/* Row 2: File Link with Browse, Documentation */}
        <div className="create-grid-2" style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label>File Link</label>
            {isEditing ? (
              <div className="attachment-input-wrapper">
                <input
                  type="text"
                  value={formData.fileLink}
                  onChange={(e) => setFormData((p) => ({ ...p, fileLink: e.target.value }))}
                  className="form-control-edit"
                  placeholder="Document URL or filename"
                />
                <button
                  type="button"
                  className="btn-browse-file"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.onchange = (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData((p) => ({ ...p, fileLink: file.name }));
                      }
                    };
                    input.click();
                  }}
                >
                  Browse
                </button>
              </div>
            ) : formData.fileLink ? (
              <div className="detail-attachment-pill">
                <FileText size={14} className="attachment-icon" />
                <a
                  href="#download-file"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Opening ' + formData.fileLink);
                  }}
                  className="attachment-link"
                >
                  {formData.fileLink}
                </a>
              </div>
            ) : (
              <input
                type="text"
                value=""
                readOnly
                className="read-only-input"
                placeholder="Document URL or filename"
              />
            )}
          </div>

          <div className="form-group">
            <label>Documentation</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.documentation}
                onChange={(e) => setFormData((p) => ({ ...p, documentation: e.target.value }))}
                className="form-control-edit"
                placeholder="Documentation summary or reference..."
              />
            ) : (
              <input
                type="text"
                value={formData.documentation || ''}
                readOnly
                className="read-only-input"
                placeholder="Documentation summary or reference..."
              />
            )}
          </div>
        </div>

        {/* Row 3: Project Archetype ID */}
        <div className="form-group" style={{ marginTop: '16px', maxWidth: '32%' }}>
          <label>Project Archetype ID</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.prjArchId}
              onChange={(e) => setFormData((p) => ({ ...p, prjArchId: e.target.value }))}
              className="form-control-edit"
              placeholder="e.g. PRJ-ARCH-01"
            />
          ) : (
            <input
              type="text"
              value={formData.prjArchId || ''}
              readOnly
              className="read-only-input"
              placeholder="Not specified"
            />
          )}
        </div>
      </div>

      {/* 2. COUNTER CARD */}
      <div className="create-card">
        <div className="create-card-header-row">
          <div className="create-card-section-title">
            COUNTER <span className="label-badge">{Array.isArray(counters) ? counters.length : 0}</span>
          </div>
          {isEditing && (
            <button
              type="button"
              className="btn-secondary-action"
              onClick={handleOpenAddCounter}
            >
              <Plus size={14} />
              <span>Add</span>
            </button>
          )}
        </div>

        {(!Array.isArray(counters) || counters.length === 0) ? (
          <div className="detail-empty-box">
            <p>No counters defined yet for this archetype.</p>
            {isEditing && (
              <button
                type="button"
                className="btn-secondary-action"
                onClick={handleOpenAddCounter}
              >
                <Plus size={14} />
                <span>Add First Counter</span>
              </button>
            )}
          </div>
        ) : (
          <div className="table-wrapper detail-subtable-wrapper">
            <table className="detail-subtable">
              <thead>
                <tr>
                  <th>COUNTER ID</th>
                  <th>PATTERN ID</th>
                  <th>ORIGIN</th>
                  <th>DESTINATION</th>
                  <th>LANE MASTER</th>
                  {isEditing && <th style={{ textAlign: 'right', width: '80px' }}>ACTIONS</th>}
                </tr>
              </thead>
              <tbody>
                {counters.map((ctr, idx) => (
                  <tr
                    key={ctr.counterId || idx}
                    className={selectedCounterId === ctr.counterId ? 'detail-row-selected' : ''}
                    onClick={() => setSelectedCounterId(ctr.counterId)}
                  >
                    <td className="detail-cell-id">{ctr.counterId}</td>
                    <td>
                      <span className="detail-pattern-link">{ctr.patternId}</span>
                    </td>
                    <td>{ctr.origin}</td>
                    <td>{ctr.destination}</td>
                    <td>{ctr.laneMaster}</td>
                    {isEditing && (
                      <td style={{ textAlign: 'right' }}>
                        <div className="row-action-buttons">
                          <button
                            type="button"
                            className="btn-row-edit"
                            title="Edit Counter"
                            onClick={(e) => handleOpenEditCounter(ctr, idx, e)}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            className="btn-row-remove"
                            title="Remove Counter"
                            onClick={(e) => handleRemoveCounter(idx, e)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. NODES CARD */}
      <div className="create-card">
        <div className="create-card-header-row">
          <div className="create-card-section-title">
            NODES <span className="nodes-item-count">{Array.isArray(nodes) ? nodes.length : 0} items</span>
          </div>
          {isEditing && (
            <button
              type="button"
              className="btn-secondary-action"
              onClick={handleOpenAddNode}
            >
              <Plus size={14} />
              <span>Add</span>
            </button>
          )}
        </div>

        {(!Array.isArray(nodes) || nodes.length === 0) ? (
          <div className="detail-empty-box">
            <p>No nodes defined yet for this archetype.</p>
            {isEditing && (
              <button
                type="button"
                className="btn-secondary-action"
                onClick={handleOpenAddNode}
              >
                <Plus size={14} />
                <span>Add First Node</span>
              </button>
            )}
          </div>
        ) : (
          <div className="table-wrapper detail-subtable-wrapper">
            <table className="detail-subtable">
              <thead>
                <tr>
                  <th>ARCHETYPE</th>
                  <th>UNIQUE ID</th>
                  <th>NODE ID</th>
                  <th>TYPE</th>
                  <th>PURPOSE</th>
                  <th>DESCRIPTION</th>
                  <th>INCO TERM</th>
                  {isEditing && <th style={{ textAlign: 'right', width: '80px' }}>ACTIONS</th>}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(nodes) && nodes.map((node, idx) => (
                  <tr key={node.uniqueId || idx}>
                    <td>{node.archetype}</td>
                    <td>{node.uniqueId}</td>
                    <td>{node.nodeId}</td>
                    <td>
                      <span className={`circle-badge badge-${node.typeColor || 'purple'}`}>
                        {node.type}
                      </span>
                    </td>
                    <td>
                      <span className={`circle-badge badge-${node.purposeColor || 'green'}`}>
                        {node.purpose}
                      </span>
                    </td>
                    <td>{node.description}</td>
                    <td>{node.incoTerm}</td>
                    {isEditing && (
                      <td style={{ textAlign: 'right' }}>
                        <div className="row-action-buttons">
                          <button
                            type="button"
                            className="btn-row-edit"
                            title="Edit Node"
                            onClick={(e) => handleOpenEditNode(node, idx, e)}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            className="btn-row-remove"
                            title="Remove Node"
                            onClick={(e) => handleRemoveNode(idx, e)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom Back Button */}
      <div className="detail-bottom-footer">
        <button type="button" className="btn-back-footer" onClick={onBack}>
          <ArrowLeft size={14} />
          <span>Back to Results</span>
        </button>
      </div>

      {/* Edit / Add Counter Modal */}
      {counterModal.isOpen && (
        <div className="modal-backdrop">
          <div className="subitem-modal">
            <div className="modal-header">
              <h3>{counterModal.isEdit ? 'Edit Counter' : 'Add New Counter'}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setCounterModal({ isOpen: false, isEdit: false, index: -1, data: {} })}
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSaveCounterModal} className="modal-form-body">
              <div className="form-group">
                <label>Counter ID</label>
                <input
                  type="text"
                  required
                  value={counterModal.data.counterId}
                  onChange={(e) =>
                    setCounterModal((prev) => ({
                      ...prev,
                      data: { ...prev.data, counterId: e.target.value }
                    }))
                  }
                />
              </div>
              <div className="form-group">
                <label>Pattern ID</label>
                <select
                  value={counterModal.data.patternId}
                  onChange={(e) =>
                    setCounterModal((prev) => ({
                      ...prev,
                      data: { ...prev.data, patternId: e.target.value }
                    }))
                  }
                >
                  {PATTERN_ID_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="two-col-grid">
                <div className="form-group">
                  <label>Origin</label>
                  <input
                    type="text"
                    required
                    value={counterModal.data.origin}
                    onChange={(e) =>
                      setCounterModal((prev) => ({
                        ...prev,
                        data: { ...prev.data, origin: e.target.value }
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Destination</label>
                  <input
                    type="text"
                    required
                    value={counterModal.data.destination}
                    onChange={(e) =>
                      setCounterModal((prev) => ({
                        ...prev,
                        data: { ...prev.data, destination: e.target.value }
                      }))
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Lane Master</label>
                <input
                  type="text"
                  required
                  value={counterModal.data.laneMaster}
                  onChange={(e) =>
                    setCounterModal((prev) => ({
                      ...prev,
                      data: { ...prev.data, laneMaster: e.target.value }
                    }))
                  }
                />
              </div>
              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setCounterModal({ isOpen: false, isEdit: false, index: -1, data: {} })}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-apply">
                  {counterModal.isEdit ? 'Save Changes' : 'Add Counter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit / Add Node Modal */}
      {nodeModal.isOpen && (
        <div className="modal-backdrop">
          <div className="subitem-modal">
            <div className="modal-header">
              <h3>{nodeModal.isEdit ? 'Edit Node' : 'Add New Node'}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setNodeModal({ isOpen: false, isEdit: false, index: -1, data: {} })}
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSaveNodeModal} className="modal-form-body">
              <div className="two-col-grid">
                <div className="form-group">
                  <label>Unique ID</label>
                  <input
                    type="text"
                    required
                    value={nodeModal.data.uniqueId}
                    onChange={(e) =>
                      setNodeModal((prev) => ({
                        ...prev,
                        data: { ...prev.data, uniqueId: e.target.value }
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Node ID</label>
                  <input
                    type="text"
                    required
                    value={nodeModal.data.nodeId}
                    onChange={(e) =>
                      setNodeModal((prev) => ({
                        ...prev,
                        data: { ...prev.data, nodeId: e.target.value }
                      }))
                    }
                  />
                </div>
              </div>
              <div className="two-col-grid">
                <div className="form-group">
                  <label>Type (e.g. P or V)</label>
                  <select
                    value={nodeModal.data.type}
                    onChange={(e) => {
                      const val = e.target.value;
                      const matched = NODE_TYPE_OPTIONS.find((t) => t.code === val);
                      setNodeModal((prev) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          type: val,
                          typeColor: matched ? matched.color : 'purple'
                        }
                      }));
                    }}
                  >
                    {NODE_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.code} value={opt.code}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Purpose (e.g. M or DC)</label>
                  <select
                    value={nodeModal.data.purpose}
                    onChange={(e) => {
                      const val = e.target.value;
                      const matched = NODE_PURPOSE_OPTIONS.find((p) => p.code === val);
                      setNodeModal((prev) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          purpose: val,
                          purposeColor: matched ? matched.color : 'green'
                        }
                      }));
                    }}
                  >
                    {NODE_PURPOSE_OPTIONS.map((opt) => (
                      <option key={opt.code} value={opt.code}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  required
                  value={nodeModal.data.description}
                  onChange={(e) =>
                    setNodeModal((prev) => ({
                      ...prev,
                      data: { ...prev.data, description: e.target.value }
                    }))
                  }
                />
              </div>
              <div className="form-group">
                <label>Inco Term</label>
                <select
                  value={nodeModal.data.incoTerm}
                  onChange={(e) =>
                    setNodeModal((prev) => ({
                      ...prev,
                      data: { ...prev.data, incoTerm: e.target.value }
                    }))
                  }
                >
                  {INCO_TERM_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setNodeModal({ isOpen: false, isEdit: false, index: -1, data: {} })}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-apply">
                  {nodeModal.isEdit ? 'Save Changes' : 'Add Node'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
