// components/reseller/tabs/LicensingTab.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cardBase, mutedText } from "../utils";

export default function LicensingTab() {
  return (
    <div className="space-y-6">
      <Card className={cardBase}>
        <CardHeader>
          <CardTitle className="text-lg text-white">Licensing</CardTitle>
          <CardDescription className={mutedText}>View licensing agreements and documents.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className={mutedText}>Licensing information coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
