// components/reseller/dialogs/CreateStorefrontDialog.tsx
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useCreateStorefront } from "@/hooks/useResellers";
import { StorefrontFormData, StorefrontDialogProps } from "../types";

export default function CreateStorefrontDialog({ open, onOpenChange, onSuccess }: StorefrontDialogProps) {
  const [form, setForm] = useState<StorefrontFormData>({ is_active: true });
  const createStorefrontMutation = useCreateStorefront();

  const handleFormChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createStorefrontMutation.mutate(form as any, {
      onSuccess: () => {
        setForm({ is_active: true });
        onOpenChange(false);
        onSuccess?.();
      },
    });
  };

  const handleClose = () => {
    setForm({ is_active: true });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0b0b0f] border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Storefront</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new storefront for your reseller account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={form.name || ""}
                onChange={(e) => handleFormChange("name", e.target.value)}
                required
                maxLength={255}
                className="bg-[#0f172a] border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={form.slug || ""}
                onChange={(e) => handleFormChange("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
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
              <Label htmlFor="address_line1">Address</Label>
              <Input
                id="address_line1"
                value={form.address_line1 || ""}
                onChange={(e) => handleFormChange("address_line1", e.target.value)}
                className="bg-[#0f172a] border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={form.city || ""}
                onChange={(e) => handleFormChange("city", e.target.value)}
                className="bg-[#0f172a] border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={form.country || ""}
                onChange={(e) => handleFormChange("country", e.target.value)}
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
            <p className="text-xs text-gray-500">Override commission rate (0-100%). Leave empty to use tier default.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={form.notes || ""}
              onChange={(e) => handleFormChange("notes", e.target.value)}
              className="bg-[#0f172a] border-gray-700 text-white"
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={form.is_active !== false}
              onCheckedChange={(checked) => handleFormChange("is_active", checked)}
            />
            <Label htmlFor="is_active" className="cursor-pointer">Active</Label>
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
  );
}
