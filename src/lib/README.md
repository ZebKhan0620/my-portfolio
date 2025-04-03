# Internationalization System

This document describes the internationalization (i18n) system used in the application, providing an overview of the architecture, key components, and usage examples.

## Architecture Overview

The i18n system consists of the following key components:

1. **LanguageContext** - React context that provides translation functions and locale management to components.
2. **Translation Cache** - In-memory cache for storing translations to avoid redundant network requests.
3. **Translation Preloader** - Utility for preloading translations for specific locales and namespaces.
4. **Translation Optimizer** - Utility for optimizing translations to reduce memory usage.
5. **Performance Monitoring** - Tools for tracking and measuring the performance of i18n operations.
6. **Global Translation System** - Utility for accessing translations outside of React components.

## Key Components

### LanguageContext

The `LanguageContext` provides the following functionality:

- Translation function (`t`) for accessing translated strings
- Current locale state and setter for changing the locale
- Loading and error states for translations
- Multiple namespace support for organizing translations
- Methods for loading additional namespaces

#### Usage Example

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { t, locale, setLocale, loadNamespace } = useLanguage();
  
  // Load additional namespace if needed
  React.useEffect(() => {
    loadNamespace('admin');
  }, [loadNamespace]);
  
  return (
    <div>
      <h1>{t('greeting')}</h1>
      <p>{t('admin.welcome', { name: 'John' })}</p>
      <button onClick={() => setLocale('ja')}>
        {t('switchLanguage')}
      </button>
    </div>
  );
}
```

### Translation Cache

The `translationCache` provides caching for translations to avoid redundant network requests:

- Caches translations by locale and namespace
- Supports custom expiration times
- Provides methods for clearing the cache

#### Usage Example

```tsx
import { translationCache } from '@/lib/translationCache';

// Get translations from cache
const translations = translationCache.get('en', 'common');

// Add translations to cache
translationCache.set('en', translationsData, 'common');

// Clear specific locale and namespace
translationCache.clear('en', 'admin');
```

### Translation Preloader

The `translationPreloader` provides utilities for preloading translations:

- Preload translations for specific locales and namespaces
- Optimize translations before caching
- Track performance metrics during loading

#### Usage Example

```tsx
import { preloadTranslations, preloadAllLocales } from '@/lib/translationPreloader';

// Preload a specific namespace for a locale
await preloadTranslations('en', 'admin');

// Preload all locales for a specific namespace
await preloadAllLocales('common');
```

### Translation Optimizer

The `translationOptimizer` provides utilities for optimizing translations:

- Remove empty values and duplicates
- Trim whitespace and normalize placeholders
- Provide statistics about the optimization process

#### Usage Example

```tsx
import { translationOptimizer } from '@/lib/translationOptimizer';

const { optimized, stats } = translationOptimizer.optimize(translations);
console.log(`Saved ${stats.savingsPercent.toFixed(2)}% of memory`);
```

### Global Translation System

The `globalTranslation` utility provides access to translations outside of React components:

- Translate keys with parameter support
- Subscribe to locale changes
- Access translations in utilities or services

#### Usage Example

```tsx
import { t, setGlobalLocale } from '@/lib/globalTranslation';

// Use translations in any JavaScript code
const greeting = t('greeting');
const welcome = t('welcome', { name: 'John' });

// Change the global locale
setGlobalLocale('ja');
```

## Translation File Structure

Translations are organized in JSON files with the following structure:

```
public/
  locales/
    en/
      common.json    # Common translations used throughout the app
      admin.json     # Admin-specific translations
      errors.json    # Error messages
    ja/
      common.json
      admin.json
      errors.json
```

Each JSON file uses a nested structure for organizing translations:

```json
{
  "common": {
    "greeting": "Hello",
    "welcome": "Welcome, {{name}}!"
  },
  "navigation": {
    "home": "Home",
    "about": "About",
    "contact": "Contact"
  }
}
```

## Performance Considerations

The i18n system is designed with performance in mind:

- Translations are cached to avoid redundant network requests
- Translations are optimized to reduce memory usage
- Namespaces allow loading only the translations that are needed
- Performance metrics are collected to identify bottlenecks

## Adding New Languages

To add a new language to the application:

1. Update the `locales` array in `src/config/i18n.ts`
2. Create translation files for the new locale in `public/locales/<locale>/`
3. Add metadata for the new locale in `localeMetadata` in `src/config/i18n.ts`

## Best Practices

1. **Use namespaces** to organize translations and load only what you need
2. **Preload translations** for critical pages to improve user experience
3. **Use translation keys** that are descriptive and structured
4. **Validate translations** to ensure all keys are available in all locales
5. **Monitor performance** to identify bottlenecks in the i18n system 