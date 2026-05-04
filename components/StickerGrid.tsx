"use client";

import { ALL_STICKERS, SECTIONS } from "@/lib/stickers";
import type { Counts } from "@/lib/storage";

interface Props {
  counts: Counts;
  activeSection: string;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function StickerGrid({ counts, activeSection, onAdd, onRemove }: Props) {
  const currentSection = SECTIONS.find((s) => s.id === activeSection);
  const stickers = ALL_STICKERS.filter((s) => s.section === activeSection);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <h2 className="text-base font-bold text-slate-100 mb-3">{currentSection?.label}</h2>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))" }}
      >
        {stickers.map((s) => {
          const c = counts[s.id] || 0;
          return (
            <div
              key={s.id}
              className={`rounded-lg pt-2 px-1 pb-1.5 text-center relative transition-all ${
                c === 0
                  ? "bg-slate-800 border border-slate-700"
                  : c === 1
                  ? "bg-emerald-950 border border-green-500"
                  : "bg-orange-950 border border-orange-500"
              }`}
            >
              <div className="text-[10px] font-bold text-slate-400 mb-1.5">{s.code}</div>
              {c > 1 && (
                <div className="absolute top-0.5 right-0.5 bg-orange-500 text-white text-[8px] font-extrabold px-1 rounded">
                  ×{c}
                </div>
              )}
              <div className="flex items-center justify-center gap-1">
                <button
                  className="w-5 h-5 bg-red-500 text-white rounded flex items-center justify-center text-sm leading-none cursor-pointer border-0"
                  onClick={() => onRemove(s.id)}
                >
                  −
                </button>
                <span className="text-[13px] font-bold min-w-[16px] text-center text-slate-200">
                  {c}
                </span>
                <button
                  className="w-5 h-5 bg-green-500 text-white rounded flex items-center justify-center text-sm leading-none cursor-pointer border-0"
                  onClick={() => onAdd(s.id)}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
