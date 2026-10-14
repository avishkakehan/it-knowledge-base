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
      className="flex w-full cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <p className="text-xs font-bold tracking-wider text-blue-600">
        {article.category}
      </p>
      <h3 className="mt-4 text-lg font-bold">{article.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">
        {article.description}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs text-slate-500">{article.time}</span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          {article.level}
        </span>
      </div>
      <span className="mt-4 text-sm font-semibold text-blue-600">
        Open guide <span aria-hidden="true">→</span>
      </span>
    </article>
  );
}
