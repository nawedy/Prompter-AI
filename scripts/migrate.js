import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrate() {
  try {
    const db = createClient({
      url: process.env.DATABASE_URL || 'file:prompter.db'
    });

    // Create migrations table if it doesn't exist
    await db.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS migrations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    // Get list of applied migrations
    const result = await db.execute({
      sql: 'SELECT name FROM migrations'
    });
    const appliedMigrations = new Set(result.rows.map(row => row.name));

    // Read migrations from supabase/migrations directory
    const migrationsDir = join(__dirname, '..', 'supabase', 'migrations');
    const migrationFiles = readFileSync(
      join(migrationsDir, '20250113213432_sunny_summit.sql'), // Use the complete schema file
      'utf8'
    );

    // Execute the migration if not already applied
    const migrationName = '20250113213432_sunny_summit.sql';
    if (!appliedMigrations.has(migrationName)) {
      console.log(`Applying migration: ${migrationName}`);
      
      // Split into individual statements and execute
      const statements = migrationFiles
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (const statement of statements) {
        await db.execute({ sql: statement });
      }
      
      await db.execute({
        sql: 'INSERT INTO migrations (name) VALUES (?)',
        args: [migrationName]
      });
      
      console.log(`✅ Successfully applied migration: ${migrationName}`);
    }

    console.log('✅ All migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();