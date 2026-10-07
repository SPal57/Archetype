-- =========================================================================
-- J&J MedTech Archetype Provisioning Hub
-- Target Server: aykbsd01.database.windows.net
-- Database: LHM2
-- Purpose: Safely drop isolated table [archetype].[lane_headers] and [archetype] schema
-- Safety: Completely isolated. ZERO impact on dbo.* or any other schemas.
-- =========================================================================

USE [LHM2];
GO

-- Step 1: Drop the table [archetype].[lane_headers] first (must be dropped before schema)
IF OBJECT_ID(N'[archetype].[lane_headers]', 'U') IS NOT NULL
BEGIN
    DROP TABLE [archetype].[lane_headers];
    PRINT '✓ Table [archetype].[lane_headers] dropped successfully.';
END
ELSE
BEGIN
    PRINT 'ℹ Table [archetype].[lane_headers] does not exist.';
END
GO

-- Step 2: Drop the isolated schema [archetype]
IF EXISTS (SELECT * FROM sys.schemas WHERE name = N'archetype')
BEGIN
    DROP SCHEMA [archetype];
    PRINT '✓ Schema [archetype] dropped successfully.';
END
ELSE
BEGIN
    PRINT 'ℹ Schema [archetype] does not exist.';
END
GO
