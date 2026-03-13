import type { OrderStatus } from '@depaneuria/types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  draft: 'Brouillon',
  submitted: 'Soumise',
  accepted: 'Acceptée',
  rejected: 'Rejetée',
  preparing: 'En préparation',
  ready_for_delivery: 'Prête',
  assigned_to_driver: 'Assignée au livreur',
  out_for_delivery: 'En livraison',
  delivered: 'Livrée',
  delivery_failed: 'Échec de livraison',
  cancelled: 'Annulée',
};

const STATUS_CLASSNAMES: Record<OrderStatus, string> = {
  draft: 'draft',
  submitted: 'submitted',
  accepted: 'accepted',
  rejected: 'rejected',
  preparing: 'preparing',
  ready_for_delivery: 'ready_for_delivery',
  assigned_to_driver: 'assigned_to_driver',
  out_for_delivery: 'out_for_delivery',
  delivered: 'delivered',
  delivery_failed: 'delivery_failed',
  cancelled: 'cancelled',
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span className={`status-badge ${STATUS_CLASSNAMES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
