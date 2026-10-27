"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Step = {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  caption?: string;
  command?: string;
  commandExplanation?: string;
  callout?: string;
};

const CATEGORIES = [
  "OUTLOOK & EMAIL",
  "PRINTERS",
  "WINDOWS",
  "SOFTWARE",
  "IT SECURITY",
];

export default function CreateArticleForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [level, setLevel] = useState("");
  const [steps, setSteps] = useState<Step[]>([
    {
      title: "",
      description: "",
      image: "",
      imageAlt: "",
      caption: "",
      command: "",
      commandExplanation: "",
      callout: "",
    },
  ]);
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateStep(index: number, field: keyof Step, value: string) {
    setSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, [field]: value } : step))
    );
  }

  function addStep() {
    setSteps((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        image: "",
        imageAlt: "",
        caption: "",
        command: "",
        commandExplanation: "",
        callout: "",
      },
    ]);
  }

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const cleanedSteps = steps
      .filter((step) => step.title.trim() || step.description.trim())
      .map((step) => ({
        title: step.title,
        description: step.description,
        image: step.image ?? "",
        imageAlt: step.imageAlt ?? "",
        caption: step.caption ?? "",
        command: step.command ?? "",
        commandExplanation: step.commandExplanation ?? "",
        callout: step.callout ?? "",
      }));

    if (cleanedSteps.length === 0) {
      setError("At least one troubleshooting step is required.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          description,
          time,
          level,
          steps: cleanedSteps,
          published,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Could not create the article.");
        setSaving(false);
        return;
      }

      setSuccess("Article created successfully.");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}{" "}
          <Link href="/admin" className="font-medium underline">
            Return to dashboard
          </Link>
        </p>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-slate-700">
            Reading time
          </label>
          <input
            id="time"
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="5 min read"
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
        </div>
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-slate-700">
            Difficulty level
          </label>
          <input
            id="level"
            type="text"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            placeholder="Beginner"
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium text-slate-700">
          Troubleshooting steps
        </p>
        {steps.map((step, index) => (
          <div
            key={index}
            className="rounded-md border border-slate-200 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Step {index + 1}
              </span>
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-xs font-medium text-red-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              type="text"
              value={step.title}
              onChange={(e) => updateStep(index, "title", e.target.value)}
              placeholder="Step title"
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
            <textarea
              value={step.description}
              onChange={(e) => updateStep(index, "description", e.target.value)}
              placeholder="Step description"
              rows={2}
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
            <input
              type="text"
              value={step.image ?? ""}
              onChange={(e) => updateStep(index, "image", e.target.value)}
              placeholder="Image URL (optional)"
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
            <input
              type="text"
              value={step.imageAlt ?? ""}
              onChange={(e) => updateStep(index, "imageAlt", e.target.value)}
              placeholder="Image alt text (optional)"
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
            <input
              type="text"
              value={step.caption ?? ""}
              onChange={(e) => updateStep(index, "caption", e.target.value)}
              placeholder="Caption (optional)"
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
            <input
              type="text"
              value={step.command ?? ""}
              onChange={(e) => updateStep(index, "command", e.target.value)}
              placeholder="Command (optional)"
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
            <input
              type="text"
              value={step.commandExplanation ?? ""}
              onChange={(e) => updateStep(index, "commandExplanation", e.target.value)}
              placeholder="Command explanation (optional)"
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
            <input
              type="text"
              value={step.callout ?? ""}
              onChange={(e) => updateStep(index, "callout", e.target.value)}
              placeholder="Callout (optional, e.g. Warning / Tip)"
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addStep}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          + Add step
        </button>
      </div>

      <div className="flex items-center gap-3">
        <input
          id="published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
        />
        <label htmlFor="published" className="text-sm font-medium text-slate-700">
          Published
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-50"
        >
          {saving ? "Creating..." : "Create article"}
        </button>
        <Link
          href="/admin"
          className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
