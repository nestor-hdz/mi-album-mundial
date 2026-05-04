"use client";

import { ALL_STICKERS, SECTIONS } from "@/lib/stickers";
import type { Counts } from "@/lib/storage";

interface Props {
  counts: Counts;
  activeSection: string;
  onSelect: (id: string) => void;
}

export default function SectionSidebar({ counts, activeSection, onSelect }: Props) {
  return (
    <aside className="w-32 min-w-[128px] overflow-y-auto bg-[#0a1628] border-r border-slate-800 py-2">
      {SECTIONS.map((sec) => {
        const secStickers = ALL_STICKERS.filter((s) => s.section === sec.id);
        const secHave = secStickers.filter((s) => (counts[s.id] || 0) > 0).length;
        const pct = Math.round((secHave / sec.count) * 100);
        const active = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            className={`w-full px-2.5 py-2 text-xs text-left flex justify-between items-center border-l-2 transition-colors cursor-pointer bg-transparent ${
              active
                ? "bg-slate-800 text-amber-400 border-amber-400"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
            onClick={() => onSelect(sec.id)}
          >
            <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[75px]">
              {sec.label}
            </span>
            <span className="text-[10px] text-slate-500 shrink-0">{pct}%</span>
          </button>
        );
      })}
    </aside>
  );
}
