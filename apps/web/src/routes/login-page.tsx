import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { CustomerData, CustomerSession } from '@depaneuria/types'
import { FormError } from '../components/customer/form-error'
import { normalizePhone } from '../lib/validation'
import { useI18n } from '../lib/i18n-context'

type LoginPageProps = {
  customer: CustomerData | null
  session: CustomerSession | null
  onCustomerChange: (customer: CustomerData | null) => void
  onSessionChange: (session: CustomerSession | null) => void
  onLogin: (phone: string) => { ok: boolean; error?: string }
}

const LoginPage = ({ customer, onSessionChange, onLogin }: LoginPageProps) => {
  const navigate = useNavigate()
  const { translations: t } = useI18n()
  const [phone, setPhone] = useState<string>(customer?.profile.phone ?? '')
  const [error, setError] = useState<string>('')
  const [info, setInfo] = useState<string>('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setInfo('')

    const cleaned = normalizePhone(phone)
    if (!cleaned || cleaned.length < 10) {
      setError(t.auth.invalidPhoneFormat)
      return
    }

    const result = onLogin(cleaned)
    if (!result.ok) {
      setError(result.error ?? t.auth.loginError)
      return
    }

    setInfo(t.auth.loginSuccess)
    navigate('/')
  }

  const handleResetSession = () => {
    onSessionChange(null)
    setInfo(t.auth.sessionReset)
    setError('')
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">{t.auth.loginTitle}</p>
          <h1>{t.auth.loginSubtitle}</h1>
          <p className="muted">
            {t.auth.loginDescription2}
          </p>
        </div>
      </div>

      <div className="card form-card">
        <form onSubmit={handleSubmit} className="stack">
          <div className="field">
            <label htmlFor="login-phone">{t.auth.phone}</label>
            <input
              id="login-phone"
              name="login-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder={t.auth.phonePlaceholder}
            />
          </div>

          <FormError message={error} />
          {info && <div className="inline-success">{info}</div>}

          <button className="btn btn-primary" type="submit">
            {t.auth.loginButton}
          </button>
        </form>

        <div className="card-footer">
          <button className="link" type="button" onClick={handleResetSession}>
            {t.auth.resetSession}
          </button>
          <span className="muted">{t.auth.or}</span>
          <Link className="link" to="/signup">
            {t.auth.createAccount}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
