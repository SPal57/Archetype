-- =========================================================================
-- J&J MedTech Archetype Provisioning Hub
-- Target Server: aykbsd01.database.windows.net
-- Database: LHM2
-- Schema: [archetype]
-- Table:  [archetype].[lane_headers]
-- Clean creation of the 26 attributes for Lane Header
-- =========================================================================

USE [LHM2];
GO

-- 1. Create Dedicated Isolated Schema (Zero impact on dbo.*)
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'archetype')
BEGIN
    EXEC('CREATE SCHEMA [archetype]');
    PRINT '✓ Schema [archetype] created successfully.';
END
ELSE
BEGIN
    PRINT 'ℹ Schema [archetype] already exists.';
END
GO

-- 2. Create Table: [archetype].[lane_headers] with all 26 attributes
IF NOT EXISTS (
    SELECT * FROM sys.objects 
    WHERE object_id = OBJECT_ID(N'[archetype].[lane_headers]') 
    AND type in (N'U')
)
BEGIN
    CREATE TABLE [archetype].[lane_headers] (
        ARCHT_ID            VARCHAR(50)   NOT NULL PRIMARY KEY,
        Short_desc          VARCHAR(500)  NULL,
        Owner_role          VARCHAR(100)  NULL,
        Owner               VARCHAR(255)  NULL,
        CSCL_Lane_ID        VARCHAR(50)   NOT NULL,
        Status              VARCHAR(50)   NOT NULL DEFAULT '00-New',
        Wave                VARCHAR(50)   NULL,
        Prev_Wave_CSCL_ID   VARCHAR(50)   NULL,
        Nodes               VARCHAR(50)   NULL DEFAULT '0 nodes defined',
        Plan_GRP            VARCHAR(100)  NULL,
        Franchise           VARCHAR(100)  NULL,
        PLAN_team           VARCHAR(100)  NULL,
        TranSCend_PRJ       VARCHAR(100)  NULL,
        Comments            VARCHAR(MAX)  NULL,
        SKU_Count           INT           NULL DEFAULT 0,
        Sales_Vol           VARCHAR(100)  NULL,
        Tranactions_Vol     VARCHAR(100)  NULL,
        OMP_relevant        VARCHAR(50)   NULL,
        LEGO                VARCHAR(50)   NULL,
        Returns             VARCHAR(100)  NULL,
        Physical_flow       VARCHAR(255)  NULL,
        Financial_flow      VARCHAR(255)  NULL,
        Description         VARCHAR(MAX)  NULL,
        File_link           VARCHAR(1000) NULL,
        prj_arch_ID         VARCHAR(100)  NULL,
        Documentation       VARCHAR(MAX)  NULL,
        created_at          DATETIME2     NOT NULL DEFAULT GETUTCDATE(),
        updated_at          DATETIME2     NOT NULL DEFAULT GETUTCDATE()
    );

    CREATE NONCLUSTERED INDEX IX_lane_headers_cscl ON [archetype].[lane_headers] (CSCL_Lane_ID);
    CREATE NONCLUSTERED INDEX IX_lane_headers_owner ON [archetype].[lane_headers] (Owner);

    PRINT '✓ Table [archetype].[lane_headers] created successfully with all 26 fields.';
END
ELSE
BEGIN
    PRINT 'ℹ Table [archetype].[lane_headers] already exists.';
END
GO
