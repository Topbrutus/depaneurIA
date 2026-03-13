import type { OrderStatus, OrderStatusHistory } from '@depaneuria/types';
import { ORDER_STATUSES } from '@depaneuria/types';
import { ValidationError } from './errors';
import {
  ORDER_TRANSITIONS,
  allowedTargets,
  canTransition,
  normalizeStatus,
} from './order-transitions';
import {
  createTransitionEvent,
  type OrderTransitionEvent,
  type OrderTransitionMetadata,
} from './order-events';

export interface OrderStateInput {
  id?: string;
  status: OrderStatus;
  statusHistory?: OrderStatusHistory | null;
}

export interface ApplyTransitionResult {
  nextStatus: OrderStatus;
  statusHistory: OrderStatusHistory;
  transitionedAt: string;
  event: OrderTransitionEvent;
}

export function ensureStatus(rawStatus: string): OrderStatus {
  const normalized = normalizeStatus(rawStatus);
  if (normalized) {
    return normalized;
  }

  throw new ValidationError(
    `Statut invalide: ${rawStatus} (attendus: ${ORDER_STATUSES.join(', ')})`
  );
}

export function normalizeStatusHistory(input: unknown): OrderStatusHistory {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {};
  }

  const entries = Object.entries(input as Record<string, unknown>).flatMap(
    ([rawStatus, rawTimestamp]) => {
      const status = normalizeStatus(rawStatus);
      if (!status || typeof rawTimestamp !== 'string') {
        return [];
      }
      return [[status, rawTimestamp] as const];
    }
  );

  return Object.fromEntries(entries);
}

export function buildInitialHistory(status: OrderStatus, at: string): OrderStatusHistory {
  return { [status]: at };
}

export function applyTransition(
  order: OrderStateInput,
  targetStatus: OrderStatus,
  metadata?: OrderTransitionMetadata
): ApplyTransitionResult {
  const currentStatus = order.status;

  if (!canTransition(currentStatus, targetStatus)) {
    const expected = allowedTargets(currentStatus);
    const expectedMsg = expected.length ? expected.join(', ') : 'aucune';
    throw new ValidationError(
      `Transition ${currentStatus} -> ${targetStatus} non autorisée. Transitions permises: ${expectedMsg}.`
    );
  }

  const transitionedAt = metadata?.at ?? new Date().toISOString();
  const baseHistory = normalizeStatusHistory(order.statusHistory);
  const statusHistory: OrderStatusHistory = {
    ...baseHistory,
    [targetStatus]: transitionedAt,
  };

  const event = createTransitionEvent(
    metadata?.orderId ?? order.id ?? 'unknown',
    currentStatus,
    targetStatus,
    transitionedAt,
    metadata
  );

  return {
    nextStatus: targetStatus,
    statusHistory,
    transitionedAt,
    event,
  };
}
