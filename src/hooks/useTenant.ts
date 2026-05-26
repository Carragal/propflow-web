import { DEFAULT_TENANT } from '@/lib/constants'
import type { Tenant } from '@/types/tenant'

export function useTenant(): Tenant {
  return {
    ...DEFAULT_TENANT,
    id: process.env.NEXT_PUBLIC_TENANT_ID ?? DEFAULT_TENANT.id,
  }
}
