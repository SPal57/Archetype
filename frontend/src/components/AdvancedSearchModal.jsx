import React, { useState, useRef } from 'react';
import { X, Calendar } from 'lucide-react';

export default function AdvancedSearchModal({ isOpen, onClose, onApplyFilters }) {
  const [filters, setFilters] = useState({
    validFrom: '',
    validTo: '',
    source: '',
    destination: '',
    supplier: '',
    supplierMaterial: '',
    legalEntity: '',
    pfcStatus: 'Any'
  });

  const validFromPickerRef = useRef(null);
  const validToPickerRef = useRef(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePickerSelect = (field, isoDate) => {
    if (!isoDate) return;
    const formattedDate = isoDate.replace(/-/g, '/'); // Formats YYYY-MM-DD -> YYYY/MM/DD
    setFilters((prev) => ({ ...prev, [field]: formattedDate }));
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
    onClose();
  };

  const openPicker = (ref) => {
    if (ref.current && typeof ref.current.showPicker === 'function') {
      try {
        ref.current.showPicker();
      } catch (err) {
        ref.current.focus();
      }
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="advanced-search-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="advanced-search-header">
          <div>
            <h3>Advanced Search</h3>
            <p>Narrow results with additional criteria</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleApply}>
          <div className="advanced-search-body">
            {/* Date Range */}
            <div className="modal-filter-section">
              <h4 className="section-label">Date Range</h4>
              <div className="two-col-grid">
                <div className="form-group">
                  <label htmlFor="validFrom">Valid From</label>
                  <div className="date-input-wrapper">
                    <input
                      type="text"
                      id="validFrom"
                      name="validFrom"
                      className="date-text-input"
                      placeholder="YYYY/MM/DD"
                      value={filters.validFrom}
                      onChange={handleChange}
                    />
                    <input
                      type="date"
                      ref={validFromPickerRef}
                      className="hidden-date-picker"
                      value={filters.validFrom ? filters.validFrom.replace(/\//g, '-') : ''}
                      onChange={(e) => handlePickerSelect('validFrom', e.target.value)}
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                    <button
                      type="button"
                      className="calendar-btn"
                      onClick={() => openPicker(validFromPickerRef)}
                      title="Select date from calendar"
                    >
                      <Calendar size={15} />
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="validTo">Valid To</label>
                  <div className="date-input-wrapper">
                    <input
                      type="text"
                      id="validTo"
                      name="validTo"
                      className="date-text-input"
                      placeholder="YYYY/MM/DD"
                      value={filters.validTo}
                      onChange={handleChange}
                    />
                    <input
                      type="date"
                      ref={validToPickerRef}
                      className="hidden-date-picker"
                      value={filters.validTo ? filters.validTo.replace(/\//g, '-') : ''}
                      onChange={(e) => handlePickerSelect('validTo', e.target.value)}
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                    <button
                      type="button"
                      className="calendar-btn"
                      onClick={() => openPicker(validToPickerRef)}
                      title="Select date from calendar"
                    >
                      <Calendar size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Logistics */}
            <div className="modal-filter-section">
              <h4 className="section-label">Logistics</h4>
              <div className="two-col-grid">
                <div className="form-group">
                  <label htmlFor="source">Source</label>
                  <input
                    type="text"
                    id="source"
                    name="source"
                    placeholder=""
                    value={filters.source}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="destination">Destination</label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    placeholder=""
                    value={filters.destination}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Supplier */}
            <div className="modal-filter-section">
              <h4 className="section-label">Supplier</h4>
              <div className="two-col-grid">
                <div className="form-group">
                  <label htmlFor="supplier">Supplier</label>
                  <input
                    type="text"
                    id="supplier"
                    name="supplier"
                    placeholder=""
                    value={filters.supplier}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="supplierMaterial">Supplier Material</label>
                  <input
                    type="text"
                    id="supplierMaterial"
                    name="supplierMaterial"
                    placeholder=""
                    value={filters.supplierMaterial}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Other */}
            <div className="modal-filter-section">
              <h4 className="section-label">Other</h4>
              <div className="two-col-grid">
                <div className="form-group">
                  <label htmlFor="legalEntity">Legal Entity</label>
                  <input
                    type="text"
                    id="legalEntity"
                    name="legalEntity"
                    placeholder=""
                    value={filters.legalEntity}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pfcStatus">PFC Status</label>
                  <select
                    id="pfcStatus"
                    name="pfcStatus"
                    value={filters.pfcStatus}
                    onChange={handleChange}
                  >
                    <option value="Any">Any</option>
                    <option value="Approved">Approved</option>
                    <option value="New">New</option>
                    <option value="Draft">Draft</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="advanced-search-footer">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn-modal-apply">
              Apply Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
