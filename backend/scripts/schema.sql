-- =========================================================================
-- J&J MedTech Archetype Provisioning Hub
-- Database: LHM2
-- Target Server: aykbsd01.database.windows.net
-- Purpose: Create isolated [archetype] schema & [lane_headers] table
-- =========================================================================

USE [LHM2];
GO

-- 1. Create Dedicated Isolated Schema (Zero impact on dbo.*)
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'archetype')
BEGIN
    EXEC('CREATE SCHEMA [archetype]');
    PRINT 'Schema [archetype] created successfully.';
END
ELSE
BEGIN
    PRINT 'Schema [archetype] already exists.';
END
GO

-- 2. Create Table: [archetype].[lane_headers]
IF NOT EXISTS (
    SELECT * FROM sys.objects 
    WHERE object_id = OBJECT_ID(N'[archetype].[lane_headers]') 
    AND type in (N'U')
)
BEGIN
    CREATE TABLE [archetype].[lane_headers] (
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

    CREATE NONCLUSTERED INDEX IX_lane_headers_cscl ON [archetype].[lane_headers] (cscl_lane_id);
    CREATE NONCLUSTERED INDEX IX_lane_headers_owner ON [archetype].[lane_headers] (owner_email);

    PRINT 'Table [archetype].[lane_headers] created successfully.';
END
ELSE
BEGIN
    PRINT 'Table [archetype].[lane_headers] already exists.';
END
GO

-- 3. Seed Initial Record (ARC-0001) if table is empty
IF NOT EXISTS (SELECT 1 FROM [archetype].[lane_headers] WHERE archetype_id = 'ARC-0001')
BEGIN
    INSERT INTO [archetype].[lane_headers] (
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
        'ARC-0001',
        'CSCL-1001',
        'L3J1-USROTC-JP',
        'USROTC DCs - JnJ Japan',
        'Draft',
        'bruno.oliveira@jnj.com',
        'Wave 3',
        'US Return to Origin - Japan DCs',
        'APAC Planning',
        'PG-JP-01',
        'PRJ-2026-042',
        '5 nodes defined',
        'lane_spec_jp.pdf',
        'US -> JP-DC -> Customer',
        'USD -> JPY (T+2)'
    );

    PRINT 'Seed row for ARC-0001 inserted successfully.';
END
GO
