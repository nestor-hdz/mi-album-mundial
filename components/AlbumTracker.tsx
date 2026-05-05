"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import type { User } from "@supabase/supabase-js";
import { ALL_STICKERS, SECTIONS } from "@/lib/stickers";
import { loadLocal, saveLocal, type Counts } from "@/lib/storage";
import { encodeCollection } from "@/lib/share";
import { createClient } from "@/lib/supabase/client";
import { fetchAlbum, saveAlbum } from "@/lib/supabase/album";
import SectionSidebar from "./SectionSidebar";
import StickerGrid from "./StickerGrid";
import RepeatsList from "./RepeatsList";
import TradeAnalyzer from "./TradeAnalyzer";
import AuthButton from "./AuthButton";
import AdSlot from "./AdSlot";
import Link from "next/link";

export default function AlbumTracker() {
  const [counts, setCounts] = useState<Counts>({});
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<"album" | "repetidas" | "intercambiar">("album");
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const syncTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // 1. Load localStorage on mount
  useEffect(() => {
    setCounts(loadLocal());
    setLoaded(true);
  }, []);

  // 2. Subscribe to auth state
  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  // 3. On login: fetch from Supabase and merge (take max per sticker so no data is lost)
  useEffect(() => {
    if (!user || !loaded) return;
    fetchAlbum(user.id).then((remote) => {
      setCounts((local) => {
        const merged: Counts = { ...remote };
        for (const [id, c] of Object.entries(local)) {
          if (c > (merged[id] ?? 0)) merged[id] = c;
        }
        saveLocal(merged);
        return merged;
      });
    });
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // 4. Persist every change: localStorage immediately, Supabase debounced 1.5 s
  useEffect(() => {
    if (!loaded) return;
    saveLocal(counts);
    if (user) {
      clearTimeout(syncTimer.current);
      syncTimer.current = setTimeout(() => saveAlbum(user.id, counts), 1500);
    }
    return () => clearTimeout(syncTimer.current);
  }, [counts, user, loaded]);

  const add = useCallback((id: string) => {
    setCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);

  const remove = useCallback((id: string) => {
    setCounts((prev) => {
      const cur = prev[id] || 0;
      if (cur <= 0) return prev;
      const next = { ...prev };
      if (cur === 1) delete next[id];
      else next[id] = cur - 1;
      return next;
    });
  }, []);

  const stats = useMemo(() => {
    let have = 0, repeated = 0, missing = 0;
    for (const s of ALL_STICKERS) {
      const c = counts[s.id] || 0;
      if (c === 0) missing++;
      else { have++; if (c > 1) repeated += c - 1; }
    }
    return { have, repeated, missing, total: ALL_STICKERS.length };
  }, [counts]);

  const myShareCode = useMemo(() => encodeCollection(counts), [counts]);

  const tabs = [
    { key: "album" as const, label: "📋 Mi Álbum" },
    { key: "repetidas" as const, label: `🔄 Repetidas (${stats.repeated})` },
    { key: "intercambiar" as const, label: "🤝 Intercambiar" },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200">
      {/* HEADER */}
      <header className="shrink-0 bg-gradient-to-br from-blue-950 to-slate-950 px-4 pt-4 border-b border-slate-800">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-[10px] font-bold tracking-widest text-amber-400 uppercase mb-1">
              FIFA WORLD CUP 2026
            </div>
            <h1 className="text-[22px] font-extrabold text-slate-100 m-0">Mi Álbum</h1>
          </div>
          <div className="flex items-start gap-3 pt-1">
            <div className="flex gap-4">
              <StatBadge label="Tengo" value={stats.have} colorClass="text-amber-400" />
              <StatBadge label="Repetidas" value={stats.repeated} colorClass="text-orange-500" />
              <StatBadge label="Faltan" value={stats.missing} colorClass="text-slate-500" />
            </div>
            <AuthButton />
          </div>
        </div>
        <div className="h-1 bg-slate-800 rounded overflow-hidden mb-1.5">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-[width] duration-300"
            style={{ width: `${(stats.have / stats.total) * 100}%` }}
          />
        </div>
        <div className="text-[11px] text-slate-600 text-right pb-2.5">
          {stats.have} / {stats.total} ({Math.round((stats.have / stats.total) * 100)}%)
        </div>
        <AdSlot slot="header-bottom" className="pb-2" />
      </header>

      {/* TABS */}
      <nav className="shrink-0 flex bg-slate-950 border-b border-slate-800 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`flex-1 py-3 px-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer bg-transparent ${
              tab === t.key
                ? "text-amber-400 border-amber-400"
                : "text-slate-500 border-transparent hover:text-slate-300"
            }`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* CONTENT */}
      <main className="flex-1 overflow-hidden">
        {tab === "album" && (
          <div className="flex h-full">
            <SectionSidebar
              counts={counts}
              activeSection={activeSection}
              onSelect={setActiveSection}
            />
            <StickerGrid
              counts={counts}
              activeSection={activeSection}
              onAdd={add}
              onRemove={remove}
            />
          </div>
        )}
        {tab === "repetidas" && (
          <div className="h-full overflow-y-auto">
            <RepeatsList counts={counts} onAdd={add} onRemove={remove} />
          </div>
        )}
        {tab === "intercambiar" && (
          <div className="h-full overflow-y-auto">
            <TradeAnalyzer counts={counts} myShareCode={myShareCode} user={user} />
          </div>
        )}
      </main>

      <footer className="shrink-0 border-t border-slate-800 py-2 px-4 flex justify-center">
        <Link href="/privacy" className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors">
          Privacidad y Términos · No afiliado con FIFA ni Panini
        </Link>
      </footer>
    </div>
  );
}

function StatBadge({ label, value, colorClass }: { label: string; value: number; colorClass: string }) {
  return (
    <div className="text-center">
      <div className={`text-[22px] font-extrabold ${colorClass}`}>{value}</div>
      <div className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</div>
    </div>
  );
}
