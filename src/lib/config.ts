/**
 * Configuration file that centralizes all environment variables
 * This file gets values from environment variables set via Terraform outputs
 */

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Cloudflare infrastructure configuration
 * These values are provided by Terraform outputs
 */
export const CloudflareConfig = {
  // Storage configuration
  r2: {
    bucketName: process.env.NEXT_PUBLIC_r2_bucket_name || '',
    bucketId: process.env.NEXT_PUBLIC_r2_bucket_id || '',
  },

  // Database configuration
  d1: {
    databaseName: process.env.NEXT_PUBLIC_d1_database_name || '',
    databaseId: process.env.NEXT_PUBLIC_d1_database_id || '',
  },

  // KV namespace for session storage
  kv: {
    namespaceId: process.env.NEXT_PUBLIC_kv_namespace_id || '',
  },

  // Pages project information
  pages: {
    projectName: process.env.NEXT_PUBLIC_pages_project_name || 'recruitreply',
    projectUrl: process.env.NEXT_PUBLIC_pages_project_url || '',
  },

  // API configuration
  api: {
    endpoint: process.env.NEXT_PUBLIC_api_endpoint || '/api',
  },

  // Domain information
  domain: {
    url: process.env.NEXT_PUBLIC_domain_url || '',
  },

  // Cloudflare account info (only used server-side)
  account: {
    accountId: process.env.NEXT_PUBLIC_cloudflare_account_id || '',
    zoneId: process.env.NEXT_PUBLIC_cloudflare_zone_id || '',
  },

  // Deployment information
  deployment: {
    environment: process.env.NEXT_PUBLIC_environment_name || 'dev',
    version: process.env.NEXT_PUBLIC_app_version || 'local',
    timestamp: process.env.NEXT_PUBLIC_app_version
      ? new Date(parseInt(process.env.NEXT_PUBLIC_app_version.substring(0, 8))).toISOString()
      : new Date().toISOString(),
  },
};

/**
 * General application configuration
 */
export const AppConfig = {
  name: 'RecruitReply',
  description: 'RAG system for recruitment agents',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

/**
 * Returns true if all required configuration is available
 */
export function isConfigured(): boolean {
  // Only check in server-side context
  if (isBrowser) {
    return true;
  }

  // Check for essential configuration
  const requiredValues = [
    CloudflareConfig.d1.databaseId,
    CloudflareConfig.kv.namespaceId,
    CloudflareConfig.r2.bucketId,
  ];

  return requiredValues.every((value) => value && value.length > 0);
}

const config = {
  cloudflare: CloudflareConfig,
  app: AppConfig,
  isConfigured,
};

export default config;

