"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function sendMagicLink() {
    if (!email) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <Link href="/album" className="text-xs text-slate-500 hover:text-slate-300 mb-4 inline-block">
          ← Volver al álbum
        </Link>
        <div className="text-xs font-bold tracking-widest text-amber-400 uppercase mb-2">
          MUNDIAL 2026
        </div>
        <h1 className="text-xl font-extrabold text-slate-100 mb-1">Guardar en la nube</h1>
        <p className="text-xs text-slate-400 mb-6">
          Inicia sesión para guardar tu álbum, sincronizarlo entre dispositivos y compartirlo con un link.
        </p>

        {sent ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">📬</div>
            <p className="text-slate-200 font-semibold">Revisa tu correo</p>
            <p className="text-xs text-slate-400 mt-2">
              Te enviamos un enlace mágico a <strong className="text-slate-200">{email}</strong>.
              Haz clic en él para entrar.
            </p>
          </div>
        ) : (
          <>
            <input
              type="email"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm outline-none mb-3 focus:border-amber-500"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMagicLink()}
              autoFocus
            />
            <button
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 py-2.5 rounded-lg text-sm font-extrabold disabled:opacity-50 cursor-pointer border-0"
              onClick={sendMagicLink}
              disabled={loading || !email}
            >
              {loading ? "Enviando…" : "Enviar enlace mágico ✨"}
            </button>
            <p className="text-[10px] text-slate-600 text-center mt-3">
              Sin contraseña. Solo haz clic en el link que te enviamos.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
