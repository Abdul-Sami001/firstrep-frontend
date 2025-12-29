// lib/utils/errors.ts - Standardized Error Handling
/**
 * Custom error classes for better error handling and type safety
 */

export class ApiError extends Error {
  status?: number;
  response?: any;
  isExpected?: boolean; // For expected errors like 401 for guests

  constructor(message: string, status?: number, response?: any, isExpected = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
    this.isExpected = isExpected;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized', response?: any) {
    super(message, 401, response, true); // 401 is expected for guest users
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Network error', response?: any) {
    super(message, 0, response, false);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Check if error is an expected error (like 401 for protected endpoints)
 * @param error - The error to check
 * @param endpoint - Optional endpoint URL to determine if 401 is expected
 */
export function isExpectedError(error: unknown, endpoint?: string): boolean {
  if (error instanceof ApiError) {
    return error.isExpected === true;
  }
  
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as any;
    const status = axiosError.response?.status;
    
    // 401 is only expected for protected endpoints
    if (status === 401 && endpoint) {
      // Dynamic import to avoid circular dependencies
      const { isProtectedEndpoint, isGuestCapableEndpoint } = require('./api-endpoints');
      
      // If it's a protected endpoint, 401 is expected for unauthenticated users
      if (isProtectedEndpoint(endpoint)) {
        return true;
      }
      
      // If it's a guest-capable endpoint, 401 might still be expected
      if (isGuestCapableEndpoint(endpoint)) {
        return true;
      }
      
      // For public endpoints, 401 is NOT expected - it's a real error
      return false;
    }
    
    // If no endpoint provided, be conservative - assume it might be expected
    // This maintains backward compatibility but should be avoided
    return status === 401;
  }
  
  return false;
}

/**
 * Check if error should be logged
 */
export function shouldLogError(error: unknown): boolean {
  // Only log unexpected errors
  if (isExpectedError(error)) {
    return false;
  }
  // Log all other errors in development
  return process.env.NODE_ENV === 'development';
}

/**
 * Safe error logging - only logs in appropriate environments
 */
export function logError(error: unknown, context?: string) {
  if (!shouldLogError(error)) {
    return;
  }

  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorDetails = error instanceof ApiError 
    ? { status: error.status, name: error.name }
    : error && typeof error === 'object' && 'response' in error
    ? { status: (error as any).response?.status }
    : {};

  console.error(`[${context || 'API'}] Error:`, errorMessage, errorDetails);
}

