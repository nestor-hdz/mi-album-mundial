"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {syncing && (
          <span className="text-[10px] text-amber-400 animate-pulse">sincronizando…</span>
        )}
        <button
          className="text-xs text-slate-400 border border-slate-700 px-2.5 py-1 rounded-lg cursor-pointer bg-transparent hover:border-slate-500"
          onClick={async () => {
            setSyncing(true);
            await createClient().auth.signOut();
            setSyncing(false);
          }}
        >
          Salir
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/auth"
      className="text-xs bg-amber-400/10 text-amber-400 border border-amber-400/30 px-2.5 py-1 rounded-lg font-semibold hover:bg-amber-400/20 transition-colors"
    >
      ☁️ Guardar
    </Link>
  );
}
