"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArticleCard } from "../components/article-card";
import { ArticleDetail } from "../components/article-detail";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import {
  fetchPublishedArticles,
  filterArticles,
  type Article,
} from "../lib/knowledge";

const LOAD_ERROR_MESSAGE =
  "Could not load guides right now. Please check your connection and try again.";

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "";

  const [input, setInput] = useState(initialQuery);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Keep the input in sync when the URL query changes.
  useEffect(() => {
    setInput(initialQuery);
  }, [initialQuery]);

  async function loadArticles() {
    setLoading(true);
    setFetchError(null);
    try {
      setArticles(await fetchPublishedArticles());
    } catch {
      setArticles([]);
      setFetchError(LOAD_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchPublishedArticles();
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
  }, []);

  if (selectedArticle) {
    return (
      <ArticleDetail
        article={selectedArticle}
        backLabel="Back to search results"
        onBack={() => setSelectedArticle(null)}
        showHubLink
      />
    );
  }

  const query = initialQuery.trim();
  const filteredArticles = filterArticles(articles, initialQuery);

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
          Search results
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {query === "" ? "Search guides" : `Results for “${query}”`}
        </h1>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            const next = input.trim();
            router.push(next === "" ? "/search" : `/search?q=${encodeURIComponent(next)}`);
          }}
          className="mt-6 flex max-w-2xl items-center gap-2 rounded-md border border-slate-300 bg-white p-1.5"
        >
          <span className="pl-3 text-lg text-slate-400" aria-hidden="true">
            ⌕
          </span>
          <input
            type="search"
            name="q"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Search Outlook, printer, Wi-Fi..."
            aria-label="Search guides"
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
            : query === ""
              ? "Type a keyword above to search all published guides."
              : `Showing ${filteredArticles.length} of ${articles.length} guides matching “${query}”.`}
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full rounded-md border border-slate-200 bg-white p-8 text-center text-slate-500">
              <p className="font-semibold text-slate-700">Loading guides…</p>
              <p className="mt-2 text-sm">
                Searching published guides in Supabase.
              </p>
            </div>
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
          ) : query === "" ? (
            <div className="col-span-full rounded-md border border-slate-200 bg-white p-8 text-center text-slate-500">
              <p>Enter a keyword above to find troubleshooting guides.</p>
              <Link
                href="/"
                className="mt-4 inline-block rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                ← Back to Knowledge Hub
              </Link>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="col-span-full rounded-md border border-slate-200 bg-white p-8 text-center text-slate-500">
              <p>
                No matching articles for “{query}”. Try another keyword.
              </p>
              <Link
                href="/"
                className="mt-4 inline-block rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                ← Back to Knowledge Hub
              </Link>
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

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-paper px-5 py-10 text-slate-800 sm:px-8">
          <div className="mx-auto max-w-3xl rounded-md border border-slate-200 bg-white p-8 text-center text-slate-500">
            <p className="font-semibold text-slate-700">Loading search…</p>
          </div>
        </main>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
