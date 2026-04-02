import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'depanneur.db')
const db = new Database(DB_PATH)

// Créer les tables si elles n'existent pas
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    emoji TEXT DEFAULT '🥔',
    stock INTEGER DEFAULT 0,
    image TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT,
    total REAL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    qty INTEGER,
    price REAL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
  );
`)

// Insérer les produits de base si la table est vide
const count = (db.prepare('SELECT COUNT(*) as c FROM products').get() as any).c
if (count === 0) {
  const insert = db.prepare(`
    INSERT INTO products (name, category, price, emoji, stock)
    VALUES (@name, @category, @price, @emoji, @stock)
  `)
  const products = [
    { name: "Lait 2%",          category: "Laitier",     price: 4.99, emoji: "🥛", stock: 12 },
    { name: "Pain blanc",        category: "Boulangerie", price: 3.49, emoji: "🍞", stock: 8  },
    { name: "Oeufs (12)",        category: "Laitier",     price: 5.49, emoji: "🥚", stock: 15 },
    { name: "Beurre",            category: "Laitier",     price: 6.99, emoji: "🧈", stock: 10 },
    { name: "Jus d'orange",      category: "Boissons",    price: 3.99, emoji: "🍊", stock: 20 },
    { name: "Coca-Cola 2L",      category: "Boissons",    price: 3.29, emoji: "🥤", stock: 25 },
    { name: "Eau Evian",         category: "Boissons",    price: 1.99, emoji: "💧", stock: 30 },
    { name: "Chips BBQ",         category: "Collations",  price: 3.79, emoji: "🍟", stock: 18 },
    { name: "Chocolat noir",     category: "Confiseries", price: 2.99, emoji: "🍫", stock: 14 },
    { name: "Bonbons gummies",   category: "Confiseries", price: 1.99, emoji: "🍬", stock: 22 },
    { name: "Aspirine",          category: "Pharmacie",   price: 7.49, emoji: "💊", stock: 6  },
    { name: "Cafe moulu",        category: "Epicerie",    price: 8.99, emoji: "☕", stock: 9  },
  ]
  for (const p of products) insert.run(p)
  console.log('[DB] Produits de base insérés')
}

export default db
