import dotenv from 'dotenv';

dotenv.config();

export const SCHEMA_NAME = process.env.DB_SCHEMA || 'archetype';

/**
 * Declarative Database Schema Definition in Code
 * 
 * To add a new column or table in the future:
 * 1. Simply add the column definition below in this JavaScript file.
 * 2. On server start (or by running npm run db:sync), the Schema Manager will
 *    automatically detect missing columns/tables and create them in the database!
 */
export const tables = {
  lane_headers: {
    tableName: 'lane_headers',
    columns: {
      archetype_id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
        nullable: false
      },
      cscl_lane_id: {
        type: 'VARCHAR(50)',
        nullable: false,
        index: true
      },
      legal_entities: {
        type: 'VARCHAR(500)',
        nullable: true
      },
      status: {
        type: 'VARCHAR(50)',
        nullable: false,
        default: "'Draft'"
      },
      owner_email: {
        type: 'VARCHAR(255)',
        nullable: false,
        index: true
      },
      wave: {
        type: 'VARCHAR(50)',
        nullable: true
      },
      short_description: {
        type: 'VARCHAR(500)',
        nullable: true
      },
      plan_team: {
        type: 'VARCHAR(100)',
        nullable: true
      },
      plan_grp: {
        type: 'VARCHAR(100)',
        nullable: true
      },
      project: {
        type: 'VARCHAR(100)',
        nullable: true
      },
      nodes_count: {
        type: 'VARCHAR(50)',
        nullable: true,
        default: "'0 nodes defined'"
      },
      attachment_name: {
        type: 'VARCHAR(255)',
        nullable: true
      },
      visio_status: {
        type: 'VARCHAR(50)',
        nullable: true,
        default: "'Not Uploaded'"
      },
      approvals_approved: {
        type: 'INT',
        nullable: true,
        default: '0'
      },
      approvals_total: {
        type: 'INT',
        nullable: true,
        default: '3'
      },
      l1_physical_flow: {
        type: 'VARCHAR(255)',
        nullable: true
      },
      l1_financial_flow: {
        type: 'VARCHAR(255)',
        nullable: true
      },
      franchise: {
        type: 'VARCHAR(100)',
        nullable: true
      },
      owner_role: {
        type: 'VARCHAR(100)',
        nullable: true
      },
      comments: {
        type: 'VARCHAR(1000)',
        nullable: true
      },
      created_at: {
        type: 'DATETIME2',
        nullable: false,
        default: 'GETUTCDATE()'
      },
      updated_at: {
        type: 'DATETIME2',
        nullable: false,
        default: 'GETUTCDATE()'
      }
    }
  }
};

export default tables;
