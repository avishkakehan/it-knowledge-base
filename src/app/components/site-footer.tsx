import Link from "next/link";
import { categories } from "../lib/knowledge";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-slate-300 dark:bg-slate-900 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-bold tracking-wide text-white dark:text-slate-200">
              IT KNOWLEDGE HUB
            </p>
            <p className="mt-1 text-xs font-semibold tracking-widest text-slate-400 dark:text-slate-500">
              STERLING STEELS · IT SUPPORT
            </p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400 dark:text-slate-500">
              Step-by-step troubleshooting guides for everyday workplace IT
              issues.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm"
          >
            <Link href="/" className="text-slate-300 hover:text-white dark:text-slate-400 dark:hover:text-slate-200">
              Home
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="text-slate-300 hover:text-white dark:text-slate-400 dark:hover:text-slate-200"
              >
                {category.title}
              </Link>
            ))}
            <Link href="/search" className="text-slate-300 hover:text-white dark:text-slate-400 dark:hover:text-slate-200">
              Search guides
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-600">
          Learn, troubleshoot and work smarter.
        </div>
      </div>
    </footer>
  );
}
