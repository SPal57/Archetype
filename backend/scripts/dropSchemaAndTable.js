import { getDbPool } from '../config/db.js';
import { SCHEMA_NAME } from '../config/schema.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Clean Script to safely drop [archetype].[lane_headers] table and [archetype] schema.
 * Completely isolated to the archetype schema with ZERO disruption to dbo.* tables.
 */
async function dropSchemaAndTable() {
  console.log('====================================================');
  console.log(`[Safety Drop] Target Schema: [${SCHEMA_NAME}]`);
  console.log(`Target Table:  [${SCHEMA_NAME}].[lane_headers]`);
  console.log('====================================================\n');

  try {
    const pool = await getDbPool();

    // 1. Drop Table first
    console.log(`Step 1: Dropping table [${SCHEMA_NAME}].[lane_headers] if it exists...`);
    await pool.request().query(`
      IF OBJECT_ID(N'[${SCHEMA_NAME}].[lane_headers]', 'U') IS NOT NULL
      BEGIN
        DROP TABLE [${SCHEMA_NAME}].[lane_headers];
        PRINT 'Table [${SCHEMA_NAME}].[lane_headers] dropped successfully.';
      END
    `);
    console.log(`✓ Table [${SCHEMA_NAME}].[lane_headers] dropped successfully.\n`);

    // 2. Drop Schema
    console.log(`Step 2: Dropping schema [${SCHEMA_NAME}] if it exists...`);
    await pool.request().query(`
      IF EXISTS (SELECT * FROM sys.schemas WHERE name = N'${SCHEMA_NAME}')
      BEGIN
        DROP SCHEMA [${SCHEMA_NAME}];
        PRINT 'Schema [${SCHEMA_NAME}] dropped successfully.';
      END
    `);
    console.log(`✓ Schema [${SCHEMA_NAME}] dropped successfully.\n`);

    console.log('====================================================');
    console.log('✓ Clean Reset Complete: Schema and table removed cleanly.');
    console.log('  Database is ready for fresh schema & table recreation.');
    console.log('====================================================');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error dropping schema and table:', error.message);
    process.exit(1);
  }
}

dropSchemaAndTable();
