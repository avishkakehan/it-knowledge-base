
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "../lib/supabase-server";
import ArticleActions from "./article-actions";

export const dynamic = "force-dynamic";

type AdminArticle = {
  id: number;
  title: string;
  category: string;
  published: boolean;
  created_at: string;
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Verify the user's authenticated session.
  const { data, error: claimsError } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (claimsError || typeof userId !== "string" || !userId) {
    redirect("/admin/login");
  }

  // Verify administrator authorization.
  const { data: adminRecord, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (adminError || !adminRecord) {
    redirect("/admin/login");
  }

  // Fetch existing articles only after verifying admin access.
  const { data: articles, error: articlesError } = await supabase
    .from("articles")
    .select("id, title, category, published, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold tracking-widest text-blue-600">
          STERLING STEELS
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
          Knowledge Hub Admin
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Welcome to the administrator dashboard.
        </p>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Article management
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">
                {articlesError ? "Articles unavailable" : `${articles?.length ?? 0} articles`}
              </span>
              <Link
                href="/admin/new"
                className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                + Create Article
              </Link>
            </div>
          </div>

          {articlesError ? (
            <p role="alert" className="mt-4 text-sm text-red-600">
              Could not load articles. Check your Supabase permissions and try again.
            </p>
          ) : !articles || articles.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              No articles found.
            </p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700">
                    <th className="px-3 py-3 font-medium">Title</th>
                    <th className="px-3 py-3 font-medium">Category</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Created</th>
                    <th className="px-3 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article: AdminArticle) => (
                    <tr
                      key={article.id}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                    >
                      <td className="px-3 py-4 font-medium text-slate-900 dark:text-white">
                        {article.title}
                      </td>
                      <td className="px-3 py-4 text-slate-600 dark:text-slate-300">
                        {article.category}
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            article.published
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {article.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-slate-600 dark:text-slate-300">
                        {new Date(article.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          timeZone: "Asia/Colombo",
                        })}
                      </td>
                      <td className="px-3 py-4">
                        <ArticleActions id={article.id} title={article.title} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <Link
          href="/"
          className="mt-6 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          Return to the public Knowledge Hub
        </Link>
      </div>
    </main>
  );
}
