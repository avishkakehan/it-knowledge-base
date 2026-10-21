
import { NextResponse } from "next/server";
import { createClient } from "../../lib/supabase-server";

export const dynamic = "force-dynamic";

async function getAuthorizedAdmin() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || typeof userId !== "string" || !userId) {
    return { supabase: null, response: NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    ) };
  }

  const { data: adminRecord, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (adminError || !adminRecord) {
    return { supabase: null, response: NextResponse.json(
      { error: "Administrator access required." },
      { status: 403 }
    ) };
  }

  return { supabase, response: null };
}

export async function POST(request: Request) {
  const { supabase, response } = await getAuthorizedAdmin();

  if (response || !supabase) return response;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid article data." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;

  if (typeof input.title !== "string" || !input.title.trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  if (typeof input.category !== "string") {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }

  if (typeof input.description !== "string") {
    return NextResponse.json({ error: "Invalid description." }, { status: 400 });
  }

  if (typeof input.time !== "string") {
    return NextResponse.json({ error: "Invalid reading time." }, { status: 400 });
  }

  if (typeof input.level !== "string") {
    return NextResponse.json({ error: "Invalid difficulty level." }, { status: 400 });
  }

  if (typeof input.published !== "boolean") {
    return NextResponse.json({ error: "Invalid publication status." }, { status: 400 });
  }

  if (
    !Array.isArray(input.steps) ||
    input.steps.length === 0 ||
    !input.steps.every(
      (step) =>
        step !== null &&
        typeof step === "object" &&
        !Array.isArray(step) &&
        typeof (step as Record<string, unknown>).title === "string" &&
        typeof (step as Record<string, unknown>).description === "string"
    )
  ) {
    return NextResponse.json({ error: "At least one valid troubleshooting step is required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("articles")
    .insert({
      title: (input.title as string).trim(),
      category: input.category,
      description: input.description,
      time: input.time,
      level: input.level,
      steps: input.steps,
      published: input.published,
    })
    .select("id, title")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Article creation failed." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Article not created or not permitted." }, { status: 404 });
  }

  return NextResponse.json({ success: true, id: data.id }, { status: 201 });
}

export async function PATCH(request: Request) {
  const { supabase, response } = await getAuthorizedAdmin();

  if (response || !supabase) return response;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid article data." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const id = input.id;

  if (!Number.isSafeInteger(id) || (id as number) <= 0) {
    return NextResponse.json({ error: "A valid article ID is required." }, { status: 400 });
  }

  const allowedFields = [
    "title",
    "category",
    "description",
    "time",
    "level",
    "steps",
    "published",
  ];

  const updates: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(input, field)) {
      updates[field] = input[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No article fields supplied." }, { status: 400 });
  }

  if ("title" in updates && (typeof updates.title !== "string" || !updates.title.trim())) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  if ("category" in updates && typeof updates.category !== "string") {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }

  if ("description" in updates && typeof updates.description !== "string") {
    return NextResponse.json({ error: "Invalid description." }, { status: 400 });
  }

  if ("time" in updates && typeof updates.time !== "string") {
    return NextResponse.json({ error: "Invalid reading time." }, { status: 400 });
  }

  if ("level" in updates && typeof updates.level !== "string") {
    return NextResponse.json({ error: "Invalid difficulty level." }, { status: 400 });
  }

  if ("published" in updates && typeof updates.published !== "boolean") {
    return NextResponse.json({ error: "Invalid publication status." }, { status: 400 });
  }

  if (
    "steps" in updates &&
    (!Array.isArray(updates.steps) ||
      !updates.steps.every(
        (step) =>
          step !== null &&
          typeof step === "object" &&
          !Array.isArray(step) &&
          typeof step.title === "string" &&
          typeof step.description === "string"
      ))
  ) {
    return NextResponse.json({ error: "Invalid article steps." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("articles")
    .update(updates)
    .eq("id", id as number)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Article update failed." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Article not found or update not permitted." }, { status: 404 });
  }

  return NextResponse.json({ success: true, id: data.id });
}

export async function DELETE(request: Request) {
  const { supabase, response } = await getAuthorizedAdmin();

  if (response || !supabase) return response;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid article data." }, { status: 400 });
  }

  const id = (body as Record<string, unknown>).id;

  if (!Number.isSafeInteger(id) || (id as number) <= 0) {
    return NextResponse.json({ error: "A valid article ID is required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("articles")
    .delete()
    .eq("id", id as number)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Article deletion failed." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Article not found or deletion not permitted." }, { status: 404 });
  }

  return NextResponse.json({ success: true, id: data.id });
}
