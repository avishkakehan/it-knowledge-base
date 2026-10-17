"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { categories } from "./lib/knowledge";

export default function Home() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function goToSearchResults() {
    const query = search.trim();
    if (query === "") return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <main className="min-h-screen bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-200">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-paper dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-bold tracking-widest text-brand">
              STERLING STEELS · IT SUPPORT
            </p>

            <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              Find a solution.
              <br />
              Fix the problem.
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-400">
              Step-by-step guides to help you solve common IT problems
              and get back to work.
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                goToSearchResults();
              }}
              className="mt-8 flex max-w-2xl items-center gap-2 rounded-md border border-slate-300 bg-white p-1.5 dark:border-slate-700 dark:bg-slate-800"
            >
              <span className="pl-3 text-lg text-slate-400" aria-hidden="true">
                ⌕
              </span>
              <input
                type="search"
                name="q"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search Outlook, printer, Wi-Fi..."
                aria-label="Search guides"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base dark:text-slate-200"
              />
              <button
                type="submit"
                className="rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                Search
              </button>
            </form>

            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Popular searches: Outlook errors · Printer offline · No internet
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest text-brand">
            BROWSE THE LIBRARY
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            What do you need help with?
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Choose a category to explore troubleshooting guides.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group w-full rounded-md border border-slate-200 bg-white p-6 text-left transition hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded bg-slate-100 text-xl text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  {category.icon}
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {category.count}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                {category.title}
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {category.description}
              </p>
              <p className="mt-4 text-sm font-semibold text-brand">
                Explore guides <span aria-hidden="true">→</span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
