import { getDbPool, sql } from '../config/db.js';
import { insertRecord, updateRecord } from '../services/dbHelper.js';

const SCHEMA = process.env.DB_SCHEMA || 'archetype';

// GET all lane headers
export const getAllLaneHeaders = async (req, res) => {
  try {
    const pool = await getDbPool();
    const result = await pool.request().query(`
      SELECT 
        archetype_id,
        cscl_lane_id,
        legal_entities,
        status,
        owner_email,
        wave,
        short_description,
        plan_team,
        plan_grp,
        project,
        nodes_count,
        attachment_name,
        visio_status,
        approvals_approved,
        approvals_total,
        l1_physical_flow,
        l1_financial_flow,
        franchise,
        owner_role,
        comments,
        created_at,
        updated_at
      FROM [${SCHEMA}].[lane_headers]
      ORDER BY created_at DESC
    `);

    // Map database columns to camelCase for the frontend
    const mappedData = result.recordset.map((row) => {
      const codeId = row.archetype_id;
      return {
        id: codeId,
        archetypeId: codeId,
        csclLaneId: row.cscl_lane_id,
        laneId: row.cscl_lane_id,
        code: codeId,
        codeLines: codeId.includes('-') ? codeId.split('-') : [codeId],
        shortDescription: row.short_description || '',
        description: row.short_description || '',
        legalEntities: row.legal_entities || '',
        status: row.status,
        pfcStatus: row.status,
        pfcStatusClass: row.status === 'Approved' ? 'status-dot-approved' : (row.status === 'In Review' ? 'status-dot-review' : 'status-dot-new'),
        owner: row.owner_email,
        ownerEmail: row.owner_email,
        updatedBy: row.owner_email,
        wave: row.wave,
        planTeam: row.plan_team,
        planGrp: row.plan_grp,
        project: row.project,
        nodesCount: row.nodes_count,
        attachmentName: row.attachment_name,
        attachment: row.attachment_name,
        visioStatus: row.visio_status || (row.attachment_name ? 'Approval In Progress' : 'Not Uploaded'),
        visioClass: (row.visio_status || (row.attachment_name ? 'Approval In Progress' : 'Not Uploaded')).toLowerCase().replace(/\s+/g, '-'),
        approvals: {
          approved: row.approvals_approved ?? (row.attachment_name ? 1 : 0),
          total: row.approvals_total ?? 3,
          steps: row.attachment_name ? ['approved', 'pending', 'pending'] : ['pending', 'pending', 'pending']
        },
        l1PhysicalFlow: row.l1_physical_flow,
        l1FinancialFlow: row.l1_financial_flow,
        franchise: row.franchise || '',
        ownerRole: row.owner_role || '',
        comments: row.comments || '',
        lastUpdate: new Date(row.updated_at || row.created_at).toISOString().slice(0, 10).replace(/-/g, '/')
      };
    });

    res.json({
      success: true,
      count: mappedData.length,
      data: mappedData
    });
  } catch (error) {
    console.error('Error fetching lane headers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve lane headers from database',
      error: error.message
    });
  }
};

// GET single lane header by archetype_id or cscl_lane_id
export const getLaneHeaderById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getDbPool();
    const result = await pool.request()
      .input('id', sql.VarChar(50), id)
      .query(`
        SELECT TOP 1 *
        FROM [${SCHEMA}].[lane_headers]
        WHERE archetype_id = @id OR cscl_lane_id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Lane header with ID ${id} not found`
      });
    }

    const row = result.recordset[0];
    const codeId = row.archetype_id;
    res.json({
      success: true,
      data: {
        id: codeId,
        archetypeId: codeId,
        csclLaneId: row.cscl_lane_id,
        laneId: row.cscl_lane_id,
        code: codeId,
        codeLines: codeId.includes('-') ? codeId.split('-') : [codeId],
        shortDescription: row.short_description || '',
        description: row.short_description || '',
        legalEntities: row.legal_entities || '',
        status: row.status,
        pfcStatus: row.status,
        owner: row.owner_email,
        ownerEmail: row.owner_email,
        wave: row.wave,
        planTeam: row.plan_team,
        planGrp: row.plan_grp,
        project: row.project,
        nodesCount: row.nodes_count,
        attachmentName: row.attachment_name,
        visioStatus: row.visio_status || (row.attachment_name ? 'Approval In Progress' : 'Not Uploaded'),
        approvals: {
          approved: row.approvals_approved ?? (row.attachment_name ? 1 : 0),
          total: row.approvals_total ?? 3
        },
        l1PhysicalFlow: row.l1_physical_flow,
        l1FinancialFlow: row.l1_financial_flow,
        franchise: row.franchise || '',
        ownerRole: row.owner_role || '',
        comments: row.comments || '',
        lastUpdate: new Date(row.updated_at || row.created_at).toISOString().slice(0, 10).replace(/-/g, '/')
      }
    });
  } catch (error) {
    console.error('Error fetching lane header by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve lane header',
      error: error.message
    });
  }
};

// CREATE new lane header
export const createLaneHeader = async (req, res) => {
  const {
    archetypeId,
    csclLaneId,
    legalEntities,
    status = 'Draft',
    owner,
    wave,
    shortDescription,
    planTeam,
    planGrp,
    project,
    nodesCount = '0 nodes defined',
    attachmentName,
    l1PhysicalFlow,
    l1FinancialFlow,
    franchise,
    ownerRole,
    comments
  } = req.body;

  // Mandatory fields: archetypeId, csclLaneId, owner
  if (!archetypeId?.trim() || !csclLaneId?.trim() || !owner?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Archetype ID, CSCL Lane ID, and Owner are required fields.'
    });
  }

  // Determine visio status & approvals based on attachment
  const hasVisio = attachmentName && attachmentName.trim().length > 0;
  const visioStatus = hasVisio ? 'Approval In Progress' : 'Not Uploaded';
  const approvalsApproved = hasVisio ? 1 : 0;
  const approvalsTotal = 3;

  try {
    await insertRecord('lane_headers', {
      archetype_id: archetypeId.trim(),
      cscl_lane_id: csclLaneId.trim(),
      legal_entities: legalEntities ? legalEntities.trim() : null,
      status: status || 'Draft',
      owner_email: owner.trim(),
      wave: wave || null,
      short_description: shortDescription ? shortDescription.trim() : null,
      plan_team: planTeam || null,
      plan_grp: planGrp || null,
      project: project || null,
      nodes_count: nodesCount || '0 nodes defined',
      attachment_name: attachmentName || null,
      visio_status: visioStatus,
      approvals_approved: approvalsApproved,
      approvals_total: approvalsTotal,
      l1_physical_flow: l1PhysicalFlow || null,
      l1_financial_flow: l1FinancialFlow || null,
      franchise: franchise ? franchise.trim() : null,
      owner_role: ownerRole ? ownerRole.trim() : null,
      comments: comments ? comments.trim() : null
    });

    res.status(201).json({
      success: true,
      message: 'Lane header created successfully',
      data: {
        id: archetypeId.trim(),
        archetypeId: archetypeId.trim(),
        csclLaneId: csclLaneId.trim(),
        shortDescription: shortDescription ? shortDescription.trim() : '',
        legalEntities: legalEntities ? legalEntities.trim() : '',
        status,
        visioStatus,
        owner: owner.trim(),
        franchise: franchise ? franchise.trim() : '',
        ownerRole: ownerRole ? ownerRole.trim() : '',
        comments: comments ? comments.trim() : ''
      }
    });
  } catch (error) {
    console.error('Error creating lane header:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create lane header',
      error: error.message
    });
  }
};

// UPDATE lane header
export const updateLaneHeader = async (req, res) => {
  const { id } = req.params; // Original archetype_id
  const {
    archetypeId,
    csclLaneId,
    legalEntities,
    status,
    owner,
    wave,
    shortDescription,
    planTeam,
    planGrp,
    project,
    nodesCount,
    attachmentName,
    l1PhysicalFlow,
    l1FinancialFlow,
    franchise,
    ownerRole,
    comments
  } = req.body;

  const targetArchId = (archetypeId || id).trim();
  const targetCsclId = csclLaneId?.trim();

  // Mandatory checks
  if (!targetArchId || !targetCsclId || !owner?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Archetype ID, CSCL Lane ID, and Owner are required fields.'
    });
  }

  try {
    const pool = await getDbPool();

    // 1. Uniqueness check: ensure new archetypeId or csclLaneId does not conflict with another existing record
    const duplicateCheck = await pool.request()
      .input('original_id', sql.VarChar(50), id)
      .input('target_arch_id', sql.VarChar(50), targetArchId)
      .input('target_cscl_id', sql.VarChar(50), targetCsclId)
      .query(`
        SELECT archetype_id, cscl_lane_id 
        FROM [${SCHEMA}].[lane_headers]
        WHERE (archetype_id = @target_arch_id OR cscl_lane_id = @target_cscl_id)
        AND archetype_id != @original_id
      `);

    if (duplicateCheck.recordset.length > 0) {
      const match = duplicateCheck.recordset[0];
      const conflictMsg = match.archetype_id.toUpperCase() === targetArchId.toUpperCase() 
        ? `Archetype ID "${targetArchId}" already exists in another record.` 
        : `CSCL Lane ID "${targetCsclId}" already exists in another record.`;
      return res.status(409).json({
        success: false,
        message: conflictMsg
      });
    }

    const hasVisio = attachmentName && attachmentName.trim().length > 0;
    const visioStatus = hasVisio ? 'Approval In Progress' : 'Not Uploaded';

    await updateRecord('lane_headers', {
      archetype_id: targetArchId,
      cscl_lane_id: targetCsclId,
      legal_entities: legalEntities ? legalEntities.trim() : null,
      status: status || 'Draft',
      owner_email: owner.trim(),
      wave: wave || null,
      short_description: shortDescription ? shortDescription.trim() : null,
      plan_team: planTeam || null,
      plan_grp: planGrp || null,
      project: project || null,
      nodes_count: nodesCount || '0 nodes defined',
      attachment_name: attachmentName || null,
      visio_status: visioStatus,
      l1_physical_flow: l1PhysicalFlow || null,
      l1_financial_flow: l1FinancialFlow || null,
      franchise: franchise ? franchise.trim() : null,
      owner_role: ownerRole ? ownerRole.trim() : null,
      comments: comments ? comments.trim() : null,
      updated_at: new Date()
    }, {
      archetype_id: id
    });

    res.json({
      success: true,
      message: 'Lane header updated successfully',
      data: {
        id: targetArchId,
        archetypeId: targetArchId,
        csclLaneId: targetCsclId,
        shortDescription: shortDescription ? shortDescription.trim() : '',
        legalEntities: legalEntities ? legalEntities.trim() : '',
        status,
        visioStatus,
        owner: owner.trim(),
        franchise: franchise ? franchise.trim() : '',
        ownerRole: ownerRole ? ownerRole.trim() : '',
        comments: comments ? comments.trim() : ''
      }
    });
  } catch (error) {
    console.error('Error updating lane header:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update lane header in database',
      error: error.message
    });
  }
};