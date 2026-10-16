export function ArticleCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex w-full animate-pulse flex-col rounded-md border border-slate-200 bg-white p-6"
    >
      <div className="h-3 w-24 rounded bg-slate-200" />
      <div className="mt-3 h-5 w-3/4 rounded bg-slate-200" />
      <div className="mt-2 space-y-2">
        <div className="h-3.5 w-full rounded bg-slate-100" />
        <div className="h-3.5 w-5/6 rounded bg-slate-100" />
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="h-3 w-16 rounded bg-slate-100" />
        <div className="h-5 w-16 rounded bg-slate-100" />
      </div>
      <div className="mt-4 h-3.5 w-24 rounded bg-slate-100" />
    </div>
  );
}

export function ArticleCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ArticleCardSkeleton key={`article-skeleton-${index}`} />
      ))}
    </>
  );
}
