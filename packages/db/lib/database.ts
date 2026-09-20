import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { Pool } from 'pg';

/**
 * Database connection with pool management
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create connection pool with optimized settings
const pool = new Pool({
  connectionString,
  max: parseInt(process.env.DATABASE_POOL_MAX || '20', 10),
  min: parseInt(process.env.DATABASE_POOL_MIN || '2', 10),
  idleTimeoutMillis: parseInt(process.env.DATABASE_POOL_IDLE_TIMEOUT || '30000', 10),
  connectionTimeoutMillis: 5000,
  statement_timeout: 30000,
  application_name: 'mind-reply-core',
});

// Health check
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Drizzle ORM instance with connection pool
 */
const queryClient = postgres(connectionString, {
  max: 20,
  idle_timeout: 30,
  prepare: false,
});

export const db = drizzle(queryClient, {
  logger: process.env.NODE_ENV === 'development',
});

/**
 * Database migration runner
 */
export async function runMigrations() {
  try {
    console.log('Running database migrations...');
    // Import your migrations here
    // await migrate(db, { migrationsFolder: './drizzle' });
    console.log('✓ Migrations completed successfully');
  } catch (error) {
    console.error('✗ Migration failed:', error);
    throw error;
  }
}

/**
 * Database health check
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const start = performance.now();
    await db.execute('SELECT 1');
    const latency = performance.now() - start;

    console.log(`✓ Database health check passed (${latency.toFixed(2)}ms)`);
    return true;
  } catch (error) {
    console.error('✗ Database health check failed:', error);
    return false;
  }
}

/**
 * Graceful shutdown
 */
export async function shutdownDatabase() {
  try {
    await pool.end();
    console.log('Database pool closed gracefully');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
}

export { pool };
