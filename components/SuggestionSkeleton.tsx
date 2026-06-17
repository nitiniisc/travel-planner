export default function SuggestionSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/90 shadow-lg backdrop-blur-sm">
      <div className="h-24 animate-pulse bg-gradient-to-br from-blue-200 to-teal-200" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
        <div className="flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-4/6 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="mt-4 h-9 w-full animate-pulse rounded-full bg-gray-200" />
      </div>
    </div>
  );
}
