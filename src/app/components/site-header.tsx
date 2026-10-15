"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
          : "text-slate-600 hover:text-slate-900"
      }`}
    >
      {children}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/SterlingSteelsLogo.png"
            alt="Sterling Steels logo"
            width={85}
            height={50}
            className="h-[50px] w-auto object-contain"
            priority
          />
          <span>
            <span className="block text-base font-bold tracking-tight text-slate-900">
              IT Knowledge Hub
            </span>
            <span className="block text-[11px] font-semibold tracking-widest text-slate-500">
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
      </div>

      <nav
        aria-label="Primary mobile"
        className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-1 lg:hidden"
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
