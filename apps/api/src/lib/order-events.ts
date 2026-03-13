import type { OrderStatus } from '@depaneuria/types';

export interface OrderTransitionMetadata {
  orderId?: string;
  actor?: 'customer' | 'store' | 'driver' | 'system';
  reason?: string;
  at?: string;
}

export interface OrderTransitionEvent {
  type: 'order.transition';
  orderId: string;
  from: OrderStatus;
  to: OrderStatus;
  at: string;
  metadata?: Omit<OrderTransitionMetadata, 'at'>;
}

export function createTransitionEvent(
  orderId: string,
  from: OrderStatus,
  to: OrderStatus,
  at: string,
  metadata?: OrderTransitionMetadata
): OrderTransitionEvent {
  const { at: _ignored, ...restMetadata } = metadata ?? {};

  return {
    type: 'order.transition',
    orderId: metadata?.orderId ?? orderId,
    from,
    to,
    at,
    metadata: Object.keys(restMetadata).length ? restMetadata : undefined,
  };
}
