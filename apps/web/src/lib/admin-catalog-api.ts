import type { Category, CreateProductPayload, Product, ProductFilters, UpdateProductPayload } from '@depaneuria/types';
import { getSessionId } from './auth-storage';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const ADMIN_BASE = `${API_URL}/admin/catalog`;

interface ApiResponse<T> {
  success: true;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  error?: { message?: string; code?: string };
}

function buildQuery(filters: ProductFilters = {}) {
  const params = new URLSearchParams();
  if (filters.categoryId) params.set('categoryId', filters.categoryId);
  if (filters.availability) params.set('availability', filters.availability);
  if (filters.status) params.set('status', filters.status);
  if (typeof filters.popular === 'boolean') params.set('popular', String(filters.popular));
  if (filters.search) params.set('search', filters.search);
  const query = params.toString();
  return query ? `?${query}` : '';
}

function authHeaders(): HeadersInit {
  const sessionId = getSessionId();
  return sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${ADMIN_BASE}${path}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers ?? {}),
    },
  });

  const contentType = res.headers.get('Content-Type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? ((await res.json()) as ApiResponse<T> | ApiErrorResponse) : null;

  if (!res.ok || !payload || payload.success === false) {
    const message =
      (payload && 'error' in payload && payload.error?.message) || res.statusText || 'Requête échouée';
    throw new Error(message);
  }

  return payload.data;
}

export async function fetchCategories(): Promise<Category[]> {
  return request<Category[]>('/categories');
}

export async function fetchProducts(filters?: ProductFilters): Promise<Product[]> {
  return request<Product[]>(`/products${buildQuery(filters)}`);
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  return request<Product>('/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(
  productId: string,
  payload: UpdateProductPayload
): Promise<Product> {
  return request<Product>(`/products/${productId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateProductAvailability(
  productId: string,
  availability: Product['availability']
): Promise<Product> {
  return request<Product>(`/products/${productId}/availability`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ availability }),
  });
}

export async function updateProductStock(
  productId: string,
  stock: number,
  minStock?: number
): Promise<Product> {
  return request<Product>(`/products/${productId}/stock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock, minStock }),
  });
}

export async function updateProductPopularity(
  productId: string,
  popular: boolean
): Promise<Product> {
  return request<Product>(`/products/${productId}/popularity`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ popular }),
  });
}
