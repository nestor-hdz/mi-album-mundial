export interface Section {
  id: string;
  label: string;
  prefix: string;
  count: number;
}

export interface Sticker {
  id: string;
  code: string;
  section: string;
  sectionLabel: string;
}

export const SECTIONS: Section[] = [
  { id: "intro", label: "Portada", prefix: "P", count: 1 },
  { id: "fwc", label: "FWC", prefix: "FWC", count: 19 },
  ...Array.from({ length: 48 }, (_, i) => ({
    id: `team_${i + 1}`,
    label: `Equipo ${i + 1}`,
    prefix: `E${i + 1}`,
    count: 20,
  })),
  { id: "momentos", label: "Momentos del Mundial", prefix: "MM", count: 14 },
];

export function buildAllStickers(): Sticker[] {
  const all: Sticker[] = [];
  for (const sec of SECTIONS) {
    for (let n = 1; n <= sec.count; n++) {
      all.push({
        id: `${sec.id}_${n}`,
        code: `${sec.prefix}-${n}`,
        section: sec.id,
        sectionLabel: sec.label,
      });
    }
  }
  return all;
}

export const ALL_STICKERS = buildAllStickers(); // 994 stickers
