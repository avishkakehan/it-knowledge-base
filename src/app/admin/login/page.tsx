"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase-browser";
import { useEffect } from "react";

export default function AdminLoginPage() {
    const router = useRouter();
    const supabase = createClient();
    useEffect(() => {
      let active = true;

      async function checkExistingSession() {
        const { data, error } = await supabase.auth.getUser();

        if (!active || error || !data.user) {
          return;
        }

        const { data: adminRecord, error: adminError } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", data.user.id)
          .maybeSingle();

        if (active && !adminError && adminRecord) {
          router.replace("/admin");
          router.refresh();
        }
      }

      void checkExistingSession();

      return () => {
        active = false;
      };
    }, [router, supabase]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const {data, error: signInError } =
                await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password,
                });

            if (signInError) {
                setError("sign-in failed. check your email and password.");
                return;
            }

            const {data: adminRecord, error:adminError} = await supabase
                .from("admin_users")
                .select("user_id")
                .eq("user_id", data.user.id)
                .maybeSingle();

            if (adminError || !adminRecord) {
                await supabase.auth.signOut();
                setError("This account is not authorized to access the admin area.");
                return;
            }

            router.push("/admin");
            router.refresh();
        } catch {
            setError("something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }
     return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-bold tracking-widest text-blue-600">
          STERLING STEELS
        </p>

        <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
          Administrator sign in
        </h1>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Sign in using your authorized Knowledge Hub administrator account.
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700"
              placeholder="Enter your work email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <a
          href="/"
          className="mt-6 inline-block text-sm text-blue-600 hover:underline"
        >
          Back to Knowledge Hub
        </a>
      </section>
    </main>
  );
}