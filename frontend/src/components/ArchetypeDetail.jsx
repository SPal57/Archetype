import React, { useState } from 'react';
import { ArrowLeft, Download, Edit2, Trash2, FileText, ChevronDown, Plus, X } from 'lucide-react';

export default function ArchetypeDetail({ archetype, onBack }) {
  const [selectedCounterId, setSelectedCounterId] = useState('CTR-001');

  // Hardcoded data matching the Figma Detail view for L3J1-USROTC-JP
  const detailData = {
    title: 'USROTC DCs - JnJ Japan',
    code: 'L3J1-USROTC-JP',
    archetypeId: 'ARC-0001',
    csclLaneId: 'CSCL-1001',
    status: 'Draft',
    owner: 'bruno.oliveira@jnj.com',
    wave: 'Wave 3',
    shortDescription: 'US Return to Origin - Japan DCs',
    planTeam: 'APAC Planning',
    planGrp: 'PG-JP-01',
    project: 'PRJ-2026-042',
    nodesCount: '5 nodes defined',
    attachmentName: 'lane_spec_jp.pdf',
    l1PhysicalFlow: 'US -> JP-DC -> Customer',
    l1FinancialFlow: 'USD -> JPY (T+2)'
  };

  const [counters, setCounters] = useState([
    {
      counterId: 'CTR-001',
      patternId: 'P-V-P',
      origin: 'M',
      destination: 'DC',
      laneMaster: 'LM-102'
    },
    {
      counterId: 'CTR-002',
      patternId: 'P-FP',
      origin: 'M',
      destination: 'M',
      laneMaster: 'LM-103'
    }
  ]);

  const [nodes, setNodes] = useState([
    {
      archetype: 'ARC-0001',
      uniqueId: 'NU-10021',
      nodeId: '01',
      type: 'P',
      typeColor: 'purple',
      purpose: 'M',
      purposeColor: 'green',
      description: 'Origin Verification',
      incoTerm: 'EXW'
    },
    {
      archetype: 'ARC-0001',
      uniqueId: 'NU-10022',
      nodeId: '02',
      type: 'V',
      typeColor: 'orange',
      purpose: 'DC',
      purposeColor: 'amber',
      description: 'Vendor Handoff',
      incoTerm: 'CIF'
    },
    {
      archetype: 'ARC-0001',
      uniqueId: 'NU-10023',
      nodeId: '03',
      type: 'P',
      typeColor: 'purple',
      purpose: 'M',
      purposeColor: 'green',
      description: 'Final Delivery Point',
      incoTerm: 'DAP'
    }
  ]);

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
      data: { counterId: nextId, patternId: 'P-V-P', origin: 'M', destination: 'DC', laneMaster: 'LM-104' }
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
        archetype: detailData.archetypeId,
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
          <span className="breadcrumb-current">{detailData.code}</span>
        </div>

        <div className="detail-top-actions">
          <button
            type="button"
            className="btn-detail-download"
            onClick={() => alert('Download options for ' + detailData.code)}
          >
            <Download size={13} />
            <span>Download</span>
            <ChevronDown size={13} />
          </button>
          <button
            type="button"
            className="btn-detail-edit"
            onClick={() => alert('Editing mode enabled')}
          >
            <Edit2 size={13} />
            <span>Edit</span>
          </button>
        </div>
      </div>

      {/* Page Title & Subtitle */}
      <div className="detail-page-heading">
        <h1>{detailData.title}</h1>
        <p>Define a new CSCL Lane ID and its associated patterns and nodes.</p>
      </div>

      {/* 1. LANE HEADER CARD */}
      <div className="create-card">
        <div className="create-card-section-title">LANE HEADER</div>

        {/* Row 1: 3 columns */}
        <div className="create-grid-3">
          <div className="form-group">
            <label>Archetype ID</label>
            <input type="text" value={detailData.archetypeId} readOnly className="read-only-input" />
          </div>
          <div className="form-group">
            <label>
              CSCL Lane ID <span className="req-asterisk">*</span>
            </label>
            <input type="text" value={detailData.csclLaneId} readOnly className="read-only-input" />
          </div>
          <div className="form-group">
            <label>
              Status <span className="req-asterisk">*</span>
            </label>
            <input type="text" value={detailData.status} readOnly className="read-only-input" />
          </div>
        </div>

        {/* Row 2: Owner, Wave, Short Description */}
        <div className="create-grid-3" style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label>
              Owner <span className="req-asterisk">*</span>
            </label>
            <input type="text" value={detailData.owner} readOnly className="read-only-input" />
          </div>
          <div className="form-group">
            <label>Wave</label>
            <input type="text" value={detailData.wave} readOnly className="read-only-input" />
          </div>
          <div className="form-group">
            <label>
              Short Description <span className="req-asterisk">*</span>
            </label>
            <input type="text" value={detailData.shortDescription} readOnly className="read-only-input" />
          </div>
        </div>

        {/* Row 3: Plan Team, Plan GRP, Project */}
        <div className="create-grid-3" style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label>Plan Team</label>
            <input type="text" value={detailData.planTeam} readOnly className="read-only-input" />
          </div>
          <div className="form-group">
            <label>Plan GRP</label>
            <input type="text" value={detailData.planGrp} readOnly className="read-only-input" />
          </div>
          <div className="form-group">
            <label>Project</label>
            <input type="text" value={detailData.project} readOnly className="read-only-input" />
          </div>
        </div>

        {/* Row 4: Nodes, Attachment, L1 Physical Flow */}
        <div className="create-grid-3" style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label>
              Nodes <span className="label-badge">{nodes.length}</span>
            </label>
            <input type="text" value={`${nodes.length} nodes defined`} readOnly className="read-only-input" />
          </div>
          <div className="form-group">
            <label>Attachment</label>
            <div className="detail-attachment-pill">
              <FileText size={14} className="attachment-icon" />
              <a
                href="#download-spec"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Opening ' + detailData.attachmentName);
                }}
                className="attachment-link"
              >
                {detailData.attachmentName}
              </a>
            </div>
          </div>
          <div className="form-group">
            <label>L1 Physical Flow</label>
            <input type="text" value={detailData.l1PhysicalFlow} readOnly className="read-only-input" />
          </div>
        </div>

        {/* Row 5: L1 Financial Flow */}
        <div className="form-group" style={{ marginTop: '16px', maxWidth: '32%' }}>
          <label>L1 Financial Flow</label>
          <input type="text" value={detailData.l1FinancialFlow} readOnly className="read-only-input" />
        </div>
      </div>

      {/* 2. COUNTER CARD */}
      <div className="create-card">
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
                <tr
                  key={ctr.counterId}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. NODES CARD */}
      <div className="create-card">
        <div className="create-card-header-row">
          <div className="create-card-section-title">
            NODES <span className="label-badge-pill">P-V-P</span> <span className="nodes-item-count">{nodes.length} items</span>
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
                    <span className={`circle-badge badge-${node.typeColor}`}>{node.type}</span>
                  </td>
                  <td>
                    <span className={`circle-badge badge-${node.purposeColor}`}>{node.purpose}</span>
                  </td>
                  <td>{node.description}</td>
                  <td>{node.incoTerm}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
