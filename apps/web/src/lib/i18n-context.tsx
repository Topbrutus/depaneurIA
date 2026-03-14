import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import type { Locale, Translations } from '@depaneuria/types'
import { DEFAULT_LOCALE } from '@depaneuria/types'
import { loadLocale, saveLocale } from './locale-storage'
import { getTranslations, translate as translateFn } from './i18n'

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  translations: Translations
}

const I18nContext = createContext<I18nContextValue | null>(null)

export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}

interface I18nProviderProps {
  children: ReactNode
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const [locale, setLocaleState] = useState<Locale>(() => loadLocale())

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    saveLocale(newLocale)
  }, [])

  const t = useCallback(
    (key: string): string => {
      return translateFn(locale, key, DEFAULT_LOCALE)
    },
    [locale]
  )

  const translations = getTranslations(locale)

  const value: I18nContextValue = {
    locale,
    setLocale,
    t,
    translations,
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
