import { execSync } from 'child_process';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function main() {
  try {
    console.log('🔄 Running database migrations...');
    
    // Run Prisma migrations
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    
    console.log('✅ Database migrations completed successfully');
    
    // Generate Prisma Client
    console.log('🔄 Generating Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('✅ Prisma Client generated successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
