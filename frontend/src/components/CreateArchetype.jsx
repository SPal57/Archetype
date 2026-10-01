import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Plus, Trash2, Edit2, Download, ChevronDown, Check, X } from 'lucide-react';

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
  const [formData, setFormData] = useState({
    archetypeId: '',
    csclLaneId: '',
    status: 'Draft',
    owner: '',
    wave: '',
    shortDescription: '',
    legalEntities: '',
    planTeam: '',
    planGrp: '',
    project: '',
    nodesCount: '',
    attachment: '',
    l1PhysicalFlow: '',
    l1FinancialFlow: ''
  });

  // Counters State
  const [counters, setCounters] = useState([]);

  // Nodes State
  const [nodes, setNodes] = useState([]);

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
      // In Clone mode: Pre-fill all fields with whatever user had filled in the reference archetype
      // but keep archetypeId and csclLaneId blank so the user must provide new unique IDs
      setFormData({
        archetypeId: '',
        csclLaneId: '',
        status: referenceData.status || referenceData.pfcStatus || 'Draft',
        owner: referenceData.owner || referenceData.ownerEmail || '',
        wave: referenceData.wave || '',
        shortDescription: referenceData.shortDescription || referenceData.description || '',
        legalEntities: referenceData.legalEntities || '',
        planTeam: referenceData.planTeam || '',
        planGrp: referenceData.planGrp || '',
        project: referenceData.project || '',
        nodesCount: referenceData.nodesCount || (referenceData.nodes?.length ? `${referenceData.nodes.length} nodes defined` : ''),
        attachment: referenceData.attachmentName || referenceData.attachment || '',
        l1PhysicalFlow: referenceData.l1PhysicalFlow || '',
        l1FinancialFlow: referenceData.l1FinancialFlow || ''
      });

      // Copy actual counters and nodes (empty array if reference has none)
      setCounters(Array.isArray(referenceData.counters) ? [...referenceData.counters] : []);
      setNodes(Array.isArray(referenceData.nodes) ? [...referenceData.nodes] : []);
    } else {
      setFormData({
        archetypeId: '',
        csclLaneId: '',
        status: 'Draft',
        owner: '',
        wave: '',
        shortDescription: '',
        legalEntities: '',
        planTeam: '',
        planGrp: '',
        project: '',
        nodesCount: '',
        attachment: '',
        l1PhysicalFlow: '',
        l1FinancialFlow: ''
      });
      setCounters([]);
      setNodes([]);
    }
    setErrors({});
  }, [isClone, referenceData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Helper to suggest unique IDs when cloning
  const handleAutoSuggestUniqueIds = () => {
    let randomNum = Math.floor(Math.random() * 9000) + 1000;
    while (
      existingArchetypes.some(
        (a) =>
          (a.code || a.archetypeId || a.id)?.toUpperCase() === `ARC-${randomNum}` ||
          (a.laneId || a.csclLaneId)?.toUpperCase() === `CSCL-${randomNum}`
      )
    ) {
      randomNum = Math.floor(Math.random() * 9000) + 1000;
    }
    setFormData((prev) => ({
      ...prev,
      archetypeId: `ARC-${randomNum}`,
      csclLaneId: `CSCL-${randomNum}`
    }));
    setErrors((prev) => ({ ...prev, archetypeId: null, csclLaneId: null }));
  };

  // Handle Form Submission with Strict Uniqueness Validation
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Mandatory fields: Archetype ID, CSCL Lane ID, Owner
    if (!formData.archetypeId.trim()) {
      newErrors.archetypeId = 'Archetype ID is required';
    }
    if (!formData.csclLaneId.trim()) {
      newErrors.csclLaneId = 'CSCL Lane ID is required';
    }
    if (!formData.owner.trim()) {
      newErrors.owner = 'Owner is required';
    }

    const targetArchId = formData.archetypeId.trim().toUpperCase();
    const targetCsclId = formData.csclLaneId.trim().toUpperCase();

    // Check against any existing archetypes in database
    const duplicateArchetype = existingArchetypes.find(
      (a) => (a.code || a.archetypeId || a.id)?.trim().toUpperCase() === targetArchId
    );
    if (duplicateArchetype) {
      newErrors.archetypeId = `Archetype ID "${formData.archetypeId.trim()}" already exists. Please enter a unique ID.`;
    }

    const duplicateLane = existingArchetypes.find(
      (a) => (a.laneId || a.csclLaneId)?.trim().toUpperCase() === targetCsclId
    );
    if (duplicateLane) {
      newErrors.csclLaneId = `CSCL Lane ID "${formData.csclLaneId.trim()}" already exists. Please enter a unique ID.`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (onSave) {
      onSave({
        ...formData,
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
            Please ensure you provide a unique <strong>Archetype ID</strong> and <strong>CSCL Lane ID</strong>.
          </div>
          <button
            type="button"
            className="btn-suggest-ids"
            onClick={handleAutoSuggestUniqueIds}
          >
            ⚡ Auto-Generate Unique IDs
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Card 1: LANE HEADER */}
        <div className="create-card">
          <div className="create-card-section-title">LANE HEADER</div>

          {/* Row 1: Archetype ID, CSCL Lane ID, Status */}
          <div className="create-grid-3">
            {/* Archetype ID */}
            <div className={`form-group ${errors.archetypeId ? 'has-error' : ''}`}>
              <label htmlFor="archetypeId">
                Archetype ID <span className="req-asterisk">*</span>
              </label>
              <input
                type="text"
                id="archetypeId"
                name="archetypeId"
                placeholder="e.g. ARC-0001"
                value={formData.archetypeId}
                onChange={handleChange}
              />
              {errors.archetypeId && (
                <span className="error-hint">{errors.archetypeId}</span>
              )}
            </div>

            {/* CSCL Lane ID * */}
            <div className={`form-group ${errors.csclLaneId ? 'has-error' : ''}`}>
              <label htmlFor="csclLaneId">
                CSCL Lane ID <span className="req-asterisk">*</span>
              </label>
              <input
                type="text"
                id="csclLaneId"
                name="csclLaneId"
                placeholder="CSCL-0000"
                value={formData.csclLaneId}
                onChange={handleChange}
              />
              {errors.csclLaneId && (
                <span className="error-hint">{errors.csclLaneId}</span>
              )}
            </div>

            {/* Status * */}
            <div className="form-group">
              <label htmlFor="status">
                Status <span className="req-asterisk">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Draft">Draft</option>
                <option value="New">New</option>
                <option value="In Review">In Review</option>
                <option value="Approved">Approved</option>
              </select>
            </div>
          </div>

          {/* Row 2: Owner, Wave, Short Description */}
          <div className="create-grid-3" style={{ marginTop: '16px' }}>
            {/* Owner * */}
            <div className={`form-group ${errors.owner ? 'has-error' : ''}`}>
              <label htmlFor="owner">
                Owner <span className="req-asterisk">*</span>
              </label>
              <div className="input-with-icon">
                <input
                  type="text"
                  id="owner"
                  name="owner"
                  placeholder="jane.doe@corp.com"
                  value={formData.owner}
                  onChange={handleChange}
                />
                <Search size={14} className="inner-search-icon" />
              </div>
              {errors.owner && (
                <span className="error-hint">{errors.owner}</span>
              )}
            </div>

            {/* Wave */}
            <div className="form-group">
              <label htmlFor="wave">Wave</label>
              <select
                id="wave"
                name="wave"
                value={formData.wave}
                onChange={handleChange}
              >
                <option value="">Select Wave</option>
                <option value="Wave 1">Wave 1</option>
                <option value="Wave 2">Wave 2</option>
                <option value="Wave 3">Wave 3</option>
              </select>
            </div>

            {/* Short Description */}
            <div className="form-group">
              <label htmlFor="shortDescription">Short Description</label>
              <input
                type="text"
                id="shortDescription"
                name="shortDescription"
                placeholder="Brief purpose..."
                value={formData.shortDescription}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 3: Legal Entities */}
          <div className="form-group" style={{ marginTop: '16px' }}>
            <label htmlFor="legalEntities">Legal Entities</label>
            <input
              type="text"
              id="legalEntities"
              name="legalEntities"
              placeholder="e.g. 6040 - ETHICON US, LLC | 8525 - CILAG GMBH INTERNATIONAL"
              value={formData.legalEntities}
              onChange={handleChange}
            />
          </div>

          {/* Row 4: Plan Team, Plan GRP, Project */}
          <div className="create-grid-3" style={{ marginTop: '16px' }}>
            {/* Plan Team */}
            <div className="form-group">
              <label htmlFor="planTeam">Plan Team</label>
              <input
                type="text"
                id="planTeam"
                name="planTeam"
                placeholder="e.g. APAC Planning"
                value={formData.planTeam}
                onChange={handleChange}
              />
            </div>

            {/* Plan GRP */}
            <div className="form-group">
              <label htmlFor="planGrp">Plan GRP</label>
              <input
                type="text"
                id="planGrp"
                name="planGrp"
                placeholder="e.g. PG-JP-01"
                value={formData.planGrp}
                onChange={handleChange}
              />
            </div>

            {/* Project */}
            <div className="form-group">
              <label htmlFor="project">Project</label>
              <input
                type="text"
                id="project"
                name="project"
                placeholder="e.g. PRJ-2026-042"
                value={formData.project}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 5: Nodes, Attachment (Visio), L1 Physical Flow */}
          <div className="create-grid-3" style={{ marginTop: '16px' }}>
            {/* Nodes */}
            <div className="form-group">
              <label htmlFor="nodesCount">
                Nodes <span className="label-badge">{nodes.length}</span>
              </label>
              <input
                type="text"
                id="nodesCount"
                value={nodes.length ? `${nodes.length} nodes defined` : 'No nodes defined'}
                disabled
                className="disabled-input"
              />
            </div>

            {/* Attachment */}
            <div className="form-group">
              <label htmlFor="attachment">Attachment (Visio / Spec)</label>
              <div className="attachment-input-wrapper">
                <input
                  type="text"
                  id="attachment"
                  name="attachment"
                  placeholder="e.g. lane_spec_jp.vsdx"
                  value={formData.attachment}
                  onChange={handleChange}
                />
                <label className="btn-browse-file" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  Browse
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    accept=".vsdx,.vsd,.pdf,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setFormData((prev) => ({ ...prev, attachment: file.name }));
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* L1 Physical Flow */}
            <div className="form-group">
              <label htmlFor="l1PhysicalFlow">L1 Physical Flow</label>
              <input
                type="text"
                id="l1PhysicalFlow"
                name="l1PhysicalFlow"
                placeholder="e.g. US -> JP-DC -> Customer"
                value={formData.l1PhysicalFlow}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 6: L1 Financial Flow */}
          <div className="create-grid-3" style={{ marginTop: '16px' }}>
            <div className="form-group">
              <label htmlFor="l1FinancialFlow">L1 Financial Flow</label>
              <input
                type="text"
                id="l1FinancialFlow"
                name="l1FinancialFlow"
                placeholder="e.g. USD -> JPY (T+2)"
                value={formData.l1FinancialFlow}
                onChange={handleChange}
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
                  <option value="P-V-P">P-V-P</option>
                  <option value="P-FP">P-FP</option>
                  <option value="P-P">P-P</option>
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
                      setNodeModal((prev) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          type: val,
                          typeColor: val === 'V' ? 'orange' : 'purple'
                        }
                      }));
                    }}
                  >
                    <option value="P">P (Plant / Hub)</option>
                    <option value="V">V (Vendor)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Purpose (e.g. M or DC)</label>
                  <select
                    value={nodeModal.data.purpose}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNodeModal((prev) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          purpose: val,
                          purposeColor: val === 'DC' ? 'amber' : 'green'
                        }
                      }));
                    }}
                  >
                    <option value="M">M (Manufacturing)</option>
                    <option value="DC">DC (Distribution Center)</option>
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
                  <option value="EXW">EXW</option>
                  <option value="CIF">CIF</option>
                  <option value="DAP">DAP</option>
                  <option value="FOB">FOB</option>
                  <option value="DDP">DDP</option>
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
