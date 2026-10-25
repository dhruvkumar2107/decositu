export default function Loading() {
  return (
    <div className="container-luxe py-20" role="status" aria-label="Loading page">
      <div className="h-2 w-24 animate-pulse bg-line" />
      <div className="mt-5 h-14 w-full max-w-2xl animate-pulse bg-cream" />
      <div className="mt-3 h-4 w-full max-w-md animate-pulse bg-cream" />
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index}>
            <div className="aspect-[4/5] animate-pulse bg-cream" />
            <div className="mt-3 h-3 w-2/3 animate-pulse bg-cream" />
            <div className="mt-2 h-3 w-1/3 animate-pulse bg-cream" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
