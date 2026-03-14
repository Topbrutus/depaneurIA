import type { Locale } from '@depaneuria/types'
import { DEFAULT_LOCALE } from '@depaneuria/types'

const LOCALE_STORAGE_KEY = 'depaneuria:locale'

export const saveLocale = (locale: Locale): void => {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch (error) {
    console.warn('Failed to save locale to localStorage:', error)
  }
}

export const loadLocale = (): Locale => {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored === 'fr' || stored === 'en') {
      return stored
    }
  } catch (error) {
    console.warn('Failed to load locale from localStorage:', error)
  }
  return DEFAULT_LOCALE
}

export const clearLocale = (): void => {
  try {
    localStorage.removeItem(LOCALE_STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear locale from localStorage:', error)
  }
}
