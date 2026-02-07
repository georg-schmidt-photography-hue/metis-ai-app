export default function LoadingSkeleton({ text = 'Analyzing trends...' }) {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-5 h-5 bg-[#FEF3C7] rounded-full" />
        <span className="text-sm text-[#D97706] font-medium">{text}</span>
      </div>
      <div className="h-4 bg-[#E8E4DD] rounded-lg w-3/4" />
      <div className="h-4 bg-[#E8E4DD] rounded-lg w-full" />
      <div className="h-4 bg-[#E8E4DD] rounded-lg w-5/6" />
      <div className="h-4 bg-[#F0EDE7] rounded-lg w-1/2 mt-6" />
      <div className="h-4 bg-[#E8E4DD] rounded-lg w-full" />
      <div className="h-4 bg-[#E8E4DD] rounded-lg w-4/5" />
      <div className="h-4 bg-[#E8E4DD] rounded-lg w-2/3" />
      <div className="h-4 bg-[#F0EDE7] rounded-lg w-3/5 mt-6" />
      <div className="h-4 bg-[#E8E4DD] rounded-lg w-full" />
      <div className="h-4 bg-[#E8E4DD] rounded-lg w-5/6" />
    </div>
  )
}
