import React, { useState } from 'react';
import { ArrowDown, ArrowUp, RefreshCw, Eye, Plus, Database } from 'lucide-react';
import { initialArchetypesData } from '../data/archetypesData';

export default function ArchetypeTable({
  archetypes = initialArchetypesData,
  onActionClick,
  onCodeClick,
  onCreateClick
}) {
  const [selectedRowId, setSelectedRowId] = useState('1');

  return (
    <div className="table-card">
      {/* Table Toolbar Header - ONLY + Create button */}
      <div className="table-card-toolbar">
        <div className="table-toolbar-left">
          <h3 className="table-section-title">Archetype List</h3>
          <span className="table-results-count">
            — {archetypes.length} {archetypes.length === 1 ? 'result' : 'results'} found
          </span>
        </div>

        <div className="table-toolbar-right">
          <button
            type="button"
            className="btn-create-archetype"
            onClick={onCreateClick}
          >
            <Plus size={15} />
            <span>Create</span>
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="archetype-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
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
            {archetypes.length === 0 ? (
              <tr>
                <td colSpan="10">
                  <div className="empty-table-container">
                    <div className="empty-icon-wrapper">
                      <Database size={28} />
                    </div>
                    <div className="empty-title">No Archetypes Found</div>
                    <div className="empty-desc">
                      No archetypes match your current search criteria. Try resetting the filters.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              archetypes.map((row, index) => {
                const isFirstRow = index === 0;
                return (
                  <tr
                    key={row.id || index}
                    className={selectedRowId === row.id ? 'row-selected' : ''}
                  >
                    {/* Radio Select Dot */}
                    <td className="select-cell">
                      <input
                        type="radio"
                        name="archetype-row-select"
                        checked={selectedRowId === row.id}
                        onChange={() => setSelectedRowId(row.id)}
                        className="row-radio-input"
                      />
                    </td>

                    {/* Code Column - First row is clickable to redirect */}
                    <td className="code-cell">
                      {isFirstRow ? (
                        <button
                          type="button"
                          className="code-link-btn"
                          onClick={() => onCodeClick && onCodeClick(row)}
                          title="Click to view Archetype Detail & Visio Diagram"
                        >
                          <span className="code-primary">{row.codeLines?.[0] || row.code}</span>
                          {row.codeLines?.[1] && (
                            <span className="code-sub">{row.codeLines[1]}</span>
                          )}
                          {row.codeLines?.[2] && (
                            <span className="code-sub">{row.codeLines[2]}</span>
                          )}
                        </button>
                      ) : (
                        <div className="code-stacked">
                          <span className="code-primary">{row.codeLines?.[0] || row.code}</span>
                          {row.codeLines?.[1] && (
                            <span className="code-sub">{row.codeLines[1]}</span>
                          )}
                          {row.codeLines?.[2] && (
                            <span className="code-sub">{row.codeLines[2]}</span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Lane ID */}
                    <td className="lane-cell">
                      <span className="lane-id-pill">{row.laneId}</span>
                    </td>

                    {/* Title */}
                    <td className="title-cell">
                      <strong>{row.title}</strong>
                    </td>

                    {/* Legal Entities */}
                    <td className="legal-entities-cell">{row.legalEntities}</td>

                    {/* PFC Status */}
                    <td>
                      <div className={`pfc-status ${row.pfcStatus?.toLowerCase().replace(/\s+/g, '-')}`}>
                        <span className={`status-dot ${row.pfcStatusClass || ''}`}></span>
                        <span>{row.pfcStatus}</span>
                      </div>
                    </td>

                    {/* L3 Visio Status */}
                    <td>
                      <span className={`visio-pill ${row.visioClass || 'in-progress'}`}>
                        {row.visioStatus}
                      </span>
                    </td>

                    {/* Approvals */}
                    <td>
                      <div className="approval-steps">
                        <div className="approval-circles">
                          {[1, 2, 3].map((step) => {
                            const isApproved = step <= (row.approvals?.approved || 0);
                            return (
                              <div
                                key={step}
                                className={`approval-circle ${isApproved ? 'approved' : 'pending'}`}
                              >
                                {step}
                              </div>
                            );
                          })}
                        </div>
                        <div className="approval-subtext">
                          {row.approvals?.approved || 0} / {row.approvals?.total || 3} approved
                        </div>
                      </div>
                    </td>

                    {/* Last Update */}
                    <td>
                      <div className="update-date">{row.lastUpdate}</div>
                      {row.updatedBy && (
                        <div className="update-author">by {row.updatedBy}</div>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td>
                      <div className="table-actions-group">
                        <div className="action-row-top">
                          <button
                            type="button"
                            className="btn-view"
                            onClick={() => onActionClick('View Diagram', row.code)}
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="btn-icon-sm"
                            title="Download"
                            onClick={() => onActionClick('Download', row.code)}
                          >
                            <ArrowDown size={12} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon-sm"
                            title="Move Up"
                            onClick={() => onActionClick('Re-order Up', row.code)}
                          >
                            <ArrowUp size={12} />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="btn-replace"
                          onClick={() => onActionClick('Replace Archetype', row.code)}
                        >
                          <RefreshCw size={11} />
                          <span>Replace</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
