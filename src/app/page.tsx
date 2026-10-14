"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { categories, categoryStyles } from "./lib/knowledge";

export default function Home() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function goToSearchResults() {
    const query = search.trim();
    if (query === "") return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
              IT
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                IT Knowledge Hub
              </h1>
              <p className="text-xs text-slate-500">
                STERLING STEELS . IT SUPPORT
              </p>
            </div>
          </a>

          <span className="hidden rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 sm:block">
            Self-Service Support
          </span>
        </div>
      </header>

      <section className="bg-[#101d35]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1.5 text-sm text-blue-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Your workplace IT assistant
            </div>

            <h2 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
              Find a solution.
              <br />
              <span className="text-blue-400">Fix the problem.</span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Simple, step-by-step guides to help you solve common IT problems
              and get back to work.
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                goToSearchResults();
              }}
              className="mt-8 flex max-w-2xl items-center gap-3 rounded-2xl bg-white p-2 shadow-xl"
            >
              <span className="pl-3 text-xl text-slate-400">⌕</span>
              <input
                type="search"
                name="q"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
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

            <p className="mt-4 text-sm text-slate-400">
              Popular searches: Outlook errors · Printer offline · No internet
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Browse the library
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              What do you need help with?
            </h2>
            <p className="mt-2 text-slate-500">
              Choose a category to explore troubleshooting guides.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group w-full rounded-2xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${categoryStyles[category.color]}`}
                >
                  {category.icon}
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {category.count}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-bold group-hover:text-blue-600">
                {category.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {category.description}
              </p>
              <p className="mt-5 text-sm font-semibold text-blue-600">
                Explore guides <span aria-hidden="true">→</span>
              </p>
            </Link>
          ))}
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
