export function PortalPageSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-10 animate-pulse">
      <div>
        <div className="h-3 w-24 bg-[#F5F5F5] rounded" />
        <div className="mt-4 h-10 w-64 max-w-full bg-[#F5F5F5] rounded" />
        <div className="mt-3 h-4 w-96 max-w-full bg-[#FAFAFA] rounded" />
      </div>
      <div className="card-soft p-8 space-y-4">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-12 bg-[#FAFAFA] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
