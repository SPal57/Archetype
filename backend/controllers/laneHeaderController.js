import { getDbPool, sql } from '../config/db.js';
import { insertRecord, updateRecord, getTableColumns, clearColumnsCache } from '../services/dbHelper.js';
import { schemaManager } from '../services/schemaManager.js';

const SCHEMA = process.env.DB_SCHEMA || 'archetype';

// Ensure table exists on the fly (auto-heals if dropped)
async function ensureTableReady() {
  try {
    const exists = await schemaManager.tableExists('lane_headers', SCHEMA);
    if (!exists) {
      console.log(`[laneHeaderController] Table [${SCHEMA}].[lane_headers] missing. Auto-creating table...`);
      await schemaManager.syncSchema();
      clearColumnsCache();
    }
  } catch (err) {
    console.warn('[laneHeaderController] Table readiness check warning:', err.message);
  }
}

// Helper to ensure Nodes column always receives a clean string
function formatNodesValue(body) {
  if (typeof body.Nodes === 'string' && body.Nodes.trim()) return body.Nodes.trim();
  if (typeof body.nodesCount === 'string' && body.nodesCount.trim()) return body.nodesCount.trim();
  if (typeof body.nodes === 'string' && body.nodes.trim()) return body.nodes.trim();
  if (Array.isArray(body.nodes)) return `${body.nodes.length} nodes defined`;
  return '0 nodes defined';
}

// Helper to map DB record to frontend model
function mapLaneHeaderRow(row) {
  const codeId = row.ARCHT_ID || row.archetype_id || '';
  const laneId = row.CSCL_Lane_ID || row.cscl_lane_id || '';
  const status = row.Status || row.status || '00-New';
  const owner = row.Owner || row.owner_email || '';
  const shortDesc = row.Short_desc || row.short_description || '';
  const franchise = row.Franchise || row.franchise || '';
  const ownerRole = row.Owner_role || row.owner_role || '';
  const wave = row.Wave || row.wave || '';
  const prevWaveCsclId = row.Prev_Wave_CSCL_ID || row.prev_wave_cscl_id || '';
  const nodes = row.Nodes || row.nodes_count || '0 nodes defined';
  const planGrp = row.Plan_GRP || row.plan_grp || '';
  const planTeam = row.PLAN_team || row.plan_team || '';
  const project = row.TranSCend_PRJ || row.project || '';
  const comments = row.Comments || row.comments || '';
  const skuCount = row.SKU_Count !== undefined && row.SKU_Count !== null ? row.SKU_Count : (row.sku_count || 0);
  const salesVol = row.Sales_Vol || row.sales_vol || '';
  const transactionsVol = row.Tranactions_Vol || row.transactions_vol || '';
  const apsRelevant = row.OMP_relevant || row.omp_relevant || '';
  const lego = row.LEGO || row.lego || '';
  const returns = row.Returns || row.returns || '';
  const physicalFlow = row.Physical_flow || row.l1_physical_flow || '';
  const financialFlow = row.Financial_flow || row.l1_financial_flow || '';
  const description = row.Description || row.description || '';
  const fileLink = row.File_link || row.file_link || '';
  const prjArchId = row.prj_arch_ID || row.prj_arch_id || '';
  const documentation = row.Documentation || row.documentation || '';
  const createdAt = row.created_at;
  const updatedAt = row.updated_at;

  return {
    id: codeId,
    archetypeId: codeId,
    archtId: codeId,
    csclLaneId: laneId,
    laneId: laneId,
    code: codeId,
    codeLines: codeId.includes('-') ? codeId.split('-') : [codeId],
    shortDesc,
    shortDescription: shortDesc,
    ownerRole,
    owner,
    ownerEmail: owner,
    updatedBy: owner,
    status,
    pfcStatus: status,
    pfcStatusClass: status === 'Approved' ? 'status-dot-approved' : (status === 'In Review' ? 'status-dot-review' : 'status-dot-new'),
    wave,
    prevWaveCsclId,
    nodes: [],
    nodesCount: nodes,
    counters: [],
    planGrp,
    franchise,
    planTeam,
    project,
    transcendPrj: project,
    comments,
    skuCount,
    salesVol,
    transactionsVol,
    apsRelevant,
    ompRelevant: apsRelevant,
    lego,
    returns,
    physicalFlow,
    financialFlow,
    description,
    fileLink,
    prjArchId,
    documentation,
    visioStatus: row.visio_status || (fileLink ? 'Approval In Progress' : 'Not Uploaded'),
    attachmentName: fileLink || row.attachment_name || '',
    approvals: {
      approved: row.approvals_approved ?? (fileLink ? 1 : 0),
      total: row.approvals_total ?? 3,
      steps: fileLink ? ['approved', 'pending', 'pending'] : ['pending', 'pending', 'pending']
    },
    lastUpdate: new Date(updatedAt || createdAt || Date.now()).toISOString().slice(0, 10)
  };
}

// GET all lane headers
export const getAllLaneHeaders = async (req, res) => {
  try {
    await ensureTableReady();
    const pool = await getDbPool();
    const result = await pool.request().query(`
      SELECT *
      FROM [${SCHEMA}].[lane_headers]
      ORDER BY created_at DESC
    `);

    const mappedData = result.recordset.map(mapLaneHeaderRow);

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
    await ensureTableReady();
    const pool = await getDbPool();
    const result = await pool.request()
      .input('id', sql.VarChar(50), id)
      .query(`
        SELECT TOP 1 *
        FROM [${SCHEMA}].[lane_headers]
        WHERE ARCHT_ID = @id OR CSCL_Lane_ID = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Lane header with ID ${id} not found`
      });
    }

    res.json({
      success: true,
      data: mapLaneHeaderRow(result.recordset[0])
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
  const b = req.body;
  const archId = (b.ARCHT_ID || b.archetypeId || b.archtId || '').trim();
  const csclId = (b.CSCL_Lane_ID || b.csclLaneId || b.laneId || '').trim();
  const ownerVal = (b.Owner || b.owner || b.ownerEmail || '').trim();

  // Mandatory fields: Archetype ID and CSCL Lane ID
  if (!archId || !csclId) {
    return res.status(400).json({
      success: false,
      message: 'Archetype ID and CSCL Lane ID are required fields.'
    });
  }

  const rawSku = b.SKU_Count !== undefined ? b.SKU_Count : b.skuCount;
  const skuNum = rawSku !== undefined && rawSku !== null && rawSku !== '' ? Number(rawSku) : 0;
  const skuCount = isNaN(skuNum) ? 0 : skuNum;

  try {
    await ensureTableReady();
    const pool = await getDbPool();
    const cols = await getTableColumns('lane_headers', SCHEMA);
    const colNames = cols.map((c) => c.columnName.toLowerCase());
    const archCol = colNames.includes('archetype_id') ? 'archetype_id' : 'ARCHT_ID';
    const csclCol = colNames.includes('cscl_lane_id')
      ? (cols.find((c) => c.columnName.toLowerCase() === 'cscl_lane_id')?.columnName || 'CSCL_Lane_ID')
      : 'CSCL_Lane_ID';

    // Uniqueness validation for new Archetype
    const duplicateCheck = await pool.request()
      .input('archId', sql.VarChar(50), archId)
      .input('csclId', sql.VarChar(50), csclId)
      .query(`
        SELECT [${archCol}] AS archId, [${csclCol}] AS csclId
        FROM [${SCHEMA}].[lane_headers]
        WHERE UPPER([${archCol}]) = UPPER(@archId) OR UPPER([${csclCol}]) = UPPER(@csclId)
      `);

    if (duplicateCheck.recordset.length > 0) {
      const existing = duplicateCheck.recordset[0];
      if (existing.archId?.toUpperCase() === archId.toUpperCase()) {
        return res.status(409).json({
          success: false,
          message: `Archetype ID "${archId}" already exists.`
        });
      }
      if (existing.csclId?.toUpperCase() === csclId.toUpperCase()) {
        return res.status(409).json({
          success: false,
          message: `CSCL Lane ID "${csclId}" already exists.`
        });
      }
    }

    await insertRecord('lane_headers', {
      ARCHT_ID: archId,
      Short_desc: b.Short_desc || b.shortDesc || b.shortDescription || null,
      Owner_role: b.Owner_role || b.ownerRole || null,
      Owner: ownerVal || null,
      CSCL_Lane_ID: csclId,
      Status: b.Status || b.status || '00-New',
      Wave: b.Wave || b.wave || null,
      Prev_Wave_CSCL_ID: b.Prev_Wave_CSCL_ID || b.prevWaveCsclId || null,
      Nodes: formatNodesValue(b),
      Plan_GRP: b.Plan_GRP || b.planGrp || null,
      Franchise: b.Franchise || b.franchise || null,
      PLAN_team: b.PLAN_team || b.planTeam || null,
      TranSCend_PRJ: b.TranSCend_PRJ || b.project || b.transcendPrj || null,
      Comments: b.Comments || b.comments || null,
      SKU_Count: skuCount,
      Sales_Vol: b.Sales_Vol || b.salesVol || null,
      Tranactions_Vol: b.Tranactions_Vol || b.transactionsVol || null,
      OMP_relevant: b.OMP_relevant || b.ompRelevant || b.apsRelevant || null,
      LEGO: b.LEGO || b.lego || null,
      Returns: b.Returns || b.returns || null,
      Physical_flow: b.Physical_flow || b.physicalFlow || null,
      Financial_flow: b.Financial_flow || b.financialFlow || null,
      Description: b.Description || b.description || null,
      File_link: b.File_link || b.fileLink || null,
      prj_arch_ID: b.prj_arch_ID || b.prjArchId || null,
      Documentation: b.Documentation || b.documentation || null
    }, SCHEMA);

    res.status(201).json({
      success: true,
      message: 'Lane header created successfully',
      data: {
        id: archId,
        archetypeId: archId,
        csclLaneId: csclId,
        owner: ownerVal
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
  const { id } = req.params; // Original ARCHT_ID
  const b = req.body;
  const targetArchId = (b.ARCHT_ID || b.archetypeId || b.archtId || id).trim();
  const targetCsclId = (b.CSCL_Lane_ID || b.csclLaneId || b.laneId || '').trim();
  const ownerVal = (b.Owner || b.owner || b.ownerEmail || '').trim();

  // Mandatory fields: Archetype ID and CSCL Lane ID
  if (!targetArchId || !targetCsclId) {
    return res.status(400).json({
      success: false,
      message: 'Archetype ID and CSCL Lane ID are required fields.'
    });
  }

  try {
    await ensureTableReady();
    const pool = await getDbPool();
    const cols = await getTableColumns('lane_headers', SCHEMA);
    const colNames = cols.map((c) => c.columnName.toLowerCase());
    const archCol = colNames.includes('archetype_id') ? 'archetype_id' : 'ARCHT_ID';
    const csclCol = colNames.includes('cscl_lane_id')
      ? (cols.find((c) => c.columnName.toLowerCase() === 'cscl_lane_id')?.columnName || 'CSCL_Lane_ID')
      : 'CSCL_Lane_ID';

    // Uniqueness check across other archetypes
    const duplicateCheck = await pool.request()
      .input('target_arch_id', sql.VarChar(50), targetArchId)
      .input('target_cscl_id', sql.VarChar(50), targetCsclId)
      .input('original_id', sql.VarChar(50), id)
      .query(`
        SELECT [${archCol}] AS archId, [${csclCol}] AS csclId
        FROM [${SCHEMA}].[lane_headers]
        WHERE UPPER([${archCol}]) != UPPER(@original_id)
          AND (UPPER([${archCol}]) = UPPER(@target_arch_id) OR UPPER([${csclCol}]) = UPPER(@target_cscl_id))
      `);

    if (duplicateCheck.recordset.length > 0) {
      const existing = duplicateCheck.recordset[0];
      if (existing.archId?.toUpperCase() === targetArchId.toUpperCase()) {
        return res.status(409).json({
          success: false,
          message: `Archetype ID "${targetArchId}" already exists.`
        });
      }
      if (existing.csclId?.toUpperCase() === targetCsclId.toUpperCase()) {
        return res.status(409).json({
          success: false,
          message: `CSCL Lane ID "${targetCsclId}" already exists.`
        });
      }
    }

    const rawSku = b.SKU_Count !== undefined ? b.SKU_Count : b.skuCount;
    const skuNum = rawSku !== undefined && rawSku !== null && rawSku !== '' ? Number(rawSku) : 0;
    const skuCount = isNaN(skuNum) ? 0 : skuNum;

    await updateRecord('lane_headers', {
      ARCHT_ID: targetArchId,
      Short_desc: b.Short_desc || b.shortDesc || b.shortDescription || null,
      Owner_role: b.Owner_role || b.ownerRole || null,
      Owner: ownerVal || null,
      CSCL_Lane_ID: targetCsclId || null,
      Status: b.Status || b.status || '00-New',
      Wave: b.Wave || b.wave || null,
      Prev_Wave_CSCL_ID: b.Prev_Wave_CSCL_ID || b.prevWaveCsclId || null,
      Nodes: formatNodesValue(b),
      Plan_GRP: b.Plan_GRP || b.planGrp || null,
      Franchise: b.Franchise || b.franchise || null,
      PLAN_team: b.PLAN_team || b.planTeam || null,
      TranSCend_PRJ: b.TranSCend_PRJ || b.project || b.transcendPrj || null,
      Comments: b.Comments || b.comments || null,
      SKU_Count: skuCount,
      Sales_Vol: b.Sales_Vol || b.salesVol || null,
      Tranactions_Vol: b.Tranactions_Vol || b.transactionsVol || null,
      OMP_relevant: b.OMP_relevant || b.ompRelevant || b.apsRelevant || null,
      LEGO: b.LEGO || b.lego || null,
      Returns: b.Returns || b.returns || null,
      Physical_flow: b.Physical_flow || b.physicalFlow || null,
      Financial_flow: b.Financial_flow || b.financialFlow || null,
      Description: b.Description || b.description || null,
      File_link: b.File_link || b.fileLink || null,
      prj_arch_ID: b.prj_arch_ID || b.prjArchId || null,
      Documentation: b.Documentation || b.documentation || null,
      updated_at: new Date()
    }, {
      ARCHT_ID: id
    }, SCHEMA);

    res.json({
      success: true,
      message: 'Lane header updated successfully',
      data: {
        id: targetArchId,
        archetypeId: targetArchId,
        csclLaneId: targetCsclId
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