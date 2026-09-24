import React, { useState } from 'react';
import { ArrowLeft, Search, Plus, Upload, Check } from 'lucide-react';

export default function CreateArchetype({ onBack, onSave }) {
  const [formData, setFormData] = useState({
    archetypeId: '',
    csclLaneId: '',
    status: 'Draft',
    owner: '',
    wave: '',
    shortDescription: '',
    planTeam: '',
    planGrp: '',
    project: '',
    attachment: '',
    l1PhysicalFlow: '',
    l1FinancialFlow: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.csclLaneId.trim()) newErrors.csclLaneId = true;
    if (!formData.owner.trim()) newErrors.owner = true;
    if (!formData.shortDescription.trim()) newErrors.shortDescription = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <div className="create-archetype-view">
      {/* Top Breadcrumb */}
      <div className="create-breadcrumb">
        <button type="button" className="btn-back-breadcrumb" onClick={onBack}>
          <ArrowLeft size={14} />
          <span>Back to Results</span>
        </button>
        <span className="breadcrumb-separator">|</span>
        <span className="breadcrumb-current">New Archetype</span>
      </div>

      {/* Page Header */}
      <div className="create-page-header">
        <h1>Create Archetype</h1>
        <p>Define a new CSCL Lane ID and its associated patterns and nodes.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Card: Lane Header */}
        <div className="create-card">
          <div className="create-card-section-title">LANE HEADER</div>

          <div className="create-grid-4">
            {/* Archetype ID */}
            <div className="form-group">
              <label htmlFor="archetypeId">Archetype ID</label>
              <input
                type="text"
                id="archetypeId"
                name="archetypeId"
                placeholder="e.g. ARC-0001"
                value={formData.archetypeId}
                onChange={handleChange}
              />
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
                <span className="error-hint">This field is required</span>
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
                <span className="error-hint">This field is required</span>
              )}
            </div>
          </div>

          <div className="create-grid-3" style={{ marginTop: '16px' }}>
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

            {/* Short Description * */}
            <div className={`form-group span-2 ${errors.shortDescription ? 'has-error' : ''}`}>
              <label htmlFor="shortDescription">
                Short Description <span className="req-asterisk">*</span>
              </label>
              <input
                type="text"
                id="shortDescription"
                name="shortDescription"
                placeholder="Brief purpose..."
                value={formData.shortDescription}
                onChange={handleChange}
              />
              {errors.shortDescription && (
                <span className="error-hint">This field is required</span>
              )}
            </div>
          </div>

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

          <div className="create-grid-3" style={{ marginTop: '16px' }}>
            {/* Nodes 0 */}
            <div className="form-group">
              <label htmlFor="nodesCount">
                Nodes <span className="label-badge">0</span>
              </label>
              <input
                type="text"
                id="nodesCount"
                placeholder="No nodes defined"
                disabled
                className="disabled-input"
              />
            </div>

            {/* Attachment */}
            <div className="form-group span-2">
              <label htmlFor="attachment">Attachment</label>
              <div className="attachment-input-wrapper">
                <input
                  type="text"
                  id="attachment"
                  name="attachment"
                  placeholder="filename.pdf"
                  value={formData.attachment}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="btn-browse-file"
                  onClick={() => {
                    const fakeFileName = 'Archetype_Visio_Flow_' + Date.now().toString().slice(-4) + '.vsdx';
                    setFormData((prev) => ({ ...prev, attachment: fakeFileName }));
                  }}
                >
                  Browse
                </button>
              </div>
            </div>
          </div>

          <div className="create-grid-2" style={{ marginTop: '16px' }}>
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

            {/* L1 Financial Flow */}
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

        {/* Card: Counter 0 */}
        <div className="create-card" style={{ marginTop: '20px' }}>
          <div className="create-card-header-row">
            <div className="create-card-section-title">
              COUNTER <span className="label-badge">0</span>
            </div>
            <button
              type="button"
              className="btn-secondary-action"
              onClick={() => alert('Counter created')}
            >
              <Plus size={14} />
              <span>Add</span>
            </button>
          </div>

          <div className="empty-subcard">
            No counters defined. Click + Add to create one.
          </div>
        </div>

        {/* Card: Nodes 0 Items */}
        <div className="create-card" style={{ marginTop: '20px' }}>
          <div className="create-card-header-row">
            <div className="create-card-section-title">
              NODES <span className="label-badge">0 Items</span>
            </div>
            <button
              type="button"
              className="btn-secondary-action"
              onClick={() => alert('Add a counter first to define nodes')}
            >
              <Plus size={14} />
              <span>Add</span>
            </button>
          </div>

          <div className="empty-subcard">
            Add a counter first to define nodes.
          </div>
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
    </div>
  );
}
