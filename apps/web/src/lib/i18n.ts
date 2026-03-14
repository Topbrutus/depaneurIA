import type { Locale, Translations } from '@depaneuria/types'
import { DEFAULT_LOCALE } from '@depaneuria/types'
import { fr } from '../locales/fr'
import { en } from '../locales/en'

const translations: Record<Locale, Translations> = {
  fr,
  en,
}

export const getTranslations = (locale: Locale): Translations => {
  return translations[locale] || translations[DEFAULT_LOCALE]
}

// Helper to get a nested translation key
export const getNestedValue = (obj: any, path: string): string => {
  const keys = path.split('.')
  let result = obj
  for (const key of keys) {
    result = result?.[key]
    if (result === undefined) break
  }
  return typeof result === 'string' ? result : path
}

// Translation function with fallback
export const translate = (locale: Locale, key: string, fallbackLocale: Locale = DEFAULT_LOCALE): string => {
  const currentTranslations = getTranslations(locale)
  const value = getNestedValue(currentTranslations, key)

  // If value found, return it
  if (value !== key) {
    return value
  }

  // Fallback to default locale if different
  if (locale !== fallbackLocale) {
    const fallbackTranslations = getTranslations(fallbackLocale)
    const fallbackValue = getNestedValue(fallbackTranslations, key)
    if (fallbackValue !== key) {
      return fallbackValue
    }
  }

  // Return the key itself if no translation found
  return key
}
