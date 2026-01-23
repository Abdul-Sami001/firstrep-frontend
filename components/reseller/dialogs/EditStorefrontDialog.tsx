// components/reseller/dialogs/EditStorefrontDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useUpdateStorefront } from "@/hooks/useResellers";
import type { Storefront } from "@/lib/api/resellers";
import { EditStorefrontDialogProps, StorefrontFormData } from "../types";

export default function EditStorefrontDialog({ open, onOpenChange, storefront, onSuccess }: EditStorefrontDialogProps) {
  const [form, setForm] = useState<StorefrontFormData>({});
  const updateStorefrontMutation = useUpdateStorefront();

  useEffect(() => {
    if (storefront) {
      setForm({
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
    }
  }, [storefront]);

  const handleFormChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storefront) return;
    updateStorefrontMutation.mutate(
      { id: storefront.id, data: form as Partial<Storefront> },
      {
        onSuccess: () => {
          setForm({});
          onOpenChange(false);
          onSuccess?.();
        },
      }
    );
  };

  const handleClose = () => {
    setForm({});
    onOpenChange(false);
  };

  if (!storefront) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0b0b0f] border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Storefront</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update storefront information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={form.name || ""}
                onChange={(e) => handleFormChange("name", e.target.value)}
                required
                maxLength={255}
                className="bg-[#0f172a] border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug *</Label>
              <Input
                id="edit-slug"
                value={form.slug || ""}
                onChange={(e) => handleFormChange("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                required
                maxLength={120}
                className="bg-[#0f172a] border-gray-700 text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-type">Type *</Label>
            <Select
              value={form.type || ""}
              onValueChange={(v) => handleFormChange("type", v)}
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
                value={form.address_line1 || ""}
                onChange={(e) => handleFormChange("address_line1", e.target.value)}
                className="bg-[#0f172a] border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-city">City</Label>
              <Input
                id="edit-city"
                value={form.city || ""}
                onChange={(e) => handleFormChange("city", e.target.value)}
                className="bg-[#0f172a] border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-country">Country</Label>
              <Input
                id="edit-country"
                value={form.country || ""}
                onChange={(e) => handleFormChange("country", e.target.value)}
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
              value={form.commission_rate_override ? (parseFloat(String(form.commission_rate_override)) * 100).toString() : ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  handleFormChange("commission_rate_override", "");
                } else {
                  const decimal = (parseFloat(value) / 100).toString();
                  handleFormChange("commission_rate_override", decimal);
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
              value={form.notes || ""}
              onChange={(e) => handleFormChange("notes", e.target.value)}
              className="bg-[#0f172a] border-gray-700 text-white"
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="edit-is_active"
              checked={form.is_active !== false}
              onCheckedChange={(checked) => handleFormChange("is_active", checked)}
            />
            <Label htmlFor="edit-is_active" className="cursor-pointer">Active</Label>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
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
  );
}
