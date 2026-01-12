"use client";

import { useMemo, useState } from "react";
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
} from "@/hooks/useResellers";
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

  const commissionsList = commissions?.results ?? [];
  const topStorefronts = analytics?.top_storefronts ?? [];

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
          <TabsList className="grid w-full grid-cols-11 bg-[#0a0a0a] border border-gray-800 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="storefront" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black">
              Storefront
            </TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black">
              Inventory
            </TabsTrigger>
            <TabsTrigger value="order" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black">
              Order
            </TabsTrigger>
            <TabsTrigger value="earning" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black">
              Earning
            </TabsTrigger>
            <TabsTrigger value="analytic" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black">
              Analytic
            </TabsTrigger>
            <TabsTrigger value="pricing" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black">
              Pricing
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black">
              Messages
            </TabsTrigger>
            <TabsTrigger value="licensing" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black">
              Licensing
            </TabsTrigger>
            <TabsTrigger value="my-product" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black">
              My Product
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black">
              Categories
            </TabsTrigger>
          </TabsList>

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
            <Card className={cardBase}>
              <CardHeader>
                <CardTitle className="text-lg text-white">Storefronts</CardTitle>
                <CardDescription className={mutedText}>Manage storefront attribution and curated products.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingStorefronts ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : !storefronts || !Array.isArray(storefronts) || storefronts.length === 0 ? (
                  <p className={mutedText}>No storefronts yet.</p>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {storefronts.map((sf) => (
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
                          <p className="text-sm text-gray-400">
                            Commission override:{" "}
                            {sf.commission_rate_override
                              ? `${(parseFloat(sf.commission_rate_override) * 100).toFixed(1)}%`
                              : "Tier default"}
                          </p>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedStorefront(sf.id)}
                              className="gap-2 border-gray-700 bg-[#0f172a] text-white hover:bg-[#111a2f]"
                            >
                              <Store className="h-4 w-4" />
                              View products
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
                            <div className="mt-3 rounded-lg border border-dashed border-gray-700 p-3 bg-[#0b1224]/40">
                              <p className="text-sm font-semibold mb-2 text-white">Products</p>
                              {loadingStorefrontProducts ? (
                                <Skeleton className="h-10 w-full" />
                              ) : storefrontProducts && storefrontProducts.length > 0 ? (
                                <ul className="space-y-1 text-sm text-gray-300">
                                  {storefrontProducts.map((p) => (
                                    <li key={p.id} className="flex items-center justify-between">
                                      <span>Product #{p.product}</span>
                                      <Badge variant="outline" className="border-gray-700 text-gray-200">
                                        Pos {p.position ?? "-"}
                                      </Badge>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className={mutedText}>No products assigned.</p>
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
                <CardTitle className="text-lg text-white">My Products</CardTitle>
                <CardDescription className={mutedText}>Manage products across your storefronts.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {selectedStorefront ? (
                  <div className="space-y-4">
                    <p className={mutedText}>Products for selected storefront.</p>
                    {loadingStorefrontProducts ? (
                      <Skeleton className="h-32 w-full" />
                    ) : storefrontProducts && storefrontProducts.length > 0 ? (
                      <div className="space-y-2">
                        {storefrontProducts.map((p) => (
                          <Card key={p.id} className={cardBase}>
                            <CardContent className="pt-4">
                              <div className="flex items-center justify-between">
                                <span className="text-white">Product #{p.product}</span>
                                <Badge variant="outline" className="border-gray-700 text-gray-200">
                                  Position {p.position ?? "-"}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className={mutedText}>No products assigned to this storefront.</p>
                    )}
                  </div>
                ) : (
                  <p className={mutedText}>Select a storefront from the Storefront tab to view products.</p>
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
    </div>
  );
}
