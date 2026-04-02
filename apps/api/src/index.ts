import express from 'express'
import cors from 'cors'
import path from 'path'
import './database'
import productsRouter from './routes/products'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '20mb' }))
app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')))

app.post('/api/generate-product', async (req: any, res: any) => {
  const { imageBase64 } = req.body
  if (!imageBase64) return res.status(400).json({ error: 'Image requise' })
  const apiKey = process.env.ANTHROPIC_API_KEY || 'AIzaSyAq-3ISKvxsOQcz4tuH1oP1LBjarzFxsJQ'
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } },
            { text: 'Analyse ce produit de dépanneur québécois. Réponds UNIQUEMENT en JSON valide sans markdown: {"name":"Nom exact","category":"Chips ou Boissons ou Chocolat ou Laitier ou Boulangerie ou Épicerie ou Hygiène ou Pharmacie ou Confiseries ou Collations ou Divers","description":"1 phrase courte","quantity":"nombre seulement","unit":"g ou ml ou L ou kg","marketPrice":"prix moyen québécois ex: 3.49","emoji":"emoji approprié"}' }
          ]
        }]
      })
    })
    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return res.status(500).json({ error: 'Réponse invalide' })
    res.json(JSON.parse(match[0]))
  } catch (e) {
    res.status(500).json({ error: 'Erreur Gemini' })
  }
})

app.get('/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/products', productsRouter)

app.listen(PORT, () => {
  console.log(`[api] Server listening on port ${PORT}`)
})
