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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BadgeCheck,
  Download,
  FileText,
  Loader2,
  LucideIcon,
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
  useCreateStorefront,
  useUpdateStorefront,
  useBulkAddStorefrontProducts,
  useRemoveStorefrontProduct,
  ResellerCommission,
  Storefront,
} from "@/hooks/useResellers";
import { useProducts, useCategories } from "@/hooks/useProducts";
import StorefrontSharing from "@/components/reseller/StorefrontSharing";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils/formatters";

const cardBase = "bg-[#0b0b0f] border border-gray-800 shadow-lg shadow-[#00bfff]/5";
const mutedText = "text-sm text-gray-400";

const metricCard = (title: string, value: string | number, icon: LucideIcon, helper?: string) => {
  const Icon = icon;
  return (
    <Card className={cardBase}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        <Icon className="h-4 w-4 text-[#00bfff]" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {helper && <p className="text-xs text-gray-500 mt-1">{helper}</p>}
      </CardContent>
    </Card>
  );
};

const statusBadgeMap: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-600",
  earned: "bg-emerald-500/20 text-emerald-600",
  paid: "bg-blue-500/20 text-blue-600",
  voided: "bg-red-500/20 text-red-600",
};

export default function ResellerDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [commissionPage, setCommissionPage] = useState(1);
  const [commissionStatus, setCommissionStatus] = useState<string | undefined>(undefined);
  const [commissionStorefront, setCommissionStorefront] = useState<string | undefined>(undefined);
  const [profileForm, setProfileForm] = useState<Record<string, string>>({});
  const [selectedStorefront, setSelectedStorefront] = useState<string | null>(null);
  
  // Storefront management state
  const [createStorefrontOpen, setCreateStorefrontOpen] = useState(false);
  const [editStorefrontOpen, setEditStorefrontOpen] = useState(false);
  const [editingStorefront, setEditingStorefront] = useState<Storefront | null>(null);
  const [storefrontForm, setStorefrontForm] = useState<Record<string, any>>({});
  const [storefrontFilters, setStorefrontFilters] = useState<{ type?: string; is_active?: string; search?: string }>({});
  
  // Product curation state
  const [bulkAddProductsOpen, setBulkAddProductsOpen] = useState(false);
  const [bulkAddStorefrontId, setBulkAddStorefrontId] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productOrdering, setProductOrdering] = useState<string>("");
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>("");
  const [removingProductId, setRemovingProductId] = useState<string | null>(null);
  const [sharingStorefrontId, setSharingStorefrontId] = useState<string | null>(null);
  const [sharingStorefrontSlug, setSharingStorefrontSlug] = useState<string>("");

  const { data: profile, isLoading: loadingProfile } = useResellerProfile();
  const { data: analytics, isLoading: loadingAnalytics } = useResellerAnalytics();
  const { data: summary, isLoading: loadingSummary } = useResellerCommissionSummary();
  const { data: commissions, isLoading: loadingCommissions } = useResellerCommissions({
    page: commissionPage,
    status: commissionStatus as any,
    storefront: commissionStorefront,
  });
  const { data: storefronts, isLoading: loadingStorefronts } = useResellerStorefronts();
  const { data: storefrontProducts, isLoading: loadingStorefrontProducts } = useResellerStorefrontProducts(
    selectedStorefront || "",
    !!selectedStorefront
  );
  const { data: marketingAssets, isLoading: loadingMarketing } = useResellerMarketingAssets();
  const updateProfileMutation = useUpdateResellerProfile();
  
  // Storefront mutations
  const createStorefrontMutation = useCreateStorefront();
  const updateStorefrontMutation = useUpdateStorefront();
  const bulkAddProductsMutation = useBulkAddStorefrontProducts();
  const removeProductMutation = useRemoveStorefrontProduct();
  
  // Categories for filtering
  const { data: categoriesData } = useCategories();
  const categories = categoriesData || [];
  
  // Products for bulk add
  const { data: productsData, isLoading: loadingProducts } = useProducts({
    is_active: true,
    search: productSearchQuery || undefined,
    category__slug: productCategoryFilter || undefined,
    ordering: productOrdering || undefined,
    page_size: 50,
  });
  const availableProducts = productsData?.results || [];
  
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
  
  // Storefront form handlers
  const handleStorefrontFormChange = (field: string, value: any) => {
    setStorefrontForm((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleCreateStorefront = (e: React.FormEvent) => {
    e.preventDefault();
    createStorefrontMutation.mutate(storefrontForm as any, {
      onSuccess: () => {
        setStorefrontForm({});
        setCreateStorefrontOpen(false);
      },
    });
  };
  
  const handleEditStorefront = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStorefront) return;
    updateStorefrontMutation.mutate(
      { id: editingStorefront.id, data: storefrontForm },
      {
        onSuccess: () => {
          setStorefrontForm({});
          setEditStorefrontOpen(false);
          setEditingStorefront(null);
        },
      }
    );
  };
  
  const openEditDialog = (storefront: Storefront) => {
    setEditingStorefront(storefront);
    setStorefrontForm({
      name: storefront.name,
      slug: storefront.slug,
      type: storefront.type,
      address_line1: storefront.address_line1 || "",
      city: storefront.city || "",
      country: storefront.country || "",
      notes: storefront.notes || "",
      commission_rate_override: storefront.commission_rate_override || "",
      is_active: storefront.is_active,
    });
    setEditStorefrontOpen(true);
  };
  
  const handleBulkAddProducts = () => {
    if (!bulkAddStorefrontId || selectedProducts.size === 0) return;
    bulkAddProductsMutation.mutate(
      { storefrontId: bulkAddStorefrontId, product_ids: Array.from(selectedProducts) },
      {
        onSuccess: () => {
          setSelectedProducts(new Set());
          setBulkAddProductsOpen(false);
          setBulkAddStorefrontId(null);
          setProductSearchQuery("");
          setProductOrdering("");
          setProductCategoryFilter("");
        },
      }
    );
  };
  
  // Calculate total products across all storefronts
  const totalProductsCount = useMemo(() => {
    if (!storefronts || !Array.isArray(storefronts)) return 0;
    // Note: This is an approximation. For exact count, we'd need to fetch products for each storefront
    // or have a summary endpoint. For now, we'll show a message.
    return storefronts.length > 0 ? "Multiple" : 0;
  }, [storefronts]);
  
  const handleRemoveProduct = (productId: string) => {
    if (!selectedStorefront) return;
    removeProductMutation.mutate(
      { storefrontId: selectedStorefront, productId },
      {
        onSuccess: () => {
          setRemovingProductId(null);
        },
      }
    );
  };
  
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };
  
  const selectAllProducts = () => {
    setSelectedProducts(new Set(availableProducts.map(p => p.id)));
  };
  
  const deselectAllProducts = () => {
    setSelectedProducts(new Set());
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

  const summaryCards = useMemo(() => {
    const month = summary?.this_month;
    const lifetime = analytics?.lifetime;
    return [
      {
        title: "This Month GMV",
        value: month ? formatCurrency(parseFloat(month.gmv || "0")) : "—",
        helper: `${month?.orders_count ?? 0} orders`,
        icon: TrendingUp,
      },
      {
        title: "This Month Commission",
        value: month ? formatCurrency(parseFloat(month.commission_amount || "0")) : "—",
        helper: `${month?.new_customers_count ?? 0} new customers`,
        icon: Percent,
      },
      {
        title: "Lifetime GMV",
        value: lifetime ? formatCurrency(parseFloat(lifetime.gmv || "0")) : "—",
        helper: `${lifetime?.orders_count ?? 0} orders total`,
        icon: Users,
      },
      {
        title: "Lifetime Commission",
        value: lifetime ? formatCurrency(parseFloat(lifetime.commission_amount || "0")) : "—",
        helper: profile?.tier?.display_name || profile?.tier?.name || "Tier",
        icon: Receipt,
      },
    ];
  }, [summary, analytics, profile]);

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
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {summaryCards.map((card) =>
                loadingAnalytics || loadingSummary ? (
                  <Skeleton key={card.title} className="h-28 w-full" />
                ) : (
                  <div key={card.title}>{metricCard(card.title, card.value, card.icon, card.helper)}</div>
                )
              )}
            </div>

            <Card className={cardBase}>
              <CardHeader>
                <CardTitle className="text-lg text-white">Top Storefronts</CardTitle>
                <CardDescription className={mutedText}>Your best performing storefronts by GMV.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingAnalytics ? (
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : topStorefronts.length === 0 ? (
                  <p className={mutedText}>No storefront performance data yet.</p>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {topStorefronts.map((storefront) => (
                      <Card key={storefront.id} className={`${cardBase} border border-gray-800`}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base text-white">{storefront.name}</CardTitle>
                          <CardDescription className="text-xs text-gray-500">Slug: {storefront.slug}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500">GMV</p>
                            <p className="font-semibold text-white">{formatCurrency(parseFloat(storefront.gmv || "0"))}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Commission</p>
                            <p className="font-semibold text-white">
                              {formatCurrency(parseFloat(storefront.commission_amount || "0"))}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Orders</p>
                            <p className="font-semibold text-white">{storefront.orders_count}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
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
                      setStorefrontForm({ is_active: true });
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
                          setStorefrontForm({ is_active: true });
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
                            <CardDescription className="text-xs text-gray-500">Slug: {sf.slug}</CardDescription>
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
          <TabsContent value="inventory" className="space-y-6">
            <Card className={cardBase}>
              <CardHeader>
                <CardTitle className="text-lg text-white">Inventory</CardTitle>
                <CardDescription className={mutedText}>Manage your product inventory.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className={mutedText}>Inventory management coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Order Tab */}
          <TabsContent value="order" className="space-y-6">
            <Card className={cardBase}>
              <CardHeader>
                <CardTitle className="text-lg text-white">Orders</CardTitle>
                <CardDescription className={mutedText}>View orders attributed to your storefronts.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className={mutedText}>Order management coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earning Tab */}
          <TabsContent value="earning" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Commission Ledger</h2>
                <p className={mutedText}>Track earned, paid, and pending commissions.</p>
              </div>
              <div className="flex gap-2">
                <Select onValueChange={(v) => setCommissionStatus(v === "all" ? undefined : v)}>
                  <SelectTrigger className="w-40 bg-[#0f172a] border-gray-800 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="earned">Earned</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="voided">Voided</SelectItem>
                  </SelectContent>
                </Select>
                <Select onValueChange={(v) => setCommissionStorefront(v === "all" ? undefined : v)}>
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
                          <TableHead className="text-gray-300">Order</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                          <TableHead className="text-gray-300">Base</TableHead>
                          <TableHead className="text-gray-300">Rate</TableHead>
                          <TableHead className="text-gray-300">Commission</TableHead>
                          <TableHead className="text-gray-300">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {commissionsList.map((item: ResellerCommission) => (
                          <TableRow key={item.id} className="border-gray-800">
                            <TableCell className="font-medium text-white">{item.order}</TableCell>
                            <TableCell>{renderCommissionStatus(item.status)}</TableCell>
                            <TableCell className="text-white">{formatCurrency(parseFloat(item.base_amount || "0"))}</TableCell>
                            <TableCell className="text-white">{(parseFloat(item.commission_rate || "0") * 100).toFixed(1)}%</TableCell>
                            <TableCell className="font-semibold text-white">
                              {formatCurrency(parseFloat(item.commission_amount || "0"))}
                            </TableCell>
                            <TableCell className="text-sm text-gray-400">
                              {new Date(item.earned_at || item.created_at).toLocaleDateString()}
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
            <Card className={cardBase}>
              <CardHeader>
                <CardTitle className="text-lg text-white">Analytics</CardTitle>
                <CardDescription className={mutedText}>Detailed analytics and insights.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingAnalytics ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className={cardBase}>
                        <CardHeader>
                          <CardTitle className="text-base text-white">Lifetime Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total GMV:</span>
                            <span className="text-white font-semibold">
                              {formatCurrency(parseFloat(analytics?.lifetime?.gmv || "0"))}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total Commission:</span>
                            <span className="text-white font-semibold">
                              {formatCurrency(parseFloat(analytics?.lifetime?.commission_amount || "0"))}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total Orders:</span>
                            <span className="text-white font-semibold">{analytics?.lifetime?.orders_count || 0}</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className={cardBase}>
                        <CardHeader>
                          <CardTitle className="text-base text-white">This Month</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">GMV:</span>
                            <span className="text-white font-semibold">
                              {formatCurrency(parseFloat(analytics?.month_to_date?.gmv || "0"))}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Commission:</span>
                            <span className="text-white font-semibold">
                              {formatCurrency(parseFloat(analytics?.month_to_date?.commission_amount || "0"))}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Orders:</span>
                            <span className="text-white font-semibold">{analytics?.month_to_date?.orders_count || 0}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card className={cardBase}>
              <CardHeader>
                <CardTitle className="text-lg text-white">Pricing</CardTitle>
                <CardDescription className={mutedText}>View your commission rates and pricing structure.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingProfile ? (
                  <Skeleton className="h-32 w-full" />
                ) : profile ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className={cardBase}>
                        <CardHeader>
                          <CardTitle className="text-base text-white">Tier Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
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
                        </CardContent>
                      </Card>
                    </div>
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
          </TabsContent>

          {/* Licensing Tab */}
          <TabsContent value="licensing" className="space-y-6">
            <Card className={cardBase}>
              <CardHeader>
                <CardTitle className="text-lg text-white">Licensing</CardTitle>
                <CardDescription className={mutedText}>View licensing agreements and documents.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className={mutedText}>Licensing information coming soon.</p>
              </CardContent>
            </Card>
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
                        setStorefrontForm({ is_active: true });
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
          <TabsContent value="categories" className="space-y-6">
            <Card className={cardBase}>
              <CardHeader>
                <CardTitle className="text-lg text-white">Categories</CardTitle>
                <CardDescription className={mutedText}>Browse and manage product categories.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className={mutedText}>Category management coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Create Storefront Dialog */}
      <Dialog open={createStorefrontOpen} onOpenChange={setCreateStorefrontOpen}>
        <DialogContent className="bg-[#0b0b0f] border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Storefront</DialogTitle>
            <DialogDescription className="text-gray-400">
              Create a new storefront for your reseller account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateStorefront} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={storefrontForm.name || ""}
                  onChange={(e) => handleStorefrontFormChange("name", e.target.value)}
                  required
                  maxLength={255}
                  className="bg-[#0f172a] border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={storefrontForm.slug || ""}
                  onChange={(e) => handleStorefrontFormChange("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                  required
                  maxLength={120}
                  placeholder="gym-alpha-main-entrance"
                  className="bg-[#0f172a] border-gray-700 text-white"
                />
                <p className="text-xs text-gray-500">URL-friendly identifier (alphanumeric and hyphens only)</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={storefrontForm.type || ""}
                onValueChange={(v) => handleStorefrontFormChange("type", v)}
                required
              >
                <SelectTrigger className="bg-[#0f172a] border-gray-700 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="physical_screen">Physical Screen</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address_line1">Address</Label>
                <Input
                  id="address_line1"
                  value={storefrontForm.address_line1 || ""}
                  onChange={(e) => handleStorefrontFormChange("address_line1", e.target.value)}
                  className="bg-[#0f172a] border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={storefrontForm.city || ""}
                  onChange={(e) => handleStorefrontFormChange("city", e.target.value)}
                  className="bg-[#0f172a] border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={storefrontForm.country || ""}
                  onChange={(e) => handleStorefrontFormChange("country", e.target.value)}
                  className="bg-[#0f172a] border-gray-700 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission_rate_override">Commission Rate Override (%)</Label>
              <Input
                id="commission_rate_override"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={storefrontForm.commission_rate_override ? (parseFloat(storefrontForm.commission_rate_override) * 100).toString() : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    handleStorefrontFormChange("commission_rate_override", "");
                  } else {
                    const decimal = (parseFloat(value) / 100).toString();
                    handleStorefrontFormChange("commission_rate_override", decimal);
                  }
                }}
                placeholder="Leave empty for tier default"
                className="bg-[#0f172a] border-gray-700 text-white"
              />
              <p className="text-xs text-gray-500">Override commission rate (0-100%). Leave empty to use tier default.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={storefrontForm.notes || ""}
                onChange={(e) => handleStorefrontFormChange("notes", e.target.value)}
                className="bg-[#0f172a] border-gray-700 text-white"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={storefrontForm.is_active !== false}
                onCheckedChange={(checked) => handleStorefrontFormChange("is_active", checked)}
              />
              <Label htmlFor="is_active" className="cursor-pointer">Active</Label>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCreateStorefrontOpen(false);
                  setStorefrontForm({});
                }}
                className="border-gray-700 text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createStorefrontMutation.isPending}
                className="bg-[#00bfff] text-black hover:bg-[#00a8e6]"
              >
                {createStorefrontMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Storefront
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Storefront Dialog */}
      <Dialog open={editStorefrontOpen} onOpenChange={setEditStorefrontOpen}>
        <DialogContent className="bg-[#0b0b0f] border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Storefront</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update storefront information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditStorefront} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={storefrontForm.name || ""}
                  onChange={(e) => handleStorefrontFormChange("name", e.target.value)}
                  required
                  maxLength={255}
                  className="bg-[#0f172a] border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug *</Label>
                <Input
                  id="edit-slug"
                  value={storefrontForm.slug || ""}
                  onChange={(e) => handleStorefrontFormChange("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                  required
                  maxLength={120}
                  className="bg-[#0f172a] border-gray-700 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Type *</Label>
              <Select
                value={storefrontForm.type || ""}
                onValueChange={(v) => handleStorefrontFormChange("type", v)}
                required
              >
                <SelectTrigger className="bg-[#0f172a] border-gray-700 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="physical_screen">Physical Screen</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-address_line1">Address</Label>
                <Input
                  id="edit-address_line1"
                  value={storefrontForm.address_line1 || ""}
                  onChange={(e) => handleStorefrontFormChange("address_line1", e.target.value)}
                  className="bg-[#0f172a] border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-city">City</Label>
                <Input
                  id="edit-city"
                  value={storefrontForm.city || ""}
                  onChange={(e) => handleStorefrontFormChange("city", e.target.value)}
                  className="bg-[#0f172a] border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-country">Country</Label>
                <Input
                  id="edit-country"
                  value={storefrontForm.country || ""}
                  onChange={(e) => handleStorefrontFormChange("country", e.target.value)}
                  className="bg-[#0f172a] border-gray-700 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-commission_rate_override">Commission Rate Override (%)</Label>
              <Input
                id="edit-commission_rate_override"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={storefrontForm.commission_rate_override ? (parseFloat(storefrontForm.commission_rate_override) * 100).toString() : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    handleStorefrontFormChange("commission_rate_override", "");
                  } else {
                    const decimal = (parseFloat(value) / 100).toString();
                    handleStorefrontFormChange("commission_rate_override", decimal);
                  }
                }}
                placeholder="Leave empty for tier default"
                className="bg-[#0f172a] border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={storefrontForm.notes || ""}
                onChange={(e) => handleStorefrontFormChange("notes", e.target.value)}
                className="bg-[#0f172a] border-gray-700 text-white"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is_active"
                checked={storefrontForm.is_active !== false}
                onCheckedChange={(checked) => handleStorefrontFormChange("is_active", checked)}
              />
              <Label htmlFor="edit-is_active" className="cursor-pointer">Active</Label>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditStorefrontOpen(false);
                  setStorefrontForm({});
                  setEditingStorefront(null);
                }}
                className="border-gray-700 text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateStorefrontMutation.isPending}
                className="bg-[#00bfff] text-black hover:bg-[#00a8e6]"
              >
                {updateStorefrontMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Storefront
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Add Products Dialog */}
      <Dialog open={bulkAddProductsOpen} onOpenChange={setBulkAddProductsOpen}>
        <DialogContent className="bg-[#0b0b0f] border-gray-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Products to Storefront</DialogTitle>
            <DialogDescription className="text-gray-400">
              Search and select products to add to your storefront.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
                className="pl-10 bg-[#0f172a] border-gray-700 text-white"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm text-gray-400">Category</Label>
                <Select
                  value={productCategoryFilter || "all"}
                  onValueChange={(v) => setProductCategoryFilter(v === "all" ? "" : v)}
                >
                  <SelectTrigger className="bg-[#0f172a] border-gray-700 text-white">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-400">Sort By</Label>
                <Select
                  value={productOrdering || "title"}
                  onValueChange={(v) => setProductOrdering(v === "title" ? "" : v)}
                >
                  <SelectTrigger className="bg-[#0f172a] border-gray-700 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title (A-Z)</SelectItem>
                    <SelectItem value="-title">Title (Z-A)</SelectItem>
                    <SelectItem value="price">Price (Low to High)</SelectItem>
                    <SelectItem value="-price">Price (High to Low)</SelectItem>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="-popularity">Least Popular</SelectItem>
                    <SelectItem value="created_at">Newest First</SelectItem>
                    <SelectItem value="-created_at">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                {selectedProducts.size} product(s) selected
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectAllProducts}
                  className="border-gray-700 text-white"
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={deselectAllProducts}
                  className="border-gray-700 text-white"
                >
                  Deselect All
                </Button>
              </div>
            </div>
            <div className="border border-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto bg-[#0f172a]">
              {loadingProducts ? (
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : availableProducts.length === 0 ? (
                <p className={mutedText}>No products found.</p>
              ) : (
                <div className="space-y-2">
                  {availableProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-gray-800 hover:bg-[#0b0b0f]"
                    >
                      <Checkbox
                        checked={selectedProducts.has(product.id)}
                        onCheckedChange={() => toggleProductSelection(product.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{product.title}</p>
                        <p className="text-xs text-gray-400">
                          {formatCurrency(product.current_price)} {product.currency}
                        </p>
                      </div>
                      {product.images && product.images.length > 0 && (
                        <img
                          src={product.images[0].image}
                          alt={product.images[0].alt_text}
                          className="w-12 h-12 object-cover rounded border border-gray-800"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setBulkAddProductsOpen(false);
                  setSelectedProducts(new Set());
                  setProductSearchQuery("");
                  setProductOrdering("");
                  setProductCategoryFilter("");
                  setBulkAddStorefrontId(null);
                }}
                className="border-gray-700 text-white"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleBulkAddProducts}
                disabled={bulkAddProductsMutation.isPending || selectedProducts.size === 0}
                className="bg-[#00bfff] text-black hover:bg-[#00a8e6]"
              >
                {bulkAddProductsMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add {selectedProducts.size > 0 && `${selectedProducts.size} `}Product{selectedProducts.size !== 1 ? "s" : ""}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Remove Product Confirmation Dialog */}
      <AlertDialog open={removingProductId !== null} onOpenChange={(open) => !open && setRemovingProductId(null)}>
        <AlertDialogContent className="bg-[#0b0b0f] border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Product</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to remove this product from the storefront? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-700 text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (removingProductId) {
                  handleRemoveProduct(removingProductId);
                }
              }}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {removeProductMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
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
