// @req FR-PROD-001, FR-PROD-007, FR-PROD-008
import { memo } from 'react'
import { MoreHorizontal, Plus } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import type { Product } from '@/features/products/types'

interface ProductRowProps {
  product: Product
  isSelected: boolean
  onSelect: (id: number, checked: boolean) => void
}

const formatPrice = (price: number): { main: string; dec: string } => {
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
  const commaIdx = formatted.lastIndexOf(',')
  return {
    main: formatted.slice(0, commaIdx),
    dec: formatted.slice(commaIdx),
  }
}

export const ProductRow = memo(({ product, isSelected, onSelect }: ProductRowProps) => {
  const { main, dec } = formatPrice(product.price)
  const isLowRating = product.rating < 3.5
  const sku = product.sku ?? `SKU-${product.id}`

  return (
    <div className="flex items-center h-[71px] border-b border-[#e2e2e2] px-[18px] hover:bg-gray-50 transition-colors">
      {/* Product column */}
      <div className="flex items-center gap-[18px] w-[296px] shrink-0">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(product.id, checked === true)}
        />
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-[48px] h-[48px] rounded-[8px] object-cover border border-[#ececeb] shrink-0"
        />
        <div className="flex flex-col gap-[6px] min-w-0">
          <p className="font-['Cairo',sans-serif] font-bold text-[16px] text-[#161919] leading-none truncate">
            {product.title}
          </p>
          <p className="font-['Cairo',sans-serif] font-normal text-[14px] text-[#b2b3b9] leading-none truncate">
            {product.category}
          </p>
        </div>
      </div>

      {/* Details columns */}
      <div className="flex items-center flex-1 justify-between">
        {/* Vendor */}
        <div className="w-[125px] text-center shrink-0">
          <p className="font-['Open_Sans',sans-serif] font-bold text-[16px] text-black leading-none truncate">
            {product.brand ?? '—'}
          </p>
        </div>

        {/* SKU */}
        <div className="w-[160px] text-center shrink-0">
          <p className="font-['Open_Sans',sans-serif] font-normal text-[16px] text-black leading-none truncate">
            {sku}
          </p>
        </div>

        {/* Rating — @req FR-PROD-007 */}
        <div className="w-[125px] text-center shrink-0">
          <p className="font-['Open_Sans',sans-serif] font-normal text-[16px] leading-none">
            <span className={isLowRating ? 'text-[#f11010]' : 'text-black'}>
              {product.rating.toFixed(1)}
            </span>
            <span className="text-black">/5</span>
          </p>
        </div>

        {/* Price */}
        <div className="w-[160px] text-center shrink-0">
          <p className="font-['Roboto_Mono',monospace] font-normal text-[16px] leading-none">
            <span className="text-[#222]">{main}</span>
            <span className="text-[#999]">{dec}</span>
          </p>
        </div>

        {/* Actions — @req FR-PROD-008 */}
        <div className="flex items-center justify-center gap-[8px] w-[133px] shrink-0">
          <button
            className="bg-[#242edb] flex items-center justify-center w-[52px] h-[27px] rounded-[23px] hover:bg-[#1d26c5] transition-colors cursor-pointer"
            aria-label="Добавить"
          >
            <Plus className="h-4 w-4 text-white" />
          </button>
          <button
            className="flex items-center justify-center w-[32px] h-[32px] rounded-full border border-[#ececeb] hover:bg-gray-50 transition-colors cursor-pointer"
            aria-label="Действия"
          >
            <MoreHorizontal className="h-5 w-5 text-[#b2b3b9]" />
          </button>
        </div>
      </div>
    </div>
  )
})

ProductRow.displayName = 'ProductRow'
