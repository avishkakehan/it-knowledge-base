import { supabase } from "./supabase";

export type StepCalloutKind = "tip" | "warning" | "important";

export type StepCallout = {
  kind: StepCalloutKind;
  text: string;
};

export type ArticleStep = {
  title: string;
  description: string;
  /** Optional screenshot URL. Absent on all existing articles. */
  image?: string;
  /** Alt text for the screenshot. Falls back to a generated label. */
  imageAlt?: string;
  /** Optional caption shown below the screenshot. */
  caption?: string;
  /**
   * Genuine command snippet only. Rendered verbatim with a copy button.
   * Never inferred from description text.
   */
  command?: string;
  /** Optional plain-language explanation of what the command does. */
  commandExplanation?: string;
  /** Optional Tip / Warning / Important callout for the step. */
  callout?: StepCallout;
};

export type Article = {
  category: string;
  title: string;
  description: string;
  time: string;
  level: string;
  steps: ArticleStep[];
};

export type CategoryColor = "blue" | "green" | "orange" | "pink" | "teal";

export type Category = {
  title: string;
  description: string;
  icon: string;
  color: CategoryColor;
  count: string;
  /** URL segment, e.g. "outlook-email" for /category/outlook-email */
  slug: string;
  /** Exact value stored in Supabase public.articles.category (uppercase) */
  dbCategory: string;
};

export const categoryStyles: Record<CategoryColor, string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  orange: "bg-orange-50 text-orange-600",
  pink: "bg-pink-50 text-pink-600",
  teal: "bg-teal-50 text-teal-600",
};

export const categories: Category[] = [
  {
    title: "Outlook & Email",
    description: "Fix mailbox, sending and receiving problems.",
    icon: "✉",
    color: "blue",
    count: "6 guides",
    slug: "outlook-email",
    dbCategory: "OUTLOOK & EMAIL",
  },
  {
    title: "Printers",
    description: "Solve printing, paper and connection errors.",
    icon: "▤",
    color: "green",
    count: "5 guides",
    slug: "printers",
    dbCategory: "PRINTERS",
  },
  {
    title: "Windows",
    description: "Resolve common Windows and PC problems.",
    icon: "▦",
    color: "orange",
    count: "8 guides",
    slug: "windows",
    dbCategory: "WINDOWS",
  },
  {
    title: "Software",
    description: "Installation, updates and application errors.",
    icon: "▣",
    color: "pink",
    count: "4 guides",
    slug: "software",
    dbCategory: "SOFTWARE",
  },
  {
    title: "IT Security",
    description: "Learn safe and secure workplace IT practices.",
    icon: "◇",
    color: "teal",
    count: "5 guides",
    slug: "it-security",
    dbCategory: "IT SECURITY",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

type ArticleRow = {
  category: string | null;
  title: string | null;
  description: string | null;
  time: string | null;
  level: string | null;
  steps: ArticleStep[] | null;
};

function normalizeStep(item: unknown): ArticleStep | null {
  if (!item || typeof item !== "object") return null;
  const raw = item as Record<string, unknown>;
  const step: ArticleStep = {
    title: typeof raw.title === "string" ? raw.title : "",
    description:
      typeof raw.description === "string" ? raw.description : "",
  };

  if (typeof raw.image === "string" && raw.image.trim() !== "") {
    step.image = raw.image.trim();
  }
  if (typeof raw.imageAlt === "string" && raw.imageAlt.trim() !== "") {
    step.imageAlt = raw.imageAlt;
  }
  if (typeof raw.caption === "string" && raw.caption.trim() !== "") {
    step.caption = raw.caption;
  }
  if (typeof raw.command === "string" && raw.command.trim() !== "") {
    step.command = raw.command;
  }
  if (
    typeof raw.commandExplanation === "string" &&
    raw.commandExplanation.trim() !== ""
  ) {
    step.commandExplanation = raw.commandExplanation;
  }

  const rawCallout = raw.callout;
  if (rawCallout && typeof rawCallout === "object") {
    const callout = rawCallout as Record<string, unknown>;
    const kind = callout.kind;
    const text = callout.text;
    if (
      (kind === "tip" || kind === "warning" || kind === "important") &&
      typeof text === "string" &&
      text.trim() !== ""
    ) {
      step.callout = { kind, text };
    }
  }

  return step;
}

function normalizeRow(row: ArticleRow): Article {
  return {
    category: row.category ?? "",
    title: row.title ?? "",
    description: row.description ?? "",
    time: row.time ?? "",
    level: row.level ?? "",
    steps: Array.isArray(row.steps)
      ? row.steps
          .map(normalizeStep)
          .filter((step): step is ArticleStep => step !== null)
      : [],
  };
}

const ARTICLE_COLUMNS = "category,title,description,time,level,steps";

export async function fetchPublishedArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error("articles-query-failed");
  return ((data ?? []) as ArticleRow[]).map(normalizeRow);
}

export async function fetchArticlesByCategory(
  dbCategory: string
): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("published", true)
    .eq("category", dbCategory)
    .order("created_at", { ascending: false });

  if (error) throw new Error("articles-query-failed");
  return ((data ?? []) as ArticleRow[]).map(normalizeRow);
}

export function filterArticles(
  articles: Article[],
  query: string
): Article[] {
  const q = query.toLowerCase().trim();
  if (q === "") return articles;
  return articles.filter(
    (article) =>
      article.title.toLowerCase().includes(q) ||
      article.description.toLowerCase().includes(q) ||
      article.category.toLowerCase().includes(q)
  );
}
