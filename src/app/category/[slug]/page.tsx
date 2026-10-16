"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArticleCard } from "../../components/article-card";
import { ArticleCardSkeletonGrid } from "../../components/article-card-skeleton";
import { ArticleDetail } from "../../components/article-detail";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import {
  fetchArticlesByCategory,
  filterArticles,
  getCategoryBySlug,
  type Article,
} from "../../lib/knowledge";

const LOAD_ERROR_MESSAGE =
  "Could not load guides right now. Please check your connection and try again.";

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const category = getCategoryBySlug(slug ?? "");

  const [search, setSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  async function loadArticles() {
    if (!category) return;
    setLoading(true);
    setFetchError(null);
    try {
      setArticles(await fetchArticlesByCategory(category.dbCategory));
    } catch {
      setArticles([]);
      setFetchError(LOAD_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!category) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchArticlesByCategory(category.dbCategory);
        if (!cancelled) setArticles(rows);
      } catch {
        if (!cancelled) {
          setArticles([]);
          setFetchError(LOAD_ERROR_MESSAGE);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [category]);

  if (!category) {
    return (
      <main className="min-h-screen bg-paper px-5 py-10 text-slate-800 sm:px-8">
        <div className="mx-auto max-w-3xl rounded-md border border-slate-200 bg-white p-8 text-center sm:p-10">
          <p className="text-xs font-bold uppercase tracking-widest text-brand">
            Category not found
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            We couldn&apos;t find that category.
          </h1>
          <p className="mt-3 leading-7 text-slate-600">
            The link may be outdated. Browse the Knowledge Hub to find the
            guide you need.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            ← Back to Knowledge Hub
          </Link>
        </div>
      </main>
    );
  }

  if (selectedArticle) {
    return (
      <ArticleDetail
        article={selectedArticle}
        backLabel={`Back to ${category.title}`}
        onBack={() => setSelectedArticle(null)}
        showHubLink
      />
    );
  }

  const filteredArticles = filterArticles(articles, search);

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-8">
        <Link
          href="/"
          className="inline-block rounded px-3 py-2 text-sm font-semibold text-brand hover:bg-red-50"
        >
          ← Back to Knowledge Hub
        </Link>

        <p className="mt-6 text-xs font-bold uppercase tracking-widest text-brand">
          {category.dbCategory}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {category.title}
        </h1>
        <p className="mt-2 max-w-2xl leading-7 text-slate-600">
          {category.description}
        </p>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="mt-6 flex max-w-2xl items-center gap-2 rounded-md border border-slate-300 bg-white p-1.5"
        >
          <span className="pl-3 text-lg text-slate-400" aria-hidden="true">
            ⌕
          </span>
          <input
            type="search"
            name="q"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${category.title} guides...`}
            aria-label={`Search ${category.title} guides`}
            className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
          />
          <button
            type="submit"
            className="rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Search
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-500">
          {loading
            ? "Loading guides…"
            : search.trim() !== ""
              ? `Showing ${filteredArticles.length} of ${articles.length} guides in ${category.title} matching “${search.trim()}”.`
              : `Showing ${articles.length} ${articles.length === 1 ? "guide" : "guides"} in ${category.title}.`}
        </p>
        {search.trim() !== "" && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="mt-2 rounded px-3 py-2 text-sm font-semibold text-brand hover:bg-red-50"
          >
            Clear search ✕
          </button>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div
          className="grid gap-4 lg:grid-cols-3"
          aria-busy={loading}
          aria-live="polite"
        >
          {loading ? (
            <ArticleCardSkeletonGrid count={6} />
          ) : fetchError ? (
            <div className="col-span-full rounded-md border border-red-200 bg-red-50 p-8 text-center">
              <p className="font-semibold text-red-800">
                Could not load guides.
              </p>
              <p className="mt-2 text-sm leading-6 text-red-700">
                {fetchError}
              </p>
              <button
                type="button"
                onClick={loadArticles}
                className="mt-4 rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Try again
              </button>
            </div>
          ) : articles.length === 0 ? (
            <div className="col-span-full rounded-md border border-slate-200 bg-white p-8 text-center text-slate-500">
              <p className="text-lg font-bold text-slate-900">
                No guides in {category.title} yet.
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6">
                There are no published articles in this category right now.
                Please check back later or browse the full Knowledge Hub.
              </p>
              <Link
                href="/"
                className="mt-4 inline-block rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                ← Back to Knowledge Hub
              </Link>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="col-span-full rounded-md border border-slate-200 bg-white p-8 text-center text-slate-500">
              <p>No matching articles in {category.title}. Try another keyword.</p>
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-4 rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Clear search
              </button>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <ArticleCard
                key={article.title}
                article={article}
                onOpen={setSelectedArticle}
              />
            ))
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
