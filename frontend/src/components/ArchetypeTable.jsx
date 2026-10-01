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
      setSelectedRowIds(archetypes.map((a) => a.id));
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
      const selectedItem = archetypes.find((a) => a.id === selectedRowIds[0]);
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
                const isSelected = selectedRowIds.includes(row.id);

                return (
                  <tr
                    key={row.id || index}
                    className={isSelected ? 'row-selected' : ''}
                  >
                    {/* Multi-Select Checkbox */}
                    <td className="select-cell">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(row.id)}
                        className="row-select-checkbox"
                        title={isSelected ? 'Deselect this row' : 'Select this row'}
                      />
                    </td>

                    {/* Code Column - First row is clickable to redirect */}
                    <td className="code-cell">
                      {isFirstRow ? (
                        <button
                          type="button"
                          className="code-link-btn"
                          onClick={() => onCodeClick && onCodeClick(row)}
                          title="Click to view Archetype Detail"
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
