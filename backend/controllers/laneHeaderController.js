import { getDbPool, sql } from '../config/db.js';

const SCHEMA = process.env.DB_SCHEMA || 'archetype';

// GET all lane headers
export const getAllLaneHeaders = async (req, res) => {
  try {
    const pool = await getDbPool();
    const result = await pool.request().query(`
      SELECT 
        archetype_id,
        cscl_lane_id,
        code,
        title,
        status,
        owner_email,
        wave,
        short_description,
        plan_team,
        plan_grp,
        project,
        nodes_count,
        attachment_name,
        l1_physical_flow,
        l1_financial_flow,
        created_at,
        updated_at
      FROM [${SCHEMA}].[lane_headers]
      ORDER BY created_at DESC
    `);
    res.json({
      success: true,
      count: result.recordset.length,
      data: result.recordset
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

    res.json({
      success: true,
      data: result.recordset[0]
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
    code,
    title,
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
    l1FinancialFlow
  } = req.body;

  if (!archetypeId || !csclLaneId || !owner) {
    return res.status(400).json({
      success: false,
      message: 'archetypeId, csclLaneId, and owner are required fields'
    });
  }

  try {
    const pool = await getDbPool();
    await pool.request()
      .input('archetype_id', sql.VarChar(50), archetypeId)
      .input('cscl_lane_id', sql.VarChar(50), csclLaneId)
      .input('code', sql.VarChar(100), code || null)
      .input('title', sql.VarChar(255), title || null)
      .input('status', sql.VarChar(50), status)
      .input('owner_email', sql.VarChar(255), owner)
      .input('wave', sql.VarChar(50), wave || null)
      .input('short_description', sql.VarChar(500), shortDescription || null)
      .input('plan_team', sql.VarChar(100), planTeam || null)
      .input('plan_grp', sql.VarChar(100), planGrp || null)
      .input('project', sql.VarChar(100), project || null)
      .input('nodes_count', sql.VarChar(50), nodesCount)
      .input('attachment_name', sql.VarChar(255), attachmentName || null)
      .input('l1_physical_flow', sql.VarChar(255), l1PhysicalFlow || null)
      .input('l1_financial_flow', sql.VarChar(255), l1FinancialFlow || null)
      .query(`
        INSERT INTO [${SCHEMA}].[lane_headers] (
          archetype_id,
          cscl_lane_id,
          code,
          title,
          status,
          owner_email,
          wave,
          short_description,
          plan_team,
          plan_grp,
          project,
          nodes_count,
          attachment_name,
          l1_physical_flow,
          l1_financial_flow
        ) VALUES (
          @archetype_id,
          @cscl_lane_id,
          @code,
          @title,
          @status,
          @owner_email,
          @wave,
          @short_description,
          @plan_team,
          @plan_grp,
          @project,
          @nodes_count,
          @attachment_name,
          @l1_physical_flow,
          @l1_financial_flow
        )
      `);

    res.status(201).json({
      success: true,
      message: 'Lane header created successfully',
      data: { archetypeId, csclLaneId, code, status }
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
