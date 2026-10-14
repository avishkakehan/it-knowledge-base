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
    <main className="min-h-screen bg-[#f6f8fc] px-5 py-10 text-slate-800 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg px-4 py-2 font-semibold text-blue-600 hover:bg-blue-50"
          >
            ← {backLabel}
          </button>
          {showHubLink && (
            <Link
              href="/"
              className="rounded-lg px-4 py-2 font-semibold text-slate-500 hover:bg-slate-100"
            >
              Back to Knowledge Hub
            </Link>
          )}
        </div>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            {article.category}
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            {article.title}
          </h1>

          <p className="mt-4 leading-7 text-slate-500">
            {article.description}
          </p>

          <div className="mt-5 flex gap-3 text-sm text-slate-500">
            <span>{article.time}</span>
            <span>•</span>
            <span>{article.level}</span>
          </div>

          <hr className="my-8 border-slate-200" />

          <h2 className="text-xl font-bold">Troubleshooting steps</h2>

          <div className="mt-6 space-y-6">
            {article.steps.map((step, index) => (
              <section key={`${index}-${step.title}`} className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                  {index + 1}
                </div>

                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-2 leading-7 text-slate-600">
                    {step.description}
                  </p>
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-xl bg-amber-50 p-5">
            <h3 className="font-semibold text-amber-900">
              Still having problems?
            </h3>
            <p className="mt-2 text-sm leading-6 text-amber-800">
              Contact your IT support team if these steps do not solve the
              issue. Follow your company&apos;s IT procedures.
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="mt-8 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            {backLabel}
          </button>
        </article>
      </div>
    </main>
  );
}
