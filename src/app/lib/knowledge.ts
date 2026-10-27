import { supabase } from "./supabase";

export type ArticleStep = {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  caption?: string;
  command?: string;
  commandExplanation?: string;
  callout?: string;
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

function normalizeRow(row: ArticleRow): Article {
  return {
    category: row.category ?? "",
    title: row.title ?? "",
    description: row.description ?? "",
    time: row.time ?? "",
    level: row.level ?? "",
    steps: Array.isArray(row.steps)
      ? row.steps.map((step) => ({
          title: step?.title ?? "",
          description: step?.description ?? "",
          image: step?.image ?? undefined,
          imageAlt: step?.imageAlt ?? undefined,
          caption: step?.caption ?? undefined,
          command: step?.command ?? undefined,
          commandExplanation: step?.commandExplanation ?? undefined,
          callout: step?.callout ?? undefined,
        }))
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
