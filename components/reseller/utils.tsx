// components/reseller/utils.tsx - Shared utilities and constants for reseller components
"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const cardBase = "bg-[#0b0b0f] border border-gray-800 shadow-lg shadow-[#00bfff]/5";
export const mutedText = "text-sm text-gray-400";

export const statusBadgeMap: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-600",
  earned: "bg-emerald-500/20 text-emerald-600",
  paid: "bg-blue-500/20 text-blue-600",
  voided: "bg-red-500/20 text-red-600",
};

export const metricCard = (title: string, value: string | number, icon: LucideIcon, helper?: string) => {
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
