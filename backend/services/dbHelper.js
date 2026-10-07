import { getDbPool, sql } from '../config/db.js';
import { SCHEMA_NAME } from '../config/schema.js';

let columnsCache = {};

/**
 * Retrieve column metadata for a table to ensure safe, adaptive queries
 */
export const getTableColumns = async (tableName, schemaName = SCHEMA_NAME) => {
  const cacheKey = `${schemaName}.${tableName}`;
  if (columnsCache[cacheKey]) return columnsCache[cacheKey];

  try {
    const pool = await getDbPool();
    const res = await pool.request()
      .input('schema_name', sql.VarChar(100), schemaName)
      .input('table_name', sql.VarChar(100), tableName)
      .query(`
        SELECT COLUMN_NAME AS columnName, DATA_TYPE AS dataTypeName, IS_NULLABLE AS isNullable
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = @schema_name AND TABLE_NAME = @table_name
      `);
    if (res.recordset && res.recordset.length > 0) {
      columnsCache[cacheKey] = res.recordset;
      return res.recordset;
    }
  } catch (err) {
    console.warn(`[dbHelper] Column metadata inspection note for [${schemaName}].[${tableName}]:`, err.message);
  }
  return [];
};

export const clearColumnsCache = () => {
  columnsCache = {};
};

// Aliases mapping between new column names and legacy/camelCase column names
const COLUMN_ALIASES = {
  ARCHT_ID: ['ARCHT_ID', 'archetype_id', 'archetypeId', 'archtId', 'id'],
  Short_desc: ['Short_desc', 'short_description', 'shortDesc', 'shortDescription'],
  Owner_role: ['Owner_role', 'owner_role', 'ownerRole'],
  Owner: ['Owner', 'owner_email', 'owner', 'ownerEmail'],
  CSCL_Lane_ID: ['CSCL_Lane_ID', 'cscl_lane_id', 'csclLaneId', 'laneId'],
  Status: ['Status', 'status', 'pfcStatus'],
  Wave: ['Wave', 'wave'],
  Prev_Wave_CSCL_ID: ['Prev_Wave_CSCL_ID', 'prev_wave_cscl_id', 'prevWaveCsclId'],
  Nodes: ['Nodes', 'nodes_count', 'nodes', 'nodesCount'],
  Plan_GRP: ['Plan_GRP', 'plan_grp', 'planGrp'],
  Franchise: ['Franchise', 'franchise'],
  PLAN_team: ['PLAN_team', 'plan_team', 'planTeam'],
  TranSCend_PRJ: ['TranSCend_PRJ', 'project', 'transcendPrj'],
  Comments: ['Comments', 'comments'],
  SKU_Count: ['SKU_Count', 'sku_count', 'skuCount'],
  Sales_Vol: ['Sales_Vol', 'sales_vol', 'salesVol'],
  Tranactions_Vol: ['Tranactions_Vol', 'transactions_vol', 'transactionsVol'],
  OMP_relevant: ['OMP_relevant', 'omp_relevant', 'ompRelevant', 'apsRelevant'],
  LEGO: ['LEGO', 'lego'],
  Returns: ['Returns', 'returns'],
  Physical_flow: ['Physical_flow', 'physical_flow', 'physicalFlow', 'l1_physical_flow', 'l1PhysicalFlow'],
  Financial_flow: ['Financial_flow', 'financial_flow', 'financialFlow', 'l1_financial_flow', 'l1FinancialFlow'],
  Description: ['Description', 'description'],
  File_link: ['File_link', 'file_link', 'fileLink', 'attachment_name', 'attachmentName'],
  prj_arch_ID: ['prj_arch_ID', 'prj_arch_id', 'prjArchId'],
  Documentation: ['Documentation', 'documentation'],
  created_at: ['created_at', 'createdAt'],
  updated_at: ['updated_at', 'updatedAt']
};

/**
 * Match a provided data key to an existing table column name
 */
function resolveColumnValue(dbColName, data) {
  // Direct match
  if (data[dbColName] !== undefined) return data[dbColName];

  // Case-insensitive direct match
  const lowerCol = dbColName.toLowerCase();
  for (const [k, v] of Object.entries(data)) {
    if (k.toLowerCase() === lowerCol && v !== undefined) return v;
  }

  // Check aliases
  for (const [canonical, aliases] of Object.entries(COLUMN_ALIASES)) {
    const canonicalMatch = canonical.toLowerCase() === lowerCol;
    const inAliases = aliases.some((a) => a.toLowerCase() === lowerCol);
    if (canonicalMatch || inAliases) {
      for (const alias of aliases) {
        if (data[alias] !== undefined) return data[alias];
      }
    }
  }

  return undefined;
}

/**
 * Insert a record into a database table adaptively through code
 */
export const insertRecord = async (tableName, data, schemaName = SCHEMA_NAME) => {
  const pool = await getDbPool();
  const dbCols = await getTableColumns(tableName, schemaName);

  let finalEntries = [];

  if (dbCols.length > 0) {
    // Adaptive mapping: only insert columns that actually exist in the DB table
    for (const col of dbCols) {
      const colName = col.columnName;
      let val = resolveColumnValue(colName, data);

      if (val !== undefined) {
        // Handle numeric columns
        const isNumeric = col.dataTypeName?.toLowerCase().includes('int') || col.dataTypeName?.toLowerCase().includes('numeric');
        if (isNumeric) {
          if (val === '' || val === null) {
            val = col.isNullable ? null : 0;
          } else {
            const num = Number(val);
            val = isNaN(num) ? 0 : num;
          }
        } else if (val instanceof Date) {
          // Keep native Date for SQL DATETIME/DATETIME2
        } else if (typeof val === 'object' && val !== null) {
          if (Array.isArray(val)) {
            val = val.length > 0 ? `${val.length} nodes defined` : '0 nodes defined';
          } else {
            val = JSON.stringify(val);
          }
        } else if (val === '' && col.isNullable) {
          // Store clean null for empty strings on nullable columns
          val = null;
        }
        finalEntries.push([colName, val]);
      }
    }
  } else {
    // Fallback if table columns could not be inspected
    finalEntries = Object.entries(data).filter(([_, val]) => val !== undefined);
  }

  if (finalEntries.length === 0) {
    throw new Error(`[dbHelper] No valid matching fields to insert into table [${tableName}]`);
  }

  const columns = finalEntries.map(([col]) => `[${col}]`).join(', ');
  const paramPlaceholders = finalEntries.map(([col]) => `@p_${col}`).join(', ');

  const request = pool.request();
  for (const [col, val] of finalEntries) {
    if (val instanceof Date) {
      request.input(`p_${col}`, sql.DateTime2, val);
    } else {
      request.input(`p_${col}`, val);
    }
  }

  const sqlQuery = `
    INSERT INTO [${schemaName}].[${tableName}] (${columns})
    VALUES (${paramPlaceholders});
  `;

  await request.query(sqlQuery);
  return { success: true, ...data };
};

/**
 * Update a record in a database table adaptively through code
 */
export const updateRecord = async (tableName, data, where, schemaName = SCHEMA_NAME) => {
  const pool = await getDbPool();
  const dbCols = await getTableColumns(tableName, schemaName);

  let updateEntries = [];
  if (dbCols.length > 0) {
    for (const col of dbCols) {
      const colName = col.columnName;
      let val = resolveColumnValue(colName, data);
      if (val !== undefined) {
        const isNumeric = col.dataTypeName?.toLowerCase().includes('int') || col.dataTypeName?.toLowerCase().includes('numeric');
        if (isNumeric) {
          if (val === '' || val === null) {
            val = col.isNullable ? null : 0;
          } else {
            const num = Number(val);
            val = isNaN(num) ? 0 : num;
          }
        } else if (val instanceof Date) {
          // Keep native Date for SQL DATETIME/DATETIME2
        } else if (typeof val === 'object' && val !== null) {
          if (Array.isArray(val)) {
            val = val.length > 0 ? `${val.length} nodes defined` : '0 nodes defined';
          } else {
            val = JSON.stringify(val);
          }
        } else if (val === '' && col.isNullable) {
          val = null;
        }
        updateEntries.push([colName, val]);
      }
    }
  } else {
    updateEntries = Object.entries(data).filter(([_, val]) => val !== undefined);
  }

  // Resolve where column dynamically
  let whereEntries = [];
  if (dbCols.length > 0) {
    for (const [whereCol, whereVal] of Object.entries(where)) {
      const matchingCol = dbCols.find(
        (c) => c.columnName.toLowerCase() === whereCol.toLowerCase()
      );
      if (matchingCol) {
        whereEntries.push([matchingCol.columnName, whereVal]);
      } else {
        // Check alias (e.g. ARCHT_ID -> archetype_id)
        let resolvedWhereCol = whereCol;
        for (const [canonical, aliases] of Object.entries(COLUMN_ALIASES)) {
          if (canonical.toLowerCase() === whereCol.toLowerCase() || aliases.some((a) => a.toLowerCase() === whereCol.toLowerCase())) {
            const aliasMatch = dbCols.find((c) => aliases.some((a) => a.toLowerCase() === c.columnName.toLowerCase()));
            if (aliasMatch) {
              resolvedWhereCol = aliasMatch.columnName;
              break;
            }
          }
        }
        whereEntries.push([resolvedWhereCol, whereVal]);
      }
    }
  } else {
    whereEntries = Object.entries(where);
  }

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
    if (val instanceof Date) {
      request.input(`set_${col}`, sql.DateTime2, val);
    } else {
      request.input(`set_${col}`, val);
    }
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
  getTableColumns,
  clearColumnsCache,
  insertRecord,
  updateRecord,
  findRecord,
  findRecords
};
