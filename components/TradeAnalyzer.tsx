"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { ALL_STICKERS, type Sticker } from "@/lib/stickers";
import { decodeCollection } from "@/lib/share";
import { getOrCreateShareSlug } from "@/lib/supabase/album";
import type { Counts } from "@/lib/storage";
import Link from "next/link";

interface Props {
  counts: Counts;
  myShareCode: string;
  user: User | null;
}

interface TradeResult {
  iCanGive: Sticker[];
  theyCanGive: Sticker[];
}

export default function TradeAnalyzer({ counts, myShareCode, user }: Props) {
  const [tradeCode, setTradeCode] = useState("");
  const [result, setResult] = useState<TradeResult | null>(null);
  const [error, setError] = useState("");
  const [tradeCopied, setTradeCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  function analyze() {
    setError("");
    setResult(null);
    const them = decodeCollection(tradeCode.trim());
    if (!them) {
      setError("Código inválido. Pídele a tu amigo que lo copie de nuevo.");
      return;
    }
    const iCanGive: Sticker[] = [];
    const theyCanGive: Sticker[] = [];
    for (const s of ALL_STICKERS) {
      const mine = counts[s.id] || 0;
      const theirs = them[s.id] || 0;
      if (mine > 1 && theirs === 0) iCanGive.push(s);
      if (theirs > 1 && mine === 0) theyCanGive.push(s);
    }
    setResult({ iCanGive, theyCanGive });
  }

  function copyTradeCode() {
    navigator.clipboard?.writeText(myShareCode).catch(() => {});
    setTradeCopied(true);
    setTimeout(() => setTradeCopied(false), 2000);
  }

  async function handleCreateShare() {
    if (!user) return;
    setShareLoading(true);
    try {
      const slug = await getOrCreateShareSlug(user.id);
      setShareUrl(`${window.location.origin}/share/${slug}`);
    } finally {
      setShareLoading(false);
    }
  }

  function copyShareUrl() {
    if (!shareUrl) return;
    navigator.clipboard?.writeText(shareUrl).catch(() => {});
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  }

  return (
    <div className="p-4 flex flex-col gap-4 pb-8">
      {/* ── Share album link (cloud) ── */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <h3 className="text-[15px] font-bold text-slate-100 mb-1.5">🔗 Link público de tu álbum</h3>
        <p className="text-xs text-slate-400 mb-3">
          Genera un link de solo lectura para que cualquiera pueda ver tu álbum.
        </p>

        {!user ? (
          <Link
            href="/auth"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-amber-400/30 text-amber-400 text-sm font-semibold hover:bg-amber-400/10 transition-colors"
          >
            ☁️ Inicia sesión para generar tu link
          </Link>
        ) : shareUrl ? (
          <div className="flex items-center gap-2 bg-slate-950 rounded-lg px-3 py-2 border border-green-700">
            <code className="flex-1 text-[11px] text-green-400 break-all font-mono">{shareUrl}</code>
            <button
              className="shrink-0 bg-green-500 text-white px-3 py-1.5 rounded text-xs font-bold cursor-pointer border-0"
              onClick={copyShareUrl}
            >
              {shareCopied ? "✓ Copiado" : "Copiar"}
            </button>
          </div>
        ) : (
          <button
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 text-white text-sm font-extrabold disabled:opacity-50 cursor-pointer border-0"
            onClick={handleCreateShare}
            disabled={shareLoading}
          >
            {shareLoading ? "Generando…" : "Generar link público"}
          </button>
        )}
      </div>

      {/* ── Trade code (for friend analysis) ── */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <h3 className="text-[15px] font-bold text-slate-100 mb-1.5">📤 Código para intercambiar</h3>
        <p className="text-xs text-slate-400 mb-3">
          Comparte este código con un amigo para calcular qué se pueden intercambiar.
        </p>
        <div className="flex items-center gap-2 bg-slate-950 rounded-lg px-3 py-2 border border-slate-700">
          <code className="flex-1 text-[10px] text-slate-500 break-all font-mono">
            {myShareCode.slice(0, 40)}…
          </code>
          <button
            className="shrink-0 bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded text-xs font-bold cursor-pointer border-0"
            onClick={copyTradeCode}
          >
            {tradeCopied ? "✓ Copiado" : "Copiar"}
          </button>
        </div>
      </div>

      {/* ── Analyze friend ── */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <h3 className="text-[15px] font-bold text-slate-100 mb-1.5">📥 Analizar código de un amigo</h3>
        <p className="text-xs text-slate-400 mb-3">
          Pega el código de tu amigo y te decimos exactamente qué pueden intercambiar.
        </p>
        <textarea
          className="w-full bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs p-2.5 resize-y outline-none font-mono"
          placeholder="Pega el código aquí..."
          value={tradeCode}
          onChange={(e) => setTradeCode(e.target.value)}
          rows={3}
        />
        <button
          className="mt-2.5 w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 py-2.5 rounded-lg text-sm font-extrabold cursor-pointer border-0"
          onClick={analyze}
        >
          Analizar intercambio
        </button>
        {error && <div className="mt-2.5 text-red-400 text-xs text-center">{error}</div>}
      </div>

      {/* ── Result ── */}
      {result && (
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          {result.iCanGive.length === 0 && result.theyCanGive.length === 0 ? (
            <div className="text-center text-slate-500 py-6 text-sm">
              No hay intercambios posibles con este amigo por ahora.
            </div>
          ) : (
            <>
              <TradeList
                title={`✅ Puedes darle (${result.iCanGive.length})`}
                items={result.iCanGive}
                colorClass="text-green-400"
                borderClass="border-green-700"
              />
              <TradeList
                title={`🎯 Puedes pedirle (${result.theyCanGive.length})`}
                items={result.theyCanGive}
                colorClass="text-blue-400"
                borderClass="border-blue-700"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function TradeList({
  title,
  items,
  colorClass,
  borderClass,
}: {
  title: string;
  items: Sticker[];
  colorClass: string;
  borderClass: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mb-4 last:mb-0">
      <div className={`font-bold text-sm mb-2 ${colorClass}`}>{title}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((s) => (
          <span
            key={s.id}
            className={`text-xs font-semibold px-2 py-1 rounded border ${borderClass} text-slate-200 bg-slate-950`}
          >
            {s.code}
          </span>
        ))}
      </div>
    </div>
  );
}
