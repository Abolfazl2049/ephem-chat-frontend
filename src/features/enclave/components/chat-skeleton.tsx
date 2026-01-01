export default function EnclaveChatSkeleton() {
  return (
    <div className="flex h-[calc(100vh-64px)] flex-col bg-black">
      {/* Skeleton Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/50 px-6 py-4">
        <div className="h-6 w-32 animate-pulse rounded-lg bg-zinc-800" />
      </div>

      {/* Skeleton Chat Area */}
      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4">
            {/* Avatar skeleton */}
            <div className="h-10 w-10 flex-shrink-0 animate-pulse rounded-full bg-zinc-800" />
            {/* Content skeleton */}
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
              <div className="space-y-2 rounded-lg bg-zinc-900/50 p-4">
                <div className="h-3 w-full animate-pulse rounded bg-zinc-800" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-zinc-800" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton Input */}
      <div className="border-t border-zinc-800 bg-zinc-950/50 p-4">
        <div className="h-24 animate-pulse rounded-lg bg-zinc-800" />
      </div>
    </div>
  );
}
