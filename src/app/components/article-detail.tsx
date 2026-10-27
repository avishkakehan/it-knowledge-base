"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Article } from "../lib/knowledge";

type ArticleDetailProps = {
  article: Article;
  /** e.g. "Back to Printers" or "Back to Knowledge Hub" */
  backLabel: string;
  onBack: () => void;
  /** When true, also show an explicit "Back to Knowledge Hub" link */
  showHubLink?: boolean;
};

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function ArticleDetail({
  article,
  backLabel,
  onBack,
  showHubLink = false,
}: ArticleDetailProps) {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{
    src: string;
    alt: string;
    caption?: string;
  } | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightbox(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox]);

  async function copyCommand(command: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(command);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = command;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedCommand(command);
      window.setTimeout(() => {
        setCopiedCommand((current) => (current === command ? null : current));
      }, 2000);
    } catch {
      // Clipboard unavailable; no-op.
    }
  }

  return (
    <main className="min-h-screen bg-paper px-5 py-10 text-slate-800 sm:px-8 dark:bg-slate-950 dark:text-slate-200">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded px-3 py-2 text-sm font-semibold text-brand hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          {showHubLink && (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Hub
            </Link>
          )}
        </div>

        <article className="rounded-md border border-slate-200 bg-white p-6 sm:p-10 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-bold uppercase tracking-wider text-brand">
            {article.category}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {article.title}
          </h1>

          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
            {article.description}
          </p>

          <div className="mt-5 flex gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span>{article.time}</span>
            <span aria-hidden="true">•</span>
            <span>{article.level}</span>
          </div>

          <hr className="my-8 border-slate-200 dark:border-slate-700" />

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Troubleshooting steps
          </h2>

          <ol className="mt-6 space-y-6">
            {article.steps.map((step, index) => {
              const image = step.image?.trim() ?? "";
              const validImage = image !== "" && isValidHttpUrl(image);
              const commandText = step.command?.trim() ?? "";
              const calloutText = step.callout?.trim() ?? "";
              const showScreenshot = validImage;
              const showCommand = commandText !== "";
              const showCallout = calloutText !== "";

              return (
                <li key={`${index}-${step.title}`} className="flex gap-4">
                  <div
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-slate-300 text-sm font-bold text-slate-700 dark:border-slate-600 dark:text-slate-300"
                  >
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                    <p className="mt-1.5 leading-7 text-slate-600 dark:text-slate-400">
                      {step.description}
                    </p>

                    {showScreenshot && (
                      <figure className="mt-3">
                        <button
                          type="button"
                          onClick={() =>
                            setLightbox({
                              src: image,
                              alt: step.imageAlt?.trim() || step.title,
                              caption: step.caption?.trim() || undefined,
                            })
                          }
                          aria-label={`Enlarge screenshot for step ${index + 1}`}
                          className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image}
                            alt={step.imageAlt?.trim() || step.title}
                            className="w-full rounded-md border border-slate-200 dark:border-slate-700"
                          />
                        </button>
                        {step.caption?.trim() ? (
                          <figcaption className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            {step.caption}
                          </figcaption>
                        ) : null}
                      </figure>
                    )}

                    {showCommand && (
                      <div className="mt-3 overflow-hidden rounded-md border border-slate-800 bg-slate-950">
                        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
                          <span className="text-xs font-semibold tracking-wide text-slate-300">
                            Command
                          </span>
                          <button
                            type="button"
                            onClick={() => copyCommand(commandText)}
                            className="rounded bg-white/10 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/20"
                          >
                            {copiedCommand === commandText ? "Copied ✓" : "Copy"}
                          </button>
                        </div>
                        <pre className="overflow-x-auto p-3 font-mono text-[13px] leading-6 text-slate-100">
                          <code>{commandText}</code>
                        </pre>
                        {step.commandExplanation?.trim() ? (
                          <p className="border-t border-white/10 px-3 py-2 text-xs leading-5 text-slate-400">
                            {step.commandExplanation}
                          </p>
                        ) : null}
                      </div>
                    )}

                    {showCallout && (
                      <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40">
                        <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                          {step.callout}
                        </p>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-10 rounded-md border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Still having problems?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
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

      {lightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="max-h-full w-full max-w-4xl overflow-auto rounded-md bg-white p-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="mx-auto max-h-[75vh] w-auto"
            />
            {lightbox.caption ? (
              <p className="mt-3 text-sm leading-6 text-slate-600">{lightbox.caption}</p>
            ) : null}
            <button
              type="button"
              autoFocus
              onClick={() => setLightbox(null)}
              className="mt-4 rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
