// @req FR-PROD-002

const SkeletonRow = () => (
  <div className="flex items-center gap-4 px-[18px] h-[71px] border-b border-[#e2e2e2] animate-pulse">
    <div className="w-[22px] h-[22px] rounded bg-gray-200 shrink-0" />
    <div className="w-[48px] h-[48px] rounded-lg bg-gray-200 shrink-0 ml-[18px]" />
    <div className="flex flex-col gap-2 w-[150px]">
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-2 bg-gray-100 rounded w-2/3" />
    </div>
    <div className="flex-1 flex gap-8 justify-center">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-3 bg-gray-200 rounded w-[100px]" />
      ))}
    </div>
  </div>
)

interface SkeletonTableProps {
  rows?: number
}

export const SkeletonTable = ({ rows = 10 }: SkeletonTableProps) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </>
)
