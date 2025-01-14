import { createClient } from '@libsql/client';

async function initializeDatabase() {
  try {
    // Initialize database client
    const db = createClient({
      url: process.env.DATABASE_URL || 'file:prompter.db'
    });

    // Create basic schema
    await db.execute({
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          avatar_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS prompts (
          id TEXT PRIMARY KEY NOT NULL,
          user_id TEXT NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          tool_type TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS templates (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          content TEXT NOT NULL,
          category TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `
    });

    console.log('✅ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
}

initializeDatabase().catch(error => {
  console.error('Database initialization failed:', error);
  process.exit(1);
});