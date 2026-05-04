import { createClient } from "@/lib/supabase/server";
import { ALL_STICKERS, SECTIONS } from "@/lib/stickers";
import { notFound } from "next/navigation";

export default async function SharePage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data } = await supabase
    .from("albums")
    .select("counts, updated_at")
    .eq("share_slug", params.slug)
    .single();

  if (!data) notFound();

  const counts = data.counts as Record<string, number>;
  const have = ALL_STICKERS.filter((s) => (counts[s.id] || 0) > 0).length;
  const total = ALL_STICKERS.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4">
      <div className="max-w-lg mx-auto">
        <div className="text-xs font-bold tracking-widest text-amber-400 uppercase mb-1">
          MUNDIAL 2026
        </div>
        <h1 className="text-2xl font-extrabold text-slate-100 mb-1">Álbum compartido</h1>
        <p className="text-sm text-slate-400 mb-6">
          Solo lectura · {have}/{total} estampas ({Math.round((have / total) * 100)}%)
        </p>

        {/* AdSense slot — top banner */}
        <div id="ad-share-top" className="my-4" />

        {SECTIONS.map((sec) => {
          const secStickers = ALL_STICKERS.filter((s) => s.section === sec.id);
          const secHave = secStickers.filter((s) => (counts[s.id] || 0) > 0).length;
          return (
            <div key={sec.id} className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-bold text-slate-300">{sec.label}</h2>
                <span className="text-xs text-slate-500">
                  {secHave}/{sec.count}
                </span>
              </div>
              <div
                className="grid gap-1"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(52px, 1fr))" }}
              >
                {secStickers.map((s) => {
                  const c = counts[s.id] || 0;
                  return (
                    <div
                      key={s.id}
                      className={`rounded text-center py-1 text-[9px] font-bold ${
                        c === 0
                          ? "bg-slate-800 text-slate-600"
                          : c === 1
                          ? "bg-emerald-950 text-green-400 border border-green-700"
                          : "bg-orange-950 text-orange-400 border border-orange-700"
                      }`}
                    >
                      {s.code}
                      {c > 1 && <span className="block text-[8px]">×{c}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
