const API_URL = 'http://localhost:3001'

export interface Product {
  id: number
  name: string
  category: string
  price: number
  emoji: string
  stock: number
  image: string
}

export const api = {
  getProducts: async (): Promise<Product[]> => {
    const res = await fetch(`${API_URL}/api/products`)
    if (!res.ok) throw new Error('Erreur API')
    return res.json()
  },

  addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const res = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    })
    if (!res.ok) throw new Error('Erreur ajout produit')
    return res.json()
  },

  // Retourne l'URL complète de l'image
  getImageUrl: (imagePath: string): string => {
    if (!imagePath) return ''
    if (imagePath.startsWith('data:') || imagePath.startsWith('http')) return imagePath
    return `${API_URL}${imagePath}`
  },
}
