// components/CookieSettingsModal.tsx - Cookie Settings Panel
'use client';
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { CookiePreferences, CookieCategory } from '@/contexts/CookieConsentContext';
import { Shield, BarChart3, Settings, Megaphone, Info } from 'lucide-react';
import Link from 'next/link';

interface CookieCategoryInfo {
    id: CookieCategory;
    title: string;
    description: string;
    icon: React.ReactNode;
    required?: boolean;
}

const cookieCategories: CookieCategoryInfo[] = [
    {
        id: 'essential',
        title: 'Essential Cookies',
        description: 'These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. These cookies cannot be disabled.',
        icon: <Shield className="h-5 w-5" />,
        required: true,
    },
    {
        id: 'analytics',
        title: 'Analytics Cookies',
        description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and user experience.',
        icon: <BarChart3 className="h-5 w-5" />,
    },
    {
        id: 'functional',
        title: 'Functional Cookies',
        description: 'These cookies enable enhanced functionality and personalization, such as remembering your preferences, language settings, and login information.',
        icon: <Settings className="h-5 w-5" />,
    },
    {
        id: 'marketing',
        title: 'Marketing Cookies',
        description: 'These cookies are used to deliver advertisements that are relevant to you and your interests. They may also be used to limit the number of times you see an advertisement.',
        icon: <Megaphone className="h-5 w-5" />,
    },
];

export default function CookieSettingsModal() {
    const { showSettings, closeSettings, preferences, savePreferences, acceptAll, rejectAll } = useCookieConsent();
    const [localPreferences, setLocalPreferences] = React.useState<CookiePreferences>(preferences);

    // Update local preferences when modal opens
    React.useEffect(() => {
        if (showSettings) {
            setLocalPreferences(preferences);
        }
    }, [showSettings, preferences]);

    const handleToggle = (category: CookieCategory) => {
        if (category === 'essential') return; // Essential cookies cannot be disabled
        
        setLocalPreferences(prev => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    const handleSave = () => {
        savePreferences(localPreferences);
    };

    const handleAcceptAll = () => {
        acceptAll();
    };

    const handleRejectAll = () => {
        rejectAll();
    };

    return (
        <Dialog open={showSettings} onOpenChange={closeSettings}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border-gray-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                        <Info className="h-6 w-6 text-[#00bfff]" />
                        Cookie Settings
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Manage your cookie preferences. You can enable or disable different types of cookies below. 
                        Learn more in our{' '}
                        <Link href="/cookie-policy" className="text-[#00bfff] hover:text-white underline">
                            Cookie Policy
                        </Link>
                        .
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Cookie Categories */}
                    {cookieCategories.map((category) => (
                        <div key={category.id} className="space-y-3">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="text-[#00bfff] mt-0.5">
                                        {category.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Label 
                                                htmlFor={`cookie-${category.id}`}
                                                className="text-base font-semibold text-white cursor-pointer"
                                            >
                                                {category.title}
                                            </Label>
                                            {category.required && (
                                                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                                                    Required
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            {category.description}
                                        </p>
                                    </div>
                                </div>
                                <Switch
                                    id={`cookie-${category.id}`}
                                    checked={localPreferences[category.id]}
                                    onCheckedChange={() => handleToggle(category.id)}
                                    disabled={category.required}
                                    className="flex-shrink-0"
                                />
                            </div>
                            {category.id !== 'marketing' && <Separator className="bg-gray-800" />}
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-800">
                    <Button
                        variant="outline"
                        onClick={handleRejectAll}
                        className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-600"
                    >
                        Reject All
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleSave}
                        className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-600"
                    >
                        Save Preferences
                    </Button>
                    <Button
                        onClick={handleAcceptAll}
                        className="flex-1 bg-gradient-to-r from-[#00bfff] via-[#0ea5e9] to-[#3b82f6] hover:from-[#0099cc] hover:via-[#00bfff] hover:to-[#0ea5e9] text-white font-medium"
                    >
                        Accept All
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
