import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/useAuthStore'

interface FavoriteItem {
  id: string
  propertyId: string
}

export function useFavorites() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: favorites = [] } = useQuery<FavoriteItem[]>({
    queryKey: ['favorites'],
    queryFn: () => api.get<FavoriteItem[]>('/favorites'),
    enabled: !!user,
    staleTime: 1000 * 30,
  })

  const favoriteIds = new Set(favorites.map((f) => f.propertyId))

  const toggle = useMutation({
    mutationFn: (propertyId: string) => api.post(`/favorites/${propertyId}`, {}),
    onMutate: async (propertyId) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] })
      const prev = queryClient.getQueryData<FavoriteItem[]>(['favorites']) ?? []
      if (favoriteIds.has(propertyId)) {
        queryClient.setQueryData(['favorites'], prev.filter((f) => f.propertyId !== propertyId))
      } else {
        queryClient.setQueryData<FavoriteItem[]>(['favorites'], [...prev, { id: 'optimistic', propertyId }])
      }
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      queryClient.setQueryData(['favorites'], ctx?.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })

  return {
    isFavorite: (propertyId: string) => favoriteIds.has(propertyId),
    toggle: (propertyId: string) => toggle.mutate(propertyId),
    isPending: toggle.isPending,
    isLoggedIn: !!user,
  }
}
