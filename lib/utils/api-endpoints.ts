// lib/utils/api-endpoints.ts - Public vs Protected Endpoint Classification
/**
 * Defines which endpoints are public (work for anonymous users) vs protected (require auth)
 * This is critical for proper error handling in e-commerce applications
 */

// Public endpoints that should work for anonymous users
export const PUBLIC_ENDPOINTS = [
  // Products - Public read access
  '/categories/',
  '/products/',
  
  // Reviews - Public read access (viewing reviews)
  '/reviews/',
  '/reviews/products/', // Product-specific reviews
  
  // Cart - Session-based, works for guests
  '/cart/',
  '/cart/add/',
  '/cart/checkout/',
  '/cart/remove/', // Remove item from cart
  '/cart/items/', // Update cart items
  
  // Search and filtering
  '/products/search/',
] as const;

// Protected endpoints that require authentication
export const PROTECTED_ENDPOINTS = [
  // User profile
  '/auth/me/',
  '/auth/profile/',
  
  // Orders (user-specific)
  '/orders/',

  // Resellers (portal)
  '/resellers/',
  
  // Seller endpoints
  '/my/',
  
  // Wishlist (can be session-based, but user-specific operations require auth)
  // Note: Wishlist GET might work for guests, but we'll handle it specially
] as const;

/**
 * Extract the API path from a full URL
 */
function extractApiPath(url: string): string {
  // Remove query params
  const path = url.split('?')[0];
  
  // Extract path after /api/v1 or just the path if it starts with /
  const apiV1Index = path.indexOf('/api/v1');
  if (apiV1Index !== -1) {
    return path.substring(apiV1Index + '/api/v1'.length);
  }
  
  // If it starts with /, return as is
  if (path.startsWith('/')) {
    return path;
  }
  
  // Otherwise, assume it's a relative path
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Check if an endpoint is public (should work for anonymous users)
 */
export function isPublicEndpoint(url: string): boolean {
  const path = extractApiPath(url);
  
  return PUBLIC_ENDPOINTS.some(endpoint => {
    // Exact match
    if (path === endpoint) return true;
    
    // Pattern match for dynamic routes
    if (endpoint.includes('{')) {
      const pattern = endpoint.replace(/\{[^}]+\}/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(path);
    }
    
    // Prefix match for nested routes (e.g., /cart/ matches /cart/add/)
    if (path.startsWith(endpoint)) return true;
    
    return false;
  });
}

/**
 * Check if an endpoint requires authentication
 */
export function isProtectedEndpoint(url: string): boolean {
  const path = extractApiPath(url);
  
  return PROTECTED_ENDPOINTS.some(endpoint => {
    if (path === endpoint) return true;
    if (path.startsWith(endpoint)) return true;
    return false;
  });
}

/**
 * Special handling for endpoints that can work both ways (guest or authenticated)
 * These endpoints support both session-based (guest) and user-based (authenticated) access
 * For these endpoints, 401 might mean token expired (should refresh) or guest access (expected)
 */
export function isGuestCapableEndpoint(url: string): boolean {
  const path = extractApiPath(url);
  
  // Cart works for both guests (session-based) and authenticated users
  // If authenticated user's token expires, we should try to refresh
  if (path.startsWith('/cart/')) {
    return true;
  }
  
  // Wishlist can work for guests (session-based) or authenticated users
  if (path.startsWith('/wishlist/')) {
    // GET and add_item can work for guests
    if (path === '/wishlist/' || path === '/wishlist/add_item/') {
      return true;
    }
    // Other operations might require auth
    return false;
  }
  
  return false;
}

