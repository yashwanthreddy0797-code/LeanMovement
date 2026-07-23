export function PortalPageSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-10">
      <div>
        <div className="h-3 w-24 bg-surface" />
        <div className="mt-4 h-10 w-64 max-w-full bg-surface" />
        <div className="mt-3 h-4 w-96 max-w-full bg-surface/80" />
      </div>
      <div className="card-soft space-y-4 p-8">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-12 bg-surface" />
        ))}
      </div>
    </div>
  );
}
