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
      ARCHT_ID: {
        type: 'VARCHAR(50)',
        primaryKey: true,
        nullable: false
      },
      Short_desc: {
        type: 'VARCHAR(500)',
        nullable: true
      },
      Owner_role: {
        type: 'VARCHAR(100)',
        nullable: true
      },
      Owner: {
        type: 'VARCHAR(255)',
        nullable: true
      },
      CSCL_Lane_ID: {
        type: 'VARCHAR(50)',
        nullable: false,
        index: true
      },
      Status: {
        type: 'VARCHAR(50)',
        nullable: false,
        default: "'00-New'"
      },
      Wave: {
        type: 'VARCHAR(50)',
        nullable: true
      },
      Prev_Wave_CSCL_ID: {
        type: 'VARCHAR(50)',
        nullable: true
      },
      Nodes: {
        type: 'VARCHAR(50)',
        nullable: true,
        default: "'0 nodes defined'"
      },
      Plan_GRP: {
        type: 'VARCHAR(100)',
        nullable: true
      },
      Franchise: {
        type: 'VARCHAR(100)',
        nullable: true
      },
      PLAN_team: {
        type: 'VARCHAR(100)',
        nullable: true
      },
      TranSCend_PRJ: {
        type: 'VARCHAR(100)',
        nullable: true
      },
      Comments: {
        type: 'VARCHAR(MAX)',
        nullable: true
      },
      SKU_Count: {
        type: 'INT',
        nullable: true,
        default: '0'
      },
      Sales_Vol: {
        type: 'VARCHAR(100)',
        nullable: true
      },
      Tranactions_Vol: {
        type: 'VARCHAR(100)',
        nullable: true
      },
      OMP_relevant: {
        type: 'VARCHAR(50)',
        nullable: true
      },
      LEGO: {
        type: 'VARCHAR(50)',
        nullable: true
      },
      Returns: {
        type: 'VARCHAR(100)',
        nullable: true
      },
      Physical_flow: {
        type: 'VARCHAR(255)',
        nullable: true
      },
      Financial_flow: {
        type: 'VARCHAR(255)',
        nullable: true
      },
      Description: {
        type: 'VARCHAR(MAX)',
        nullable: true
      },
      File_link: {
        type: 'VARCHAR(1000)',
        nullable: true
      },
      prj_arch_ID: {
        type: 'VARCHAR(100)',
        nullable: true
      },
      Documentation: {
        type: 'VARCHAR(MAX)',
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
