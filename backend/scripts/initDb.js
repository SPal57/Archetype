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
          code                VARCHAR(100)  NULL,
          title               VARCHAR(255)  NULL,
          status              VARCHAR(50)   NOT NULL DEFAULT 'Draft',
          owner_email         VARCHAR(255)  NOT NULL,
          wave                VARCHAR(50)   NULL,
          short_description   VARCHAR(500)  NULL,
          plan_team           VARCHAR(100)  NULL,
          plan_grp            VARCHAR(100)  NULL,
          project             VARCHAR(100)  NULL,
          nodes_count         VARCHAR(50)   NULL DEFAULT '0 nodes defined',
          attachment_name     VARCHAR(255)  NULL,
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
      END
    `;
    await pool.request().query(tableCreateQuery);
    console.log(`✓ Table [${SCHEMA_NAME}].[lane_headers] is ready.\n`);

    // 3. Seed initial row if table is empty
    console.log(`Step 3: Checking for initial seed data in [${SCHEMA_NAME}].[lane_headers]...`);
    const countResult = await pool.request().query(`SELECT COUNT(*) AS rowCount FROM [${SCHEMA_NAME}].[lane_headers]`);
    const rowCount = countResult.recordset[0].rowCount;

    if (rowCount === 0) {
      console.log('Table is empty. Seeding initial Archetype record (ARC-0001)...');
      const seedQuery = `
        INSERT INTO [${SCHEMA_NAME}].[lane_headers] (
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
      `;

      await pool.request()
        .input('archetype_id', sql.VarChar(50), 'ARC-0001')
        .input('cscl_lane_id', sql.VarChar(50), 'CSCL-1001')
        .input('code', sql.VarChar(100), 'L3J1-USROTC-JP')
        .input('title', sql.VarChar(255), 'USROTC DCs - JnJ Japan')
        .input('status', sql.VarChar(50), 'Draft')
        .input('owner_email', sql.VarChar(255), 'bruno.oliveira@jnj.com')
        .input('wave', sql.VarChar(50), 'Wave 3')
        .input('short_description', sql.VarChar(500), 'US Return to Origin - Japan DCs')
        .input('plan_team', sql.VarChar(100), 'APAC Planning')
        .input('plan_grp', sql.VarChar(100), 'PG-JP-01')
        .input('project', sql.VarChar(100), 'PRJ-2026-042')
        .input('nodes_count', sql.VarChar(50), '5 nodes defined')
        .input('attachment_name', sql.VarChar(255), 'lane_spec_jp.pdf')
        .input('l1_physical_flow', sql.VarChar(255), 'US -> JP-DC -> Customer')
        .input('l1_financial_flow', sql.VarChar(255), 'USD -> JPY (T+2)')
        .query(seedQuery);

      console.log('✓ Initial record (ARC-0001) seeded successfully.\n');
    } else {
      console.log(`✓ Table already contains ${rowCount} records. No seed needed.\n`);
    }

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
