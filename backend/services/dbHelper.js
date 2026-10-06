import { getDbPool } from '../config/db.js';
import { SCHEMA_NAME } from '../config/schema.js';

/**
 * Code-First Database Helper (Queryless CRUD Engine)
 * 
 * Allows inserting, updating, and querying records dynamically through
 * pure JavaScript objects without writing raw SQL INSERT/UPDATE query strings.
 */

/**
 * Insert a record into a database table through code
 * 
 * @param {string} tableName - e.g. 'lane_headers'
 * @param {Object} data - Key-value pair of column names and values
 * @param {string} schemaName - defaults to process.env.DB_SCHEMA || 'archetype'
 * @returns {Promise<Object>} Inserted data object
 */
export const insertRecord = async (tableName, data, schemaName = SCHEMA_NAME) => {
  const pool = await getDbPool();

  // Filter out undefined values
  const validEntries = Object.entries(data).filter(([_, val]) => val !== undefined);
  if (validEntries.length === 0) {
    throw new Error(`[dbHelper] Cannot insert empty data into table [${tableName}]`);
  }

  const columns = validEntries.map(([col]) => `[${col}]`).join(', ');
  const paramPlaceholders = validEntries.map(([col]) => `@p_${col}`).join(', ');

  const request = pool.request();
  for (const [col, val] of validEntries) {
    request.input(`p_${col}`, val);
  }

  const sqlQuery = `
    INSERT INTO [${schemaName}].[${tableName}] (${columns})
    VALUES (${paramPlaceholders});
  `;

  await request.query(sqlQuery);
  return { success: true, ...data };
};

/**
 * Update a record in a database table through code
 * 
 * @param {string} tableName - e.g. 'lane_headers'
 * @param {Object} data - Key-value pair of column names and new values to set
 * @param {Object} where - Key-value pair of conditions (e.g. { archetype_id: 'ARC-001' })
 * @param {string} schemaName
 */
export const updateRecord = async (tableName, data, where, schemaName = SCHEMA_NAME) => {
  const pool = await getDbPool();

  const updateEntries = Object.entries(data).filter(([_, val]) => val !== undefined);
  const whereEntries = Object.entries(where);

  if (updateEntries.length === 0) {
    throw new Error(`[dbHelper] No fields provided to update in table [${tableName}]`);
  }
  if (whereEntries.length === 0) {
    throw new Error(`[dbHelper] Cannot perform UPDATE without a WHERE condition on table [${tableName}]`);
  }

  const setClause = updateEntries.map(([col]) => `[${col}] = @set_${col}`).join(', ');
  const whereClause = whereEntries.map(([col]) => `[${col}] = @where_${col}`).join(' AND ');

  const request = pool.request();
  for (const [col, val] of updateEntries) {
    request.input(`set_${col}`, val);
  }
  for (const [col, val] of whereEntries) {
    request.input(`where_${col}`, val);
  }

  const sqlQuery = `
    UPDATE [${schemaName}].[${tableName}]
    SET ${setClause}
    WHERE ${whereClause};
  `;

  const result = await request.query(sqlQuery);
  return { success: true, rowsAffected: result.rowsAffected[0] };
};

/**
 * Find a single record by matching conditions
 */
export const findRecord = async (tableName, where, schemaName = SCHEMA_NAME) => {
  const pool = await getDbPool();
  const whereEntries = Object.entries(where);

  if (whereEntries.length === 0) {
    throw new Error(`[dbHelper] Condition required for findRecord in [${tableName}]`);
  }

  const whereClause = whereEntries.map(([col]) => `[${col}] = @where_${col}`).join(' AND ');
  const request = pool.request();
  for (const [col, val] of whereEntries) {
    request.input(`where_${col}`, val);
  }

  const sqlQuery = `
    SELECT TOP 1 *
    FROM [${schemaName}].[${tableName}]
    WHERE ${whereClause};
  `;

  const result = await request.query(sqlQuery);
  return result.recordset[0] || null;
};

/**
 * Find records with optional ordering
 */
export const findRecords = async (tableName, { where = {}, orderBy = 'created_at DESC', limit = 100 } = {}, schemaName = SCHEMA_NAME) => {
  const pool = await getDbPool();
  const whereEntries = Object.entries(where);

  const request = pool.request();
  let whereClause = '';
  if (whereEntries.length > 0) {
    whereClause = 'WHERE ' + whereEntries.map(([col]) => `[${col}] = @where_${col}`).join(' AND ');
    for (const [col, val] of whereEntries) {
      request.input(`where_${col}`, val);
    }
  }

  const topClause = limit ? `TOP ${parseInt(limit, 10)}` : '';
  const orderClause = orderBy ? `ORDER BY ${orderBy}` : '';

  const sqlQuery = `
    SELECT ${topClause} *
    FROM [${schemaName}].[${tableName}]
    ${whereClause}
    ${orderClause};
  `;

  const result = await request.query(sqlQuery);
  return result.recordset;
};

export default {
  insertRecord,
  updateRecord,
  findRecord,
  findRecords
};
