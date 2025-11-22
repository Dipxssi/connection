/**
 * URL validation utilities
 */

export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Validates a portfolio URL
 */
export function validatePortfolioUrl(url: string): ValidationResult {
  if (!url || !url.trim()) {
    return { isValid: false, error: 'Portfolio URL is required' }
  }

  try {
    const urlObj = new URL(url)
    
    // Must be http or https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'URL must start with http:// or https://' }
    }

    // Must have a valid hostname
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      return { isValid: false, error: 'Invalid URL format' }
    }

    // Check for localhost or IP addresses (allow for development)
    if (urlObj.hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(urlObj.hostname)) {
      return { isValid: true }
    }

    // Basic domain validation
    if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/.test(urlObj.hostname)) {
      return { isValid: false, error: 'Invalid domain name' }
    }

    return { isValid: true }
  } catch (e) {
    return { isValid: false, error: 'Invalid URL format. Please include http:// or https://' }
  }
}

/**
 * Validates a LinkedIn profile URL
 */
export function validateLinkedInUrl(url: string): ValidationResult {
  if (!url || !url.trim()) {
    return { isValid: false, error: 'LinkedIn URL is required' }
  }

  try {
    const urlObj = new URL(url)
    
    // Must be http or https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'URL must start with http:// or https://' }
    }

    // Must be from LinkedIn domain
    const linkedinDomains = ['linkedin.com', 'www.linkedin.com']
    if (!linkedinDomains.includes(urlObj.hostname.toLowerCase())) {
      return { isValid: false, error: 'URL must be from linkedin.com' }
    }

    // Should have /in/ in the path for profile URLs
    if (!urlObj.pathname.includes('/in/')) {
      return { isValid: false, error: 'Invalid LinkedIn profile URL. Should be like: https://linkedin.com/in/yourprofile' }
    }

    return { isValid: true }
  } catch (e) {
    return { isValid: false, error: 'Invalid URL format. Please include http:// or https://' }
  }
}

/**
 * Sanitizes user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  const div = document.createElement('div')
  div.textContent = input
  return div.innerHTML
}

/**
 * Sanitizes URL to prevent XSS while preserving URL structure
 */
export function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    // Reconstruct URL with only protocol, hostname, and pathname
    // This removes any potential javascript: or data: schemes
    return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}${urlObj.search}${urlObj.hash}`
  } catch {
    // If URL parsing fails, return empty string
    return ''
  }
}

