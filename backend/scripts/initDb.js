import { schemaManager } from '../services/schemaManager.js';
import { SCHEMA_NAME } from '../config/schema.js';
import dotenv from 'dotenv';

dotenv.config();

async function runCodeFirstMigration() {
  console.log('====================================================');
  console.log(`Starting Code-First Schema Manager on Azure SQL Database`);
  console.log(`Target Schema: [${SCHEMA_NAME}]`);
  console.log('====================================================\n');

  try {
    const report = await schemaManager.syncSchema();

    console.log('\n====================================================');
    console.log('✓ Code-First Database Synchronization Completed!');
    console.log(`  Tables Checked: ${report.tablesChecked}`);
    console.log(`  New Tables Created: ${report.tablesCreated.length ? report.tablesCreated.join(', ') : 'None (Up to date)'}`);
    console.log(`  New Columns Added: ${report.columnsAdded.length ? report.columnsAdded.join(', ') : 'None (Up to date)'}`);
    console.log('====================================================\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during code-first schema sync:', error.message);
    process.exit(1);
  }
}

runCodeFirstMigration();
