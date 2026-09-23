import React, { useState } from 'react';
import { ArrowDown, ArrowUp, ThumbsUp, Database, FileText } from 'lucide-react';

export default function ArchetypeTable({ onActionClick }) {
  // Wireframe sample data ready for future API binding
  const sampleWireframeData = [
    {
      code: 'L3J1',
      laneId: '10147',
      title: 'USROTC DCs - JnJ Japan',
      legalEntities: '6040 - ETHICON US, LLC | 8525 - CILAG GMBH INTERNATIONAL | 8235 - JOHNSON & JOHNSON K. K.',
      pfcStatus: 'New',
      visioStatus: 'Approval In Progress',
      visioClass: 'in-progress',
      approvals: { approved: 2, total: 3 },
      lastUpdate: '2026/02/10',
      updatedBy: 'Bruno Oliveira',
      actionType: 'view'
    },
    {
      code: 'L3KR',
      laneId: '20201',
      title: 'USROTC DCs - JnJ Korea',
      legalEntities: '6040 - ETHICON US, LLC | 4150 - JOHNSON & JOHNSON KOREA',
      pfcStatus: 'Approved',
      visioStatus: 'Approved',
      visioClass: 'approved',
      approvals: { approved: 3, total: 3 },
      lastUpdate: '2026/01/15',
      updatedBy: 'Maria Santos',
      actionType: 'view'
    },
    {
      code: 'E3EU',
      laneId: '30401',
      title: 'Ethicon MX Export - CILAG EU',
      legalEntities: '4010 - ETHICON JUAREZ | 8525 - CILAG GMBH INTERNATIONAL',
      pfcStatus: 'New',
      visioStatus: 'New',
      visioClass: 'new',
      approvals: { approved: 0, total: 3 },
      lastUpdate: '2026/03/02',
      updatedBy: '',
      actionType: 'generate'
    },
    {
      code: 'D3AN',
      laneId: '40601',
      title: 'DePuy Synthes - ANZ Distribution',
      legalEntities: '5020 - DEPUY SYNTHES US | 9100 - J&J MEDICAL AUSTRALIA',
      pfcStatus: 'New',
      visioStatus: 'Approval In Progress',
      visioClass: 'in-progress',
      approvals: { approved: 1, total: 3 },
      lastUpdate: '2026/02/20',
      updatedBy: 'Tom Bradley',
      actionType: 'view'
    },
    {
      code: 'C3BR',
      laneId: '50812',
      title: 'Cordis Brazil - LatAm Hub',
      legalEntities: '7010 - CORDIS LLC US | 3200 - JOHNSON & JOHNSON BRAZIL',
      pfcStatus: 'New',
      visioStatus: 'Draft',
      visioClass: 'draft',
      approvals: { approved: 0, total: 3 },
      lastUpdate: '2026/03/28',
      updatedBy: '',
      actionType: 'view'
    },
    {
      code: 'V3IN',
      laneId: '60314',
      title: 'Vision Care India - Affiliate DC',
      legalEntities: '6200 - J&J VISION CARE US | 8800 - JOHNSON & JOHNSON INDIA',
      pfcStatus: 'New',
      visioStatus: 'Ready for Approval',
      visioClass: 'ready',
      approvals: { approved: 0, total: 3 },
      lastUpdate: '2026/04/05',
      updatedBy: 'Priya Nair',
      actionType: 'view'
    },
    {
      code: 'M3AU',
      laneId: '70528',
      title: 'MedTech Australia - Reopened Review',
      legalEntities: '7100 - JOHNSON & JOHNSON AUSTRALIA | 7200 - DEPUY SYNTHES AU',
      pfcStatus: 'New',
      visioStatus: 'Reopened',
      visioClass: 'reopened',
      approvals: { approved: 0, total: 3 },
      lastUpdate: '2026/09/10',
      updatedBy: 'Anna Mueller',
      actionType: 'view'
    },
    {
      code: 'B3SG',
      laneId: '80215',
      title: 'Biosense Webster - Singapore Hub',
      legalEntities: '3100 - BIOSENSE WEBSTER INC | 9200 - J&J MEDICAL SINGAPORE',
      pfcStatus: 'Approved',
      visioStatus: 'Approved',
      visioClass: 'approved',
      approvals: { approved: 3, total: 3 },
      lastUpdate: '2026/06/12',
      updatedBy: 'Wei Liang',
      actionType: 'view'
    }
  ];

  // Default table state is BLANK per requirements
  const [showPreviewData, setShowPreviewData] = useState(false);
  const data = showPreviewData ? sampleWireframeData : [];

  return (
    <div className="table-card">
      <div className="toggle-data-bar">
        <span>
          <strong>Table Status:</strong> {showPreviewData ? 'Showing Sample Data' : 'Blank (Ready for API)'}
        </span>
        <button
          className="toggle-data-btn"
          onClick={() => setShowPreviewData(!showPreviewData)}
        >
          {showPreviewData ? 'Clear Table Data (Keep Blank)' : 'Preview Wireframe Mock Data'}
        </button>
      </div>

      <div className="table-wrapper">
        <table className="archetype-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Lane ID</th>
              <th>Title</th>
              <th>Legal Entities</th>
              <th>PFC Status</th>
              <th>L3 Visio Status</th>
              <th>Approvals</th>
              <th>Last Update</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="9">
                  <div className="empty-table-container">
                    <div className="empty-icon-wrapper">
                      <Database size={28} />
                    </div>
                    <div className="empty-title">Table is currently blank</div>
                    <div className="empty-desc">
                      The table structure is built and ready. Data will load here once the backend API is connected.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index}>
                  <td className="code-cell">{row.code}</td>
                  <td className="lane-cell">{row.laneId}</td>
                  <td className="title-cell">{row.title}</td>
                  <td className="legal-entities-cell">{row.legalEntities}</td>
                  <td>
                    <div className={`pfc-status ${row.pfcStatus.toLowerCase()}`}>
                      <span className="dot"></span>
                      <span>{row.pfcStatus}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`visio-pill ${row.visioClass}`}>
                      {row.visioStatus}
                    </span>
                  </td>
                  <td>
                    <div className="approval-steps">
                      <div className="approval-circles">
                        {[1, 2, 3].map((step) => (
                          <div
                            key={step}
                            className={`approval-circle ${
                              step <= row.approvals.approved ? 'approved' : 'pending'
                            }`}
                          >
                            {step}
                          </div>
                        ))}
                      </div>
                      <div className="approval-subtext">
                        {row.approvals.approved} / {row.approvals.total} approved
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>{row.lastUpdate}</div>
                    {row.updatedBy && (
                      <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                        by {row.updatedBy}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      {row.actionType === 'generate' ? (
                        <button
                          className="btn-generate"
                          onClick={() => onActionClick('Generate', row.code)}
                        >
                          Generate
                        </button>
                      ) : (
                        <button
                          className="btn-view"
                          onClick={() => onActionClick('View Diagram', row.code)}
                        >
                          View
                        </button>
                      )}
                      <button
                        className="btn-icon-sm"
                        onClick={() => onActionClick('Download', row.code)}
                      >
                        <ArrowDown size={12} />
                      </button>
                      <button
                        className="btn-icon-sm"
                        onClick={() => onActionClick('Re-order Up', row.code)}
                      >
                        <ArrowUp size={12} />
                      </button>
                      {(row.visioStatus === 'Approval In Progress' || row.visioStatus === 'Ready for Approval') && (
                        <button
                          className="btn-icon-sm"
                          style={{ color: '#D97706' }}
                          onClick={() => onActionClick('Approve Permission', row.code)}
                        >
                          <ThumbsUp size={12} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
