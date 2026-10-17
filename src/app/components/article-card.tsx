import type { Article } from "../lib/knowledge";

type ArticleCardProps = {
  article: Article;
  onOpen: (article: Article) => void;
};

export function ArticleCard({ article, onOpen }: ArticleCardProps) {
  return (
    <article
      onClick={() => onOpen(article)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(article);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open guide: ${article.title}`}
      className="flex w-full cursor-pointer flex-col rounded-md border border-slate-200 bg-white p-6 text-left transition hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <p className="text-xs font-bold tracking-wider text-brand">
        {article.category}
      </p>
      <h3 className="mt-3 text-lg font-bold text-slate-900">{article.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
        {article.description}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs text-slate-500">{article.time}</span>
        <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {article.level}
        </span>
      </div>
      <span className="mt-4 text-sm font-semibold text-brand">
        Open guide <span aria-hidden="true">→</span>
      </span>
    </article>
  );
}
