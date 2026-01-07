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
  tier: ResellerTier;
  company_name?: string;
  legal_name?: string;
  vat_number?: string;
  website_url?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  status: ResellerStatus;
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

export type CommissionStatus = 'pending' | 'earned' | 'voided' | 'paid';

export interface ResellerCommission {
  id: string;
  order: string;
  reseller: string;
  storefront?: string | null;
  base_amount: string;
  commission_rate: string;
  commission_amount: string;
  status: CommissionStatus;
  earned_at?: string;
  paid_at?: string | null;
  void_reason?: string | null;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface CommissionListParams {
  page?: number;
  page_size?: number;
  status?: CommissionStatus;
  storefront?: string;
  date_from?: string;
  date_to?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CommissionSummary {
  this_month: ResellerSummaryStats;
  last_30_days: ResellerSummaryStats;
}

export type StorefrontType = 'online' | 'physical_screen' | 'link';

export interface Storefront {
  id: string;
  reseller: string;
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

export interface StorefrontProduct {
  id: string;
  product: string;
  position?: number;
  is_featured?: boolean;
  notes?: string;
  created_at?: string;
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

  getAnalyticsOverview: () => api.get<ResellerAnalyticsOverview>('/resellers/analytics/overview/'),

  getCommissions: (params?: CommissionListParams) =>
    api.get<PaginatedResponse<ResellerCommission>>('/resellers/commissions/', { params }),

  getCommissionSummary: () => api.get<CommissionSummary>('/resellers/commissions/summary/'),

  getStorefronts: () => api.get<Storefront[]>('/resellers/storefronts/'),

  getStorefront: (id: string) => api.get<Storefront>(`/resellers/storefronts/${id}/`),

  updateStorefront: (id: string, data: Partial<Storefront>) =>
    api.patch<Storefront>(`/resellers/storefronts/${id}/`, data),

  getStorefrontProducts: (storefrontId: string) =>
    api.get<StorefrontProduct[]>(`/resellers/storefronts/${storefrontId}/products/`),

  bulkAddStorefrontProducts: (storefrontId: string, product_ids: string[]) =>
    api.post(`/resellers/storefronts/${storefrontId}/products/bulk-add/`, { product_ids }),

  removeStorefrontProduct: (storefrontId: string, productId: string) =>
    api.delete(`/resellers/storefronts/${storefrontId}/products/${productId}/`),

  getMarketingAssets: () => api.get<MarketingAsset[]>('/resellers/marketing-assets/'),

  getMarketingAsset: (id: string) => api.get<MarketingAsset>(`/resellers/marketing-assets/${id}/`),
};

export default resellersApi;

