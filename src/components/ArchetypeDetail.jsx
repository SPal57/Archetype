import React, { useState } from 'react';
import { ArrowLeft, Download, Edit2, FileText, ChevronDown } from 'lucide-react';

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

  const counters = [
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
  ];

  const nodes = [
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
  ];

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
            onClick={() => alert('Edit Archetype ' + detailData.code)}
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
              Nodes <span className="label-badge">5</span>
            </label>
            <input type="text" value={detailData.nodesCount} readOnly className="read-only-input" />
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
            COUNTER <span className="label-badge">2</span>
          </div>
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
              </tr>
            </thead>
            <tbody>
              {counters.map((ctr) => (
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
            NODES <span className="label-badge-pill">P-V-P</span> <span className="nodes-item-count">3 items</span>
          </div>
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
              </tr>
            </thead>
            <tbody>
              {nodes.map((node) => (
                <tr key={node.nodeId}>
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
    </div>
  );
}
