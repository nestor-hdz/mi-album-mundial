import { createClient } from "./client";
import type { Counts } from "@/lib/storage";

export async function fetchAlbum(userId: string): Promise<Counts> {
  const supabase = createClient();
  const { data } = await supabase
    .from("albums")
    .select("counts")
    .eq("user_id", userId)
    .single();
  return (data?.counts as Counts) ?? {};
}

export async function saveAlbum(userId: string, counts: Counts): Promise<void> {
  const supabase = createClient();
  await supabase
    .from("albums")
    .upsert({ user_id: userId, counts }, { onConflict: "user_id" });
}

export async function getOrCreateShareSlug(userId: string): Promise<string> {
  const supabase = createClient();

  const { data } = await supabase
    .from("albums")
    .select("share_slug")
    .eq("user_id", userId)
    .single();

  if (data?.share_slug) return data.share_slug as string;

  // Generate a short random slug — no external dependency needed
  const slug = Array.from(crypto.getRandomValues(new Uint8Array(6)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  await supabase
    .from("albums")
    .update({ share_slug: slug })
    .eq("user_id", userId);

  return slug;
}
