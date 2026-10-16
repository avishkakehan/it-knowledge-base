"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Article, StepCalloutKind } from "../lib/knowledge";

type ArticleDetailProps = {
  article: Article;
  /** e.g. "Back to Printers" or "Back to Knowledge Hub" */
  backLabel: string;
  onBack: () => void;
  /** When true, also show an explicit "Back to Knowledge Hub" link */
  showHubLink?: boolean;
};

type Lightbox = {
  src: string;
  alt: string;
  caption?: string;
};

const CALLOUT_STYLES: Record<StepCalloutKind, string> = {
  tip: "border-blue-200 bg-blue-50 text-blue-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  important: "border-red-200 bg-red-50 text-red-900",
};

const CALLOUT_LABELS: Record<StepCalloutKind, string> = {
  tip: "Tip",
  warning: "Warning",
  important: "Important",
};

export function ArticleDetail({
  article,
  backLabel,
  onBack,
  showHubLink = false,
}: ArticleDetailProps) {
  const [lightbox, setLightbox] = useState<Lightbox | null>(null);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightbox(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox]);

  async function copyCommand(command: string, index: number) {
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
      setCopiedStep(index);
      window.setTimeout(() => {
        setCopiedStep((current) => (current === index ? null : current));
      }, 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context); leave button unchanged.
    }
  }

  return (
    <main className="print-article min-h-screen bg-paper px-5 py-10 text-slate-800 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={onBack}
            className="rounded px-3 py-2 text-sm font-semibold text-brand hover:bg-red-50"
          >
            ← {backLabel}
          </button>
          {showHubLink && (
            <Link
              href="/"
              className="rounded px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100"
            >
              Back to Knowledge Hub
            </Link>
          )}
        </div>

        <article className="rounded-md border border-slate-200 bg-white p-6 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-wider text-brand">
            {article.category}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {article.title}
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            {article.description}
          </p>

          <div className="mt-5 flex gap-3 text-sm text-slate-500">
            <span>{article.time}</span>
            <span aria-hidden="true">•</span>
            <span>{article.level}</span>
          </div>

          <hr className="my-8 border-slate-200" />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-900">
              Troubleshooting steps
            </h2>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 print:hidden"
            >
              Print / Save PDF
            </button>
          </div>

          <ol className="mt-6 space-y-6">
            {article.steps.map((step, index) => {
              const image = step.image;
              const imageAlt =
                step.imageAlt ?? `Screenshot for step ${index + 1}`;
              const command = step.command;
              const callout = step.callout;
              return (
                <li
                  key={`${index}-${step.title}`}
                  className="flex gap-4 print:break-inside-avoid"
                >
                  <div
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-slate-300 text-sm font-bold text-slate-700"
                  >
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 leading-7 text-slate-600">
                      {step.description}
                    </p>

                    {image ? (
                      <figure className="mt-3">
                        <button
                          type="button"
                          onClick={() =>
                            setLightbox({
                              src: image,
                              alt: imageAlt,
                              caption: step.caption,
                            })
                          }
                          aria-label={`Enlarge screenshot for step ${index + 1}: ${step.title}`}
                          className="block w-full overflow-hidden rounded-md border border-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                        >
                          <img
                            src={image}
                            alt={imageAlt}
                            loading="lazy"
                            className="w-full object-cover transition-transform duration-200 ease-out hover:scale-[1.01]"
                          />
                        </button>
                        {step.caption ? (
                          <figcaption className="mt-2 text-xs leading-5 text-slate-500">
                            {step.caption} (select to enlarge)
                          </figcaption>
                        ) : null}
                      </figure>
                    ) : null}

                    {command ? (
                      <div className="mt-3 overflow-hidden rounded-md border border-slate-800 bg-slate-950">
                        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
                          <span className="text-xs font-semibold tracking-wide text-slate-300">
                            Command
                          </span>
                          <button
                            type="button"
                            onClick={() => copyCommand(command, index)}
                            aria-live="polite"
                            className="rounded bg-white/10 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/20 print:hidden"
                          >
                            {copiedStep === index ? "Copied ✓" : "Copy"}
                          </button>
                        </div>
                        <pre className="overflow-x-auto p-3 font-mono text-[13px] leading-6 text-slate-100">
                          <code>{command}</code>
                        </pre>
                        {step.commandExplanation ? (
                          <p className="border-t border-white/10 px-3 py-2 text-xs leading-5 text-slate-400">
                            {step.commandExplanation}
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    {callout ? (
                      <div
                        role="note"
                        aria-label={`${CALLOUT_LABELS[callout.kind]}: ${callout.text}`}
                        className={`mt-3 rounded-md border p-4 ${CALLOUT_STYLES[callout.kind]}`}
                      >
                        <p className="text-sm font-bold">
                          {CALLOUT_LABELS[callout.kind]}
                        </p>
                        <p className="mt-1 text-sm leading-6">{callout.text}</p>
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-10 rounded-md border border-slate-200 bg-slate-50 p-5">
            <h3 className="font-semibold text-slate-900">
              Still having problems?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Contact your IT support team if these steps do not solve the
              issue. Follow your company&apos;s IT procedures.
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="mt-8 rounded bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark print:hidden"
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
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="mx-auto max-h-[75vh] w-auto"
            />
            {lightbox.caption ? (
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {lightbox.caption}
              </p>
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
