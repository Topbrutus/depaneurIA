import type { CatalogProduct } from '@depaneuria/types';

/**
 * Catalogue de démonstration — 20 produits typiques d'un dépanneur québécois.
 * À remplacer par un appel API lorsque le backend sera disponible.
 */
export const DEMO_CATALOG: CatalogProduct[] = [
  // Laitier
  { id: 'milk-2pct', name: 'Lait 2%', category: 'Laitier', brand: 'Natrel', price: 4.99, available: true },
  { id: 'milk-whole', name: 'Lait entier', category: 'Laitier', brand: 'Quebon', price: 5.19, available: true },
  { id: 'butter-1', name: 'Beurre 454g', category: 'Laitier', brand: 'Lactantia', price: 5.49, available: true },

  // Boissons gazeuses
  { id: 'coke-355', name: 'Coca-Cola 355ml', category: 'Boissons', brand: 'Coca-Cola', price: 1.99, available: true },
  { id: 'coke-zero-355', name: 'Coca-Cola Zero 355ml', category: 'Boissons', brand: 'Coca-Cola', price: 1.99, available: true },
  { id: 'pepsi-355', name: 'Pepsi 355ml', category: 'Boissons', brand: 'Pepsi', price: 1.99, available: true },
  { id: 'pepsi-zero-355', name: 'Pepsi Zero 355ml', category: 'Boissons', brand: 'Pepsi', price: 1.99, available: true },

  // Boissons non gazeuses
  { id: 'water-1', name: 'Eau minerale 500ml', category: 'Boissons', brand: 'Evian', price: 1.49, available: true },
  { id: 'juice-orange', name: 'Jus orange 1L', category: 'Boissons', brand: 'Tropicana', price: 3.99, available: true },

  // Collations
  { id: 'chips-lays', name: 'Chips Lays Original', category: 'Collations', brand: 'Lays', price: 3.49, available: true },
  { id: 'chips-ketchup', name: 'Chips Lays Ketchup', category: 'Collations', brand: 'Lays', price: 3.49, available: true },
  { id: 'chips-ruffles', name: 'Chips Ruffles Creme sure', category: 'Collations', brand: 'Ruffles', price: 3.49, available: true },
  { id: 'chips-doritos', name: 'Doritos Nacho Cheese', category: 'Collations', brand: 'Doritos', price: 3.49, available: true },

  // Boulangerie
  { id: 'bread-white', name: 'Pain blanc tranche', category: 'Boulangerie', price: 2.99, available: true },
  { id: 'bread-wheat', name: 'Pain ble entier', category: 'Boulangerie', price: 3.29, available: true },

  // Épicerie
  { id: 'eggs-12', name: 'Oeufs 12 gros', category: 'Epicerie', price: 4.49, available: true },
  { id: 'sugar-1kg', name: 'Sucre blanc 1kg', category: 'Epicerie', brand: 'Redpath', price: 2.49, available: true },
  { id: 'coffee-1', name: 'Cafe moulu 300g', category: 'Epicerie', brand: 'Van Houtte', price: 7.99, available: true },

  // Tabac / Divers (non disponible — test de filtrage)
  { id: 'beer-1', name: 'Biere 6 pack', category: 'Boissons', brand: 'Molson', price: 12.99, available: false },
];
