
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../lib/supabase-server";
import EditArticleForm from "./edit-article-form";

export const dynamic = "force-dynamic";

type EditArticlePageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function EditArticlePage({
  searchParams,
}: EditArticlePageProps) {
  const { id } = await searchParams;

  if (!id || !/^[1-9]\d*$/.test(id)) {
    notFound();
  }

  const supabase = await createClient();

  // Verify the signed-in user's session.
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || typeof userId !== "string" || !userId) {
    redirect("/admin/login");
  }

  // Verify that this user is an administrator.
  const { data: adminRecord, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (adminError || !adminRecord) {
    redirect("/admin/login");
  }

  // Load only the selected article.
  const { data: article, error: articleError } = await supabase
    .from("articles")
    .select("id, title, category, description, time, level, steps, published")
    .eq("id", Number(id))
    .maybeSingle();

  if (articleError) {
    throw new Error("Could not load the article.");
  }

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to dashboard
        </Link>

        <h1 className="mt-5 text-3xl font-bold text-slate-900 dark:text-white">
          Edit Article
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Editing article #{article.id}: {article.title}
        </p>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <EditArticleForm
            article={{
              id: article.id,
              title: article.title,
              category: article.category,
              description: article.description,
              time: article.time,
              level: article.level,
              steps: Array.isArray(article.steps) ? article.steps : [],
              published: article.published,
            }}
          />
        </section>
      </div>
    </main>
  );
}
