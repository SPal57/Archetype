import { getDbPool, sql } from '../config/db.js';
import { SCHEMA_NAME, tables as defaultTables } from '../config/schema.js';

/**
 * Code-First Database Schema Manager
 * 
 * Inspects SQL Server and automatically creates tables and adds columns
 * based on pure JavaScript code definitions, without needing manual queries in SSMS.
 */
class SchemaManager {
  /**
   * Ensure schema (e.g. [archetype]) exists in the database
   */
  async ensureSchema(schemaName = SCHEMA_NAME) {
    const pool = await getDbPool();
    const query = `
      IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'${schemaName}')
      BEGIN
        EXEC('CREATE SCHEMA [${schemaName}]');
        PRINT 'Schema [${schemaName}] created.';
      END
    `;
    await pool.request().query(query);
  }

  /**
   * Check if a table exists in the database
   */
  async tableExists(tableName, schemaName = SCHEMA_NAME) {
    const pool = await getDbPool();
    const res = await pool.request().query(`
      SELECT 1 
      FROM sys.objects 
      WHERE object_id = OBJECT_ID(N'[${schemaName}].[${tableName}]') 
      AND type IN (N'U')
    `);
    return res.recordset.length > 0;
  }

  /**
   * Retrieve list of existing columns for a table from sys.columns
   */
  async getExistingColumns(tableName, schemaName = SCHEMA_NAME) {
    const pool = await getDbPool();
    const res = await pool.request().query(`
      SELECT 
        c.name AS columnName,
        t.name AS dataTypeName,
        c.max_length AS maxLength,
        c.is_nullable AS isNullable
      FROM sys.columns c
      JOIN sys.types t ON c.user_type_id = t.user_type_id
      WHERE c.object_id = OBJECT_ID(N'[${schemaName}].[${tableName}]')
    `);
    return res.recordset.map((r) => r.columnName.toLowerCase());
  }

  /**
   * Drop a specific table through code
   * Only drops the specified table if it exists; other tables and schemas remain untouched.
   */
  async dropTable(tableName, schemaName = SCHEMA_NAME) {
    const pool = await getDbPool();
    const query = `
      IF OBJECT_ID(N'[${schemaName}].[${tableName}]', 'U') IS NOT NULL
      BEGIN
        DROP TABLE [${schemaName}].[${tableName}];
        PRINT 'Table [${schemaName}].[${tableName}] dropped successfully.';
      END
    `;
    console.log(`[SchemaManager] Dropping table [${schemaName}].[${tableName}] through code...`);
    await pool.request().query(query);
    console.log(`[SchemaManager] Table [${schemaName}].[${tableName}] dropped successfully.`);
    return { success: true, table: tableName };
  }

  /**
   * Programmatically create a table through code
   * 
   * @param {string} tableName 
   * @param {Object} columnsDefinition 
   * @param {string} schemaName 
   */
  async createTable(tableName, columnsDefinition, schemaName = SCHEMA_NAME) {
    const pool = await getDbPool();
    await this.ensureSchema(schemaName);

    const columnDefs = [];
    const indexDefs = [];

    for (const [colName, colMeta] of Object.entries(columnsDefinition)) {
      let def = `[${colName}] ${colMeta.type}`;
      if (colMeta.primaryKey) {
        def += ' NOT NULL PRIMARY KEY';
      } else if (colMeta.nullable === false) {
        def += ' NOT NULL';
      } else {
        def += ' NULL';
      }

      if (colMeta.default !== undefined) {
        def += ` DEFAULT ${colMeta.default}`;
      }

      columnDefs.push(def);

      if (colMeta.index && !colMeta.primaryKey) {
        indexDefs.push(
          `CREATE NONCLUSTERED INDEX [IX_${tableName}_${colName}] ON [${schemaName}].[${tableName}] ([${colName}]);`
        );
      }
    }

    const createSql = `
      CREATE TABLE [${schemaName}].[${tableName}] (
        ${columnDefs.join(',\n        ')}
      );
    `;

    console.log(`[SchemaManager] Creating table [${schemaName}].[${tableName}] through code...`);
    await pool.request().query(createSql);

    // Create nonclustered indexes
    for (const idxSql of indexDefs) {
      try {
        await pool.request().query(idxSql);
      } catch (idxErr) {
        console.warn(`[SchemaManager] Index creation note for ${tableName}:`, idxErr.message);
      }
    }

    console.log(`[SchemaManager] Table [${schemaName}].[${tableName}] created successfully.`);
    return { success: true, table: tableName, columnsCreated: Object.keys(columnsDefinition).length };
  }

  /**
   * Programmatically add a new column to an existing table through code
   * 
   * @param {string} tableName 
   * @param {string} columnName 
   * @param {Object} colMeta - { type: 'VARCHAR(100)', nullable: true, default: null, index: false }
   * @param {string} schemaName 
   */
  async addColumn(tableName, columnName, colMeta, schemaName = SCHEMA_NAME) {
    const pool = await getDbPool();
    const existing = await this.getExistingColumns(tableName, schemaName);

    if (existing.includes(columnName.toLowerCase())) {
      return { success: true, message: `Column [${columnName}] already exists in [${tableName}].` };
    }

    let alterSql = `ALTER TABLE [${schemaName}].[${tableName}] ADD [${columnName}] ${colMeta.type}`;
    if (colMeta.nullable === false) {
      alterSql += ' NOT NULL';
    } else {
      alterSql += ' NULL';
    }

    if (colMeta.default !== undefined) {
      alterSql += ` DEFAULT ${colMeta.default}`;
    }

    console.log(`[SchemaManager] Adding column [${columnName}] to [${schemaName}].[${tableName}] through code...`);
    await pool.request().query(alterSql);

    if (colMeta.index) {
      const idxSql = `CREATE NONCLUSTERED INDEX [IX_${tableName}_${columnName}] ON [${schemaName}].[${tableName}] ([${columnName}]);`;
      try {
        await pool.request().query(idxSql);
      } catch (e) {
        // Index note
      }
    }

    console.log(`[SchemaManager] Column [${columnName}] successfully added to [${tableName}].`);
    return { success: true, table: tableName, columnAdded: columnName };
  }

  /**
   * Synchronize entire code schema definition with the database
   * Creates missing tables and adds missing columns automatically
   */
  async syncSchema(schemaConfig = defaultTables, schemaName = SCHEMA_NAME) {
    console.log(`[SchemaManager] Synchronizing database schema [${schemaName}] with code definitions...`);
    await this.ensureSchema(schemaName);

    const report = {
      tablesChecked: 0,
      tablesCreated: [],
      columnsAdded: []
    };

    for (const [tableName, tableConfig] of Object.entries(schemaConfig)) {
      if (!tableConfig.columns || Object.keys(tableConfig.columns).length === 0) {
        console.log(`[SchemaManager] Table [${tableName}] has no columns defined yet. Skipping auto-creation.`);
        continue;
      }
      report.tablesChecked++;
      const exists = await this.tableExists(tableName, schemaName);

      if (!exists) {
        await this.createTable(tableName, tableConfig.columns, schemaName);
        report.tablesCreated.push(tableName);
      } else {
        const existingCols = await this.getExistingColumns(tableName, schemaName);
        // If lane_headers exists with old legacy primary key 'archetype_id' instead of 'ARCHT_ID'
        if (tableName === 'lane_headers' && existingCols.includes('archetype_id') && !existingCols.includes('archt_id')) {
          console.log(`[SchemaManager] Detected legacy schema for [${schemaName}].[${tableName}]. Recreating with 26 new columns...`);
          await this.dropTable(tableName, schemaName);
          await this.createTable(tableName, tableConfig.columns, schemaName);
          report.tablesCreated.push(`${tableName} (migrated to new schema)`);
          continue;
        }

        for (const [colName, colMeta] of Object.entries(tableConfig.columns)) {
          if (!existingCols.includes(colName.toLowerCase())) {
            await this.addColumn(tableName, colName, colMeta, schemaName);
            report.columnsAdded.push(`${tableName}.${colName}`);
          }
        }
      }
    }

    console.log(
      `[SchemaManager] Schema sync complete. Checked: ${report.tablesChecked} table(s), Created: ${report.tablesCreated.length}, New Columns Added: ${report.columnsAdded.length}.`
    );
    return report;
  }
}

export const schemaManager = new SchemaManager();
export const syncSchema = (schemaConfig, schemaName) => schemaManager.syncSchema(schemaConfig, schemaName);
export default schemaManager;
