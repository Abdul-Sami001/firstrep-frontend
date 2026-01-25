// contexts/CookieConsentContext.tsx - GDPR-Compliant Cookie Consent Management
'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type CookieCategory = 'essential' | 'analytics' | 'functional' | 'marketing';

export interface CookiePreferences {
    essential: boolean;    // Always true, cannot be disabled
    analytics: boolean;
    functional: boolean;
    marketing: boolean;
}

interface CookieConsentContextType {
    preferences: CookiePreferences;
    hasConsented: boolean;
    showBanner: boolean;
    showSettings: boolean;
    acceptAll: () => void;
    rejectAll: () => void;
    savePreferences: (prefs: Partial<CookiePreferences>) => void;
    openSettings: () => void;
    closeSettings: () => void;
    isCategoryEnabled: (category: CookieCategory) => boolean;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const COOKIE_CONSENT_KEY = 'cookie_consent_preferences';
const COOKIE_CONSENT_TIMESTAMP_KEY = 'cookie_consent_timestamp';

// Default preferences - Essential cookies are always enabled
const DEFAULT_PREFERENCES: CookiePreferences = {
    essential: true,  // Always true
    analytics: false,
    functional: false,
    marketing: false,
};

export const useCookieConsent = () => {
    const context = useContext(CookieConsentContext);
    if (context === undefined) {
        throw new Error('useCookieConsent must be used within a CookieConsentProvider');
    }
    return context;
};

interface CookieConsentProviderProps {
    children: ReactNode;
}

export const CookieConsentProvider = ({ children }: CookieConsentProviderProps) => {
    const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);
    const [hasConsented, setHasConsented] = useState(false);
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load saved preferences from localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const savedPrefs = localStorage.getItem(COOKIE_CONSENT_KEY);
            const consentTimestamp = localStorage.getItem(COOKIE_CONSENT_TIMESTAMP_KEY);

            if (savedPrefs && consentTimestamp) {
                const parsedPrefs = JSON.parse(savedPrefs) as CookiePreferences;
                // Ensure essential is always true
                parsedPrefs.essential = true;
                setPreferences(parsedPrefs);
                setHasConsented(true);
                setShowBanner(false);
            } else {
                // No consent given yet, show banner
                setShowBanner(true);
            }
        } catch (error) {
            console.error('Error loading cookie preferences:', error);
            setShowBanner(true);
        } finally {
            setIsInitialized(true);
        }
    }, []);

    // Apply cookie preferences (enable/disable scripts based on consent)
    useEffect(() => {
        if (!isInitialized) return;

        // Essential cookies are always enabled (handled by backend)
        // Analytics cookies
        if (preferences.analytics) {
            // Enable Google Analytics or other analytics tools
            // This would typically initialize analytics scripts
            // For now, we'll just mark it as enabled
        } else {
            // Disable analytics
            // Remove analytics cookies if they exist
        }

        // Functional cookies
        if (preferences.functional) {
            // Enable functional features like theme preferences, language, etc.
        } else {
            // Disable functional cookies
        }

        // Marketing cookies
        if (preferences.marketing) {
            // Enable marketing/advertising scripts
        } else {
            // Disable marketing cookies
        }
    }, [preferences, isInitialized]);

    const acceptAll = () => {
        const allAccepted: CookiePreferences = {
            essential: true,
            analytics: true,
            functional: true,
            marketing: true,
        };
        savePreferences(allAccepted);
        setShowBanner(false);
    };

    const rejectAll = () => {
        const onlyEssential: CookiePreferences = {
            essential: true,
            analytics: false,
            functional: false,
            marketing: false,
        };
        savePreferences(onlyEssential);
        setShowBanner(false);
    };

    const savePreferences = (newPrefs: Partial<CookiePreferences>) => {
        const updatedPrefs: CookiePreferences = {
            ...preferences,
            ...newPrefs,
            essential: true, // Always ensure essential is true
        };

        setPreferences(updatedPrefs);
        setHasConsented(true);
        setShowBanner(false);
        setShowSettings(false);

        // Save to localStorage
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(updatedPrefs));
                localStorage.setItem(COOKIE_CONSENT_TIMESTAMP_KEY, Date.now().toString());
            } catch (error) {
                console.error('Error saving cookie preferences:', error);
            }
        }
    };

    const openSettings = () => {
        setShowSettings(true);
        setShowBanner(false);
    };

    const closeSettings = () => {
        setShowSettings(false);
    };

    const isCategoryEnabled = (category: CookieCategory): boolean => {
        return preferences[category] ?? false;
    };

    const value: CookieConsentContextType = {
        preferences,
        hasConsented,
        showBanner,
        showSettings,
        acceptAll,
        rejectAll,
        savePreferences,
        openSettings,
        closeSettings,
        isCategoryEnabled,
    };

    return (
        <CookieConsentContext.Provider value={value}>
            {children}
        </CookieConsentContext.Provider>
    );
};
