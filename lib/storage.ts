const STORAGE_KEY = "mundial2026_album";

export type Counts = Record<string, number>;

export function loadLocal(): Counts {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Counts;
  } catch {}
  return {};
}

export function saveLocal(counts: Counts): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
  } catch {}
}
