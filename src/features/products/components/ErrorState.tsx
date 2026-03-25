// @req FR-PROD-002
interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <p className="text-[#333] text-base font-['Inter',sans-serif]">{message}</p>
    <button
      onClick={onRetry}
      className="px-6 py-2 bg-[#242edb] text-white text-sm font-medium rounded-lg hover:bg-[#1d26c5] transition cursor-pointer"
    >
      Повторить
    </button>
  </div>
)
