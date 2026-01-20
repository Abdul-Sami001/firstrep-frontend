// components/reseller/StorefrontSharing.tsx - Storefront Sharing Dialog
'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Download, Share2, ExternalLink, Code, QrCode, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStorefrontSharing } from '@/hooks/useStorefronts';
import { useToast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';

// Dynamically import QR code to avoid SSR issues
// react-qr-code exports QRCodeSVG as named export
const QRCodeSVG = dynamic(
  () => import('react-qr-code').then((mod) => mod.QRCodeSVG),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    ),
  }
);

interface StorefrontSharingProps {
  storefrontId: string;
  storefrontSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function StorefrontSharing({
  storefrontId,
  storefrontSlug,
  open,
  onOpenChange,
}: StorefrontSharingProps) {
  const { toast } = useToast();
  const { data: sharingData, isLoading, error } = useStorefrontSharing(storefrontId, open);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('link');

  // Get frontend URL from environment or construct it
  const getFrontendUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://yourstore.com';
  };

  // Construct URLs if backend doesn't provide them
  const shareUrl = sharingData?.share_url || `${getFrontendUrl()}/storefront/${storefrontSlug}`;
  const directLink = sharingData?.direct_link || `${getFrontendUrl()}/products?storefront=${storefrontSlug}`;
  const qrCodeData = sharingData?.qr_code_data || shareUrl;
  const embedCode = sharingData?.embed_code || `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast({
        title: 'Copied!',
        description: `${fieldName} copied to clipboard.`,
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy to clipboard. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const downloadQRCode = () => {
    // Create a canvas element to convert SVG to image
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `storefront-${storefrontSlug}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out ${storefrontSlug} storefront`);
    const body = encodeURIComponent(`I'd like to share this storefront with you:\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareViaSocial = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(`Check out this storefront: ${storefrontSlug}`);

    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0b0b0f] border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-[#00bfff]" />
            Share Storefront
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Share your storefront with customers using the options below.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#00bfff]" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">Failed to load sharing information.</p>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="border-gray-700 text-white"
            >
              Close
            </Button>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#0f172a] border-gray-800">
              <TabsTrigger value="link" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black">
                <ExternalLink className="h-4 w-4 mr-2" />
                Link
              </TabsTrigger>
              <TabsTrigger value="qr" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black">
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </TabsTrigger>
              <TabsTrigger value="embed" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-black">
                <Code className="h-4 w-4 mr-2" />
                Embed
              </TabsTrigger>
            </TabsList>

            {/* Link Tab */}
            <TabsContent value="link" className="space-y-4 mt-6">
              <div className="space-y-4">
                {/* Storefront Page Link */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-300">Storefront Page Link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={shareUrl}
                      readOnly
                      className="bg-[#0f172a] border-gray-700 text-white text-sm"
                    />
                    <Button
                      onClick={() => copyToClipboard(shareUrl, 'Link')}
                      variant="outline"
                      size="icon"
                      className="border-gray-700 text-white hover:bg-gray-800 flex-shrink-0"
                    >
                      {copiedField === 'Link' ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Direct link to your storefront page with curated products
                  </p>
                </div>

                {/* Direct Products Link */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-300">Products Page Link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={directLink}
                      readOnly
                      className="bg-[#0f172a] border-gray-700 text-white text-sm"
                    />
                    <Button
                      onClick={() => copyToClipboard(directLink, 'Direct Link')}
                      variant="outline"
                      size="icon"
                      className="border-gray-700 text-white hover:bg-gray-800 flex-shrink-0"
                    >
                      {copiedField === 'Direct Link' ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Link to products page with storefront attribution
                  </p>
                </div>

                {/* Share Buttons */}
                <div className="pt-4 border-t border-gray-800">
                  <Label className="text-sm font-medium text-gray-300 mb-3 block">Share Via</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={shareViaEmail}
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      Email
                    </Button>
                    <Button
                      onClick={() => shareViaSocial('twitter')}
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      Twitter
                    </Button>
                    <Button
                      onClick={() => shareViaSocial('facebook')}
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      Facebook
                    </Button>
                    <Button
                      onClick={() => shareViaSocial('linkedin')}
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      LinkedIn
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* QR Code Tab */}
            <TabsContent value="qr" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center p-6 bg-[#0f172a] rounded-lg border border-gray-800">
                  <div className="bg-white p-4 rounded-lg mb-4">
                    <QRCodeSVG
                      id="qr-code-svg"
                      value={qrCodeData}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-sm text-gray-400 text-center mb-4">
                    Scan this QR code to visit your storefront
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={downloadQRCode}
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download QR Code
                    </Button>
                    <Button
                      onClick={() => copyToClipboard(qrCodeData, 'QR Code URL')}
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy URL
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-300">QR Code URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={qrCodeData}
                      readOnly
                      className="bg-[#0f172a] border-gray-700 text-white text-sm"
                    />
                    <Button
                      onClick={() => copyToClipboard(qrCodeData, 'QR Code URL')}
                      variant="outline"
                      size="icon"
                      className="border-gray-700 text-white hover:bg-gray-800 flex-shrink-0"
                    >
                      {copiedField === 'QR Code URL' ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Perfect for physical locations, print materials, or digital displays
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Embed Tab */}
            <TabsContent value="embed" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-300">Embed Code</Label>
                  <Textarea
                    value={embedCode}
                    readOnly
                    rows={6}
                    className="bg-[#0f172a] border-gray-700 text-white text-sm font-mono"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => copyToClipboard(embedCode, 'Embed Code')}
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      {copiedField === 'Embed Code' ? (
                        <>
                          <Check className="h-4 w-4 mr-2 text-green-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Embed Code
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Add this code to your website to embed your storefront
                  </p>
                </div>

                <div className="p-4 bg-[#0f172a] rounded-lg border border-gray-800">
                  <h4 className="text-sm font-medium text-white mb-2">Preview</h4>
                  <div className="border border-gray-700 rounded p-2 bg-black">
                    <iframe
                      src={shareUrl}
                      width="100%"
                      height="400"
                      className="border-0 rounded"
                      title="Storefront Preview"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
