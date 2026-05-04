export function encodeCollection(counts: Record<string, number>): string {
  const parts = Object.entries(counts)
    .filter(([, c]) => c > 0)
    .map(([id, c]) => `${id}:${c}`);
  return btoa(unescape(encodeURIComponent(parts.join(","))));
}

export function decodeCollection(code: string): Record<string, number> | null {
  try {
    const str = decodeURIComponent(escape(atob(code)));
    const result: Record<string, number> = {};
    str.split(",").forEach((part) => {
      const [id, c] = part.split(":");
      if (id && c) result[id] = parseInt(c, 10);
    });
    return result;
  } catch {
    return null;
  }
}
