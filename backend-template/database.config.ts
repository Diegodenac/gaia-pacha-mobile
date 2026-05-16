/**
 * Database Configuration
 * ───────────────────────────────────────────────────────────────────────────────
 *
 * This file is BACKEND-ONLY. Copy this to your backend API repository.
 * It structures the database connection configuration for use by backend services.
 *
 * The mobile app does NOT connect to the database directly — it communicates
 * via the REST API provided by your backend.
 *
 * Usage in Backend (Node.js/Express):
 *   import { getDatabaseConfig } from './src/lib/database.config';
 *   const config = getDatabaseConfig();
 *   const client = new Client(config);
 *
 * Usage with Prisma:
 *   Use DATABASE_URL in prisma/.env instead
 *   DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require
 */

export interface DatabaseConfig {
  /** PostgreSQL host */
  host: string;
  /** PostgreSQL port */
  port: number;
  /** Database name */
  database: string;
  /** Database user */
  user: string;
  /** Database password */
  password: string;
  /** Full connection string (alternative to individual fields) */
  connectionString?: string;
  /** SSL mode: 'require', 'prefer', 'disable' */
  ssl: {
    rejectUnauthorized?: boolean;
    mode: 'require' | 'prefer' | 'disable';
  };
  /** Max number of connections in the pool */
  max: number;
  /** Idle timeout in milliseconds */
  idleTimeoutMillis: number;
  /** Query timeout in milliseconds */
  statement_timeout: number;
}

/**
 * Get database configuration from environment variables
 * @returns Configured database connection object
 */
export function getDatabaseConfig(): DatabaseConfig {
  const host = process.env.DATABASE_HOST;
  const port = parseInt(process.env.DATABASE_PORT || '5432', 10);
  const database = process.env.DATABASE_NAME;
  const user = process.env.DATABASE_USER;
  const password = process.env.DATABASE_PASSWORD;
  const sslMode = (process.env.DATABASE_SSL_MODE || 'require') as 'require' | 'prefer' | 'disable';
  const connectionLimit = parseInt(process.env.DATABASE_CONNECTION_LIMIT || '20', 10);
  const idleTimeout = parseInt(process.env.DATABASE_IDLE_TIMEOUT || '30000', 10);
  const queryTimeout = parseInt(process.env.DATABASE_QUERY_TIMEOUT || '15000', 10);

  // Validate required fields
  if (!host || !database || !user || !password) {
    throw new Error(
      'Missing required database environment variables: DATABASE_HOST, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD',
    );
  }

  return {
    host,
    port,
    database,
    user,
    password,
    ssl: {
      rejectUnauthorized: sslMode === 'require',
      mode: sslMode,
    },
    max: connectionLimit,
    idleTimeoutMillis: idleTimeout,
    statement_timeout: queryTimeout,
  };
}

/**
 * Get PostgreSQL connection string from environment (convenience function)
 * @returns PostgreSQL connection string
 */
export function getDatabaseConnectionString(): string {
  // If full connection string is provided, use it
  const fullString = process.env.DATABASE_URL;
  if (fullString) {
    return fullString;
  }

  // Otherwise, build from individual parts
  const { host, port, database, user, password, ssl } = getDatabaseConfig();
  const sslParam = ssl.mode === 'require' ? '?sslmode=require' : '';

  return `postgresql://${user}:${password}@${host}:${port}/${database}${sslParam}`;
}

/**
 * Database configuration for different build profiles
 */
export const DATABASE_PROFILES = {
  development: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    database: process.env.DATABASE_NAME || 'defaultdb',
    user: process.env.DATABASE_USER || 'postgres',
    enableDebugLogging: true,
  },
  preview: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    database: process.env.DATABASE_NAME || 'defaultdb',
    user: process.env.DATABASE_USER || 'postgres',
    enableDebugLogging: true,
  },
  production: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    database: process.env.DATABASE_NAME || 'defaultdb',
    user: process.env.DATABASE_USER || 'postgres',
    enableDebugLogging: false,
  },
} as const;
