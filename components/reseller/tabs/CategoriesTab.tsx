// components/reseller/tabs/CategoriesTab.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cardBase, mutedText } from "../utils";

export default function CategoriesTab() {
  return (
    <div className="space-y-6">
      <Card className={cardBase}>
        <CardHeader>
          <CardTitle className="text-lg text-white">Categories</CardTitle>
          <CardDescription className={mutedText}>Browse and manage product categories.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className={mutedText}>Category management coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
