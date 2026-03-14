import { SUPPORTED_LOCALES } from '@depaneuria/types'
import type { Locale } from '@depaneuria/types'
import { useI18n } from '../../lib/i18n-context'

const localeLabels: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
}

export const LanguageSwitcher = () => {
  const { locale, setLocale } = useI18n()

  return (
    <div className="language-switcher">
      {SUPPORTED_LOCALES.map((loc) => (
        <button
          key={loc}
          onClick={() => setLocale(loc)}
          className={locale === loc ? 'lang-btn active' : 'lang-btn'}
          aria-label={`Switch to ${localeLabels[loc]}`}
          aria-pressed={locale === loc}
        >
          {localeLabels[loc]}
        </button>
      ))}
    </div>
  )
}
