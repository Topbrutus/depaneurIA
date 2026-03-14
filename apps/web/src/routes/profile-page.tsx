import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { CustomerData, CustomerSession } from '@depaneuria/types'
import { CustomerForm, type CustomerFormValues } from '../components/customer/customer-form'
import { startSession } from '../lib/customer-storage'
import { normalizePhone, validateProfile, type ProfileValidationErrors } from '../lib/validation'
import { useI18n } from '../lib/i18n-context'

type ProfilePageProps = {
  customer: CustomerData | null
  session: CustomerSession | null
  onCustomerChange: (customer: CustomerData | null) => void
  onSessionChange: (session: CustomerSession | null) => void
  onLogout: () => void
}

const ProfilePage = ({ customer, session, onCustomerChange, onSessionChange, onLogout }: ProfilePageProps) => {
  const navigate = useNavigate()
  const { translations: t } = useI18n()
  const [errors, setErrors] = useState<ProfileValidationErrors>({})
  const [info, setInfo] = useState<string>('')

  if (!customer) {
    return (
      <div className="page">
        <div className="card">
          <h2>{t.profile.noProfile}</h2>
          <p className="muted">{t.profile.createProfileFirst}</p>
          <Link className="btn btn-primary" to="/signup">
            {t.profile.createProfile}
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = (values: CustomerFormValues) => {
    setInfo('')
    const validation = validateProfile(values)
    setErrors(validation)
    if (Object.keys(validation).length > 0) {
      return
    }

    const updated: CustomerData = {
      ...customer,
      profile: {
        ...customer.profile,
        name: values.name.trim(),
        phone: normalizePhone(values.phone),
        deliveryNotes: values.deliveryNotes?.trim(),
      },
      updatedAt: new Date().toISOString(),
    }

    onCustomerChange(updated)
    if (session?.loggedIn) {
      onSessionChange(startSession(updated.profile.phone))
    }
    setInfo(t.profile.profileUpdated)
  }

  const handleDeleteAccount = () => {
    onCustomerChange(null)
    onSessionChange(null)
    onLogout()
    navigate('/signup')
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">{t.profile.title}</p>
          <h1>{t.profile.yourInfo}</h1>
          <p className="muted">{t.profile.profileDescription}</p>
        </div>
      </div>

      <div className="stack">
        <CustomerForm
          initialValues={{
            name: customer.profile.name,
            phone: customer.profile.phone,
            deliveryNotes: customer.profile.deliveryNotes ?? '',
          }}
          submitLabel={t.profile.updateButton}
          onSubmit={handleSubmit}
          errors={errors}
        />

        {info && <div className="inline-success">{info}</div>}

        <div className="card danger-card">
          <div>
            <h3>{t.profile.deleteAccountTitle}</h3>
            <p className="muted">{t.profile.deleteAccountDescription}</p>
          </div>
          <button className="btn btn-danger" type="button" onClick={handleDeleteAccount}>
            {t.profile.deleteAndReset}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
