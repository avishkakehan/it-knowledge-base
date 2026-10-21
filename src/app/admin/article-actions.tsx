
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ArticleActionsProps = {
  id: number;
  title: string;
};

export default function ArticleActions({
  id,
  title,
}: ArticleActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function deleteArticle() {
    const confirmed = window.confirm(
      `Delete "${title}" permanently? This cannot be undone.`
    );

    if (!confirmed) return;

    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Could not delete article.");
        return;
      }

      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
    <button
    type="button"
    onClick={() => router.push(`/admin/edit?id=${id}`)}
    disabled={busy}
    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
    >
    Edit
    </button>

      <button
        type="button"
        onClick={deleteArticle}
        disabled={busy}
        className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400"
      >
        {busy ? "Deleting..." : "Delete"}
      </button>

      {error && (
        <p role="alert" className="w-full text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
