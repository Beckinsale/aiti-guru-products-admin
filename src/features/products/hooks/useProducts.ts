// @req FR-PROD-001, FR-PROD-003, FR-PROD-005
import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import api from '@/shared/api/axiosInstance'
import type { Product, ProductsResponse, SortField, SortOrder } from '@/features/products/types'

interface UseProductsParams {
  query: string
  sortBy: SortField | null
  order: SortOrder
}

export const useProducts = ({ query, sortBy, order }: UseProductsParams) => {
  const { data, refetch } = useSuspenseQuery({
    queryKey: ['products', query],
    queryFn: async (): Promise<Product[]> => {
      const url = query
        ? `/products/search?q=${encodeURIComponent(query)}&limit=100`
        : '/products?limit=100'
      const res = await api.get<ProductsResponse>(url)
      return res.data.products
    },
  })

  // Client-side sort: DummyJSON supports sortBy/order params too,
  // but client-side is more reliable for a test assignment (no dependency
  // on external API sort behaviour) and trivially switchable to server-side.
  const products = useMemo(() => {
    if (!sortBy) return data
    return [...data].sort((a, b) =>
      order === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy],
    )
  }, [data, sortBy, order])

  return { products, total: data.length, refetch }
}
