// components/reseller/tabs/OverviewTab.tsx
"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Percent, Users, Receipt } from "lucide-react";
import { useResellerAnalytics, useResellerCommissionSummary, useResellerProfile } from "@/hooks/useResellers";
import { formatCurrency } from "@/lib/utils/formatters";
import { cardBase, mutedText, metricCard } from "../utils";

export default function OverviewTab() {
  const { data: analytics, isLoading: loadingAnalytics } = useResellerAnalytics({});
  const { data: summary, isLoading: loadingSummary } = useResellerCommissionSummary();
  const { data: profile } = useResellerProfile();

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
        helper: `${(month as any)?.new_customers_count ?? 0} new customers`,
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

  const topStorefronts = analytics?.top_storefronts ?? [];

  return (
    <div className="space-y-6">
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
    </div>
  );
}
