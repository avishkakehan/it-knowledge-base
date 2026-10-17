"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { categories } from "../lib/knowledge";

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`whitespace-nowrap px-3 py-2 text-sm font-medium transition ${
        active
          ? "text-brand"
          : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ? stored === "dark" : prefersDark;
    setDark(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/Logo.png"
            alt="Sterling Steels logo"
            width={85}
            height={50}
            className="h-[50px] w-auto object-contain"
            priority
          />
          <span>
            <span className="block text-base font-bold tracking-tight text-slate-900 dark:text-white">
              IT Knowledge Hub
            </span>
            <span className="block text-[11px] font-semibold tracking-widest text-slate-500 dark:text-slate-400">
              STERLING STEELS · IT SUPPORT
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center lg:flex">
          <NavLink href="/" active={pathname === "/"}>
            Home
          </NavLink>
          {categories.map((category) => {
            const href = `/category/${category.slug}`;
            return (
              <NavLink key={category.slug} href={href} active={pathname === href}>
                {category.title}
              </NavLink>
            );
          })}
          <NavLink href="/search" active={pathname === "/search"}>
            Search
          </NavLink>
        </nav>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          {dark ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>

      <nav
        aria-label="Primary mobile"
        className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-1 lg:hidden dark:border-slate-800"
      >
        <NavLink href="/" active={pathname === "/"}>
          Home
        </NavLink>
        {categories.map((category) => {
          const href = `/category/${category.slug}`;
          return (
            <NavLink key={category.slug} href={href} active={pathname === href}>
              {category.title}
            </NavLink>
          );
        })}
        <NavLink href="/search" active={pathname === "/search"}>
          Search
        </NavLink>
      </nav>
    </header>
  );
}
