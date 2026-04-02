import { Router, Request, Response } from 'express'
import path from 'path'
import fs from 'fs'
import db from '../database'

const router = Router()

// GET /api/products
router.get('/', (req: Request, res: Response) => {
  const products = db.prepare('SELECT * FROM products ORDER BY category, name').all()
  res.json(products)
})

// GET /api/products/:id
router.get('/:id', (req: Request, res: Response) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
  if (!product) return res.status(404).json({ error: 'Produit non trouvé' })
  res.json(product)
})

// POST /api/products — supporte base64 image
router.post('/', (req: Request, res: Response) => {
  const { name, category, price, emoji, stock, image } = req.body
  if (!name || !price) return res.status(400).json({ error: 'Nom et prix requis' })

  let imagePath = ''

  // Si image base64, on la sauvegarde en fichier
  if (image && image.startsWith('data:image')) {
    try {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
      const fileName = `product-${Date.now()}.jpg`
      const filePath = path.join(process.cwd(), 'public', 'images', fileName)
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'))
      imagePath = `/images/${fileName}`
    } catch (e) {
      console.error('Erreur sauvegarde image:', e)
    }
  }

  const result = db.prepare(`
    INSERT INTO products (name, category, price, emoji, stock, image)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(name, category || 'Divers', price, emoji || '🥔', stock || 0, imagePath)

  const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json(newProduct)
})

// PUT /api/products/:id
router.put('/:id', (req: Request, res: Response) => {
  const { name, category, price, emoji, stock, image } = req.body

  let imagePath = image || ''

  if (image && image.startsWith('data:image')) {
    try {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
      const fileName = `product-${Date.now()}.jpg`
      const filePath = path.join(process.cwd(), 'public', 'images', fileName)
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'))
      imagePath = `/images/${fileName}`
    } catch (e) {
      console.error('Erreur sauvegarde image:', e)
    }
  }

  db.prepare(`
    UPDATE products SET name=?, category=?, price=?, emoji=?, stock=?, image=?
    WHERE id=?
  `).run(name, category, price, emoji, stock, imagePath, req.params.id)

  const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
  res.json(updated)
})

// DELETE /api/products/:id
router.delete('/:id', (req: Request, res: Response) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

export default router
