// lib/api/storefronts/index.ts - Public Storefront API
import { api } from '../client';
import { Product, PaginatedResponse } from '../products';

export interface PublicStorefront {
  id: string;
  name: string;
  slug: string;
  type: 'online' | 'physical_screen' | 'link';
  reseller_company_name?: string;
  address_line1?: string;
  city?: string;
  country?: string;
  created_at?: string;
}

export interface StorefrontSharing {
  share_url: string;
  direct_link: string;
  qr_code_data: string;
  embed_code: string;
}

export interface StorefrontProductsParams {
  ordering?: 'position' | 'created_at' | 'price' | '-position' | '-created_at' | '-price';
  page?: number;
  page_size?: number;
}

export const storefrontsApi = {
  // Public endpoint - no auth required
  getPublicStorefront: (slug: string) =>
    api.get<PublicStorefront>(`/public/storefronts/${slug}/`),
  
  getPublicStorefrontProducts: (slug: string, params?: StorefrontProductsParams) =>
    api.get<PaginatedResponse<Product>>(`/public/storefronts/${slug}/products/`, {
      params,
    }),
  
  // Reseller endpoint - requires authentication
  getStorefrontSharing: (storefrontId: string) =>
    api.get<StorefrontSharing>(`/resellers/storefronts/${storefrontId}/sharing/`),
};

export default storefrontsApi;
