import type { OrderStatus } from '@depaneuria/types';

interface DeliveryStatusBadgeProps {
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
  delivery_failed: 'Échec livraison',
  cancelled: 'Annulée',
};

export function DeliveryStatusBadge({ status }: DeliveryStatusBadgeProps) {
  return (
    <span className={`status-badge status-badge-${status}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
