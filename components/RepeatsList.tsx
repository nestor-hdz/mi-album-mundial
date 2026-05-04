"use client";

import { useState, useMemo } from "react";
import { ALL_STICKERS } from "@/lib/stickers";
import type { Counts } from "@/lib/storage";
import AdSlot from "./AdSlot";

interface Props {
  counts: Counts;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function RepeatsList({ counts, onAdd, onRemove }: Props) {
  const [search, setSearch] = useState("");

  const repeated = useMemo(
    () => ALL_STICKERS.filter((s) => (counts[s.id] || 0) > 1),
    [counts]
  );

  const filtered = useMemo(() => {
    if (!search) return repeated;
    const q = search.toLowerCase();
    return repeated.filter(
      (s) =>
        s.code.toLowerCase().includes(q) || s.sectionLabel.toLowerCase().includes(q)
    );
  }, [repeated, search]);

  return (
    <div>
      <div className="p-4">
        <input
          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm outline-none"
          placeholder="Buscar por código o sección..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <AdSlot slot="repetidas-mid" className="mb-2" />

      {filtered.length === 0 ? (
        <div className="text-center text-slate-500 py-10 text-sm">
          {repeated.length === 0
            ? "No tienes estampas repetidas todavía 🎉"
            : "No hay resultados para esa búsqueda."}
        </div>
      ) : (
        <div className="px-4 pb-4 space-y-2">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="flex justify-between items-center bg-slate-800 rounded-lg px-3.5 py-2.5 border border-orange-500/20"
            >
              <div>
                <div className="font-bold text-sm text-amber-400">{s.code}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.sectionLabel}</div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="bg-orange-500/10 text-orange-500 text-xs font-bold px-2 py-0.5 rounded-full border border-orange-500/40">
                  +{(counts[s.id] || 0) - 1} extra
                </span>
                <div className="flex items-center gap-1">
                  <button
                    className="w-5 h-5 bg-red-500 text-white rounded flex items-center justify-center text-sm leading-none cursor-pointer border-0"
                    onClick={() => onRemove(s.id)}
                  >
                    −
                  </button>
                  <span className="text-[13px] font-bold min-w-[16px] text-center text-slate-200">
                    {counts[s.id]}
                  </span>
                  <button
                    className="w-5 h-5 bg-green-500 text-white rounded flex items-center justify-center text-sm leading-none cursor-pointer border-0"
                    onClick={() => onAdd(s.id)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
