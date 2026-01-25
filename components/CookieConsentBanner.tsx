// components/CookieConsentBanner.tsx - GDPR Cookie Consent Banner
'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Cookie, Settings, X } from 'lucide-react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import Link from 'next/link';

export default function CookieConsentBanner() {
    const { showBanner, acceptAll, rejectAll, openSettings } = useCookieConsent();

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-[#0a0a0a] border-t border-gray-800 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    {/* Icon and Message */}
                    <div className="flex items-start gap-3 flex-1">
                        <Cookie className="h-6 w-6 text-[#00bfff] flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
                                We use cookies
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                                By clicking "Accept All", you consent to our use of cookies.{' '}
                                <Link 
                                    href="/cookie-policy" 
                                    className="text-[#00bfff] hover:text-white underline"
                                >
                                    Learn more
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={openSettings}
                            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-600"
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            Customize
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={rejectAll}
                            className="text-gray-400 hover:text-white hover:bg-gray-800"
                        >
                            Reject All
                        </Button>
                        <Button
                            size="sm"
                            onClick={acceptAll}
                            className="bg-gradient-to-r from-[#00bfff] via-[#0ea5e9] to-[#3b82f6] hover:from-[#0099cc] hover:via-[#00bfff] hover:to-[#0ea5e9] text-white font-medium"
                        >
                            Accept All
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
