import express from 'express';
import { schemaManager } from '../services/schemaManager.js';
import { tables, SCHEMA_NAME } from '../config/schema.js';
import { getDbPool } from '../config/db.js';

const router = express.Router();

/**
 * GET /api/schema/status
 * Returns the current schema definition in code and inspection status from the database.
 */
router.get('/status', async (req, res) => {
  try {
    const pool = await getDbPool();
    const result = await pool.request().query(`
      SELECT 
        t.name AS tableName,
        c.name AS columnName,
        ty.name AS dataTypeName,
        c.max_length AS maxLength,
        c.is_nullable AS isNullable
      FROM sys.tables t
      JOIN sys.schemas s ON t.schema_id = s.schema_id
      JOIN sys.columns c ON t.object_id = c.object_id
      JOIN sys.types ty ON c.user_type_id = ty.user_type_id
      WHERE s.name = '${SCHEMA_NAME}'
      ORDER BY t.name, c.column_id;
    `);

    // Group columns by table
    const dbTables = {};
    for (const row of result.recordset) {
      if (!dbTables[row.tableName]) {
        dbTables[row.tableName] = [];
      }
      dbTables[row.tableName].push({
        column: row.columnName,
        type: row.dataTypeName,
        nullable: row.isNullable
      });
    }

    res.json({
      success: true,
      schema: SCHEMA_NAME,
      codeDefinition: tables,
      liveDatabaseTables: dbTables
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to inspect database schema',
      error: err.message
    });
  }
});

/**
 * POST /api/schema/sync
 * Triggers code-first schema synchronization on demand
 */
router.post('/sync', async (req, res) => {
  try {
    const report = await schemaManager.syncSchema();
    res.json({
      success: true,
      message: 'Database schema successfully synchronized with code definitions',
      report
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Schema synchronization failed',
      error: err.message
    });
  }
});

/**
 * POST /api/schema/create-table
 * Dynamically creates a new table through code at runtime
 * Body: { tableName, columns }
 */
router.post('/create-table', async (req, res) => {
  const { tableName, columns } = req.body;
  if (!tableName || !columns || typeof columns !== 'object') {
    return res.status(400).json({
      success: false,
      message: 'tableName and columns object are required'
    });
  }

  try {
    const result = await schemaManager.createTable(tableName, columns);
    res.json({
      success: true,
      message: `Table [${tableName}] successfully created through code`,
      result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Failed to create table [${tableName}]`,
      error: err.message
    });
  }
});

/**
 * POST /api/schema/add-column
 * Dynamically adds a column to an existing table through code at runtime
 * Body: { tableName, columnName, colMeta }
 */
router.post('/add-column', async (req, res) => {
  const { tableName, columnName, colMeta } = req.body;
  if (!tableName || !columnName || !colMeta || !colMeta.type) {
    return res.status(400).json({
      success: false,
      message: 'tableName, columnName, and colMeta with type (e.g. VARCHAR(100)) are required'
    });
  }

  try {
    const result = await schemaManager.addColumn(tableName, columnName, colMeta);
    res.json({
      success: true,
      message: `Column [${columnName}] successfully added to [${tableName}] through code`,
      result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Failed to add column [${columnName}] to [${tableName}]`,
      error: err.message
    });
  }
});

export default router;
