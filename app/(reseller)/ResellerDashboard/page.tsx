"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  BadgeCheck,
  Download,
  FileText,
  Loader2,
  Percent,
  Receipt,
  Store,
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Tag,
  MessageSquare,
  FileCheck,
  Grid3x3,
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Share2,
} from "lucide-react";
import {
  useResellerAnalytics,
  useResellerCommissionSummary,
  useResellerCommissions,
  useResellerMarketingAssets,
  useResellerProfile,
  useResellerStorefrontProducts,
  useResellerStorefronts,
  useUpdateResellerProfile,
  ResellerCommission,
  Storefront,
} from "@/hooks/useResellers";
import { useProducts } from "@/hooks/useProducts";
import type { ProductFilters } from "@/lib/api/products";
import { useOrders } from "@/hooks/useOrders";
import StorefrontSharing from "@/components/reseller/StorefrontSharing";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils/formatters";
import { cardBase, mutedText, statusBadgeMap, metricCard } from "@/components/reseller/utils";
import { OverviewTab, InventoryTab, LicensingTab, CategoriesTab } from "@/components/reseller/tabs";
import {
  CreateStorefrontDialog,
  EditStorefrontDialog,
  BulkAddProductsDialog,
  RemoveProductDialog,
} from "@/components/reseller/dialogs";

export default function ResellerDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [commissionPage, setCommissionPage] = useState(1);
  const [commissionStatus, setCommissionStatus] = useState<string | undefined>(undefined);
  const [commissionStorefront, setCommissionStorefront] = useState<string | undefined>(undefined);
  const [commissionDateFrom, setCommissionDateFrom] = useState<string | undefined>(undefined);
  const [commissionDateTo, setCommissionDateTo] = useState<string | undefined>(undefined);
  const [analyticsDateFrom, setAnalyticsDateFrom] = useState<string | undefined>(undefined);
  const [analyticsDateTo, setAnalyticsDateTo] = useState<string | undefined>(undefined);
  const [profileForm, setProfileForm] = useState<Record<string, string>>({});
  const [selectedStorefront, setSelectedStorefront] = useState<string | null>(null);
  const [marketingAssetsSearch, setMarketingAssetsSearch] = useState<string>("");
  const [marketingAssetsOrdering, setMarketingAssetsOrdering] = useState<string>("");
  const [selectedMarketingAsset, setSelectedMarketingAsset] = useState<string | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [orderDateFrom, setOrderDateFrom] = useState<string | undefined>(undefined);
  const [orderDateTo, setOrderDateTo] = useState<string | undefined>(undefined);
  
  // Storefront management state
  const [createStorefrontOpen, setCreateStorefrontOpen] = useState(false);
  const [editStorefrontOpen, setEditStorefrontOpen] = useState(false);
  const [editingStorefront, setEditingStorefront] = useState<Storefront | null>(null);
  const [storefrontFilters, setStorefrontFilters] = useState<{ type?: string; is_active?: string; search?: string }>({});
  
  // Product curation state
  const [bulkAddProductsOpen, setBulkAddProductsOpen] = useState(false);
  const [bulkAddStorefrontId, setBulkAddStorefrontId] = useState<string | null>(null);
  const [removingProductId, setRemovingProductId] = useState<string | null>(null);
  const [sharingStorefrontId, setSharingStorefrontId] = useState<string | null>(null);
  const [sharingStorefrontSlug, setSharingStorefrontSlug] = useState<string>("");

  const { data: profile, isLoading: loadingProfile } = useResellerProfile();
  const { data: analytics, isLoading: loadingAnalytics } = useResellerAnalytics({
    dateFrom: analyticsDateFrom,
    dateTo: analyticsDateTo,
  });
  const { data: summary, isLoading: loadingSummary } = useResellerCommissionSummary();
  const { data: commissions, isLoading: loadingCommissions } = useResellerCommissions({
    page: commissionPage,
    status: commissionStatus as any,
    storefront: commissionStorefront,
    date_from: commissionDateFrom,
    date_to: commissionDateTo,
  });
  const { data: storefronts, isLoading: loadingStorefronts } = useResellerStorefronts();
  const { data: storefrontProducts, isLoading: loadingStorefrontProducts } = useResellerStorefrontProducts(
    selectedStorefront || "",
    !!selectedStorefront,
    {
      ordering: 'position', // Order by position like the public storefront
      pageSize: 200, // Fetch up to 200 products to show all products
    }
  );
  const { data: marketingAssets, isLoading: loadingMarketing } = useResellerMarketingAssets({
    search: marketingAssetsSearch || undefined,
    ordering: marketingAssetsOrdering || undefined,
  });
  const { data: ordersData, isLoading: loadingOrders } = useOrders({
    status: orderStatusFilter === "all" ? undefined : orderStatusFilter,
    date_from: orderDateFrom,
    date_to: orderDateTo,
  });
  const updateProfileMutation = useUpdateResellerProfile();
  
  // Fetch product details for storefront products to show images and prices
  // Only fetch when we have storefront products
  const storefrontProductIds = useMemo(() => {
    if (!storefrontProducts || !Array.isArray(storefrontProducts)) {
      return [];
    }
    return storefrontProducts.map(p => p.product);
  }, [storefrontProducts]);
  
  // Fetch all products to get details for storefront products
  // In production, you might want to fetch individual products or use a batch endpoint
  const { data: allProductsData } = useProducts({
    page_size: 200, // Fetch more products to cover storefront products
    is_active: true,
  });
  
  const productDetailsMap = useMemo(() => {
    const map = new Map<string, any>();
    if (allProductsData?.results && storefrontProductIds.length > 0) {
      allProductsData.results.forEach((product: any) => {
        if (storefrontProductIds.includes(product.id)) {
          map.set(product.id, product);
        }
      });
    }
    return map;
  }, [allProductsData, storefrontProductIds]);

  // Auto-select first storefront when "My Product" tab is opened and no storefront is selected
  useEffect(() => {
    if (activeTab === "my-product" && !selectedStorefront && storefronts && storefronts.length > 0) {
      setSelectedStorefront(storefronts[0].id);
    }
  }, [activeTab, selectedStorefront, storefronts]);

  const commissionsList = commissions?.results ?? [];
  const topStorefronts = analytics?.top_storefronts ?? [];
  
  // Filter storefronts
  const filteredStorefronts = useMemo(() => {
    if (!storefronts || !Array.isArray(storefronts)) return [];
    let filtered = [...storefronts];
    
    if (storefrontFilters.type) {
      filtered = filtered.filter(sf => sf.type === storefrontFilters.type);
    }
    
    if (storefrontFilters.is_active !== undefined) {
      const isActive = storefrontFilters.is_active === "true";
      filtered = filtered.filter(sf => sf.is_active === isActive);
    }
    
    if (storefrontFilters.search) {
      const searchLower = storefrontFilters.search.toLowerCase();
      filtered = filtered.filter(sf => 
        sf.name.toLowerCase().includes(searchLower) ||
        sf.slug.toLowerCase().includes(searchLower) ||
        (sf.city && sf.city.toLowerCase().includes(searchLower)) ||
        (sf.country && sf.country.toLowerCase().includes(searchLower))
      );
    }
    
    return filtered;
  }, [storefronts, storefrontFilters]);
  
  const openEditDialog = (storefront: Storefront) => {
    setEditingStorefront(storefront);
    setEditStorefrontOpen(true);
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileForm, {
      onSuccess: () => setProfileForm({}),
      onError: () =>
        toast({
          title: "Update failed",
          description: "Unable to save changes. Please try again.",
          variant: "destructive",
        }),
    });
  };

  const renderCommissionStatus = (status: string) => (
    <Badge className={statusBadgeMap[status] || "bg-muted text-muted-foreground"}>{status}</Badge>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="w-full mb-6 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="inline-flex w-max min-w-full sm:w-full sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-11 bg-[#0a0a0a] border border-gray-800 h-auto p-1 gap-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black whitespace-nowrap text-xs sm:text-sm px-3 py-2 flex-shrink-0 sm:flex-shrink">
                Overview
              </TabsTrigger>
              <TabsTrigger value="storefront" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black whitespace-nowrap text-xs sm:text-sm px-3 py-2 flex-shrink-0 sm:flex-shrink">
                Storefront
              </TabsTrigger>
              <TabsTrigger value="inventory" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black whitespace-nowrap text-xs sm:text-sm px-3 py-2 flex-shrink-0 sm:flex-shrink">
                Inventory
              </TabsTrigger>
              <TabsTrigger value="order" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black whitespace-nowrap text-xs sm:text-sm px-3 py-2 flex-shrink-0 sm:flex-shrink">
                Order
              </TabsTrigger>
              <TabsTrigger value="earning" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black whitespace-nowrap text-xs sm:text-sm px-3 py-2 flex-shrink-0 sm:flex-shrink">
                Earning
              </TabsTrigger>
              <TabsTrigger value="analytic" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black whitespace-nowrap text-xs sm:text-sm px-3 py-2 flex-shrink-0 sm:flex-shrink">
                Analytic
              </TabsTrigger>
              <TabsTrigger value="pricing" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black whitespace-nowrap text-xs sm:text-sm px-3 py-2 flex-shrink-0 sm:flex-shrink">
                Pricing
              </TabsTrigger>
              <TabsTrigger value="messages" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black whitespace-nowrap text-xs sm:text-sm px-3 py-2 flex-shrink-0 sm:flex-shrink">
                Messages
              </TabsTrigger>
              <TabsTrigger value="licensing" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black whitespace-nowrap text-xs sm:text-sm px-3 py-2 flex-shrink-0 sm:flex-shrink">
                Licensing
              </TabsTrigger>
              <TabsTrigger value="my-product" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black whitespace-nowrap text-xs sm:text-sm px-3 py-2 flex-shrink-0 sm:flex-shrink">
                My Product
              </TabsTrigger>
              <TabsTrigger value="categories" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black whitespace-nowrap text-xs sm:text-sm px-3 py-2 flex-shrink-0 sm:flex-shrink">
                Categories
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          {/* Storefront Tab */}
          <TabsContent value="storefront" className="space-y-6">
            {/* Summary Cards */}
            {storefronts && storefronts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className={cardBase}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Total Storefronts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{storefronts.length}</div>
                    <p className="text-xs text-gray-500 mt-1">Active storefronts</p>
                  </CardContent>
                </Card>
                <Card className={cardBase}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Active Storefronts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {storefronts.filter(sf => sf.is_active).length}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Currently active</p>
                  </CardContent>
                </Card>
                <Card className={cardBase}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Storefront Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {new Set(storefronts.map(sf => sf.type)).size}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Different types</p>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <Card className={cardBase}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-white">Storefronts</CardTitle>
                    <CardDescription className={mutedText}>Manage storefront attribution and curated products.</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setCreateStorefrontOpen(true);
                    }}
                    className="gap-2 bg-[#00bfff] text-black hover:bg-[#00a8e6]"
                  >
                    <Plus className="h-4 w-4" />
                    Create Storefront
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name, slug, city, or country..."
                      value={storefrontFilters.search || ""}
                      onChange={(e) => setStorefrontFilters((prev) => ({ ...prev, search: e.target.value }))}
                      className="pl-10 bg-[#0f172a] border-gray-700 text-white"
                    />
                  </div>
                  <Select
                    value={storefrontFilters.type || "all"}
                    onValueChange={(v) => setStorefrontFilters((prev) => ({ ...prev, type: v === "all" ? undefined : v }))}
                  >
                    <SelectTrigger className="w-full sm:w-40 bg-[#0f172a] border-gray-700 text-white">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="physical_screen">Physical Screen</SelectItem>
                      <SelectItem value="link">Link</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={storefrontFilters.is_active !== undefined ? storefrontFilters.is_active : "all"}
                    onValueChange={(v) => setStorefrontFilters((prev) => ({ ...prev, is_active: v === "all" ? undefined : v }))}
                  >
                    <SelectTrigger className="w-full sm:w-40 bg-[#0f172a] border-gray-700 text-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {loadingStorefronts ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : filteredStorefronts.length === 0 ? (
                  <div className="text-center py-8">
                    <Store className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                    <p className={mutedText}>No storefronts found.</p>
                    {(!storefronts || storefronts.length === 0) && (
                    <Button
                      onClick={() => {
                        setCreateStorefrontOpen(true);
                      }}
                      className="mt-4 gap-2 bg-[#00bfff] text-black hover:bg-[#00a8e6]"
                    >
                      <Plus className="h-4 w-4" />
                      Create your first storefront
                    </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {filteredStorefronts.map((sf) => (
                      <Card key={sf.id} className={`${cardBase} border border-gray-800`}>
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                          <div>
                            <CardTitle className="text-base text-white">{sf.name}</CardTitle>
                            <CardDescription className="text-xs text-gray-500">
                              Slug: {sf.slug}
                              {sf.resellerCompanyName && ` • ${sf.resellerCompanyName}`}
                            </CardDescription>
                            {sf.resellerId && (
                              <CardDescription className="text-xs text-gray-600 mt-1">
                                Reseller ID: {sf.resellerId.substring(0, 8)}...
                              </CardDescription>
                            )}
                          </div>
                          <Badge variant="secondary" className="bg-[#0b1224] text-white border border-[#1f2a44]">
                            {sf.type}
                          </Badge>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {sf.address_line1 && (
                            <p className="text-sm text-gray-400">
                              {sf.address_line1}
                              {sf.city && `, ${sf.city}`}
                              {sf.country && `, ${sf.country}`}
                            </p>
                          )}
                          <p className="text-sm text-gray-400">
                            Commission override:{" "}
                            {sf.commission_rate_override
                              ? `${(parseFloat(sf.commission_rate_override) * 100).toFixed(1)}%`
                              : "Tier default"}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedStorefront(sf.id === selectedStorefront ? null : sf.id)}
                              className="gap-2 border-gray-700 bg-[#0f172a] text-white hover:bg-[#111a2f]"
                            >
                              <Store className="h-4 w-4" />
                              {selectedStorefront === sf.id ? "Hide products" : "View products"}
                              {storefrontProducts && Array.isArray(storefrontProducts) && selectedStorefront === sf.id && storefrontProducts.length > 0 && (
                                <Badge variant="secondary" className="ml-1 bg-[#00bfff]/20 text-[#00bfff] border-[#00bfff]/40">
                                  {storefrontProducts.length}
                                </Badge>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(sf)}
                              className="gap-2 border-gray-700 bg-[#0f172a] text-white hover:bg-[#111a2f]"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setBulkAddStorefrontId(sf.id);
                                setBulkAddProductsOpen(true);
                              }}
                              className="gap-2 border-gray-700 bg-[#0f172a] text-white hover:bg-[#111a2f]"
                            >
                              <Plus className="h-4 w-4" />
                              Add Products
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSharingStorefrontId(sf.id);
                                setSharingStorefrontSlug(sf.slug);
                              }}
                              className="gap-2 border-gray-700 bg-[#0f172a] text-white hover:bg-[#111a2f]"
                            >
                              <Share2 className="h-4 w-4" />
                              Share
                            </Button>
                            {sf.is_active ? (
                              <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border border-emerald-700/40">
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-gray-700 text-gray-300">
                                Inactive
                              </Badge>
                            )}
                          </div>
                          {selectedStorefront === sf.id && (
                            <div className="mt-3 rounded-lg border border-gray-700 p-4 bg-[#0b1224]/60">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <p className="text-sm font-semibold text-white">Products in Storefront</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {storefrontProducts && Array.isArray(storefrontProducts) && storefrontProducts.length > 0 
                                      ? `${storefrontProducts.length} product(s) added`
                                      : "No products added yet"}
                                  </p>
                                </div>
                                {storefrontProducts && Array.isArray(storefrontProducts) && storefrontProducts.length > 0 && (
                                  <Badge variant="outline" className="border-[#00bfff] text-[#00bfff] bg-[#00bfff]/10">
                                    {storefrontProducts.length} product(s)
                                  </Badge>
                                )}
                              </div>
                              {loadingStorefrontProducts ? (
                                <Skeleton className="h-10 w-full" />
                              ) : storefrontProducts && Array.isArray(storefrontProducts) && storefrontProducts.length > 0 ? (
                                <div className="space-y-3">
                                  {storefrontProducts.map((p) => {
                                    const productDetail = productDetailsMap.get(p.product);
                                    return (
                                      <div key={p.id} className="flex items-start gap-3 p-3 rounded-lg bg-[#0b0b0f] border border-gray-800 hover:border-gray-700 transition-colors">
                                        {productDetail?.images?.[0] ? (
                                          <img
                                            src={productDetail.images[0].image}
                                            alt={productDetail.images[0].alt_text || p.product_title || "Product"}
                                            className="w-16 h-16 object-cover rounded border border-gray-800 flex-shrink-0"
                                          />
                                        ) : (
                                          <div className="w-16 h-16 rounded border border-gray-800 bg-[#0f172a] flex items-center justify-center flex-shrink-0">
                                            <Package className="h-6 w-6 text-gray-600" />
                                          </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium text-white truncate">
                                                {p.product_title || productDetail?.title || `Product ${p.product.substring(0, 8)}...`}
                                              </p>
                                              {productDetail && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                  {formatCurrency(productDetail.current_price)} {productDetail.currency}
                                                </p>
                                              )}
                                              {p.notes && (
                                                <p className="text-xs text-gray-500 mt-1 italic">"{p.notes}"</p>
                                              )}
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                              {p.is_featured && (
                                                <Badge variant="outline" className="border-yellow-700 text-yellow-300 text-xs">
                                                  Featured
                                                </Badge>
                                              )}
                                              {p.position !== undefined && (
                                                <Badge variant="outline" className="border-gray-700 text-gray-200 text-xs">
                                                  #{p.position}
                                                </Badge>
                                              )}
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setRemovingProductId(p.id)}
                                                className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                title="Remove product"
                                              >
                                                <Trash2 className="h-3 w-3" />
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="text-center py-4">
                                  <p className={mutedText}>No products assigned.</p>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setBulkAddStorefrontId(sf.id);
                                      setBulkAddProductsOpen(true);
                                    }}
                                    className="mt-2 gap-2 border-gray-700 bg-[#0f172a] text-white hover:bg-[#111a2f]"
                                  >
                                    <Plus className="h-4 w-4" />
                                    Add Products
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <InventoryTab />
          </TabsContent>

          {/* Order Tab */}
          <TabsContent value="order" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Orders</h2>
                <p className={mutedText}>View orders attributed to your storefronts.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                  <SelectTrigger className="w-40 bg-[#0f172a] border-gray-800 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={orderDateFrom || ""}
                    onChange={(e) => setOrderDateFrom(e.target.value || undefined)}
                    placeholder="From Date"
                    className="w-40 bg-[#0f172a] border-gray-800 text-white"
                  />
                  <span className="text-gray-400">to</span>
                  <Input
                    type="date"
                    value={orderDateTo || ""}
                    onChange={(e) => setOrderDateTo(e.target.value || undefined)}
                    placeholder="To Date"
                    className="w-40 bg-[#0f172a] border-gray-800 text-white"
                  />
                  {(orderDateFrom || orderDateTo) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setOrderDateFrom(undefined);
                        setOrderDateTo(undefined);
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <Card className={cardBase}>
              <CardHeader>
                <CardTitle className="text-lg text-white">Order List</CardTitle>
                <CardDescription className={mutedText}>Orders with reseller attribution.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingOrders ? (
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : !ordersData || (Array.isArray(ordersData) ? ordersData.length === 0 : false) ? (
                  <p className={mutedText}>No orders found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-800">
                          <TableHead className="text-gray-300">Order ID</TableHead>
                          <TableHead className="text-gray-300">Storefront</TableHead>
                          <TableHead className="text-gray-300">Total</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                          <TableHead className="text-gray-300">Payment</TableHead>
                          <TableHead className="text-gray-300">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.isArray(ordersData) && ordersData.map((order: any) => (
                          <TableRow key={order.id} className="border-gray-800">
                            <TableCell className="font-medium text-white">{order.id}</TableCell>
                            <TableCell>
                              {order.storefrontSlug || order.storefront_slug ? (
                                <Badge variant="outline" className="border-gray-700 text-gray-300">
                                  {order.storefrontSlug || order.storefront_slug}
                                </Badge>
                              ) : (
                                <span className="text-gray-500">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-white">{formatCurrency(parseFloat(order.total || "0"))}</TableCell>
                            <TableCell>
                              <Badge className={statusBadgeMap[order.status] || "bg-muted text-muted-foreground"}>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={statusBadgeMap[order.payment_status] || "bg-muted text-muted-foreground"}>
                                {order.payment_status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-400">
                              {new Date(order.created_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earning Tab */}
          <TabsContent value="earning" className="space-y-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Commission Ledger</h2>
                <p className={mutedText}>Track earned, paid, and pending commissions.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Select value={commissionStatus || "all"} onValueChange={(v) => setCommissionStatus(v === "all" ? undefined : v)}>
                  <SelectTrigger className="w-40 bg-[#0f172a] border-gray-800 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="earned">Earned</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="voided">Voided</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={commissionStorefront || "all"} onValueChange={(v) => setCommissionStorefront(v === "all" ? undefined : v)}>
                  <SelectTrigger className="w-40 bg-[#0f172a] border-gray-800 text-white">
                    <SelectValue placeholder="Storefront" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Storefronts</SelectItem>
                    {Array.isArray(storefronts) && storefronts.map((sf) => (
                      <SelectItem key={sf.id} value={sf.id}>
                        {sf.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={commissionDateFrom || ""}
                    onChange={(e) => setCommissionDateFrom(e.target.value || undefined)}
                    placeholder="From Date"
                    className="w-40 bg-[#0f172a] border-gray-800 text-white"
                  />
                  <span className="text-gray-400">to</span>
                  <Input
                    type="date"
                    value={commissionDateTo || ""}
                    onChange={(e) => setCommissionDateTo(e.target.value || undefined)}
                    placeholder="To Date"
                    className="w-40 bg-[#0f172a] border-gray-800 text-white"
                  />
                  {(commissionDateFrom || commissionDateTo) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCommissionDateFrom(undefined);
                        setCommissionDateTo(undefined);
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <Card className={cardBase}>
              <CardHeader className="pb-0">
                <CardTitle className="text-lg text-white">Summary</CardTitle>
                <CardDescription className={mutedText}>Current month and last 30 days.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                {loadingSummary ? (
                  <>
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </>
                ) : (
                  <>
                    {metricCard(
                      "This Month Commission",
                      formatCurrency(parseFloat(summary?.this_month?.commission_amount || "0")),
                      Receipt
                    )}
                    {metricCard("This Month GMV", formatCurrency(parseFloat(summary?.this_month?.gmv || "0")), TrendingUp)}
                    {metricCard(
                      "Last 30d Commission",
                      formatCurrency(parseFloat(summary?.last_30_days?.commission_amount || "0")),
                      Receipt
                    )}
                    {metricCard(
                      "Last 30d GMV",
                      formatCurrency(parseFloat(summary?.last_30_days?.gmv || "0")),
                      TrendingUp
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Card className={cardBase}>
              <CardHeader>
                <CardTitle className="text-white">Commission Entries</CardTitle>
                <CardDescription className={mutedText}>Status, amounts, and attribution.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingCommissions ? (
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : commissionsList.length === 0 ? (
                  <p className={mutedText}>No commissions yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-800">
                          <TableHead className="text-gray-300">Order ID</TableHead>
                          <TableHead className="text-gray-300">Storefront</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                          <TableHead className="text-gray-300">Base Amount</TableHead>
                          <TableHead className="text-gray-300">Rate</TableHead>
                          <TableHead className="text-gray-300">Commission</TableHead>
                          <TableHead className="text-gray-300">Earned At</TableHead>
                          <TableHead className="text-gray-300">Paid At</TableHead>
                          <TableHead className="text-gray-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {commissionsList.map((item: ResellerCommission) => (
                          <TableRow key={item.id} className="border-gray-800">
                            <TableCell className="font-medium text-white">
                              <div className="flex flex-col">
                                <span className="text-xs text-gray-400">Order:</span>
                                <span>{item.orderId || item.order}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-white">
                              {item.storefrontSlug ? (
                                <Badge variant="outline" className="border-gray-700 text-gray-300">
                                  {item.storefrontSlug}
                                </Badge>
                              ) : (
                                <span className="text-gray-500">—</span>
                              )}
                            </TableCell>
                            <TableCell>{renderCommissionStatus(item.status)}</TableCell>
                            <TableCell className="text-white">{formatCurrency(parseFloat(item.base_amount || "0"))}</TableCell>
                            <TableCell className="text-white">{(parseFloat(item.commission_rate || "0") * 100).toFixed(1)}%</TableCell>
                            <TableCell className="font-semibold text-white">
                              {formatCurrency(parseFloat(item.commission_amount || "0"))}
                            </TableCell>
                            <TableCell className="text-sm text-gray-400">
                              {item.earned_at ? (
                                <div className="flex flex-col">
                                  <span>{new Date(item.earned_at).toLocaleDateString()}</span>
                                  <span className="text-xs text-gray-500">{new Date(item.earned_at).toLocaleTimeString()}</span>
                                </div>
                              ) : (
                                <span className="text-gray-500">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-gray-400">
                              {item.paid_at ? (
                                <div className="flex flex-col">
                                  <span>{new Date(item.paid_at).toLocaleDateString()}</span>
                                  <span className="text-xs text-gray-500">{new Date(item.paid_at).toLocaleTimeString()}</span>
                                </div>
                              ) : (
                                <span className="text-gray-500">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {(item.void_reason || item.metadata) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    // Show details in a dialog
                                    const details = [];
                                    if (item.void_reason) details.push(`Void Reason: ${item.void_reason}`);
                                    if (item.metadata) details.push(`Metadata: ${JSON.stringify(item.metadata, null, 2)}`);
                                    toast({
                                      title: "Commission Details",
                                      description: details.join("\n"),
                                    });
                                  }}
                                  className="h-7 w-7 p-0 text-gray-400 hover:text-white"
                                >
                                  <FileText className="h-3 w-3" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                {commissions?.count && commissions.count > (commissionsList.length || 0) && (
                  <div className="flex items-center justify-between mt-4">
                    <p className={mutedText}>
                      Page {commissionPage} • {commissions.count} total
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!commissions.previous}
                        onClick={() => setCommissionPage((p) => Math.max(1, p - 1))}
                        className="border-gray-700 text-white"
                      >
                        Previous
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!commissions.next}
                        onClick={() => setCommissionPage((p) => p + 1)}
                        className="border-gray-700 text-white"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytic Tab */}
          <TabsContent value="analytic" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
                <p className={mutedText}>Comprehensive performance metrics and insights</p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={analyticsDateFrom || ""}
                  onChange={(e) => setAnalyticsDateFrom(e.target.value || undefined)}
                  placeholder="From Date"
                  className="w-40 bg-[#0f172a] border-gray-800 text-white"
                />
                <span className="text-gray-400">to</span>
                <Input
                  type="date"
                  value={analyticsDateTo || ""}
                  onChange={(e) => setAnalyticsDateTo(e.target.value || undefined)}
                  placeholder="To Date"
                  className="w-40 bg-[#0f172a] border-gray-800 text-white"
                />
                {(analyticsDateFrom || analyticsDateTo) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAnalyticsDateFrom(undefined);
                      setAnalyticsDateTo(undefined);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {loadingAnalytics ? (
                <>
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </>
              ) : (
                <>
                  {metricCard(
                    "Lifetime GMV",
                    formatCurrency(parseFloat(analytics?.lifetime?.gmv || "0")),
                    TrendingUp,
                    `${analytics?.lifetime?.orders_count || 0} orders`
                  )}
                  {metricCard(
                    "Lifetime Commission",
                    formatCurrency(parseFloat(analytics?.lifetime?.commission_amount || "0")),
                    DollarSign,
                    `${analytics?.lifetime?.new_customers_count || 0} new customers`
                  )}
                  {metricCard(
                    "This Month GMV",
                    formatCurrency(parseFloat(analytics?.month_to_date?.gmv || "0")),
                    BarChart3,
                    `${analytics?.month_to_date?.orders_count || 0} orders`
                  )}
                  {metricCard(
                    "Last 30 Days GMV",
                    formatCurrency(parseFloat(analytics?.last_30_days?.gmv || "0")),
                    ShoppingCart,
                    `${analytics?.last_30_days?.orders_count || 0} orders`
                  )}
                </>
              )}
            </div>

            {/* Detailed Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className={cardBase}>
                <CardHeader>
                  <CardTitle className="text-base text-white flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#00bfff]" />
                    Lifetime Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Total GMV</span>
                      <span className="text-white font-semibold">
                        {formatCurrency(parseFloat(analytics?.lifetime?.gmv || "0"))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Total Commission</span>
                      <span className="text-white font-semibold">
                        {formatCurrency(parseFloat(analytics?.lifetime?.commission_amount || "0"))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Total Orders</span>
                      <span className="text-white font-semibold">{analytics?.lifetime?.orders_count || 0}</span>
                    </div>
                    {analytics?.lifetime?.new_customers_count !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">New Customers</span>
                        <span className="text-white font-semibold">{analytics.lifetime.new_customers_count}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className={cardBase}>
                <CardHeader>
                  <CardTitle className="text-base text-white flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#00bfff]" />
                    This Month (MTD)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">GMV</span>
                      <span className="text-white font-semibold">
                        {formatCurrency(parseFloat(analytics?.month_to_date?.gmv || "0"))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Commission</span>
                      <span className="text-white font-semibold">
                        {formatCurrency(parseFloat(analytics?.month_to_date?.commission_amount || "0"))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Orders</span>
                      <span className="text-white font-semibold">{analytics?.month_to_date?.orders_count || 0}</span>
                    </div>
                    {analytics?.month_to_date?.new_customers_count !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">New Customers</span>
                        <span className="text-white font-semibold">{analytics.month_to_date.new_customers_count}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className={cardBase}>
                <CardHeader>
                  <CardTitle className="text-base text-white flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-[#00bfff]" />
                    Last 30 Days
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">GMV</span>
                      <span className="text-white font-semibold">
                        {formatCurrency(parseFloat(analytics?.last_30_days?.gmv || "0"))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Commission</span>
                      <span className="text-white font-semibold">
                        {formatCurrency(parseFloat(analytics?.last_30_days?.commission_amount || "0"))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Orders</span>
                      <span className="text-white font-semibold">{analytics?.last_30_days?.orders_count || 0}</span>
                    </div>
                    {analytics?.last_30_days?.new_customers_count !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">New Customers</span>
                        <span className="text-white font-semibold">{analytics.last_30_days.new_customers_count}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Storefronts */}
            {analytics?.top_storefronts && analytics.top_storefronts.length > 0 && (
              <Card className={cardBase}>
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Store className="h-5 w-5 text-[#00bfff]" />
                    Top Performing Storefronts
                  </CardTitle>
                  <CardDescription className={mutedText}>Best performing storefronts by GMV and commission</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {analytics.top_storefronts.map((storefront) => (
                      <Card key={storefront.id} className={`${cardBase} border border-gray-800`}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base text-white">{storefront.name}</CardTitle>
                          <CardDescription className="text-xs text-gray-500">Slug: {storefront.slug}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">GMV</span>
                            <span className="text-white font-semibold">{formatCurrency(parseFloat(storefront.gmv || "0"))}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Commission</span>
                            <span className="text-white font-semibold">
                              {formatCurrency(parseFloat(storefront.commission_amount || "0"))}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Orders</span>
                            <span className="text-white font-semibold">{storefront.orders_count}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Commissions */}
            {analytics?.recent_commissions && analytics.recent_commissions.length > 0 && (
              <Card className={cardBase}>
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-[#00bfff]" />
                    Recent Commissions
                  </CardTitle>
                  <CardDescription className={mutedText}>Latest commission entries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-800">
                          <TableHead className="text-gray-300">Order</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                          <TableHead className="text-gray-300">Commission</TableHead>
                          <TableHead className="text-gray-300">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analytics.recent_commissions.slice(0, 10).map((commission: ResellerCommission) => (
                          <TableRow key={commission.id} className="border-gray-800">
                            <TableCell className="font-medium text-white">
                              {commission.orderId || commission.order}
                            </TableCell>
                            <TableCell>{renderCommissionStatus(commission.status)}</TableCell>
                            <TableCell className="font-semibold text-white">
                              {formatCurrency(parseFloat(commission.commission_amount || "0"))}
                            </TableCell>
                            <TableCell className="text-sm text-gray-400">
                              {new Date(commission.earned_at || commission.created_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Performance Comparison */}
            {analytics && (
              <Card className={cardBase}>
                <CardHeader>
                  <CardTitle className="text-lg text-white">Performance Comparison</CardTitle>
                  <CardDescription className={mutedText}>Compare different time periods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">Lifetime vs This Month</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">GMV Ratio</span>
                          <span className="text-white">
                            {parseFloat(analytics.lifetime?.gmv || "0") > 0
                              ? ((parseFloat(analytics.month_to_date?.gmv || "0") / parseFloat(analytics.lifetime.gmv)) * 100).toFixed(1)
                              : "0"}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Commission Ratio</span>
                          <span className="text-white">
                            {parseFloat(analytics.lifetime?.commission_amount || "0") > 0
                              ? ((parseFloat(analytics.month_to_date?.commission_amount || "0") / parseFloat(analytics.lifetime.commission_amount)) * 100).toFixed(1)
                              : "0"}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">This Month vs Last 30 Days</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">GMV Difference</span>
                          <span className="text-white">
                            {formatCurrency(
                              parseFloat(analytics.month_to_date?.gmv || "0") - parseFloat(analytics.last_30_days?.gmv || "0")
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Commission Difference</span>
                          <span className="text-white">
                            {formatCurrency(
                              parseFloat(analytics.month_to_date?.commission_amount || "0") -
                              parseFloat(analytics.last_30_days?.commission_amount || "0")
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">Average Metrics</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Avg Order Value (Lifetime)</span>
                          <span className="text-white">
                            {analytics.lifetime?.orders_count && analytics.lifetime.orders_count > 0
                              ? formatCurrency(parseFloat(analytics.lifetime.gmv || "0") / analytics.lifetime.orders_count)
                              : "—"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Commission Rate</span>
                          <span className="text-white">
                            {parseFloat(analytics.lifetime?.gmv || "0") > 0
                              ? ((parseFloat(analytics.lifetime.commission_amount || "0") / parseFloat(analytics.lifetime.gmv)) * 100).toFixed(2)
                              : "0"}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card className={cardBase}>
              <CardHeader>
                <CardTitle className="text-lg text-white">Profile & Pricing</CardTitle>
                <CardDescription className={mutedText}>View your reseller profile, tier information, and commission rates.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingProfile ? (
                  <Skeleton className="h-32 w-full" />
                ) : profile ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className={cardBase}>
                        <CardHeader>
                          <CardTitle className="text-base text-white">Tier Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Tier:</span>
                            <span className="text-white font-semibold">{profile.tier?.display_name || profile.tier?.name || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Commission Rate:</span>
                            <span className="text-white font-semibold">
                              {profile.tier?.commission_rate
                                ? `${(parseFloat(profile.tier.commission_rate) * 100).toFixed(1)}%`
                                : "N/A"}
                            </span>
                          </div>
                          {profile.tier?.min_payout_threshold && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Min Payout:</span>
                              <span className="text-white font-semibold">
                                {formatCurrency(parseFloat(profile.tier.min_payout_threshold))}
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      <Card className={cardBase}>
                        <CardHeader>
                          <CardTitle className="text-base text-white">Account Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Status:</span>
                            <Badge className={statusBadgeMap[profile.status] || "bg-muted text-muted-foreground"}>
                              {profile.status}
                            </Badge>
                          </div>
                          {profile.userEmail && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Email:</span>
                              <span className="text-white font-semibold">{profile.userEmail}</span>
                            </div>
                          )}
                          {profile.approved_at && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Approved At:</span>
                              <span className="text-white font-semibold">
                                {new Date(profile.approved_at).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {profile.created_at && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Created:</span>
                              <span className="text-white font-semibold">
                                {new Date(profile.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                    <Card className={cardBase}>
                      <CardHeader>
                        <CardTitle className="text-base text-white">Company Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {profile.company_name && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Company Name:</span>
                              <span className="text-white font-semibold">{profile.company_name}</span>
                            </div>
                          )}
                          {profile.legal_name && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Legal Name:</span>
                              <span className="text-white font-semibold">{profile.legal_name}</span>
                            </div>
                          )}
                          {profile.vat_number && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">VAT Number:</span>
                              <span className="text-white font-semibold">{profile.vat_number}</span>
                            </div>
                          )}
                          {profile.website_url && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Website:</span>
                              <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-[#00bfff] hover:underline">
                                {profile.website_url}
                              </a>
                            </div>
                          )}
                          {profile.contact_name && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Contact Name:</span>
                              <span className="text-white font-semibold">{profile.contact_name}</span>
                            </div>
                          )}
                          {profile.contact_email && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Contact Email:</span>
                              <span className="text-white font-semibold">{profile.contact_email}</span>
                            </div>
                          )}
                          {profile.contact_phone && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Contact Phone:</span>
                              <span className="text-white font-semibold">{profile.contact_phone}</span>
                            </div>
                          )}
                          {profile.default_commission_rate && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Default Commission:</span>
                              <span className="text-white font-semibold">
                                {(parseFloat(profile.default_commission_rate) * 100).toFixed(1)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <p className={mutedText}>Profile unavailable.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card className={cardBase}>
              <CardHeader>
                <CardTitle className="text-lg text-white">Messages</CardTitle>
                <CardDescription className={mutedText}>Communicate with support and view notifications.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className={mutedText}>Messages feature coming soon.</p>
              </CardContent>
            </Card>

            {/* Marketing Assets Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Marketing Assets</h2>
                <p className={mutedText}>Download marketing materials for your tier.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search assets..."
                    value={marketingAssetsSearch}
                    onChange={(e) => setMarketingAssetsSearch(e.target.value)}
                    className="pl-10 bg-[#0f172a] border-gray-700 text-white"
                  />
                </div>
                <Select value={marketingAssetsOrdering || "created_at"} onValueChange={setMarketingAssetsOrdering}>
                  <SelectTrigger className="w-40 bg-[#0f172a] border-gray-800 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Newest First</SelectItem>
                    <SelectItem value="-created_at">Oldest First</SelectItem>
                    <SelectItem value="title">Title (A-Z)</SelectItem>
                    <SelectItem value="-title">Title (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className={cardBase}>
              <CardContent className="pt-6">
                {loadingMarketing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                  </div>
                ) : !marketingAssets || marketingAssets.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                    <p className={mutedText}>No marketing assets available for your tier.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {marketingAssets.map((asset) => (
                      <Card key={asset.id} className={`${cardBase} border border-gray-800 hover:border-gray-700 transition-colors`}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base text-white">{asset.title}</CardTitle>
                            <Badge variant="outline" className="border-gray-700 text-gray-300 text-xs">
                              {asset.asset_type}
                            </Badge>
                          </div>
                          {asset.description && (
                            <CardDescription className={mutedText}>{asset.description}</CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {asset.min_tier && (
                            <div className="text-xs text-gray-500">
                              Min Tier: {asset.min_tier.display_name || asset.min_tier.name}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            {asset.file && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  window.open(asset.file || '', '_blank');
                                }}
                                className="flex-1 border-gray-700 bg-[#0f172a] text-white hover:bg-[#111a2f]"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            )}
                            {asset.url && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  window.open(asset.url || '', '_blank');
                                }}
                                className="flex-1 border-gray-700 bg-[#0f172a] text-white hover:bg-[#111a2f]"
                              >
                                View Link
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedMarketingAsset(asset.id)}
                              className="h-9 w-9 p-0 text-gray-400 hover:text-white"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Marketing Asset Detail Dialog */}
            {selectedMarketingAsset && (
              <Dialog open={!!selectedMarketingAsset} onOpenChange={(open) => !open && setSelectedMarketingAsset(null)}>
                <DialogContent className="bg-[#0b0b0f] border-gray-800 text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Marketing Asset Details</DialogTitle>
                  </DialogHeader>
                  {(() => {
                    const asset = marketingAssets?.find(a => a.id === selectedMarketingAsset);
                    if (!asset) return null;
                    return (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-gray-400">Title</Label>
                          <p className="text-white">{asset.title}</p>
                        </div>
                        {asset.description && (
                          <div>
                            <Label className="text-gray-400">Description</Label>
                            <p className="text-white">{asset.description}</p>
                          </div>
                        )}
                        <div>
                          <Label className="text-gray-400">Type</Label>
                          <Badge variant="outline" className="border-gray-700 text-gray-300">
                            {asset.asset_type}
                          </Badge>
                        </div>
                        {asset.min_tier && (
                          <div>
                            <Label className="text-gray-400">Minimum Tier</Label>
                            <p className="text-white">{asset.min_tier.display_name || asset.min_tier.name}</p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          {asset.file && (
                            <Button
                              onClick={() => window.open(asset.file || '', '_blank')}
                              className="bg-[#00bfff] text-black hover:bg-[#00a8e6]"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download File
                            </Button>
                          )}
                          {asset.url && (
                            <Button
                              variant="outline"
                              onClick={() => window.open(asset.url || '', '_blank')}
                              className="border-gray-700 text-white"
                            >
                              Open URL
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>

          {/* Licensing Tab */}
          <TabsContent value="licensing">
            <LicensingTab />
          </TabsContent>

          {/* My Product Tab */}
          <TabsContent value="my-product" className="space-y-6">
            <Card className={cardBase}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-white">My Products</CardTitle>
                    <CardDescription className={mutedText}>Manage products across your storefronts.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingStorefronts ? (
                  <Skeleton className="h-10 w-full mb-4" />
                ) : !storefronts || storefronts.length === 0 ? (
                  <div className="text-center py-8">
                    <Store className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                    <p className={mutedText}>No storefronts found. Create a storefront first to add products.</p>
                    <Button
                      onClick={() => {
                        setActiveTab("storefront");
                        setCreateStorefrontOpen(true);
                      }}
                      className="mt-4 gap-2 bg-[#00bfff] text-black hover:bg-[#00a8e6]"
                    >
                      <Plus className="h-4 w-4" />
                      Create Storefront
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Storefront Selector */}
                    <div className="flex items-center gap-3">
                      <Label htmlFor="my-product-storefront" className="text-sm font-medium text-white whitespace-nowrap">
                        Select Storefront:
                      </Label>
                      <Select
                        value={selectedStorefront || (storefronts && storefronts.length > 0 ? storefronts[0].id : "")}
                        onValueChange={(value) => setSelectedStorefront(value)}
                      >
                        <SelectTrigger id="my-product-storefront" className="flex-1 max-w-md bg-[#0f172a] border-gray-700 text-white">
                          <SelectValue placeholder="Select a storefront" />
                        </SelectTrigger>
                        <SelectContent>
                          {storefronts.map((sf) => (
                            <SelectItem key={sf.id} value={sf.id}>
                              {sf.name} {sf.is_active ? "" : "(Inactive)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Products List */}
                    {selectedStorefront ? (
                      <>
                        {loadingStorefrontProducts ? (
                          <div className="space-y-3">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                          </div>
                        ) : storefrontProducts && Array.isArray(storefrontProducts) && storefrontProducts.length > 0 ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm text-gray-400">
                                {storefrontProducts.length} product{storefrontProducts.length !== 1 ? "s" : ""} in this storefront
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setBulkAddStorefrontId(selectedStorefront);
                                  setBulkAddProductsOpen(true);
                                }}
                                className="gap-2 border-gray-700 bg-[#0f172a] text-white hover:bg-[#111a2f]"
                              >
                                <Plus className="h-4 w-4" />
                                Add Products
                              </Button>
                            </div>
                            {storefrontProducts.map((p) => {
                              const productDetail = productDetailsMap.get(p.product);
                              return (
                                <Card key={p.id} className={cardBase}>
                                  <CardContent className="pt-4">
                                    <div className="flex items-start gap-3">
                                      {productDetail?.images?.[0] ? (
                                        <img
                                          src={productDetail.images[0].image}
                                          alt={productDetail.images[0].alt_text || p.product_title || "Product"}
                                          className="w-20 h-20 object-cover rounded border border-gray-800 flex-shrink-0"
                                        />
                                      ) : (
                                        <div className="w-20 h-20 rounded border border-gray-800 bg-[#0f172a] flex items-center justify-center flex-shrink-0">
                                          <Package className="h-8 w-8 text-gray-600" />
                                        </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                          <div className="flex-1">
                                            <p className="text-sm font-medium text-white">
                                              {p.product_title || productDetail?.title || `Product ${p.product.substring(0, 8)}...`}
                                            </p>
                                            {productDetail && (
                                              <p className="text-xs text-gray-400 mt-1">
                                                {formatCurrency(productDetail.current_price)} {productDetail.currency}
                                              </p>
                                            )}
                                            {p.notes && (
                                              <p className="text-xs text-gray-500 mt-1 italic">"{p.notes}"</p>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-2 flex-shrink-0">
                                            {p.is_featured && (
                                              <Badge variant="outline" className="border-yellow-700 text-yellow-300 text-xs">
                                                Featured
                                              </Badge>
                                            )}
                                            <Badge variant="outline" className="border-gray-700 text-gray-200 text-xs">
                                              Position {p.position ?? "-"}
                                            </Badge>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => setRemovingProductId(p.id)}
                                              className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                              title="Remove product"
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8 border border-gray-800 rounded-lg bg-[#0b1224]/60">
                            <Package className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                            <p className={mutedText}>No products assigned to this storefront.</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setBulkAddStorefrontId(selectedStorefront);
                                setBulkAddProductsOpen(true);
                              }}
                              className="mt-4 gap-2 border-gray-700 bg-[#0f172a] text-white hover:bg-[#111a2f]"
                            >
                              <Plus className="h-4 w-4" />
                              Add Products
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className={mutedText}>Please select a storefront to view products.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <CategoriesTab />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialogs */}
      <CreateStorefrontDialog
        open={createStorefrontOpen}
        onOpenChange={setCreateStorefrontOpen}
        onSuccess={() => {
          // Dialog handles its own state cleanup
        }}
      />
      
      <EditStorefrontDialog
        open={editStorefrontOpen}
        onOpenChange={(open) => {
          setEditStorefrontOpen(open);
          if (!open) setEditingStorefront(null);
        }}
        storefront={editingStorefront}
        onSuccess={() => {
          setEditingStorefront(null);
        }}
      />
      
      <BulkAddProductsDialog
        open={bulkAddProductsOpen}
        onOpenChange={(open) => {
          setBulkAddProductsOpen(open);
          if (!open) setBulkAddStorefrontId(null);
        }}
        storefrontId={bulkAddStorefrontId}
        onSuccess={() => {
          setBulkAddStorefrontId(null);
        }}
      />
      
      <RemoveProductDialog
        open={removingProductId !== null}
        onOpenChange={(open) => !open && setRemovingProductId(null)}
        productId={removingProductId}
        storefrontId={selectedStorefront}
        onSuccess={() => {
          setRemovingProductId(null);
        }}
      />
      
      {/* Storefront Sharing Dialog */}
      {sharingStorefrontId && (
        <StorefrontSharing
          storefrontId={sharingStorefrontId}
          storefrontSlug={sharingStorefrontSlug}
          open={sharingStorefrontId !== null}
          onOpenChange={(open) => {
            if (!open) {
              setSharingStorefrontId(null);
              setSharingStorefrontSlug("");
            }
          }}
        />
      )}
    </div>
  );
}
