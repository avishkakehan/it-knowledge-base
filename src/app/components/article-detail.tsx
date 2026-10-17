import Link from "next/link";
import type { Article } from "../lib/knowledge";

type ArticleDetailProps = {
  article: Article;
  /** e.g. "Back to Printers" or "Back to Knowledge Hub" */
  backLabel: string;
  onBack: () => void;
  /** When true, also show an explicit "Back to Knowledge Hub" link */
  showHubLink?: boolean;
};

export function ArticleDetail({
  article,
  backLabel,
  onBack,
  showHubLink = false,
}: ArticleDetailProps) {
  return (
    <main className="min-h-screen bg-paper px-5 py-10 text-slate-800 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="rounded px-3 py-2 text-sm font-semibold text-brand hover:bg-red-50"
          >
            ← {backLabel}
          </button>
          {showHubLink && (
            <Link
              href="/"
              className="rounded px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100"
            >
              Back to Knowledge Hub
            </Link>
          )}
        </div>

        <article className="rounded-md border border-slate-200 bg-white p-6 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-wider text-brand">
            {article.category}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {article.title}
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            {article.description}
          </p>

          <div className="mt-5 flex gap-3 text-sm text-slate-500">
            <span>{article.time}</span>
            <span aria-hidden="true">•</span>
            <span>{article.level}</span>
          </div>

          <hr className="my-8 border-slate-200" />

          <h2 className="text-xl font-bold text-slate-900">
            Troubleshooting steps
          </h2>

          <ol className="mt-6 space-y-6">
            {article.steps.map((step, index) => (
              <li key={`${index}-${step.title}`} className="flex gap-4">
                <div
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-slate-300 text-sm font-bold text-slate-700"
                >
                  {index + 1}
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-1.5 leading-7 text-slate-600">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-md border border-slate-200 bg-slate-50 p-5">
            <h3 className="font-semibold text-slate-900">
              Still having problems?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Contact your IT support team if these steps do not solve the
              issue. Follow your company&apos;s IT procedures.
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="mt-8 rounded bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            {backLabel}
          </button>
        </article>
      </div>
    </main>
  );
}
