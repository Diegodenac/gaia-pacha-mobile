/**
 * Backend API Configuration Type Helpers
 * ───────────────────────────────────────────────────────────────────────────────
 *
 * This file is BACKEND-ONLY. Copy this to your backend API repository.
 *
 * Helper utilities for the backend API to integrate database and mobile app
 * configuration. These types ensure type-safety when using environment variables
 * and database connections.
 *
 * Usage in Backend:
 *   import type { BackendConfig } from '@/lib/api.config';
 *   const config: BackendConfig = getBackendConfig();
 */

export interface DatabaseCredentials {
  /** PostgreSQL host */
  host: string;
  /** PostgreSQL port (typically 5432 or custom) */
  port: number;
  /** Database name */
  database: string;
  /** Database user */
  user: string;
  /** Database password */
  password: string;
  /** Max connection pool size */
  maxConnections: number;
  /** SSL configuration */
  ssl: {
    enabled: boolean;
    rejectUnauthorized: boolean;
  };
}

export interface BackendConfig {
  /** API Server Configuration */
  api: {
    /** Server port (e.g., 3000) */
    port: number;
    /** Cross-origin allowed origins */
    corsOrigins: string[];
    /** Request timeout in ms */
    requestTimeout: number;
  };

  /** Database Connection Configuration */
  database: DatabaseCredentials;

  /** Authentication Configuration */
  auth: {
    /** JWT secret key */
    jwtSecret: string;
    /** Token expiration (e.g., '24h', '7d') */
    tokenExpiry: string;
    /** Refresh token expiry */
    refreshTokenExpiry: string;
  };

  /** Environment */
  env: 'development' | 'preview' | 'production';

  /** Feature Flags */
  features: {
    /** Enable debug logging */
    debugLogging: boolean;
    /** Enable mock data */
    mockDataEnabled: boolean;
  };
}

/**
 * Helper function to build backend configuration from environment variables
 * Use this in your Node.js/Express backend
 */
export function getBackendConfig(): BackendConfig {
  const env = (process.env.APP_ENV || 'development') as
    | 'development'
    | 'preview'
    | 'production';

  return {
    api: {
      port: parseInt(process.env.API_PORT || '3000', 10),
      corsOrigins: [
        'http://localhost:3000', // Local dev
        'http://localhost:19000', // Expo
        'http://localhost:8081', // React Native
        'https://*.gaia-pacha.com', // Production domains
      ],
      requestTimeout: parseInt(process.env.API_REQUEST_TIMEOUT || '15000', 10),
    },

    database: {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      database: process.env.DATABASE_NAME || 'defaultdb',
      user: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || '',
      maxConnections: parseInt(process.env.DATABASE_CONNECTION_LIMIT || '20', 10),
      ssl: {
        enabled: process.env.DATABASE_SSL_MODE === 'require',
        rejectUnauthorized: process.env.DATABASE_SSL_MODE === 'require',
      },
    },

    auth: {
      jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      tokenExpiry: process.env.JWT_TOKEN_EXPIRY || '24h',
      refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d',
    },

    env,

    features: {
      debugLogging: env !== 'production',
      mockDataEnabled: process.env.ENABLE_MOCK_DATA === 'true',
    },
  };
}

/**
 * Validation function to ensure required env vars are set
 */
export function validateBackendConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!process.env.DATABASE_HOST) errors.push('DATABASE_HOST is required');
  if (!process.env.DATABASE_NAME) errors.push('DATABASE_NAME is required');
  if (!process.env.DATABASE_USER) errors.push('DATABASE_USER is required');
  if (!process.env.DATABASE_PASSWORD) errors.push('DATABASE_PASSWORD is required');

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Express.js middleware to attach config to request
 * Usage:
 *   app.use(attachConfigMiddleware);
 *   app.get('/api/config', (req, res) => {
 *     res.json({ config: req.backendConfig });
 *   });
 */
export function attachConfigMiddleware() {
  return (req: any, res: any, next: any) => {
    req.backendConfig = getBackendConfig();
    next();
  };
}
