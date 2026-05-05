"use client";

import { useEffect } from "react";

interface Props {
  message: string | null;
  onDismiss: () => void;
}

export default function Toast({ message, onDismiss }: Props) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="toast-in fixed bottom-24 left-1/2 -translate-x-1/2 z-40 bg-slate-800 border border-slate-600 text-slate-100 text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl whitespace-nowrap">
      {message}
    </div>
  );
}
