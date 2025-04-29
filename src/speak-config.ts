import type { SpeakConfig } from 'qwik-speak';

export const config: SpeakConfig = {
    defaultLocale: { lang: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles' },
    supportedLocales: [
        { lang: 'fr', currency: 'EUR', timeZone: 'Europe/Rome' },
        { lang: 'es', currency: 'EUR', timeZone: 'Europe/Madrid' },
        { lang: 'en', currency: 'USD', timeZone: 'America/Los_Angeles' },
        { lang: 'ar', currency: 'USD', timeZone: 'Africa/Cairo' },
    ],
    // Translations available in the whole app
    assets: [
        'app'
    ],
    // Translations with dynamic keys available in the whole app
    runtimeAssets: [
        'runtime'
    ]
};