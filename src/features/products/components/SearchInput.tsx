// @req FR-PROD-005
import { useEffect, useState } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export const SearchInput = ({ value, onChange }: SearchInputProps) => {
  const [local, setLocal] = useState(value)

  // Debounce: 300ms after user stops typing → propagate to parent
  useEffect(() => {
    const timer = setTimeout(() => onChange(local), 300)
    return () => clearTimeout(timer)
  }, [local, onChange])

  // Sync if parent resets the value (e.g. clear from URL)
  useEffect(() => {
    setLocal(value)
  }, [value])

  return (
    <div className="flex items-center gap-2 bg-[#f3f3f3] rounded-[8px] px-5 py-3 w-[1023px] max-w-full">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <circle cx="10.5" cy="10.5" r="6.5" stroke="#999" strokeWidth="1.5" />
        <path d="M15.5 15.5L20 20" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="Найти  "
        className="flex-1 bg-transparent text-[14px] text-[#333] placeholder-[#999] outline-none font-['Inter',sans-serif] leading-6"
      />
      {local && (
        <button
          onClick={() => { setLocal(''); onChange('') }}
          className="text-[#999] hover:text-[#666] leading-none cursor-pointer"
          aria-label="Очистить поиск"
        >
          ✕
        </button>
      )}
    </div>
  )
}
