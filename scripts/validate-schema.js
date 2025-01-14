import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function validateSchema() {
  try {
    const db = createClient({
      url: process.env.DATABASE_URL || 'file:prompter.db'
    });

    // Get all tables
    const tablesResult = await db.execute({
      sql: `
        SELECT name FROM sqlite_master 
        WHERE type='table' 
        AND name NOT LIKE 'sqlite_%'
        AND name NOT IN ('migrations')
      `
    });

    console.log('\nExisting tables in database:');
    for (const row of tablesResult.rows) {
      const tableName = row.name;
      console.log(`\nTable: ${tableName}`);
      
      // Get column info for each table
      const columnsResult = await db.execute({
        sql: `PRAGMA table_info(${tableName});`
      });
      
      console.log('Columns:');
      for (const column of columnsResult.rows) {
        console.log(`  - ${column.name}: ${column.type} ${column.notnull ? 'NOT NULL' : 'NULL'} ${column.dflt_value ? `DEFAULT ${column.dflt_value}` : ''}`);
      }

      // Get foreign keys
      const foreignKeysResult = await db.execute({
        sql: `PRAGMA foreign_key_list(${tableName});`
      });
      
      if (foreignKeysResult.rows.length > 0) {
        console.log('Foreign Keys:');
        for (const fk of foreignKeysResult.rows) {
          console.log(`  - ${fk.from} -> ${fk.table}(${fk.to})`);
        }
      }

      // Get indexes
      const indexesResult = await db.execute({
        sql: `SELECT name, sql FROM sqlite_master WHERE type='index' AND tbl_name=?`,
        args: [tableName]
      });
      
      if (indexesResult.rows.length > 0) {
        console.log('Indexes:');
        for (const idx of indexesResult.rows) {
          console.log(`  - ${idx.name}: ${idx.sql}`);
        }
      }
    }

    // Read expected schema from latest migration
    const migrationsDir = join(__dirname, '..', 'supabase', 'migrations');
    const latestMigration = readFileSync(
      join(migrationsDir, '20250113213432_sunny_summit.sql'), 
      'utf8'
    );
    
    console.log('\nExpected schema from migration:');
    console.log(latestMigration);

    console.log('\n✅ Schema information printed above. Please compare the actual and expected schemas.');
    
  } catch (error) {
    console.error('❌ Schema validation failed:', error);
    process.exit(1);
  }
}

validateSchema();