// lib/api/resellers/index.ts
import { api } from '../client';

// --- Types ------------------------------------------------------------------

export type ResellerStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface ResellerTier {
  id: string;
  name: string;
  display_name: string;
  commission_rate: string;
  min_payout_threshold?: string;
}

export interface ResellerProfile {
  id: string;
  user: string;
  userEmail?: string; // From API: user_email (transformed to camelCase)
  tier: ResellerTier;
  company_name?: string;
  legal_name?: string;
  vat_number?: string;
  website_url?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  status: ResellerStatus;
  approved_at?: string; // From API
  approved_by?: string; // From API
  payout_method?: string;
  payout_details?: Record<string, any>;
  default_commission_rate?: string | null;
  lifetime_gmv?: string;
  lifetime_commission?: string;
  orders_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ResellerSummaryStats {
  orders_count: number;
  gmv: string;
  commission_amount: string;
  new_customers_count?: number;
}

export interface ResellerAnalyticsOverview {
  lifetime: ResellerSummaryStats;
  month_to_date: ResellerSummaryStats;
  last_30_days: ResellerSummaryStats;
  top_storefronts?: Array<{
    id: string;
    name: string;
    slug: string;
    gmv: string;
    commission_amount: string;
    orders_count: number;
  }>;
  recent_commissions?: ResellerCommission[];
}

export interface AnalyticsOverviewParams {
  date_from?: string; // YYYY-MM-DD
  date_to?: string; // YYYY-MM-DD
}

export type CommissionStatus = 'pending' | 'earned' | 'voided' | 'paid';

export interface ResellerCommission {
  id: string;
  order: string;
  orderId?: string; // From API: order_id (transformed to camelCase)
  reseller: string;
  storefront?: string | null;
  storefrontSlug?: string; // From API: storefront_slug (transformed to camelCase)
  base_amount: string;
  commission_rate: string;
  commission_amount: string;
  status: CommissionStatus;
  earned_at?: string;
  paid_at?: string | null;
  void_reason?: string | null;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

export interface CommissionListParams {
  cursor?: string; // For cursor pagination
  page?: number;
  page_size?: number;
  ordering?: string; // Ordering field
  status?: CommissionStatus;
  storefront?: string;
  date_from?: string; // YYYY-MM-DD
  date_to?: string; // YYYY-MM-DD
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Commission Summary can be an array of period summaries
export interface CommissionSummaryPeriod {
  period: string; // e.g., "this_month", "last_30_days"
  orders_count: number;
  gmv: string;
  commission_amount: string;
}

// Support both object and array formats
export type CommissionSummary = 
  | {
      this_month: ResellerSummaryStats;
      last_30_days: ResellerSummaryStats;
    }
  | CommissionSummaryPeriod[];

export type StorefrontType = 'online' | 'physical_screen' | 'link';

export interface Storefront {
  id: string;
  reseller: string;
  resellerId?: string; // From API: reseller_id (transformed to camelCase)
  resellerCompanyName?: string; // From API: reseller_company_name (transformed to camelCase)
  name: string;
  slug: string;
  type: StorefrontType;
  address_line1?: string;
  city?: string;
  country?: string;
  notes?: string;
  commission_rate_override?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface StorefrontListParams {
  cursor?: string;
  ordering?: string;
  page_size?: number;
  search?: string;
}

export interface StorefrontProduct {
  id: string;
  product: string;
  product_title?: string; // Product title from backend response
  position?: number;
  is_featured?: boolean;
  notes?: string;
  created_at?: string;
}

export interface CreateStorefrontPayload {
  name: string;
  slug: string;
  type: StorefrontType;
  address_line1?: string;
  city?: string;
  country?: string;
  notes?: string;
  commission_rate_override?: string;
  is_active?: boolean;
}

export interface MarketingAsset {
  id: string;
  title: string;
  description?: string;
  file?: string | null;
  url?: string | null;
  asset_type: 'image' | 'video' | 'pdf' | 'copy' | 'other';
  min_tier?: ResellerTier | null;
  allowed_tiers?: ResellerTier[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MarketingAssetsParams {
  cursor?: string;
  ordering?: string;
  page_size?: number;
  search?: string;
}

export interface UpdateProfilePayload {
  company_name?: string;
  legal_name?: string;
  vat_number?: string;
  website_url?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  payout_method?: string;
  payout_details?: Record<string, any>;
}

export interface ResellerApplicationPayload {
  company_name: string;
  website_url?: string;
  app_url?: string;
  description?: string;
  location_description?: string;
  expected_traffic?: string;
}

export interface ResellerApplication {
  id: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  company_name: string;
  website_url?: string;
  app_url?: string;
  description?: string;
  location_description?: string;
  expected_traffic?: string;
  user?: string | null; // Optional FK to User
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string | null;
  review_notes?: string;
  approved_at?: string;
  approved_by?: string;
  rejected_at?: string;
  rejected_by?: string;
  rejection_reason?: string;
}

// --- API Methods -------------------------------------------------------------

export const resellersApi = {
  getMe: () => api.get<ResellerProfile>('/resellers/me/'),
  updateProfile: (data: UpdateProfilePayload) => api.patch<ResellerProfile>('/resellers/me/profile/', data),

  // Application submission (requires authentication)
  submitApplication: (data: ResellerApplicationPayload) =>
    api.post<ResellerApplication>('/resellers/applications/', data),

  // Check application status (requires authentication)
  getMyApplication: () => api.get<ResellerApplication>('/resellers/applications/me/'),

  getAnalyticsOverview: (params?: AnalyticsOverviewParams) => 
    api.get<ResellerAnalyticsOverview>('/resellers/analytics/overview/', { params }),

  getCommissions: (params?: CommissionListParams) =>
    api.get<PaginatedResponse<ResellerCommission>>('/resellers/commissions/', { params }),

  getCommissionSummary: () => api.get<CommissionSummary>('/resellers/commissions/summary/'),

  getStorefronts: (params?: StorefrontListParams) => 
    api.get<PaginatedResponse<Storefront> | Storefront[]>('/resellers/storefronts/', { params }),

  getStorefront: (id: string) => api.get<Storefront>(`/resellers/storefronts/${id}/`),

  createStorefront: (data: CreateStorefrontPayload) =>
    api.post<Storefront>('/resellers/storefronts/', data),

  updateStorefront: (id: string, data: Partial<Storefront>) =>
    api.patch<Storefront>(`/resellers/storefronts/${id}/`, data),

  getStorefrontProducts: (storefrontId: string, params?: { cursor?: string; ordering?: string; page_size?: number }) =>
    api.get<PaginatedResponse<StorefrontProduct> | StorefrontProduct[]>(`/resellers/storefronts/${storefrontId}/products/`, { params }),

  bulkAddStorefrontProducts: (storefrontId: string, product_ids: string[]) =>
    api.post(`/resellers/storefronts/${storefrontId}/products/bulk-add/`, { product_ids }),

  removeStorefrontProduct: (storefrontId: string, productId: string) =>
    api.delete(`/resellers/storefronts/${storefrontId}/products/${productId}/`),

  getMarketingAssets: (params?: MarketingAssetsParams) => 
    api.get<PaginatedResponse<MarketingAsset> | MarketingAsset[]>('/resellers/marketing-assets/', { params }),

  getMarketingAsset: (id: string) => api.get<MarketingAsset>(`/resellers/marketing-assets/${id}/`),
};

export default resellersApi;

