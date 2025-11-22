/**
 * Environment configuration
 * Access environment variables through this module
 */

interface AppConfig {
  appName: string
  appUrl: string
  enableAnalytics: boolean
  enableErrorTracking: boolean
}

const getEnvVar = (key: string, defaultValue: string = ''): string => {
  return import.meta.env[key] || defaultValue
}

const getEnvBoolean = (key: string, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[key]
  if (value === undefined) return defaultValue
  return value === 'true' || value === '1'
}

export const config: AppConfig = {
  appName: getEnvVar('VITE_APP_NAME', 'Connection'),
  appUrl: getEnvVar('VITE_APP_URL', window.location.origin),
  enableAnalytics: getEnvBoolean('VITE_ENABLE_ANALYTICS', false),
  enableErrorTracking: getEnvBoolean('VITE_ENABLE_ERROR_TRACKING', false),
}

export default config

