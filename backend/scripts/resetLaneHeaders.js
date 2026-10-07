import { schemaManager } from '../services/schemaManager.js';
import { SCHEMA_NAME } from '../config/schema.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * One-time execution script to drop [archetype].[lane_headers]
 * 
 * - Only drops the specific table [archetype].[lane_headers].
 * - Does NOT affect any other table or schema (such as dbo.*).
 * - Normal server startup (npm start / npm run dev) will NEVER drop this table.
 */
async function dropLaneHeadersTable() {
  console.log('====================================================');
  console.log(`[Action] One-time Reset for [${SCHEMA_NAME}].[lane_headers]`);
  console.log(`Target Schema: [${SCHEMA_NAME}]`);
  console.log(`Target Table:  [lane_headers]`);
  console.log('====================================================\n');

  try {
    const exists = await schemaManager.tableExists('lane_headers', SCHEMA_NAME);
    if (!exists) {
      console.log(`ℹ Table [${SCHEMA_NAME}].[lane_headers] does not exist or has already been dropped.`);
      process.exit(0);
    }

    await schemaManager.dropTable('lane_headers', SCHEMA_NAME);

    console.log('\n====================================================');
    console.log(`✓ Table [${SCHEMA_NAME}].[lane_headers] successfully removed!`);
    console.log('  All old columns and rows have been deleted.');
    console.log('  Normal app runs will NOT drop this table.');
    console.log('  Ready for defining new columns/fields.');
    console.log('====================================================\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error dropping table [lane_headers]:', error.message);
    process.exit(1);
  }
}

dropLaneHeadersTable();
