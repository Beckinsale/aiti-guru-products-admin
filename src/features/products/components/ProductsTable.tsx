// @req FR-PROD-001, FR-PROD-003
import { useState, useCallback } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { SortHeader } from './SortHeader'
import { ProductRow } from './ProductRow'
import { useProducts } from '@/features/products/hooks/useProducts'
import type { SortField, SortOrder } from '@/features/products/types'

interface ProductsTableProps {
  query: string
  sortBy: SortField | null
  order: SortOrder
  onSort: (field: SortField) => void
}

export const ProductsTable = ({ query, sortBy, order, onSort }: ProductsTableProps) => {
  const { products } = useProducts({ query, sortBy, order })

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const allSelected = products.length > 0 && selectedIds.size === products.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < products.length

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedIds(checked ? new Set(products.map((p) => p.id)) : new Set())
    },
    [products],
  )

  const handleSelectOne = useCallback((id: number, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }, [])

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[900px]">
        {/* Header */}
        <div className="flex items-center h-[73px] px-[18px] border-b border-[#e2e2e2]">
          <div className="flex items-center gap-[18px] w-[296px] shrink-0">
            <Checkbox
              checked={allSelected}
              data-state={someSelected ? 'indeterminate' : allSelected ? 'checked' : 'unchecked'}
              onCheckedChange={(checked) => handleSelectAll(checked === true)}
            />
            <span className="font-['Cairo',sans-serif] font-bold text-[16px] text-[#b2b3b9] leading-none">
              Наименование
            </span>
          </div>

          <div className="flex items-center flex-1 justify-between">
            <div className="w-[125px] text-center shrink-0">
              <span className="font-['Cairo',sans-serif] font-bold text-[16px] text-[#b2b3b9] leading-none">
                Вендор
              </span>
            </div>
            <div className="w-[160px] text-center shrink-0">
              <span className="font-['Cairo',sans-serif] font-bold text-[16px] text-[#b2b3b9] leading-none">
                Артикул
              </span>
            </div>
            <div className="w-[125px] flex justify-center shrink-0">
              <SortHeader
                label="Оценка"
                field="rating"
                currentSortBy={sortBy}
                currentOrder={order}
                onSort={onSort}
              />
            </div>
            <div className="w-[160px] flex justify-center shrink-0">
              <SortHeader
                label="Цена, ₽"
                field="price"
                currentSortBy={sortBy}
                currentOrder={order}
                onSort={onSort}
              />
            </div>
            <div className="w-[133px] shrink-0" />
          </div>
        </div>

        {/* Rows */}
        {products.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-[#b2b3b9] font-['Inter',sans-serif] text-[16px]">
              {query ? `По запросу «${query}» ничего не найдено` : 'Товары не найдены'}
            </p>
          </div>
        ) : (
          products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              isSelected={selectedIds.has(product.id)}
              onSelect={handleSelectOne}
            />
          ))
        )}
      </div>
    </div>
  )
}
