import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Plus, Trash2, Edit2, Download, ChevronDown, Check, X, FileText } from 'lucide-react';

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

export default function CreateArchetype({
  mode = 'blank', // 'blank' | 'clone'
  referenceData = null,
  existingArchetypes = [],
  onBack,
  onSave
}) {
  const isClone = mode === 'clone';
  const refCode = referenceData?.code || referenceData?.archetypeId || referenceData?.id || 'Selected Archetype';

  // Form Fields State
  const [formData, setFormData] = useState(() => {
    if (isClone && referenceData) {
      return {
        archetypeId: '',
        shortDesc: '',
        ownerRole: referenceData.ownerRole || '',
        owner: referenceData.owner || referenceData.ownerEmail || '',
        csclLaneId: '',
        status: referenceData.status || referenceData.pfcStatus || '00-New',
        wave: referenceData.wave || '',
        prevWaveCsclId: '',
        nodes: `${referenceData.nodes?.length || 0} nodes defined`,
        planGrp: referenceData.planGrp || '',
        franchise: referenceData.franchise || '',
        planTeam: referenceData.planTeam || '',
        transcendPrj: referenceData.transcendPrj || referenceData.project || '',
        comments: referenceData.comments || '',
        skuCount: referenceData.skuCount !== undefined && referenceData.skuCount !== null ? referenceData.skuCount : 0,
        salesVol: referenceData.salesVol || '',
        transactionsVol: referenceData.transactionsVol || '',
        ompRelevant: referenceData.ompRelevant || referenceData.apsRelevant || '',
        lego: referenceData.lego || '',
        returns: referenceData.returns || '',
        physicalFlow: referenceData.physicalFlow || referenceData.l1PhysicalFlow || '',
        financialFlow: referenceData.financialFlow || referenceData.l1FinancialFlow || '',
        description: referenceData.description || '',
        fileLink: referenceData.fileLink || referenceData.attachmentName || '',
        prjArchId: referenceData.prjArchId || '',
        documentation: referenceData.documentation || ''
      };
    }
    return {
      archetypeId: '',
      shortDesc: '',
      ownerRole: '',
      owner: '',
      csclLaneId: '',
      status: '00-New',
      wave: '',
      prevWaveCsclId: '',
      nodes: '0 nodes defined',
      planGrp: '',
      franchise: '',
      planTeam: '',
      transcendPrj: '',
      comments: '',
      skuCount: 0,
      salesVol: '',
      transactionsVol: '',
      ompRelevant: '',
      lego: '',
      returns: '',
      physicalFlow: '',
      financialFlow: '',
      description: '',
      fileLink: '',
      prjArchId: '',
      documentation: ''
    };
  });

  // Counters State
  const [counters, setCounters] = useState(() => (
    isClone && Array.isArray(referenceData?.counters) ? [...referenceData.counters] : []
  ));

  // Nodes State
  const [nodes, setNodes] = useState(() => (
    isClone && Array.isArray(referenceData?.nodes) ? [...referenceData.nodes] : []
  ));

  // Errors state
  const [errors, setErrors] = useState({});

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

  // Initialize data on mount or when mode/referenceData changes
  useEffect(() => {
    if (isClone && referenceData) {
      setFormData({
        archetypeId: '',
        shortDesc: '',
        ownerRole: referenceData.ownerRole || '',
        owner: referenceData.owner || referenceData.ownerEmail || '',
        csclLaneId: '',
        status: referenceData.status || referenceData.pfcStatus || '00-New',
        wave: referenceData.wave || '',
        prevWaveCsclId: '',
        nodes: `${referenceData.nodes?.length || 0} nodes defined`,
        planGrp: referenceData.planGrp || '',
        franchise: referenceData.franchise || '',
        planTeam: referenceData.planTeam || '',
        transcendPrj: referenceData.transcendPrj || referenceData.project || '',
        comments: referenceData.comments || '',
        skuCount: referenceData.skuCount !== undefined && referenceData.skuCount !== null ? referenceData.skuCount : 0,
        salesVol: referenceData.salesVol || '',
        transactionsVol: referenceData.transactionsVol || '',
        ompRelevant: referenceData.ompRelevant || referenceData.apsRelevant || '',
        lego: referenceData.lego || '',
        returns: referenceData.returns || '',
        physicalFlow: referenceData.physicalFlow || referenceData.l1PhysicalFlow || '',
        financialFlow: referenceData.financialFlow || referenceData.l1FinancialFlow || '',
        description: referenceData.description || '',
        fileLink: referenceData.fileLink || referenceData.attachmentName || '',
        prjArchId: referenceData.prjArchId || '',
        documentation: referenceData.documentation || ''
      });

      // Copy actual counters and nodes (empty array if reference has none)
      setCounters(Array.isArray(referenceData.counters) ? [...referenceData.counters] : []);
      setNodes(Array.isArray(referenceData.nodes) ? [...referenceData.nodes] : []);
    } else {
      setFormData({
        archetypeId: '',
        shortDesc: '',
        ownerRole: '',
        owner: '',
        csclLaneId: '',
        status: '00-New',
        wave: '',
        prevWaveCsclId: '',
        nodes: '0 nodes defined',
        planGrp: '',
        franchise: '',
        planTeam: '',
        transcendPrj: '',
        comments: '',
        skuCount: 0,
        salesVol: '',
        transactionsVol: '',
        ompRelevant: '',
        lego: '',
        returns: '',
        physicalFlow: '',
        financialFlow: '',
        description: '',
        fileLink: '',
        prjArchId: '',
        documentation: ''
      });
      setCounters([]);
      setNodes([]);
    }
    setErrors({});
  }, [isClone, referenceData]);

  // Helper to format Description as [Arch ID] Short description Lane ID
  const computeDescription = (archId, sDesc, laneId) => {
    const cleanArch = (archId || '').trim();
    const cleanShort = (sDesc || '').trim();
    const cleanLane = (laneId || '').trim();
    const archPart = cleanArch ? `[${cleanArch}]` : '';
    return [archPart, cleanShort, cleanLane].filter(Boolean).join(' ');
  };

  // Keep Description and Project Archetype ID automatically synchronized
  useEffect(() => {
    const computedDesc = computeDescription(formData.archetypeId, formData.shortDesc, formData.csclLaneId);
    const computedPrj = formData.archetypeId ? formData.archetypeId.trim() : '';

    if (formData.description !== computedDesc || formData.prjArchId !== computedPrj) {
      setFormData((prev) => ({
        ...prev,
        description: computedDesc,
        prjArchId: computedPrj
      }));
    }
  }, [formData.archetypeId, formData.shortDesc, formData.csclLaneId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newVal = type === 'checkbox' ? (checked ? 'Not Applicable' : '') : value;

    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: newVal
      };
      if (name === 'archetypeId') {
        next.prjArchId = newVal.trim();
      }
      if (name === 'archetypeId' || name === 'shortDesc' || name === 'csclLaneId') {
        next.description = computeDescription(
          name === 'archetypeId' ? newVal : next.archetypeId,
          name === 'shortDesc' ? newVal : next.shortDesc,
          name === 'csclLaneId' ? newVal : next.csclLaneId
        );
      }
      return next;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle Form Submission with Strict Uniqueness Validation
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Mandatory fields: Archetype ID, Short Description, and CSCL Lane ID
    if (!formData.archetypeId.trim()) {
      newErrors.archetypeId = 'Archetype ID is required';
    }
    if (!formData.shortDesc.trim()) {
      newErrors.shortDesc = 'Short Description is required';
    }
    if (!formData.csclLaneId.trim()) {
      newErrors.csclLaneId = 'CSCL Lane ID is required';
    }

    const targetArchId = formData.archetypeId.trim().toUpperCase();
    const targetCsclId = formData.csclLaneId.trim().toUpperCase();

    // Check Archetype ID uniqueness against existing archetypes
    if (targetArchId) {
      const duplicateArchetype = existingArchetypes.find(
        (a) => (a.code || a.archetypeId || a.archtId || a.id)?.trim().toUpperCase() === targetArchId
      );
      if (duplicateArchetype) {
        newErrors.archetypeId = `Archetype ID "${formData.archetypeId.trim()}" already exists. Please enter a unique ID.`;
      }
    }

    // Check CSCL Lane ID uniqueness against existing archetypes
    if (targetCsclId) {
      const duplicateLane = existingArchetypes.find(
        (a) => (a.laneId || a.csclLaneId)?.trim().toUpperCase() === targetCsclId
      );
      if (duplicateLane) {
        newErrors.csclLaneId = `CSCL Lane ID "${formData.csclLaneId.trim()}" already exists. Please enter a unique ID.`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalDescription = computeDescription(formData.archetypeId, formData.shortDesc, formData.csclLaneId);
    const finalPrjArchId = formData.archetypeId.trim();

    if (onSave) {
      onSave({
        ...formData,
        description: finalDescription,
        prjArchId: finalPrjArchId,
        shortDescription: formData.shortDesc,
        project: formData.transcendPrj,
        apsRelevant: formData.ompRelevant,
        nodesCount: `${nodes.length} nodes defined`,
        counters,
        nodes
      });
    }
  };

  // Counter Handlers
  const handleRemoveCounter = (idx) => {
    setCounters((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleOpenAddCounter = () => {
    const nextId = `CTR-00${counters.length + 1}`;
    setCounterModal({
      isOpen: true,
      isEdit: false,
      index: -1,
      data: { counterId: nextId, patternId: 'P-V-P', origin: 'M', destination: 'DC', laneMaster: 'LM-104' }
    });
  };

  const handleOpenEditCounter = (ctr, idx) => {
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
  const handleRemoveNode = (idx) => {
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
        description: 'New Fulfillment Node',
        incoTerm: 'DAP'
      }
    });
  };

  const handleOpenEditNode = (node, idx) => {
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

  return (
    <div className="create-archetype-view">
      {/* Top Breadcrumb & Actions */}
      <div className="detail-top-bar">
        <div className="create-breadcrumb">
          <button type="button" className="btn-back-breadcrumb" onClick={onBack}>
            <ArrowLeft size={14} />
            <span>Back to Results</span>
          </button>
          <span className="breadcrumb-separator">|</span>
          <span className="breadcrumb-current">
            {isClone ? `Cloning ${refCode}` : 'New Archetype'}
          </span>
        </div>

        {isClone && (
          <div className="detail-top-actions">
            <button
              type="button"
              className="btn-detail-download"
              onClick={() => alert(`Downloading specification for ${refCode}`)}
            >
              <Download size={13} />
              <span>Download</span>
              <ChevronDown size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Page Header */}
      <div className="create-page-header">
        <h1>{isClone ? `Clone — ${refCode}` : 'Create Archetype'}</h1>
        <p>Define a new CSCL Lane ID and its associated patterns and nodes.</p>
      </div>

      {isClone && (
        <div className="clone-info-alert">
          <div className="clone-alert-text">
            <strong>Clone with Reference Mode:</strong> All lane attributes, counters, and nodes have been copied from <code>{refCode}</code>.
            Please manually enter a unique <strong>Archetype ID</strong> and <strong>CSCL Lane ID</strong>.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Card 1: LANE HEADER */}
        <div className="create-card">
          <div className="create-card-section-title">LANE HEADER</div>

          {/* SECTION 1: IDENTITY & OWNERSHIP */}
          <div className="detail-section-header">
            <span className="detail-section-title">IDENTITY & OWNERSHIP</span>
          </div>

          {/* Row 1: Archetype ID, Short Description, Owner Role */}
          <div className="create-grid-3">
            <div className={`form-group ${errors.archetypeId ? 'has-error' : ''}`}>
              <label htmlFor="archetypeId">
                Archetype ID <span className="req-asterisk">*</span>
              </label>
              <input
                type="text"
                id="archetypeId"
                name="archetypeId"
                placeholder="Enter Archetype ID"
                value={formData.archetypeId}
                onChange={handleChange}
              />
              {errors.archetypeId && (
                <span className="error-hint">{errors.archetypeId}</span>
              )}
            </div>

            <div className={`form-group ${errors.shortDesc ? 'has-error' : ''}`}>
              <label htmlFor="shortDesc">
                Short Description <span className="req-asterisk">*</span>
              </label>
              <input
                type="text"
                id="shortDesc"
                name="shortDesc"
                placeholder="Enter Short Description"
                value={formData.shortDesc}
                onChange={handleChange}
              />
              {errors.shortDesc && (
                <span className="error-hint">{errors.shortDesc}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="ownerRole">Owner Role</label>
              <select
                id="ownerRole"
                name="ownerRole"
                value={formData.ownerRole}
                onChange={handleChange}
              >
                <option value="">Select Owner Role</option>
                {OWNER_ROLE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.ownerRole && !OWNER_ROLE_OPTIONS.includes(formData.ownerRole) && (
                  <option value={formData.ownerRole}>{formData.ownerRole}</option>
                )}
              </select>
            </div>
          </div>

          {/* Row 2: Owner *, CSCL Lane ID *, Status * */}
          <div className="create-grid-3" style={{ marginTop: '16px' }}>
            <div className={`form-group ${errors.owner ? 'has-error' : ''}`}>
              <label htmlFor="owner">
                Owner
              </label>
              <div className="input-with-icon">
                <input
                  type="text"
                  id="owner"
                  name="owner"
                  placeholder="Enter Owner email"
                  value={formData.owner}
                  onChange={handleChange}
                />
                <Search size={14} className="inner-search-icon" />
              </div>
              {errors.owner && (
                <span className="error-hint">{errors.owner}</span>
              )}
            </div>

            <div className={`form-group ${errors.csclLaneId ? 'has-error' : ''}`}>
              <label htmlFor="csclLaneId">
                CSCL Lane ID <span className="req-asterisk">*</span>
              </label>
              <input
                type="text"
                id="csclLaneId"
                name="csclLaneId"
                placeholder="Enter CSCL Lane ID"
                value={formData.csclLaneId}
                onChange={handleChange}
              />
              {errors.csclLaneId && (
                <span className="error-hint">{errors.csclLaneId}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.status && !STATUS_OPTIONS.includes(formData.status) && (
                  <option value={formData.status}>{formData.status}</option>
                )}
              </select>
            </div>
          </div>

          {/* Row 3: Wave, Previous Wave CSCL ID, Nodes */}
          <div className="create-grid-3" style={{ marginTop: '16px' }}>
            <div className="form-group">
              <label htmlFor="wave">Wave</label>
              <select
                id="wave"
                name="wave"
                value={formData.wave}
                onChange={handleChange}
              >
                <option value="">Select Wave</option>
                {WAVE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.wave && !WAVE_OPTIONS.includes(formData.wave) && (
                  <option value={formData.wave}>{formData.wave}</option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="prevWaveCsclId">Previous Wave CSCL ID</label>
              <input
                type="text"
                id="prevWaveCsclId"
                name="prevWaveCsclId"
                placeholder="Enter Previous Wave CSCL ID"
                value={formData.prevWaveCsclId}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="nodesCount">
                Nodes <span className="label-badge">{nodes.length}</span>
              </label>
              <input
                type="text"
                id="nodesCount"
                value={`${nodes.length} nodes defined`}
                disabled
                className="disabled-input"
                placeholder="Enter node information"
              />
            </div>
          </div>

          {/* Row 4: Plan GRP, Franchise */}
          <div className="create-grid-3" style={{ marginTop: '16px' }}>
            <div className="form-group">
              <label htmlFor="planGrp">Plan GRP</label>
              <select
                id="planGrp"
                name="planGrp"
                value={formData.planGrp}
                onChange={handleChange}
              >
                <option value="">Select Plan GRP</option>
                {PLAN_GRP_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.planGrp && !PLAN_GRP_OPTIONS.includes(formData.planGrp) && (
                  <option value={formData.planGrp}>{formData.planGrp}</option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="franchise">Franchise</label>
              <select
                id="franchise"
                name="franchise"
                value={formData.franchise}
                onChange={handleChange}
              >
                <option value="">Select Franchise</option>
                {FRANCHISE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.franchise && !FRANCHISE_OPTIONS.includes(formData.franchise) && (
                  <option value={formData.franchise}>{formData.franchise}</option>
                )}
              </select>
            </div>
          </div>

          {/* SECTION 2: PLANNING & PROJECT */}
          <div className="detail-section-header" style={{ marginTop: '28px' }}>
            <span className="detail-section-title">PLANNING & PROJECT</span>
          </div>

          {/* Row 1: Plan Team, Project (TranSCend_PRJ) */}
          <div className="create-grid-2">
            <div className="form-group">
              <label htmlFor="planTeam">Plan Team</label>
              <select
                id="planTeam"
                name="planTeam"
                value={formData.planTeam}
                onChange={handleChange}
              >
                <option value="">Select Plan Team</option>
                {PLAN_TEAM_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.planTeam && !PLAN_TEAM_OPTIONS.includes(formData.planTeam) && (
                  <option value={formData.planTeam}>{formData.planTeam}</option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="transcendPrj">Project</label>
              <select
                id="transcendPrj"
                name="transcendPrj"
                value={formData.transcendPrj}
                onChange={handleChange}
              >
                <option value="">Select Project</option>
                {PROJECT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.transcendPrj && !PROJECT_OPTIONS.includes(formData.transcendPrj) && (
                  <option value={formData.transcendPrj}>{formData.transcendPrj}</option>
                )}
              </select>
            </div>
          </div>

          {/* Row 2: Comments */}
          <div className="form-group" style={{ marginTop: '16px' }}>
            <label htmlFor="comments">Comments</label>
            <textarea
              id="comments"
              name="comments"
              rows={3}
              placeholder="Add planning notes or comments..."
              value={formData.comments}
              onChange={handleChange}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          {/* SECTION 3: VOLUMES & FLOW */}
          <div className="detail-section-header" style={{ marginTop: '28px' }}>
            <span className="detail-section-title">VOLUMES & FLOW</span>
          </div>

          {/* Row 1: SKU Count, Sales Volume, Transactions Volume */}
          <div className="create-grid-3">
            <div className="form-group">
              <label htmlFor="skuCount">SKU Count</label>
              <input
                type="number"
                id="skuCount"
                name="skuCount"
                placeholder="0"
                value={formData.skuCount}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="salesVol">Sales Volume</label>
              <input
                type="text"
                id="salesVol"
                name="salesVol"
                placeholder="Annual sales volume"
                value={formData.salesVol}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="transactionsVol">Transactions Volume</label>
              <input
                type="text"
                id="transactionsVol"
                name="transactionsVol"
                placeholder="Annual transaction volume"
                value={formData.transactionsVol}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 2: APS Relevant (OMP_relevant), LEGO, Returns */}
          <div className="create-grid-3" style={{ marginTop: '16px' }}>
            <div className="form-group">
              <label htmlFor="ompRelevant">APS Relevant</label>
              <select
                id="ompRelevant"
                name="ompRelevant"
                value={formData.ompRelevant}
                onChange={handleChange}
              >
                <option value="">Select APS Relevant</option>
                {APS_RELEVANT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.ompRelevant && !APS_RELEVANT_OPTIONS.includes(formData.ompRelevant) && (
                  <option value={formData.ompRelevant}>{formData.ompRelevant}</option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label>LEGO</label>
              <div style={{ display: 'flex', alignItems: 'center', height: '38px', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="lego-create"
                  name="lego"
                  checked={formData.lego === 'Not Applicable' || formData.lego === true}
                  onChange={handleChange}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label
                  htmlFor="lego-create"
                  style={{ margin: 0, fontWeight: 500, cursor: 'pointer', color: '#475569', fontSize: '13px' }}
                >
                  Not Applicable
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="returns">Returns</label>
              <select
                id="returns"
                name="returns"
                value={formData.returns}
                onChange={handleChange}
              >
                <option value="">Select Returns</option>
                {RETURNS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.returns && !RETURNS_OPTIONS.includes(formData.returns) && (
                  <option value={formData.returns}>{formData.returns}</option>
                )}
              </select>
            </div>
          </div>

          {/* Row 3: Physical Flow, Financial Flow */}
          <div className="create-grid-2" style={{ marginTop: '16px' }}>
            <div className="form-group">
              <label htmlFor="physicalFlow">Physical Flow</label>
              <select
                id="physicalFlow"
                name="physicalFlow"
                value={formData.physicalFlow}
                onChange={handleChange}
              >
                <option value="">Select Physical Flow</option>
                {PHYSICAL_FLOW_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.physicalFlow && !PHYSICAL_FLOW_OPTIONS.includes(formData.physicalFlow) && (
                  <option value={formData.physicalFlow}>{formData.physicalFlow}</option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="financialFlow">Financial Flow</label>
              <select
                id="financialFlow"
                name="financialFlow"
                value={formData.financialFlow}
                onChange={handleChange}
              >
                <option value="">Select Financial Flow</option>
                {FINANCIAL_FLOW_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {formData.financialFlow && !FINANCIAL_FLOW_OPTIONS.includes(formData.financialFlow) && (
                  <option value={formData.financialFlow}>{formData.financialFlow}</option>
                )}
              </select>
            </div>
          </div>

          {/* SECTION 4: DESCRIPTION & DOCUMENTATION */}
          <div className="detail-section-header" style={{ marginTop: '28px' }}>
            <span className="detail-section-title">DESCRIPTION & DOCUMENTATION</span>
          </div>

          {/* Row 1: Description & File Link */}
          <div className="create-grid-2">
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="[Archetype ID] Short Description Lane ID"
                value={formData.description}
                readOnly
                disabled
                className="disabled-input"
                style={{
                  backgroundColor: '#F8FAFC',
                  color: '#475569',
                  cursor: 'not-allowed'
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="fileLink">File Link</label>
              <div className="attachment-input-wrapper">
                <input
                  type="text"
                  id="fileLink"
                  name="fileLink"
                  placeholder="Document URL or filename"
                  value={formData.fileLink}
                  onChange={handleChange}
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
            </div>
          </div>

          {/* Row 2: Documentation & Project Archetype ID */}
          <div className="create-grid-2" style={{ marginTop: '16px' }}>
            <div className="form-group">
              <label htmlFor="documentation">Documentation</label>
              <input
                type="text"
                id="documentation"
                name="documentation"
                placeholder="Documentation summary or reference..."
                value={formData.documentation}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="prjArchId">Project Archetype ID</label>
              <input
                type="text"
                id="prjArchId"
                name="prjArchId"
                placeholder="e.g. PRJ-ARCH-01"
                value={formData.prjArchId}
                readOnly
                disabled
                className="disabled-input"
                style={{
                  backgroundColor: '#F8FAFC',
                  color: '#475569',
                  cursor: 'not-allowed'
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: COUNTER CARD */}
        <div className="create-card" style={{ marginTop: '20px' }}>
          <div className="create-card-header-row">
            <div className="create-card-section-title">
              COUNTER <span className="label-badge">{counters.length}</span>
            </div>
            <button
              type="button"
              className="btn-secondary-action"
              onClick={handleOpenAddCounter}
            >
              <Plus size={14} />
              <span>Add</span>
            </button>
          </div>

          {counters.length === 0 ? (
            <div className="empty-subcard">
              No counters defined. Click + Add to create one.
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
                    <th style={{ textAlign: 'right', width: '80px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {counters.map((ctr, idx) => (
                    <tr key={ctr.counterId || idx}>
                      <td className="detail-cell-id">{ctr.counterId}</td>
                      <td>
                        <span className="detail-pattern-link">{ctr.patternId}</span>
                      </td>
                      <td>{ctr.origin}</td>
                      <td>{ctr.destination}</td>
                      <td>{ctr.laneMaster}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="row-action-buttons">
                          <button
                            type="button"
                            className="btn-row-edit"
                            title="Edit Counter"
                            onClick={() => handleOpenEditCounter(ctr, idx)}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            className="btn-row-remove"
                            title="Remove Counter"
                            onClick={() => handleRemoveCounter(idx)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Card 3: NODES CARD */}
        <div className="create-card" style={{ marginTop: '20px' }}>
          <div className="create-card-header-row">
            <div className="create-card-section-title">
              NODES{' '}
              {isClone && <span className="label-badge-pill">P-V-P</span>}{' '}
              <span className="nodes-item-count">{nodes.length} items</span>
            </div>
            <button
              type="button"
              className="btn-secondary-action"
              onClick={handleOpenAddNode}
            >
              <Plus size={14} />
              <span>Add</span>
            </button>
          </div>

          {nodes.length === 0 ? (
            <div className="empty-subcard">
              {counters.length === 0
                ? 'Add a counter first to define nodes.'
                : 'No nodes defined. Click + Add to define nodes.'}
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
                    <th style={{ textAlign: 'right', width: '80px' }}>ACTIONS</th>
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
                      <td style={{ textAlign: 'right' }}>
                        <div className="row-action-buttons">
                          <button
                            type="button"
                            className="btn-row-edit"
                            title="Edit Node"
                            onClick={() => handleOpenEditNode(node, idx)}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            className="btn-row-remove"
                            title="Remove Node"
                            onClick={() => handleRemoveNode(idx)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bottom Footer Actions */}
        <div className="create-form-footer">
          <button type="button" className="btn-back-footer" onClick={onBack}>
            <ArrowLeft size={14} />
            <span>Back to Results</span>
          </button>

          <div className="footer-right-buttons">
            <button type="button" className="btn-form-cancel" onClick={onBack}>
              Cancel
            </button>
            <button type="submit" className="btn-form-save">
              Save Lane
            </button>
          </div>
        </div>
      </form>

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
