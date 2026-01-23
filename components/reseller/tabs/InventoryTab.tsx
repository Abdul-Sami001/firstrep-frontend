// components/reseller/tabs/InventoryTab.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cardBase, mutedText } from "../utils";

export default function InventoryTab() {
  return (
    <div className="space-y-6">
      <Card className={cardBase}>
        <CardHeader>
          <CardTitle className="text-lg text-white">Inventory</CardTitle>
          <CardDescription className={mutedText}>Manage your product inventory.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className={mutedText}>Inventory management coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
