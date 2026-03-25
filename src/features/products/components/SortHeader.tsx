// @req FR-PROD-003, FR-PROD-004
import { ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SortField, SortOrder } from '@/features/products/types'

interface SortHeaderProps {
  label: string
  field: SortField
  currentSortBy: SortField | null
  currentOrder: SortOrder
  onSort: (field: SortField) => void
  className?: string
}

export const SortHeader = ({
  label,
  field,
  currentSortBy,
  currentOrder,
  onSort,
  className,
}: SortHeaderProps) => {
  const isActive = currentSortBy === field

  return (
    <button
      onClick={() => onSort(field)}
      className={cn(
        "inline-flex items-center gap-1 cursor-pointer select-none font-['Cairo',sans-serif] font-bold text-[16px] leading-none",
        isActive ? 'text-[#242edb]' : 'text-[#b2b3b9]',
        'hover:text-[#242edb] transition-colors',
        className,
      )}
    >
      {label}
      <span className="flex flex-col">
        <ChevronUp
          className={cn('h-3 w-3 -mb-1', isActive && currentOrder === 'asc' ? 'text-[#242edb]' : 'text-[#d0d0d0]')}
        />
        <ChevronDown
          className={cn('h-3 w-3', isActive && currentOrder === 'desc' ? 'text-[#242edb]' : 'text-[#d0d0d0]')}
        />
      </span>
    </button>
  )
}
