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