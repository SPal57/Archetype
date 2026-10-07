import React, { useState, useRef, useEffect } from 'react';
import { ArrowDown, ArrowUp, RefreshCw, Plus, Database, ChevronDown, Copy, AlertCircle, Download } from 'lucide-react';
import { initialArchetypesData } from '../data/archetypesData';

export default function ArchetypeTable({
  archetypes = initialArchetypesData,
  onActionClick,
  onCodeClick,
  onCreateClick
}) {
  // Support multiple selected row IDs (for multi-download)
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [warningMessage, setWarningMessage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle individual row checkbox toggle (multi-select)
  const handleToggleRow = (rowId) => {
    setSelectedRowIds((prev) => {
      const next = prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId];
      // Automatically clear warning once valid single-row selection is reached
      if (next.length === 1 && warningMessage) {
        setWarningMessage('');
      }
      return next;
    });
  };

  // Handle Select All / Deselect All
  const handleToggleSelectAll = () => {
    if (selectedRowIds.length === archetypes.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(archetypes.map((a) => a.id || a.archtId || a.archetypeId));
    }
    setWarningMessage('');
  };

  const handleSelectCreateOption = (mode) => {
    setIsDropdownOpen(false);

    if (mode === 'blank') {
      if (onCreateClick) {
        onCreateClick('blank', null);
      }
      return;
    }

    if (mode === 'clone') {
      // 1. If 0 rows selected -> prompt to select a row first
      if (selectedRowIds.length === 0) {
        setWarningMessage('Select a row first');
        return;
      }

      // 2. If more than 1 row selected -> prompt that multiple rows cannot be cloned
      if (selectedRowIds.length > 1) {
        setWarningMessage("You can't clone more than one archetype at one time");
        return;
      }

      // 3. Exactly 1 row selected -> proceed to clone
      setWarningMessage('');
      const selectedItem = archetypes.find((a) => (a.id || a.archtId || a.archetypeId) === selectedRowIds[0]);
      if (onCreateClick) {
        onCreateClick('clone', selectedItem);
      }
    }
  };

  const isAllSelected = archetypes.length > 0 && selectedRowIds.length === archetypes.length;

  return (
    <div className="table-card">
      {/* Table Toolbar Header */}
      <div className="table-card-toolbar">
        <div className="table-toolbar-left">
          <h3 className="table-section-title">Archetype List</h3>
          <span className="table-results-count">
            — {archetypes.length} {archetypes.length === 1 ? 'result' : 'results'} found
          </span>
          {selectedRowIds.length > 0 && (
            <span className="selected-count-badge">
              ({selectedRowIds.length} selected)
            </span>
          )}
        </div>

        {/* Right Toolbar: Warning Prompt, Download Button, and + Create Dropdown */}
        <div className="table-toolbar-right" ref={dropdownRef}>
          {/* Dynamic Warning Prompt (0 rows OR >1 row for clone) */}
          {warningMessage && (
            <div className="select-row-warning-pill">
              <AlertCircle size={14} className="warning-pill-icon" />
              <span>{warningMessage}</span>
            </div>
          )}

          {/* Download Button (Supports single and multiple selected rows) */}
          <button
            type="button"
            className="btn-table-download"
            onClick={() => {
              const count = selectedRowIds.length;
              if (onActionClick) {
                onActionClick(
                  'Download Excel',
                  count > 0 ? `${count} selected archetype(s)` : 'All archetypes'
                );
              }
            }}
            title={selectedRowIds.length > 0 ? `Download ${selectedRowIds.length} selected row(s)` : 'Download archetypes as Excel'}
          >
            <Download size={14} />
            <span>Download</span>
          </button>

          {/* Create Button with Dropdown */}
          <div className="create-dropdown-container">
            <button
              type="button"
              className="btn-create-archetype btn-create-dropdown-toggle"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
            >
              <Plus size={15} />
              <span>Create</span>
              <ChevronDown size={14} className={`dropdown-chevron ${isDropdownOpen ? 'rotated' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="create-dropdown-menu">
                {/* 1. Blank Create */}
                <button
                  type="button"
                  className="create-dropdown-item"
                  onClick={() => handleSelectCreateOption('blank')}
                >
                  <div className="dropdown-item-icon">
                    <Plus size={18} />
                  </div>
                  <div className="dropdown-item-text">
                    <div className="dropdown-item-title">Create</div>
                    <div className="dropdown-item-desc">Start with a blank form</div>
                  </div>
                </button>

                {/* 2. Create with Reference (Clone) */}
                <button
                  type="button"
                  className="create-dropdown-item"
                  onClick={() => handleSelectCreateOption('clone')}
                >
                  <div className="dropdown-item-icon">
                    <Copy size={17} />
                  </div>
                  <div className="dropdown-item-text">
                    <div className="dropdown-item-title">Create with Reference</div>
                    <div className="dropdown-item-desc">Copy from selected row</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="archetype-table">
          <thead>
            <tr>
              {/* Header Checkbox (Select / Deselect All) */}
              <th style={{ width: '40px' }} className="select-cell">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleToggleSelectAll}
                  className="row-select-checkbox"
                  title={isAllSelected ? 'Deselect all rows' : 'Select all rows'}
                />
              </th>
              <th>Archetype ID</th>
              <th>Lane ID</th>
              <th>Short Description</th>
              <th>Owner</th>
              <th>PFC Status</th>
              <th>Visio Status</th>
              <th>Last Update</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {archetypes.length === 0 ? (
              <tr>
                <td colSpan="9">
                  <div className="empty-table-container" style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <div className="empty-icon-wrapper" style={{ margin: '0 auto 12px' }}>
                      <Database size={32} />
                    </div>
                    <div className="empty-title" style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
                      No Archetypes Created Yet
                    </div>
                    <div className="empty-desc" style={{ fontSize: '13px', color: '#64748b', maxWidth: '420px', margin: '6px auto 16px' }}>
                      The database is currently clean and empty. Click <strong>+ Create</strong> above to manually define your first Lane Header!
                    </div>
                    <button
                      type="button"
                      className="btn-create-archetype"
                      style={{ margin: '0 auto' }}
                      onClick={() => onCreateClick && onCreateClick('blank', null)}
                    >
                      <Plus size={15} />
                      <span>Create First Archetype</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              archetypes.map((row, index) => {
                const rowId = row.id || row.archtId || row.archetypeId || row.code;
                const isSelected = selectedRowIds.includes(rowId);

                return (
                  <tr
                    key={rowId || index}
                    className={isSelected ? 'row-selected' : ''}
                  >
                    {/* Multi-Select Checkbox */}
                    <td className="select-cell">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(rowId)}
                        className="row-select-checkbox"
                        title={isSelected ? 'Deselect this row' : 'Select this row'}
                      />
                    </td>

                    {/* Archetype ID Column - Clickable to open Archetype Detail */}
                    <td className="code-cell">
                      <button
                        type="button"
                        className="code-link-btn"
                        onClick={() => onCodeClick && onCodeClick(row)}
                        title="Click to view Archetype Detail"
                      >
                        <span className="code-primary">{row.archtId || row.archetypeId || row.code}</span>
                      </button>
                    </td>

                    {/* Lane ID */}
                    <td className="lane-cell">
                      <span className="lane-id-pill">{row.csclLaneId || row.laneId || '—'}</span>
                    </td>

                    {/* Short Description */}
                    <td className="title-cell" title={row.shortDesc || row.shortDescription || row.description}>
                      <strong>{row.shortDesc || row.shortDescription || row.description || '—'}</strong>
                    </td>

                    {/* Owner */}
                    <td>
                      <div className="table-owner-cell">
                        <span className="table-owner-name">{row.owner || row.ownerEmail || '—'}</span>
                        {row.ownerRole && <span className="table-owner-role">({row.ownerRole})</span>}
                      </div>
                    </td>

                    {/* PFC Status (Lane Header Status field) */}
                    <td>
                      {(() => {
                        const statusVal = row.status || row.pfcStatus || '00-New';
                        const lower = statusVal.toLowerCase();
                        let dotClass = 'status-dot-new';
                        if (lower.includes('approved') || lower.includes('live')) {
                          dotClass = 'status-dot-approved';
                        } else if (lower.includes('review') || lower.includes('hold') || lower.includes('implementing') || lower.includes('test')) {
                          dotClass = 'status-dot-review';
                        }
                        return (
                          <div className={`pfc-status ${lower.replace(/[^a-z0-9]/g, '-')}`}>
                            <span className={`status-dot ${dotClass}`}></span>
                            <span>{statusVal}</span>
                          </div>
                        );
                      })()}
                    </td>

                    {/* Visio Status (Depends on file attached inside archetype, otherwise 'Not Uploaded') */}
                    <td>
                      {(() => {
                        const hasFile = Boolean(
                          (row.fileLink || row.attachmentName || row.attachment || '').trim()
                        );
                        const statusText = hasFile
                          ? (row.visioStatus && row.visioStatus !== 'Not Uploaded' ? row.visioStatus : 'Approval In Progress')
                          : 'Not Uploaded';
                        const lower = statusText.toLowerCase();
                        let pillClass = 'not-uploaded';
                        if (lower.includes('approved')) {
                          pillClass = 'approved';
                        } else if (lower.includes('progress') || lower.includes('review')) {
                          pillClass = 'in-progress';
                        }
                        return <span className={`visio-pill ${pillClass}`}>{statusText}</span>;
                      })()}
                    </td>

                    {/* Last Update (YYYY-MM-DD format) */}
                    <td>
                      {(() => {
                        const raw = row.lastUpdate || '';
                        let formatted = '—';
                        if (raw) {
                          formatted = String(raw).trim().slice(0, 10).replace(/\//g, '-');
                        }
                        return (
                          <div>
                            <div className="update-date">{formatted}</div>
                            {row.updatedBy && row.updatedBy !== row.owner && (
                              <div className="update-author">by {row.updatedBy}</div>
                            )}
                          </div>
                        );
                      })()}
                    </td>

                    {/* Actions Column */}
                    <td>
                      <div className="table-actions-group">
                        <div className="action-row-top">
                          <button
                            type="button"
                            className="btn-view"
                            onClick={() => (onCodeClick ? onCodeClick(row) : onActionClick('View Details', row.archtId || row.code))}
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="btn-icon-sm"
                            title="Download"
                            onClick={() => onActionClick('Download', row.archtId || row.code)}
                          >
                            <ArrowDown size={12} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon-sm"
                            title="Move Up"
                            onClick={() => onActionClick('Re-order Up', row.archtId || row.code)}
                          >
                            <ArrowUp size={12} />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="btn-replace"
                          onClick={() => onActionClick('Replace Archetype', row.archtId || row.code)}
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
