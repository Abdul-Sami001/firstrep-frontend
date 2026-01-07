// lib/utils/storefront.ts
// Utility functions for storefront ID capture and management

/**
 * Captures storefront_id from multiple sources in priority order:
 * 1. URL search parameter (?storefront=slug)
 * 2. SessionStorage (temporary, cleared on browser close)
 * 3. LocalStorage (persistent across sessions)
 * 
 * NOTE: This function only READS from storage. Use setStorefrontId() to write.
 * Writing to storage during render causes infinite re-renders.
 * 
 * @param searchParams - URLSearchParams from Next.js useSearchParams()
 * @returns storefront_id (UUID or slug) or undefined
 */
export function getStorefrontId(searchParams: URLSearchParams | null): string | undefined {
  if (!searchParams && typeof window === 'undefined') {
    return undefined;
  }

  // Priority 1: URL parameter (highest priority - most recent)
  const urlParam = searchParams?.get('storefront');
  if (urlParam) {
    // Note: Don't write to storage here - that should be done in useEffect
    return urlParam;
  }

  // Priority 2: SessionStorage (temporary, session-based)
  if (typeof window !== 'undefined') {
    const sessionId = sessionStorage.getItem('storefront_id');
    if (sessionId) {
      return sessionId;
    }
  }

  // Priority 3: LocalStorage (persistent)
  if (typeof window !== 'undefined') {
    const storageId = localStorage.getItem('storefront_id');
    if (storageId) {
      return storageId;
    }
  }

  return undefined;
}

/**
 * Sets storefront_id in sessionStorage (for checkout flow)
 * @param storefrontId - UUID or slug of storefront
 */
export function setStorefrontId(storefrontId: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('storefront_id', storefrontId);
  }
}

/**
 * Clears storefront_id from storage (after checkout completion)
 */
export function clearStorefrontId(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('storefront_id');
    localStorage.removeItem('storefront_id');
  }
}

/**
 * Validates if a string is a valid UUID format
 * @param id - String to validate
 * @returns true if valid UUID format
 */
export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Validates if a string is a valid storefront slug format
 * @param slug - String to validate
 * @returns true if valid slug format (alphanumeric, hyphens, underscores)
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;
  return slugRegex.test(slug);
}

