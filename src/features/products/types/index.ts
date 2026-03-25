// @req FR-PROD-001

export interface Product {
  id: number
  title: string
  price: number
  rating: number
  stock: number
  brand?: string
  category: string
  sku?: string
  thumbnail: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export type SortField = 'price' | 'rating'
export type SortOrder = 'asc' | 'desc'
