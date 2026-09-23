import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

export default function SearchCard({ onOpenAdvancedSearch, onSearch, onReset }) {
  const [formData, setFormData] = useState({
    patternId: 'All Patterns',
    status: 'All Statuses',
    laneId: '',
    archetypeId: '',
    description: '',
    owner: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      patternId: 'All Patterns',
      status: 'All Statuses',
      laneId: '',
      archetypeId: '',
      description: '',
      owner: ''
    });
    if (onReset) onReset();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(formData);
  };

  return (
    <section className="search-section">
      <div className="search-section-header">
        <h2>MSCL Archetype Search</h2>
        <p>Search and filter archetypes using basic or advanced criteria</p>
      </div>

      <div className="search-card">
        <div className="search-card-top">
          <div className="search-card-title">
            <Search size={16} className="search-title-icon" />
            <span>Search Archetypes</span>
          </div>

          <button
            type="button"
            className="btn-advanced-search"
            onClick={onOpenAdvancedSearch}
          >
            <Filter size={14} />
            <span>Advanced Search</span>
          </button>
        </div>

        <form onSubmit={handleSearch}>
          <div className="search-fields-grid">
            {/* 1. Pattern ID Dropdown */}
            <div className="form-group">
              <label htmlFor="patternId">Pattern ID</label>
              <select
                id="patternId"
                name="patternId"
                value={formData.patternId}
                onChange={handleChange}
              >
                <option value="All Patterns">All Patterns</option>
                <option value="P-P">P-P</option>
                <option value="P-V-P">P-V-P</option>
                <option value="P-FP">P-FP</option>
              </select>
            </div>

            {/* 2. Status Dropdown (in 2nd position) */}
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Approval in Progress">Approval in Progress</option>
                <option value="Ready for Approval">Ready for Approval</option>
                <option value="New">New</option>
                <option value="Draft">Draft</option>
                <option value="Reopened">Reopened</option>
              </select>
            </div>

            {/* 3. Lane ID */}
            <div className="form-group">
              <label htmlFor="laneId">Lane ID</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  id="laneId"
                  name="laneId"
                  placeholder="Lane ID"
                  value={formData.laneId}
                  onChange={handleChange}
                />
                <Search size={14} className="inner-search-icon" />
              </div>
            </div>

            {/* 4. Archetype ID */}
            <div className="form-group">
              <label htmlFor="archetypeId">Archetype ID</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  id="archetypeId"
                  name="archetypeId"
                  placeholder="Archetype ID"
                  value={formData.archetypeId}
                  onChange={handleChange}
                />
                <Search size={14} className="inner-search-icon" />
              </div>
            </div>

            {/* 5. Description */}
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="Keyword search"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* 6. Owner */}
            <div className="form-group">
              <label htmlFor="owner">Owner</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  id="owner"
                  name="owner"
                  placeholder="Owner"
                  value={formData.owner}
                  onChange={handleChange}
                />
                <Search size={14} className="inner-search-icon" />
              </div>
            </div>
          </div>

          <div className="search-card-actions">
            <button
              type="button"
              className="btn-search-reset"
              onClick={handleReset}
            >
              Reset
            </button>
            <button type="submit" className="btn-search-submit">
              <Search size={14} />
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
