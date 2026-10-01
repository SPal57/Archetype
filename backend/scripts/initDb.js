import { getDbPool, sql } from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const SCHEMA_NAME = process.env.DB_SCHEMA || 'archetype';

async function initDatabase() {
  console.log('====================================================');
  console.log(`Starting Database Setup for J&J Archetype Hub on LHM2`);
  console.log(`Target Schema: [${SCHEMA_NAME}] (Isolated from dbo.*)`);
  console.log('====================================================\n');

  try {
    const pool = await getDbPool();

    // 1. Create Schema if not exists
    console.log(`Step 1: Checking if schema [${SCHEMA_NAME}] exists...`);
    const schemaCheckQuery = `
      IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'${SCHEMA_NAME}')
      BEGIN
        EXEC('CREATE SCHEMA [${SCHEMA_NAME}]');
        PRINT 'Schema [${SCHEMA_NAME}] created successfully.';
      END
      ELSE
      BEGIN
        PRINT 'Schema [${SCHEMA_NAME}] already exists.';
      END
    `;
    await pool.request().query(schemaCheckQuery);
    console.log(`✓ Schema [${SCHEMA_NAME}] is ready.\n`);

    // 2. Create Table: [archetype].[lane_headers]
    console.log(`Step 2: Checking if table [${SCHEMA_NAME}].[lane_headers] exists...`);
    const tableCreateQuery = `
      IF NOT EXISTS (
        SELECT * FROM sys.objects 
        WHERE object_id = OBJECT_ID(N'[${SCHEMA_NAME}].[lane_headers]') 
        AND type in (N'U')
      )
      BEGIN
        CREATE TABLE [${SCHEMA_NAME}].[lane_headers] (
          archetype_id        VARCHAR(50)   NOT NULL PRIMARY KEY,
          cscl_lane_id        VARCHAR(50)   NOT NULL,
          legal_entities      VARCHAR(500)  NULL,
          status              VARCHAR(50)   NOT NULL DEFAULT 'Draft',
          owner_email         VARCHAR(255)  NOT NULL,
          wave                VARCHAR(50)   NULL,
          short_description   VARCHAR(500)  NULL,
          plan_team           VARCHAR(100)  NULL,
          plan_grp            VARCHAR(100)  NULL,
          project             VARCHAR(100)  NULL,
          nodes_count         VARCHAR(50)   NULL DEFAULT '0 nodes defined',
          attachment_name     VARCHAR(255)  NULL,
          visio_status        VARCHAR(50)   NULL DEFAULT 'Not Uploaded',
          approvals_approved  INT           NULL DEFAULT 0,
          approvals_total     INT           NULL DEFAULT 3,
          l1_physical_flow    VARCHAR(255)  NULL,
          l1_financial_flow   VARCHAR(255)  NULL,
          created_at          DATETIME2     NOT NULL DEFAULT GETUTCDATE(),
          updated_at          DATETIME2     NOT NULL DEFAULT GETUTCDATE()
        );

        CREATE NONCLUSTERED INDEX IX_lane_headers_cscl ON [${SCHEMA_NAME}].[lane_headers] (cscl_lane_id);
        CREATE NONCLUSTERED INDEX IX_lane_headers_owner ON [${SCHEMA_NAME}].[lane_headers] (owner_email);

        PRINT 'Table [${SCHEMA_NAME}].[lane_headers] created successfully.';
      END
      ELSE
      BEGIN
        PRINT 'Table [${SCHEMA_NAME}].[lane_headers] already exists.';
        
        -- Drop deprecated title column if present
        IF EXISTS (
          SELECT * FROM sys.columns 
          WHERE object_id = OBJECT_ID(N'[${SCHEMA_NAME}].[lane_headers]') 
          AND name = 'title'
        )
        BEGIN
          ALTER TABLE [${SCHEMA_NAME}].[lane_headers] DROP COLUMN title;
          PRINT 'Removed redundant [title] column (merged with short_description).';
        END

        -- Drop redundant code column if present (merged with archetype_id)
        IF EXISTS (
          SELECT * FROM sys.columns 
          WHERE object_id = OBJECT_ID(N'[${SCHEMA_NAME}].[lane_headers]') 
          AND name = 'code'
        )
        BEGIN
          ALTER TABLE [${SCHEMA_NAME}].[lane_headers] DROP COLUMN code;
          PRINT 'Removed redundant [code] column (merged with archetype_id).';
        END

        -- Safe auto-migration for legal_entities column if missing
        IF NOT EXISTS (
          SELECT * FROM sys.columns 
          WHERE object_id = OBJECT_ID(N'[${SCHEMA_NAME}].[lane_headers]') 
          AND name = 'legal_entities'
        )
        BEGIN
          ALTER TABLE [${SCHEMA_NAME}].[lane_headers] ADD legal_entities VARCHAR(500) NULL;
          PRINT 'Added missing column [legal_entities] to table.';
        END

        -- Safe auto-migration for visio_status column if missing
        IF NOT EXISTS (
          SELECT * FROM sys.columns 
          WHERE object_id = OBJECT_ID(N'[${SCHEMA_NAME}].[lane_headers]') 
          AND name = 'visio_status'
        )
        BEGIN
          ALTER TABLE [${SCHEMA_NAME}].[lane_headers] ADD visio_status VARCHAR(50) NULL DEFAULT 'Not Uploaded';
          PRINT 'Added missing column [visio_status] to table.';
        END

        -- Safe auto-migration for approvals_approved column if missing
        IF NOT EXISTS (
          SELECT * FROM sys.columns 
          WHERE object_id = OBJECT_ID(N'[${SCHEMA_NAME}].[lane_headers]') 
          AND name = 'approvals_approved'
        )
        BEGIN
          ALTER TABLE [${SCHEMA_NAME}].[lane_headers] ADD approvals_approved INT NULL DEFAULT 0;
          PRINT 'Added missing column [approvals_approved] to table.';
        END

        -- Safe auto-migration for approvals_total column if missing
        IF NOT EXISTS (
          SELECT * FROM sys.columns 
          WHERE object_id = OBJECT_ID(N'[${SCHEMA_NAME}].[lane_headers]') 
          AND name = 'approvals_total'
        )
        BEGIN
          ALTER TABLE [${SCHEMA_NAME}].[lane_headers] ADD approvals_total INT NULL DEFAULT 3;
          PRINT 'Added missing column [approvals_total] to table.';
        END
      END
    `;
    await pool.request().query(tableCreateQuery);
    console.log(`✓ Table [${SCHEMA_NAME}].[lane_headers] is ready.\n`);

    console.log(`Step 3: Verifying table status (No hardcoded data will be seeded per your instruction)...`);
    const countResult = await pool.request().query(`SELECT COUNT(*) AS total_count FROM [${SCHEMA_NAME}].[lane_headers]`);
    const rowCount = countResult.recordset[0].total_count;
    console.log(`✓ Table [${SCHEMA_NAME}].[lane_headers] currently contains ${rowCount} rows.`);
    console.log(`✓ Ready for manual input from the Web Application!\n`);

    console.log('====================================================');
    console.log('✓ Database initialization finished successfully!');
    console.log('====================================================');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database initialization failed:');
    console.error(error.message);
    if (error.message.includes('Login failed')) {
      console.error('\nTip: Please verify your DB_USER and DB_PASSWORD in backend/.env');
    }
    process.exit(1);
  }
}

initDatabase();
