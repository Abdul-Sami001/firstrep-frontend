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

const metricCard = (title: string, value: string | number, icon: LucideIcon, helper?: string) => {
  const Icon = icon;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {helper && <p className="text-xs text-muted-foreground mt-1">{helper}</p>}
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
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Reseller Dashboard</h1>
            <p className="text-muted-foreground">
              Track performance, commissions, storefronts, and marketing assets.
            </p>
          </div>
          {profile && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{profile.tier?.display_name || profile.tier?.name}</Badge>
              <Badge className="gap-1">
                <BadgeCheck className="h-3.5 w-3.5" />
                {profile.status}
              </Badge>
            </div>
          )}
        </div>
      </div>

      <section id="overview" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card) =>
            loadingAnalytics || loadingSummary ? (
              <Skeleton key={card.title} className="h-28 w-full" />
            ) : (
              <div key={card.title}>{metricCard(card.title, card.value, card.icon, card.helper)}</div>
            )
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Storefronts</CardTitle>
            <CardDescription>Your best performing storefronts by GMV.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingAnalytics ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : topStorefronts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No storefront performance data yet.</p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {topStorefronts.map((storefront) => (
                  <Card key={storefront.id} className="border border-border/60">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{storefront.name}</CardTitle>
                      <CardDescription className="text-xs">Slug: {storefront.slug}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">GMV</p>
                        <p className="font-semibold">{formatCurrency(parseFloat(storefront.gmv || "0"))}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Commission</p>
                        <p className="font-semibold">
                          {formatCurrency(parseFloat(storefront.commission_amount || "0"))}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Orders</p>
                        <p className="font-semibold">{storefront.orders_count}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section id="commissions" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Commission Ledger</h2>
            <p className="text-sm text-muted-foreground">Track earned, paid, and pending commissions.</p>
          </div>
          <div className="flex gap-2">
            <Select onValueChange={(v) => setCommissionStatus(v || undefined)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="earned">Earned</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="voided">Voided</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => setCommissionStorefront(v || undefined)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Storefront" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Storefronts</SelectItem>
                {storefronts?.map((sf) => (
                  <SelectItem key={sf.id} value={sf.id}>
                    {sf.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg">Summary</CardTitle>
            <CardDescription>Current month and last 30 days.</CardDescription>
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

        <Card>
          <CardHeader>
            <CardTitle>Commission Entries</CardTitle>
            <CardDescription>Status, amounts, and attribution.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCommissions ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : commissionsList.length === 0 ? (
              <p className="text-sm text-muted-foreground">No commissions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Base</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissionsList.map((item: ResellerCommission) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.order}</TableCell>
                        <TableCell>{renderCommissionStatus(item.status)}</TableCell>
                        <TableCell>{formatCurrency(parseFloat(item.base_amount || "0"))}</TableCell>
                        <TableCell>{(parseFloat(item.commission_rate || "0") * 100).toFixed(1)}%</TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(parseFloat(item.commission_amount || "0"))}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
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
                <p className="text-sm text-muted-foreground">
                  Page {commissionPage} • {commissions.count} total
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!commissions.previous}
                    onClick={() => setCommissionPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!commissions.next}
                    onClick={() => setCommissionPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section id="storefronts" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Storefronts</h2>
            <p className="text-sm text-muted-foreground">Manage storefront attribution and curated products.</p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            {loadingStorefronts ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : !storefronts || storefronts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No storefronts yet.</p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {storefronts.map((sf) => (
                  <Card key={sf.id} className="border border-border/70">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{sf.name}</CardTitle>
                        <CardDescription className="text-xs">Slug: {sf.slug}</CardDescription>
                      </div>
                      <Badge variant="secondary">{sf.type}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">
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
                          className="gap-2"
                        >
                          <Store className="h-4 w-4" />
                          View products
                        </Button>
                        {sf.is_active ? (
                          <Badge variant="secondary">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </div>
                      {selectedStorefront === sf.id && (
                        <div className="mt-3 rounded-lg border border-dashed border-border p-3">
                          <p className="text-sm font-semibold mb-2">Products</p>
                          {loadingStorefrontProducts ? (
                            <Skeleton className="h-10 w-full" />
                          ) : storefrontProducts && storefrontProducts.length > 0 ? (
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              {storefrontProducts.map((p) => (
                                <li key={p.id} className="flex items-center justify-between">
                                  <span>Product #{p.product}</span>
                                  <Badge variant="outline">Pos {p.position ?? "-"}</Badge>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground">No products assigned.</p>
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
      </section>

      <section id="marketing" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Marketing Assets</h2>
            <p className="text-sm text-muted-foreground">Download creative approved for your tier.</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            {loadingMarketing ? (
              <div className="grid gap-3 md:grid-cols-3">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
              </div>
            ) : !marketingAssets || marketingAssets.length === 0 ? (
              <p className="text-sm text-muted-foreground">No assets available yet.</p>
            ) : (
              <div className="grid gap-3 md:grid-cols-3">
                {marketingAssets.map((asset) => (
                  <Card key={asset.id} className="border border-border/70">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {asset.title}
                      </CardTitle>
                      <CardDescription className="text-xs capitalize">
                        {asset.asset_type} • {asset.min_tier?.display_name || asset.min_tier?.name || "All tiers"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <p className="text-muted-foreground line-clamp-2">
                        {asset.description || "Approved marketing asset."}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-center gap-2"
                        onClick={() => {
                          const url = asset.file || asset.url;
                          if (url) {
                            window.open(url, "_blank");
                          } else {
                            toast({
                              title: "File unavailable",
                              description: "No file or URL attached to this asset.",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        <Download className="h-4 w-4" />
                        Open Asset
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section id="profile" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Profile & Contact</h2>
            <p className="text-sm text-muted-foreground">Keep your reseller company details up to date.</p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            {loadingProfile ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : profile ? (
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleProfileSubmit}>
                <div className="space-y-2">
                  <Label>Company name</Label>
                  <Input
                    defaultValue={profile.company_name}
                    onChange={(e) => handleProfileChange("company_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input
                    defaultValue={profile.website_url}
                    onChange={(e) => handleProfileChange("website_url", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact name</Label>
                  <Input
                    defaultValue={profile.contact_name}
                    onChange={(e) => handleProfileChange("contact_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact email</Label>
                  <Input
                    defaultValue={profile.contact_email}
                    onChange={(e) => handleProfileChange("contact_email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact phone</Label>
                  <Input
                    defaultValue={profile.contact_phone}
                    onChange={(e) => handleProfileChange("contact_phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>VAT number</Label>
                  <Input
                    defaultValue={profile.vat_number}
                    onChange={(e) => handleProfileChange("vat_number", e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Payout details (JSON)</Label>
                  <Input
                    placeholder="bank_account or paypal"
                    defaultValue={profile.payout_details ? JSON.stringify(profile.payout_details) : ""}
                    onChange={(e) => handleProfileChange("payout_details", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 flex items-center justify-end gap-2">
                  <Button variant="outline" type="button" onClick={() => router.refresh()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateProfileMutation.isLoading}>
                    {updateProfileMutation.isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Save changes
                  </Button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-muted-foreground">Profile unavailable.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
    Package,
    TrendingUp,
    AlertTriangle,
    ShoppingCart,
    DollarSign,
    Users,
    Eye,
    Plus,
    Minus
} from "lucide-react";

// Mock data for demonstration
const mockResellerData = {
    businessName: "Elite Fitness Gym",
    tier: "Gold",
    discountPercentage: 25,
    creditLimit: 5000,
    currentCredit: 1250,
    totalOrders: 47,
    monthlyRevenue: 12400,
    stockAlerts: 3
};

const mockInventory = [
    {
        id: "1",
        productName: "1st Rep Classic T-Shirt",
        sku: "1R-TS-001",
        size: "M",
        color: "Black",
        quantity: 15,
        reorderLevel: 10,
        wholesalePrice: 16.50,
        retailPrice: 22.00,
        lastOrdered: "2024-09-20"
    },
    {
        id: "2",
        productName: "1st Rep Classic Hoodie",
        sku: "1R-HD-001",
        size: "L",
        color: "Grey",
        quantity: 5,
        reorderLevel: 8,
        wholesalePrice: 30.00,
        retailPrice: 40.00,
        lastOrdered: "2024-09-18"
    },
    {
        id: "3",
        productName: "High Neck Sports Bra",
        sku: "1R-SB-001",
        size: "M",
        color: "Black",
        quantity: 2,
        reorderLevel: 5,
        wholesalePrice: 22.50,
        retailPrice: 30.00,
        lastOrdered: "2024-09-15"
    }
];

const mockOrders = [
    {
        id: "ORD-001",
        orderNumber: "ORD-1758805234-ABC12",
        status: "shipped",
        totalAmount: 450.00,
        orderDate: "2024-09-22",
        trackingNumber: "1Z999AA1234567890"
    },
    {
        id: "ORD-002",
        orderNumber: "ORD-1758805123-DEF34",
        status: "delivered",
        totalAmount: 320.00,
        orderDate: "2024-09-20",
        trackingNumber: "1Z999AA1234567891"
    }
];

export default function ResellerDashboard() {
    const [selectedTab, setSelectedTab] = useState("overview");

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-500";
            case "confirmed": return "bg-blue-500";
            case "shipped": return "bg-purple-500";
            case "delivered": return "bg-green-500";
            case "cancelled": return "bg-red-500";
            default: return "bg-gray-500";
        }
    };

    const getLowStockItems = () => {
        return mockInventory.filter(item => item.quantity <= item.reorderLevel);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold" data-testid="dashboard-title">
                                Reseller Portal
                            </h1>
                            <p className="text-muted-foreground mt-1" data-testid="business-name">
                                {mockResellerData.businessName}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Badge variant="secondary" className="text-lg px-3 py-1" data-testid="tier-badge">
                                {mockResellerData.tier} Tier
                            </Badge>
                            <Badge variant="outline" data-testid="discount-badge">
                                {mockResellerData.discountPercentage}% Discount
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                        <TabsTrigger value="inventory" data-testid="tab-inventory">Inventory</TabsTrigger>
                        <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
                        <TabsTrigger value="pricing" data-testid="tab-pricing">Pricing</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Orders</p>
                                        <p className="text-2xl font-bold" data-testid="total-orders">
                                            {mockResellerData.totalOrders}
                                        </p>
                                    </div>
                                    <ShoppingCart className="h-8 w-8 text-primary" />
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                                        <p className="text-2xl font-bold" data-testid="monthly-revenue">
                                            £{mockResellerData.monthlyRevenue.toLocaleString()}
                                        </p>
                                    </div>
                                    <DollarSign className="h-8 w-8 text-green-500" />
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Credit Available</p>
                                        <p className="text-2xl font-bold" data-testid="credit-available">
                                            £{mockResellerData.creditLimit - mockResellerData.currentCredit}
                                        </p>
                                    </div>
                                    <TrendingUp className="h-8 w-8 text-blue-500" />
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Stock Alerts</p>
                                        <p className="text-2xl font-bold text-red-500" data-testid="stock-alerts">
                                            {getLowStockItems().length}
                                        </p>
                                    </div>
                                    <AlertTriangle className="h-8 w-8 text-red-500" />
                                </div>
                            </Card>
                        </div>

                        {/* Credit Usage */}
                        <Card className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Credit Usage</h3>
                                    <span className="text-sm text-muted-foreground">
                                        £{mockResellerData.currentCredit} / £{mockResellerData.creditLimit}
                                    </span>
                                </div>
                                <Progress
                                    value={(mockResellerData.currentCredit / mockResellerData.creditLimit) * 100}
                                    className="w-full"
                                    data-testid="credit-progress"
                                />
                            </div>
                        </Card>

                        {/* Low Stock Alerts */}
                        {getLowStockItems().length > 0 && (
                            <Card className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <AlertTriangle className="h-5 w-5 text-red-500" />
                                        <h3 className="text-lg font-semibold text-red-500">Low Stock Alerts</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {getLowStockItems().map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                                                <div>
                                                    <p className="font-medium">{item.productName}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.size} • {item.color} • SKU: {item.sku}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-red-600">
                                                        {item.quantity} units remaining
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Reorder at {item.reorderLevel}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Inventory Tab */}
                    <TabsContent value="inventory" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Inventory Management</h2>
                            <Button onClick={() => console.log('Request stock')} data-testid="button-request-stock">
                                <Plus className="h-4 w-4 mr-2" />
                                Request Stock
                            </Button>
                        </div>

                        <Card>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left p-4 font-semibold">Product</th>
                                            <th className="text-left p-4 font-semibold">SKU</th>
                                            <th className="text-left p-4 font-semibold">Variant</th>
                                            <th className="text-left p-4 font-semibold">Stock</th>
                                            <th className="text-left p-4 font-semibold">Wholesale Price</th>
                                            <th className="text-left p-4 font-semibold">Retail Price</th>
                                            <th className="text-left p-4 font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mockInventory.map((item) => (
                                            <tr key={item.id} className="border-b border-border">
                                                <td className="p-4">
                                                    <div>
                                                        <p className="font-medium" data-testid={`product-name-${item.id}`}>
                                                            {item.productName}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Last ordered: {item.lastOrdered}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm font-mono">{item.sku}</td>
                                                <td className="p-4">
                                                    <div className="text-sm">
                                                        <div>{item.size}</div>
                                                        <div className="text-muted-foreground">{item.color}</div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center space-x-2">
                                                        <span
                                                            className={`font-medium ${item.quantity <= item.reorderLevel ? 'text-red-500' : 'text-foreground'}`}
                                                            data-testid={`stock-quantity-${item.id}`}
                                                        >
                                                            {item.quantity}
                                                        </span>
                                                        {item.quantity <= item.reorderLevel && (
                                                            <AlertTriangle className="h-4 w-4 text-red-500" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Reorder at {item.reorderLevel}
                                                    </p>
                                                </td>
                                                <td className="p-4 font-medium">£{item.wholesalePrice.toFixed(2)}</td>
                                                <td className="p-4 text-muted-foreground">£{item.retailPrice.toFixed(2)}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => console.log('View details', item.id)}
                                                            data-testid={`button-view-${item.id}`}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => console.log('Reorder', item.id)}
                                                            data-testid={`button-reorder-${item.id}`}
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Orders Tab */}
                    <TabsContent value="orders" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Order History</h2>
                            <Button onClick={() => console.log('New order')} data-testid="button-new-order">
                                <Plus className="h-4 w-4 mr-2" />
                                New Order
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {mockOrders.map((order) => (
                                <Card key={order.id} className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-4">
                                                <p className="font-semibold text-lg" data-testid={`order-number-${order.id}`}>
                                                    {order.orderNumber}
                                                </p>
                                                <Badge
                                                    className={`${getStatusColor(order.status)} text-white`}
                                                    data-testid={`order-status-${order.id}`}
                                                >
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                                                <span>Order Date: {order.orderDate}</span>
                                                <span>Total: £{order.totalAmount.toFixed(2)}</span>
                                                {order.trackingNumber && (
                                                    <span>Tracking: {order.trackingNumber}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => console.log('Track order', order.id)}
                                                data-testid={`button-track-${order.id}`}
                                            >
                                                Track Order
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => console.log('View details', order.id)}
                                                data-testid={`button-details-${order.id}`}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Pricing Tab */}
                    <TabsContent value="pricing" className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Pricing Information</h2>
                            <p className="text-muted-foreground">
                                Your current tier: <span className="font-semibold text-primary">{mockResellerData.tier}</span>
                                {" "}({mockResellerData.discountPercentage}% discount on wholesale prices)
                            </p>
                        </div>

                        <Card className="p-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Tier Benefits</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="p-4 border border-border rounded-lg">
                                        <h4 className="font-medium text-yellow-600">Bronze Tier</h4>
                                        <p className="text-sm text-muted-foreground">10% discount</p>
                                        <p className="text-xs">£1,000 credit limit</p>
                                    </div>
                                    <div className="p-4 border border-border rounded-lg">
                                        <h4 className="font-medium text-gray-400">Silver Tier</h4>
                                        <p className="text-sm text-muted-foreground">15% discount</p>
                                        <p className="text-xs">£2,500 credit limit</p>
                                    </div>
                                    <div className="p-4 border border-primary rounded-lg bg-primary/5">
                                        <h4 className="font-medium text-yellow-500">Gold Tier</h4>
                                        <p className="text-sm text-muted-foreground">25% discount</p>
                                        <p className="text-xs">£5,000 credit limit</p>
                                    </div>
                                    <div className="p-4 border border-border rounded-lg">
                                        <h4 className="font-medium text-purple-600">Platinum Tier</h4>
                                        <p className="text-sm text-muted-foreground">35% discount</p>
                                        <p className="text-xs">£10,000 credit limit</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left p-4 font-semibold">Product</th>
                                            <th className="text-left p-4 font-semibold">Retail Price</th>
                                            <th className="text-left p-4 font-semibold">Wholesale Price</th>
                                            <th className="text-left p-4 font-semibold">Your Price</th>
                                            <th className="text-left p-4 font-semibold">Margin</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mockInventory.map((item) => {
                                            const yourPrice = item.wholesalePrice * (1 - mockResellerData.discountPercentage / 100);
                                            const margin = ((item.retailPrice - yourPrice) / item.retailPrice) * 100;

                                            return (
                                                <tr key={item.id} className="border-b border-border">
                                                    <td className="p-4">
                                                        <p className="font-medium">{item.productName}</p>
                                                        <p className="text-sm text-muted-foreground">{item.size} • {item.color}</p>
                                                    </td>
                                                    <td className="p-4">£{item.retailPrice.toFixed(2)}</td>
                                                    <td className="p-4 text-muted-foreground">£{item.wholesalePrice.toFixed(2)}</td>
                                                    <td className="p-4 font-medium text-primary">£{yourPrice.toFixed(2)}</td>
                                                    <td className="p-4 text-green-600 font-medium">
                                                        {margin.toFixed(1)}%
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}