import type { OrderStatus } from '@depaneuria/types';
import { ORDER_STATUSES } from '@depaneuria/types';

export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  draft: ['submitted'],
  submitted: ['accepted', 'rejected', 'cancelled'],
  accepted: ['preparing', 'cancelled'],
  rejected: [],
  preparing: ['ready_for_delivery', 'cancelled'],
  ready_for_delivery: ['assigned_to_driver', 'cancelled'],
  assigned_to_driver: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered', 'delivery_failed'],
  delivered: [],
  delivery_failed: ['assigned_to_driver', 'cancelled'],
  cancelled: [],
};

export const LEGACY_STATUS_MAP: Record<string, OrderStatus> = {
  panier: 'draft',
  soumise: 'submitted',
  soumission: 'submitted',
  confirmee: 'accepted',
  confirmée: 'accepted',
  en_preparation: 'preparing',
  'en_preparation ': 'preparing',
  'en_preparation\u0301': 'preparing',
  'en_préparation': 'preparing',
  en_préparation: 'preparing',
  prete: 'ready_for_delivery',
  prête: 'ready_for_delivery',
  acceptee: 'assigned_to_driver',
  acceptée: 'assigned_to_driver',
  en_route: 'out_for_delivery',
  livree: 'delivered',
  livrée: 'delivered',
  payee: 'delivered',
  payée: 'delivered',
  annulee: 'cancelled',
  annulée: 'cancelled',
  probleme: 'delivery_failed',
  problème: 'delivery_failed',
  archivee: 'cancelled',
};

export function normalizeStatus(rawStatus: string | undefined): OrderStatus | null {
  if (!rawStatus) {
    return null;
  }

  if (ORDER_STATUSES.includes(rawStatus as OrderStatus)) {
    return rawStatus as OrderStatus;
  }

  const mapped = LEGACY_STATUS_MAP[rawStatus];
  return mapped ?? null;
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  const allowed = ORDER_TRANSITIONS[from] ?? [];
  return allowed.includes(to);
}

export function allowedTargets(from: OrderStatus): OrderStatus[] {
  return ORDER_TRANSITIONS[from] ?? [];
}
