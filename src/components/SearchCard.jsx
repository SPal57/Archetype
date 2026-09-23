import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

export default function SearchCard({ onOpenAdvancedSearch, onSearch, onReset }) {
  const [formData, setFormData] = useState({
    msclPatternId: '',
    laneId: '',
    archetypeId: '',
    description: '',
    owner: '',
    status: 'All Statuses'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      msclPatternId: '',
      laneId: '',
      archetypeId: '',
      description: '',
      owner: '',
      status: 'All Statuses'
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
            <span>Search MSCL Archetypes</span>
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
            <div className="form-group">
              <label htmlFor="msclPatternId">MSCL Pattern ID</label>
              <input
                type="text"
                id="msclPatternId"
                name="msclPatternId"
                value={formData.msclPatternId}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="laneId">Lane ID</label>
              <input
                type="text"
                id="laneId"
                name="laneId"
                value={formData.laneId}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="archetypeId">Archetype ID</label>
              <input
                type="text"
                id="archetypeId"
                name="archetypeId"
                value={formData.archetypeId}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="owner">Owner</label>
              <input
                type="text"
                id="owner"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
              />
            </div>

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
