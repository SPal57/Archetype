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
  AlertCircle
} from 'lucide-react';

import {
  OWNER_ROLE_OPTIONS,
  FRANCHISE_OPTIONS,
  STATUS_OPTIONS,
  WAVE_OPTIONS,
  PATTERN_ID_OPTIONS,
  NODE_TYPE_OPTIONS,
  NODE_PURPOSE_OPTIONS,
  INCO_TERM_OPTIONS
} from '../data/lovData';

export default function ArchetypeDetail({ archetype, allArchetypes = [], onBack, onSaveEdit }) {
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState('');

  // Editable form state initialized from archetype prop (no dummy fallbacks)
  const [formData, setFormData] = useState({
    archetypeId: archetype?.archetypeId || archetype?.code || archetype?.id || '',
    csclLaneId: archetype?.csclLaneId || archetype?.laneId || '',
    status: archetype?.status || archetype?.pfcStatus || 'Draft',
    owner: archetype?.owner || archetype?.ownerEmail || '',
    ownerRole: archetype?.ownerRole || '',
    franchise: archetype?.franchise || '',
    wave: archetype?.wave || '',
    shortDescription: archetype?.shortDescription || archetype?.description || '',
    legalEntities: archetype?.legalEntities || '',
    planTeam: archetype?.planTeam || '',
    planGrp: archetype?.planGrp || '',
    project: archetype?.project || '',
    attachmentName: archetype?.attachmentName || archetype?.attachment || '',
    l1PhysicalFlow: archetype?.l1PhysicalFlow || '',
    l1FinancialFlow: archetype?.l1FinancialFlow || '',
    comments: archetype?.comments || ''
  });

  // Only show counters and nodes that the user actually defined
  const [counters, setCounters] = useState(archetype?.counters || []);
  const [nodes, setNodes] = useState(archetype?.nodes || []);
  const [selectedCounterId, setSelectedCounterId] = useState(
    archetype?.counters?.[0]?.counterId || ''
  );

  // Sync state whenever selected archetype changes
  useEffect(() => {
    setFormData({
      archetypeId: archetype?.archetypeId || archetype?.code || archetype?.id || '',
      csclLaneId: archetype?.csclLaneId || archetype?.laneId || '',
      status: archetype?.status || archetype?.pfcStatus || 'Draft',
      owner: archetype?.owner || archetype?.ownerEmail || '',
      ownerRole: archetype?.ownerRole || '',
      franchise: archetype?.franchise || '',
      wave: archetype?.wave || '',
      shortDescription: archetype?.shortDescription || archetype?.description || '',
      legalEntities: archetype?.legalEntities || '',
      planTeam: archetype?.planTeam || '',
      planGrp: archetype?.planGrp || '',
      project: archetype?.project || '',
      attachmentName: archetype?.attachmentName || archetype?.attachment || '',
      l1PhysicalFlow: archetype?.l1PhysicalFlow || '',
      l1FinancialFlow: archetype?.l1FinancialFlow || '',
      comments: archetype?.comments || ''
    });
    const currentCounters = archetype?.counters || [];
    setCounters(currentCounters);
    setSelectedCounterId(currentCounters[0]?.counterId || '');
    setNodes(archetype?.nodes || []);
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
      archetypeId: archetype?.archetypeId || archetype?.code || archetype?.id || '',
      csclLaneId: archetype?.csclLaneId || archetype?.laneId || '',
      status: archetype?.status || archetype?.pfcStatus || 'Draft',
      owner: archetype?.owner || archetype?.ownerEmail || '',
      ownerRole: archetype?.ownerRole || '',
      franchise: archetype?.franchise || '',
      wave: archetype?.wave || '',
      shortDescription: archetype?.shortDescription || archetype?.description || '',
      legalEntities: archetype?.legalEntities || '',
      planTeam: archetype?.planTeam || '',
      planGrp: archetype?.planGrp || '',
      project: archetype?.project || '',
      attachmentName: archetype?.attachmentName || archetype?.attachment || '',
      l1PhysicalFlow: archetype?.l1PhysicalFlow || '',
      l1FinancialFlow: archetype?.l1FinancialFlow || '',
      comments: archetype?.comments || ''
    });
    setCounters(archetype?.counters || []);
    setNodes(archetype?.nodes || []);
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
    if (!newOwner) {
      setEditError('Owner is a required field.');
      return;
    }

    const originalArchId = (archetype?.archetypeId || archetype?.code || archetype?.id || '').trim();

    // 1. Check uniqueness of Archetype ID against all other existing archetypes
    const duplicateArch = allArchetypes.find((item) => {
      const itemArchId = (item.archetypeId || item.code || item.id || '').trim();
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
      const itemArchId = (item.archetypeId || item.code || item.id || '').trim();
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

        {/* Row 1: 3 columns */}
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
                placeholder="e.g. ARC-0001"
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
            <label>
              CSCL Lane ID <span className="req-asterisk">*</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.csclLaneId}
                onChange={(e) => setFormData((p) => ({ ...p, csclLaneId: e.target.value }))}
                className="form-control-edit"
                placeholder="e.g. CSCL-1001"
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
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
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

        {/* Row 2: Owner, Owner Role (Dropdown), Wave */}
        <div className="create-grid-3" style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label>
              Owner <span className="req-asterisk">*</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData((p) => ({ ...p, owner: e.target.value }))}
                className="form-control-edit"
                placeholder="Owner email (e.g. user@jnj.com)"
                required
              />
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
                placeholder="Not specified"
              />
            )}
          </div>
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
              </select>
            ) : (
              <input
                type="text"
                value={formData.wave || ''}
                readOnly
                className="read-only-input"
              />
            )}
          </div>
        </div>

        {/* Row 3: Franchise (Dropdown), Short Description */}
        <div className="create-grid-3" style={{ marginTop: '16px' }}>
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
                placeholder="Not specified"
              />
            )}
          </div>
          <div className="form-group span-2">
            <label>Short Description</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => setFormData((p) => ({ ...p, shortDescription: e.target.value }))}
                className="form-control-edit"
                placeholder="Brief summary of archetype"
              />
            ) : (
              <input
                type="text"
                value={formData.shortDescription || ''}
                readOnly
                className="read-only-input"
              />
            )}
          </div>
        </div>

        {/* Row 4: Legal Entities */}
        <div className="form-group" style={{ marginTop: '16px' }}>
          <label>Legal Entities</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.legalEntities}
              onChange={(e) => setFormData((p) => ({ ...p, legalEntities: e.target.value }))}
              className="form-control-edit"
              placeholder="e.g. Johnson & Johnson Global Supply Chain"
            />
          ) : (
            <input
              type="text"
              value={formData.legalEntities || ''}
              readOnly
              className="read-only-input"
            />
          )}
        </div>

        {/* Row 5: Plan Team, Plan GRP, Project */}
        <div className="create-grid-3" style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label>Plan Team</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.planTeam}
                onChange={(e) => setFormData((p) => ({ ...p, planTeam: e.target.value }))}
                className="form-control-edit"
                placeholder="Plan team"
              />
            ) : (
              <input
                type="text"
                value={formData.planTeam || ''}
                readOnly
                className="read-only-input"
              />
            )}
          </div>
          <div className="form-group">
            <label>Plan GRP</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.planGrp}
                onChange={(e) => setFormData((p) => ({ ...p, planGrp: e.target.value }))}
                className="form-control-edit"
                placeholder="Plan GRP"
              />
            ) : (
              <input
                type="text"
                value={formData.planGrp || ''}
                readOnly
                className="read-only-input"
              />
            )}
          </div>
          <div className="form-group">
            <label>Project</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.project}
                onChange={(e) => setFormData((p) => ({ ...p, project: e.target.value }))}
                className="form-control-edit"
                placeholder="Project name or code"
              />
            ) : (
              <input
                type="text"
                value={formData.project || ''}
                readOnly
                className="read-only-input"
              />
            )}
          </div>
        </div>

        {/* Row 6: Nodes, Attachment, L1 Physical Flow */}
        <div className="create-grid-3" style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label>
              Nodes <span className="label-badge">{nodes.length}</span>
            </label>
            <input
              type="text"
              value={`${nodes.length} nodes defined`}
              readOnly
              className="read-only-input"
            />
          </div>
          <div className="form-group">
            <label>Attachment</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.attachmentName}
                onChange={(e) => setFormData((p) => ({ ...p, attachmentName: e.target.value }))}
                className="form-control-edit"
                placeholder="Attachment file name (e.g. Visio_Specs.vsdx)"
              />
            ) : formData.attachmentName ? (
              <div className="detail-attachment-pill">
                <FileText size={14} className="attachment-icon" />
                <a
                  href="#download-spec"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Opening ' + formData.attachmentName);
                  }}
                  className="attachment-link"
                >
                  {formData.attachmentName}
                </a>
              </div>
            ) : (
              <input
                type="text"
                value=""
                placeholder="No file attached"
                readOnly
                className="read-only-input"
              />
            )}
          </div>
          <div className="form-group">
            <label>L1 Physical Flow</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.l1PhysicalFlow}
                onChange={(e) => setFormData((p) => ({ ...p, l1PhysicalFlow: e.target.value }))}
                className="form-control-edit"
                placeholder="L1 Physical Flow"
              />
            ) : (
              <input
                type="text"
                value={formData.l1PhysicalFlow || ''}
                readOnly
                className="read-only-input"
              />
            )}
          </div>
        </div>

        {/* Row 7: L1 Financial Flow */}
        <div className="form-group" style={{ marginTop: '16px', maxWidth: '32%' }}>
          <label>L1 Financial Flow</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.l1FinancialFlow}
              onChange={(e) => setFormData((p) => ({ ...p, l1FinancialFlow: e.target.value }))}
              className="form-control-edit"
              placeholder="L1 Financial Flow"
            />
          ) : (
            <input
              type="text"
              value={formData.l1FinancialFlow || ''}
              readOnly
              className="read-only-input"
            />
          )}
        </div>

        {/* Row 8: Comments */}
        <div className="form-group" style={{ marginTop: '16px' }}>
          <label>Comments</label>
          {isEditing ? (
            <textarea
              rows={3}
              value={formData.comments}
              onChange={(e) => setFormData((p) => ({ ...p, comments: e.target.value }))}
              className="form-control-edit"
              placeholder="Add notes, operational comments or remarks..."
              style={{ width: '100%', resize: 'vertical' }}
            />
          ) : (
            <textarea
              rows={3}
              value={formData.comments || ''}
              readOnly
              className="read-only-input"
              placeholder="No comments added"
              style={{ width: '100%', resize: 'none' }}
            />
          )}
        </div>
      </div>

      {/* 2. COUNTER CARD */}
      <div className="create-card">
        <div className="create-card-header-row">
          <div className="create-card-section-title">
            COUNTER <span className="label-badge">{counters.length}</span>
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

        {counters.length === 0 ? (
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
            NODES <span className="nodes-item-count">{nodes.length} items</span>
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

        {nodes.length === 0 ? (
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
                {nodes.map((node, idx) => (
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
