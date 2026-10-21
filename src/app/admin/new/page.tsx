import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase-server";
import CreateArticleForm from "./create-article-form";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || typeof userId !== "string" || !userId) {
    redirect("/admin/login");
  }

  const { data: adminRecord, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (adminError || !adminRecord) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Create Article
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Add a new troubleshooting guide to the Knowledge Hub.
        </p>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <CreateArticleForm />
        </section>
      </div>
    </main>
  );
}
