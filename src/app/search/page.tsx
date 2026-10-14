"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArticleCard } from "../components/article-card";
import { ArticleDetail } from "../components/article-detail";
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
    <main className="min-h-screen bg-[#f6f8fc] text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
              IT
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">
                IT Knowledge Hub
              </p>
              <p className="text-xs text-slate-500">
                STERLING STEELS . IT SUPPORT
              </p>
            </div>
          </Link>

          <span className="hidden rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 sm:block">
            Self-Service Support
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-8">
        <Link
          href="/"
          className="inline-block rounded-lg px-4 py-2 font-semibold text-blue-600 hover:bg-blue-50"
        >
          ← Back to Knowledge Hub
        </Link>

        <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-blue-600">
          Search results
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {query === "" ? "Search guides" : `Results for “${query}”`}
        </h1>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            const next = input.trim();
            router.push(next === "" ? "/search" : `/search?q=${encodeURIComponent(next)}`);
          }}
          className="mt-6 flex max-w-2xl items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
        >
          <span className="pl-3 text-xl text-slate-400" aria-hidden="true">
            ⌕
          </span>
          <input
            type="search"
            name="q"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Search Outlook, printer, Wi-Fi..."
            aria-label="Search guides"
            className="min-w-0 flex-1 bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
          />
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
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
        <div className="grid gap-5 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              <p className="font-semibold">Loading guides…</p>
              <p className="mt-2 text-sm">
                Searching published guides in Supabase.
              </p>
            </div>
          ) : fetchError ? (
            <div className="col-span-full rounded-xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="font-semibold text-red-800">
                Could not load guides.
              </p>
              <p className="mt-2 text-sm leading-6 text-red-700">
                {fetchError}
              </p>
              <button
                type="button"
                onClick={loadArticles}
                className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Try again
              </button>
            </div>
          ) : query === "" ? (
            <div className="col-span-full rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              <p>Enter a keyword above to find troubleshooting guides.</p>
              <Link
                href="/"
                className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                ← Back to Knowledge Hub
              </Link>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="col-span-full rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              <p>
                No matching articles for “{query}”. Try another keyword.
              </p>
              <Link
                href="/"
                className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
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

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>IT Knowledge Hub · Sterling Steels</p>
          <p>Learn, troubleshoot and work smarter.</p>
        </div>
      </footer>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f6f8fc] px-5 py-10 text-slate-800 sm:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            <p className="font-semibold">Loading search…</p>
          </div>
        </main>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
