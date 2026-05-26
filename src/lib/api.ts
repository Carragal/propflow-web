import { useAuthStore } from '@/store/useAuthStore'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID ?? ''

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function getHeaders(extraHeaders?: HeadersInit): Record<string, string> {
  const token =
    typeof window !== 'undefined' ? useAuthStore.getState().accessToken : null
  return {
    'Content-Type': 'application/json',
    'x-tenant-id': TENANT_ID,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extraHeaders as Record<string, string>),
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: getHeaders(init?.headers),
  })

  const body = await res.json().catch(() => null)

  if (!res.ok) {
    const code = body?.error?.code ?? 'UNKNOWN_ERROR'
    const message = body?.error?.message ?? `Error ${res.status}`
    throw new ApiError(code, message, res.status)
  }

  // Paginated envelope: { success, data: [...], meta: {...} }
  if (body?.meta !== undefined && body?.data !== undefined) {
    return { items: body.data, meta: body.meta } as T
  }
  // Standard envelope: { success, data: ... }
  return (body?.data ?? body) as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

/** Fetch sin auth, para server components (SSR) */
export async function serverFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'x-tenant-id': TENANT_ID },
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const body = await res.json()
    if (body?.meta !== undefined && body?.data !== undefined) {
      return { items: body.data, meta: body.meta } as T
    }
    return (body?.data ?? body) as T
  } catch {
    return null
  }
}
