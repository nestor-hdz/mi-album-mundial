const STORAGE_KEY = "mundial2026_album";
const VERSION_KEY = "mundial2026_version";

// Bump this string whenever sticker IDs or prefixes change in a
// backwards-incompatible way. Old localStorage data will be cleared
// automatically on the user's next visit.
const CURRENT_VERSION = "2"; // v1 = generic E1…E48 prefixes; v2 = real country codes

export type Counts = Record<string, number>;

/** Returns true when the stored data contains old-style sticker keys (E1_1, E2_3 …). */
function isLegacyData(counts: Counts): boolean {
  return Object.keys(counts).some((key) => /^team_\d+_\d+$/.test(key));
  // All keys look the same in v1 and v2 (team_N_N), so we detect v1 by
  // checking whether the first team key's matching sticker code would have
  // been generated with the old generic prefix — i.e. ANY key exists AND
  // the version flag is absent/wrong (handled by the caller).
}

export function loadLocal(): Counts {
  if (typeof window === "undefined") return {};
  try {
    const storedVersion = window.localStorage.getItem(VERSION_KEY);

    if (storedVersion !== CURRENT_VERSION) {
      // Version mismatch → wipe stale data and stamp the new version
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
      return {};
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Counts;
  } catch {}
  return {};
}

export function saveLocal(counts: Counts): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
    // Always keep the version stamp in sync
    window.localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  } catch {}
}
