import { DEFAULT_TENANT } from '@/lib/constants'
import type { Tenant } from '@/types/tenant'

// TODO: fetch from API based on subdomain/hostname
export function useTenant(): Tenant {
  return DEFAULT_TENANT
}
