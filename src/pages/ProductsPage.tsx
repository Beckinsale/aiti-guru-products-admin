// @req FR-PROD-001..009
import { Suspense, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { RefreshCw, PlusCircle } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/features/products/components/SearchInput'
import { ProductsTable } from '@/features/products/components/ProductsTable'
import { SkeletonTable } from '@/features/products/components/SkeletonRow'
import { ErrorState } from '@/features/products/components/ErrorState'
import { AddProductModal } from '@/features/products/components/AddProductModal'
import type { SortField, SortOrder } from '@/features/products/types'

// @req FR-PROD-009 — refresh by invalidating the query cache
const useRefresh = (query: string) => {
  const queryClient = useQueryClient()
  return useCallback(() => {
    void queryClient.resetQueries({ queryKey: ['products', query] })
  }, [queryClient, query])
}

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [modalOpen, setModalOpen] = useState(false)

  // @req FR-PROD-004 — sort state in URL
  const sortBy = (searchParams.get('sortBy') as SortField | null) ?? null
  const order = (searchParams.get('order') as SortOrder) || 'asc'
  // @req FR-PROD-005 — search query from URL (debounce happens in SearchInput)
  const query = searchParams.get('q') ?? ''

  const refresh = useRefresh(query)

  // @req FR-PROD-003 — toggle sort: same field → flip order; new field → asc
  const handleSort = useCallback(
    (field: SortField) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (field === sortBy) {
          next.set('order', order === 'asc' ? 'desc' : 'asc')
        } else {
          next.set('sortBy', field)
          next.set('order', 'asc')
        }
        return next
      })
    },
    [sortBy, order, setSearchParams],
  )

  const handleSearch = useCallback(
    (value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (value) next.set('q', value)
        else next.delete('q')
        return next
      })
    },
    [setSearchParams],
  )

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex flex-col gap-[30px] py-[20px]">
      {/* Navbar */}
      <div className="bg-white rounded-[10px] mx-[30px] h-[105px] flex items-center justify-between px-[30px]">
        <h1 className="font-['Cairo',sans-serif] font-bold text-[24px] text-[#202020] leading-none">
          Товары
        </h1>
        {/* @req FR-PROD-005 */}
        <SearchInput value={query} onChange={handleSearch} />
        <div className="w-[93px]" /> {/* spacer to balance heading */}
      </div>

      {/* Content card */}
      <div className="bg-white rounded-[12px] mx-[30px] flex flex-col gap-[30px] p-[30px]">
        {/* Card header */}
        <div className="flex items-center justify-between">
          <h2 className="font-['Cairo',sans-serif] font-bold text-[20px] text-[#333] leading-[20px]">
            Все позиции
          </h2>
          <div className="flex items-center gap-[8px]">
            {/* @req FR-PROD-009 */}
            <button
              onClick={refresh}
              className="bg-white border border-[#ececeb] rounded-[8px] p-[10px] hover:bg-gray-50 transition-colors cursor-pointer"
              aria-label="Обновить"
            >
              <RefreshCw className="h-[22px] w-[22px] text-[#333]" />
            </button>
            {/* @req FR-PROD-006 */}
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-[#242edb] hover:bg-[#1d26c5] rounded-[6px] px-[20px] py-[10px] h-auto gap-[8px]"
            >
              <PlusCircle className="h-[22px] w-[22px]" />
              <span className="font-['Cairo',sans-serif] font-semibold text-[14px]">Добавить</span>
            </Button>
          </div>
        </div>

        {/* Table with Suspense + ErrorBoundary */}
        <ErrorBoundary
          fallbackRender={({ resetErrorBoundary }) => (
            <ErrorState
              message="Не удалось загрузить данные"
              onRetry={resetErrorBoundary}
            />
          )}
        >
          <Suspense fallback={<SkeletonTable rows={10} />}>
            <ProductsTable
              query={query}
              sortBy={sortBy}
              order={order}
              onSort={handleSort}
            />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* @req FR-PROD-006 */}
      <AddProductModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

export default ProductsPage
