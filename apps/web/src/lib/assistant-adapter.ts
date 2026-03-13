import type {
  AssistantResponse,
  CartAdapter,
  CartItem,
  CatalogProduct,
} from '@depaneuria/types';
import {
  handleRemove,
  handleReplace,
  matchCatalog,
  refineKeywords,
  parseIntent,
  replyClarify,
  replyProductAdded,
  replyProductNotFound,
  replyProductOutOfStock,
  replyUnknown,
  replyVague,
} from '@depaneuria/utils';

import { DEMO_CATALOG } from './demo-catalog';

// ---------------------------------------------------------------------------
// Adaptateur panier en mémoire (mock V1)
// À remplacer par le store Zustand quand le module panier sera mergé.
// ---------------------------------------------------------------------------
class MockCartAdapter implements CartAdapter {
  private items: CartItem[] = [];

  addItem(productId: string, quantity: number, productName: string): void {
    const existing = this.items.find((i) => i.productId === productId);
    if (existing !== undefined) {
      existing.quantity += quantity;
    } else {
      this.items.push({ productId, quantity, productName });
    }
  }

  removeItem(productId: string): void {
    this.items = this.items.filter((i) => i.productId !== productId);
  }

  getItems(): CartItem[] {
    return [...this.items];
  }
}

// Singleton module-level pour la durée de la session V1
const mockCart = new MockCartAdapter();

// ---------------------------------------------------------------------------
// Point d'entrée principal
// ---------------------------------------------------------------------------

/**
 * Traite un message utilisateur et retourne la réponse de l'assistant.
 * Moteur 100 % déterministe — aucun appel LLM externe.
 */
export function processMessage(rawText: string): AssistantResponse {
  const intent = parseIntent(rawText);

  switch (intent.type) {
    case 'vague':
      return {
        text: replyVague(),
        action: { type: 'none' },
        suggestions: getPopularSuggestions(),
        needsClarification: false,
      };

    case 'replace':
      return handleReplace(intent, DEMO_CATALOG);

    case 'remove':
      return handleRemove(intent, mockCart);

    case 'add':
      return handleAdd(intent.keywords, intent.quantity);

    default:
      return {
        text: replyUnknown(),
        action: { type: 'none' },
        suggestions: [],
        needsClarification: false,
      };
  }
}

// ---------------------------------------------------------------------------
// Helpers internes
// ---------------------------------------------------------------------------

function handleAdd(keywords: string[], quantity: number): AssistantResponse {
  if (keywords.length === 0) {
    return {
      text: replyUnknown(),
      action: { type: 'none' },
      suggestions: [],
      needsClarification: false,
    };
  }

  // Affinage des mots-clés si nécessaire (ex. "pepsi zero" → sous-ensemble)
  const refined = refineKeywords(keywords, DEMO_CATALOG);
  const match = matchCatalog(refined, DEMO_CATALOG);

  if (match.confidence === 'none') {
    return {
      text: replyProductNotFound(keywords),
      action: { type: 'none' },
      suggestions: [],
      needsClarification: false,
    };
  }

  if (match.confidence === 'partial' && match.candidates.length > 1) {
    return {
      text: replyClarify(match),
      action: { type: 'clarify' },
      suggestions: match.candidates,
      needsClarification: true,
    };
  }

  const product: CatalogProduct | undefined =
    match.product ?? match.candidates[0];

  if (product === undefined) {
    return {
      text: replyProductNotFound(keywords),
      action: { type: 'none' },
      suggestions: [],
      needsClarification: false,
    };
  }

  if (!product.available) {
    return {
      text: replyProductOutOfStock(product.name),
      action: { type: 'none' },
      suggestions: [],
      needsClarification: false,
    };
  }

  mockCart.addItem(product.id, quantity, product.name);

  return {
    text: replyProductAdded(product, quantity),
    action: { type: 'add_to_cart', productId: product.id, quantity },
    suggestions: [],
    needsClarification: false,
  };
}

function getPopularSuggestions(): CatalogProduct[] {
  return DEMO_CATALOG.filter((p) => p.available).slice(0, 3);
}

/** Expose le contenu du panier mock pour les composants qui en ont besoin. */
export function getCartItems(): CartItem[] {
  return mockCart.getItems();
}
