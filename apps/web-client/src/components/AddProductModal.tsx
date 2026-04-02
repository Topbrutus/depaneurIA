import { useState, useRef } from 'react'
import ImageUploader from './ImageUploader'

const CATEGORIES = ['Chips','Boissons','Chocolat','Populaires','Laitier','Boulangerie','Épicerie','Hygiène','Divers','Pharmacie','Confiseries','Collations']
const UNITS = ['g','ml','L','kg','lb','oz','unité','pack']
const EMOJIS = ['🥔','🥤','🍫','🍞','🥛','🍊','🧃','🥜','🍦','🍬','💊','🧴','🔋','☕','🧀','🍯','🥚','🧈']

interface Props {
  onSave: (product: any) => void
  onClose: () => void
}

function processImage(file: File): Promise<{ dataUrl: string; fileName: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const SIZE = 500
        const canvas = document.createElement('canvas')
        canvas.width = SIZE; canvas.height = SIZE
        const ctx = canvas.getContext('2d')!
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, SIZE, SIZE)
        const ratio = img.width / img.height
        let sw, sh, sx, sy
        if (ratio > 1) { sh = img.height; sw = img.height; sx = Math.floor((img.width - sw) / 2); sy = 0 }
        else { sw = img.width; sh = img.width; sx = 0; sy = Math.floor((img.height - sh) / 2) }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, SIZE, SIZE)
        const baseName = file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/\s+/g, '-')
        resolve({ dataUrl: canvas.toDataURL('image/jpeg', 0.88), fileName: `${baseName}.jpg` })
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function AddProductModal({ onSave, onClose }: Props) {
  const [name, setName]           = useState('')
  const [price, setPrice]         = useState('')
  const [marketPrice, setMarketPrice] = useState('')
  const [priceAdjust, setPriceAdjust] = useState(0)
  const [category, setCategory]   = useState('Chips')
  const [description, setDescription] = useState('')
  const [quantity, setQuantity]   = useState('')
  const [unit, setUnit]           = useState('g')
  const [stock, setStock]         = useState('10')
  const [emoji, setEmoji]         = useState('🥔')
  const [imageData, setImageData] = useState('')
  const [fileName, setFileName]   = useState('')
  const [error, setError]         = useState('')
  const [generating, setGenerating] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [speaking, setSpeaking]   = useState(false)
  const cameraRef = useRef<HTMLInputElement>(null)

  // Calcul prix final avec ajustement
  const finalPrice = marketPrice
    ? (parseFloat(marketPrice) * (1 + priceAdjust / 100)).toFixed(2)
    : price

  // ─── Générer avec IA ─────────────────────────────────
  const generateWithAI = async () => {
    if (!imageData) { setError('Ajoutez une photo d\'abord'); return }
    setGenerating(true); setError('')

    try {
      const base64 = imageData.split(',')[1]
      const res = await fetch('http://localhost:3001/api/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 })
      })
      if (!res.ok) throw new Error('Erreur API')
      const parsed = await res.json()
      setName(parsed.name || '')
      setCategory(parsed.category || 'Divers')
      setDescription(parsed.description || '')
      setQuantity(parsed.quantity || '')
      setUnit(parsed.unit || 'g')
      setMarketPrice(parsed.marketPrice || '')
      setPrice(parsed.marketPrice || '')
      setEmoji(parsed.emoji || '🥔')

      // Lecture vocale si activée
      if (soundEnabled && parsed.name) {
        speakDescription(parsed)
      }
    } catch (e) {
      setError('Erreur de génération IA — réessayez')
    }
    setGenerating(false)
  }

  // ─── Lecture vocale ───────────────────────────────────
  const speakDescription = (data?: any) => {
    window.speechSynthesis.cancel()
    const text = data
      ? `${data.name}. ${data.description || ''}. ${data.quantity ? data.quantity + ' ' + data.unit + '.' : ''} Prix suggéré : ${data.marketPrice} dollars.`
      : `${name}. ${description || ''}. ${quantity ? quantity + ' ' + unit + '.' : ''} Prix : ${finalPrice} dollars.`

    setSpeaking(true)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'fr-CA'
    utterance.rate = 0.85
    utterance.volume = 1
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    setTimeout(() => window.speechSynthesis.speak(utterance), 100)
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  // ─── Prise de photo caméra ────────────────────────────
  const handleCameraFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const { dataUrl, fileName: fn } = await processImage(file)
    setImageData(dataUrl)
    setFileName(fn)
    e.target.value = ''
  }

  // ─── Ajustement prix ──────────────────────────────────
  const adjustPrice = (delta: number) => {
    const next = Math.round((priceAdjust + delta) * 10) / 10
    setPriceAdjust(next)
    if (marketPrice) setPrice((parseFloat(marketPrice) * (1 + next / 100)).toFixed(2))
  }

  // ─── Enregistrer ─────────────────────────────────────
  const handleSave = () => {
    if (!name.trim()) { setError('Le nom est requis'); return }
    if (!finalPrice || isNaN(+finalPrice) || +finalPrice <= 0) { setError('Prix invalide'); return }
    onSave({
      name: name.trim(),
      price: parseFloat(finalPrice),
      category,
      stock: parseInt(stock) || 10,
      emoji,
      description,
      quantity,
      unit,
      image: imageData || '',
    })
    onClose()
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 600,
    color: '#555', marginBottom: 5,
    textTransform: 'uppercase', letterSpacing: '0.06em',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    border: '1px solid #e0e0e0', fontSize: 13, outline: 'none',
    background: '#fafafa', transition: 'border-color 0.15s',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 12 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 500, maxHeight: '93vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }}>

        {/* Header */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Ajouter un produit</h2>
            <p style={{ fontSize: 11, color: '#999', margin: 0 }}>Photo → IA génère tout automatiquement</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Son on/off */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontSize: 12, color: '#666' }}>
              <input type="checkbox" checked={soundEnabled} onChange={e => { setSoundEnabled(e.target.checked); if (!e.target.checked) stopSpeaking() }} />
              🔊
            </label>
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid #e0e0e0', background: '#f5f5f5', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>
        </div>

        <div style={{ padding: '16px 18px' }}>

          {/* Photo + Caméra */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>📷 Photo du produit</label>
            <ImageUploader productName={name || undefined} onImageReady={(data, fname) => { setImageData(data); setFileName(fname) }} />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {/* Bouton caméra */}
              <button onClick={() => cameraRef.current?.click()} style={{
                flex: 1, padding: '8px', border: '1px solid #e0e0e0', borderRadius: 8,
                background: '#fafafa', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                📸 Prendre une photo
              </button>
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleCameraFile} style={{ display: 'none' }} />

              {/* Bouton Générer */}
              <button onClick={generateWithAI} disabled={!imageData || generating} style={{
                flex: 1, padding: '8px',
                background: imageData && !generating ? '#2d7a3a' : '#e0e0e0',
                border: 'none', borderRadius: 8, color: imageData && !generating ? '#fff' : '#999',
                fontSize: 12, fontWeight: 700, cursor: imageData && !generating ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                boxShadow: imageData && !generating ? '0 2px 8px rgba(45,122,58,0.3)' : 'none',
              }}>
                {generating ? '⏳ Génération...' : '✨ Générer avec IA'}
              </button>
            </div>

            {/* Bouton lecture vocale */}
            {soundEnabled && (name || description) && (
              <button onClick={(e) => {
                e.preventDefault()
                if (speaking) {
                  stopSpeaking()
                } else {
                  window.speechSynthesis.cancel()
                  const u = new SpeechSynthesisUtterance(`${name}. ${description}. ${quantity} ${unit}. Prix : ${finalPrice} dollars.`)
                  u.lang = 'fr-CA'
                  u.rate = 0.85
                  u.onstart = () => setSpeaking(true)
                  u.onend = () => setSpeaking(false)
                  u.onerror = () => setSpeaking(false)
                  window.speechSynthesis.speak(u)
                }
              }} style={{
                width: '100%', marginTop: 6, padding: '7px',
                background: speaking ? '#fce4e4' : '#e8f5eb',
                border: `1px solid ${speaking ? '#f87171' : '#c8e6c9'}`,
                borderRadius: 8, fontSize: 12, cursor: 'pointer',
                color: speaking ? '#e53935' : '#2d7a3a',
              }}>
                {speaking ? '⏹ Arrêter la lecture' : '🔊 Lire la description'}
              </button>
            )}
          </div>

          {/* Nom */}
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Nom du produit *</label>
            <input value={name} onChange={e => { setName(e.target.value); setError('') }}
              placeholder="ex: Lay's Ketchup 200g" style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#2d7a3a' }}
              onBlur={e => { e.target.style.borderColor = '#e0e0e0' }} />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Description</label>
            <input value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Description courte..." style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#2d7a3a' }}
              onBlur={e => { e.target.style.borderColor = '#e0e0e0' }} />
          </div>

          {/* Quantité + Unité */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Quantité</label>
              <input value={quantity} onChange={e => setQuantity(e.target.value)}
                placeholder="ex: 200" type="number" style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#2d7a3a' }}
                onBlur={e => { e.target.style.borderColor = '#e0e0e0' }} />
            </div>
            <div>
              <label style={labelStyle}>Unité</label>
              <select value={unit} onChange={e => setUnit(e.target.value)}
                style={{ ...inputStyle, appearance: 'none' }}>
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Prix marché + Ajustement */}
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>💰 Prix</label>
            <div style={{ background: '#f8f8f8', border: '1px solid #e0e0e0', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#999', marginBottom: 4 }}>PRIX MARCHÉ ($)</div>
                  <input value={marketPrice} onChange={e => { setMarketPrice(e.target.value); setPrice((parseFloat(e.target.value || '0') * (1 + priceAdjust / 100)).toFixed(2)) }}
                    placeholder="3.49" type="number" step="0.01"
                    style={{ ...inputStyle, background: '#fff' }}
                    onFocus={e => { e.target.style.borderColor = '#2d7a3a' }}
                    onBlur={e => { e.target.style.borderColor = '#e0e0e0' }} />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#999', marginBottom: 4 }}>PRIX FINAL ($)</div>
                  <input value={finalPrice} onChange={e => setPrice(e.target.value)}
                    placeholder="3.49" type="number" step="0.01"
                    style={{ ...inputStyle, background: '#fff', fontWeight: 700, color: '#2d7a3a' }}
                    onFocus={e => { e.target.style.borderColor = '#2d7a3a' }}
                    onBlur={e => { e.target.style.borderColor = '#e0e0e0' }} />
                </div>
              </div>

              {/* Ajustement % */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: '#666', whiteSpace: 'nowrap' }}>Ajustement :</span>
                <button onClick={() => adjustPrice(-0.1)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontSize: 14 }}>−</button>
                <button onClick={() => adjustPrice(-1)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontSize: 11 }}>-1%</button>
                <div style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 14, color: priceAdjust > 0 ? '#e53935' : priceAdjust < 0 ? '#2d7a3a' : '#666' }}>
                  {priceAdjust > 0 ? '+' : ''}{priceAdjust.toFixed(1)}%
                </div>
                <button onClick={() => adjustPrice(1)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontSize: 11 }}>+1%</button>
                <button onClick={() => adjustPrice(0.1)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontSize: 14 }}>+</button>
                <button onClick={() => { setPriceAdjust(0); if (marketPrice) setPrice(marketPrice) }} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e0e0e0', background: '#f5f5f5', cursor: 'pointer', fontSize: 10 }}>0</button>
              </div>
              <div style={{ fontSize: 10, color: '#999', marginTop: 4, textAlign: 'center' }}>
                {priceAdjust > 0 ? `${priceAdjust.toFixed(1)}% plus cher que le marché` : priceAdjust < 0 ? `${Math.abs(priceAdjust).toFixed(1)}% moins cher que le marché` : 'Prix du marché'}
              </div>
            </div>
          </div>

          {/* Stock + Catégorie */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Stock</label>
              <input value={stock} onChange={e => setStock(e.target.value)} placeholder="10" type="number" style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#2d7a3a' }}
                onBlur={e => { e.target.style.borderColor = '#e0e0e0' }} />
            </div>
            <div>
              <label style={labelStyle}>Catégorie</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Emoji (caché si photo) */}
          {!imageData && (
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Emoji</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setEmoji(e)} style={{ width: 34, height: 34, borderRadius: 8, border: `2px solid ${emoji === e ? '#2d7a3a' : '#e0e0e0'}`, background: emoji === e ? '#e8f5eb' : '#fafafa', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{e}</button>
                ))}
              </div>
            </div>
          )}

          {error && <p style={{ color: '#e53935', fontSize: 12, marginBottom: 10 }}>⚠ {error}</p>}

          {/* Boutons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{ padding: '11px 18px', border: '1px solid #e0e0e0', borderRadius: 8, background: '#fff', color: '#555', fontSize: 13, cursor: 'pointer' }}>Annuler</button>
            <button onClick={handleSave} style={{ flex: 1, padding: '11px', background: '#2d7a3a', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 12px rgba(45,122,58,0.3)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1e5c29' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#2d7a3a' }}>
              ✓ Enregistrer le produit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
