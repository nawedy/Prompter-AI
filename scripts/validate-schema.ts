import { execSync } from 'child_process';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function main() {
  try {
    console.log('🔄 Validating database schema...');
    
    // Validate Prisma schema
    execSync('npx prisma validate', { stdio: 'inherit' });
    
    console.log('✅ Schema validation completed successfully');
  } catch (error) {
    console.error('❌ Schema validation failed:', error);
    process.exit(1);
  }
}

main();
