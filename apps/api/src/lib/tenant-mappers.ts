import type { Tenant } from '@depaneuria/types';

export function mapTenant(t: Tenant) {
  return {
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description,
    active: t.active,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}
