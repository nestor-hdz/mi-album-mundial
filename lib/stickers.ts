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
  // 48 qualified nations — id kept as team_N to preserve saved data
  { id: "team_1",  label: "Mexico",             prefix: "MEX", count: 20 },
  { id: "team_2",  label: "South Africa",        prefix: "RSA", count: 20 },
  { id: "team_3",  label: "Korea Republic",      prefix: "KOR", count: 20 },
  { id: "team_4",  label: "Czechia",             prefix: "CZE", count: 20 },
  { id: "team_5",  label: "Canada",              prefix: "CAN", count: 20 },
  { id: "team_6",  label: "Bosnia-Herzegovina",  prefix: "BIH", count: 20 },
  { id: "team_7",  label: "Qatar",               prefix: "QAT", count: 20 },
  { id: "team_8",  label: "Switzerland",         prefix: "SUI", count: 20 },
  { id: "team_9",  label: "Brazil",              prefix: "BRA", count: 20 },
  { id: "team_10", label: "Morocco",             prefix: "MAR", count: 20 },
  { id: "team_11", label: "Haiti",               prefix: "HAI", count: 20 },
  { id: "team_12", label: "Scotland",            prefix: "SCO", count: 20 },
  { id: "team_13", label: "USA",                 prefix: "USA", count: 20 },
  { id: "team_14", label: "Paraguay",            prefix: "PAR", count: 20 },
  { id: "team_15", label: "Australia",           prefix: "AUS", count: 20 },
  { id: "team_16", label: "Turkiye",             prefix: "TUR", count: 20 },
  { id: "team_17", label: "Germany",             prefix: "GER", count: 20 },
  { id: "team_18", label: "Curacao",             prefix: "CUW", count: 20 },
  { id: "team_19", label: "Cote d'Ivoire",       prefix: "CIV", count: 20 },
  { id: "team_20", label: "Ecuador",             prefix: "ECU", count: 20 },
  { id: "team_21", label: "Netherlands",         prefix: "NED", count: 20 },
  { id: "team_22", label: "Japan",               prefix: "JPN", count: 20 },
  { id: "team_23", label: "Sweden",              prefix: "SWE", count: 20 },
  { id: "team_24", label: "Tunisia",             prefix: "TUN", count: 20 },
  { id: "team_25", label: "Belgium",             prefix: "BEL", count: 20 },
  { id: "team_26", label: "Egypt",               prefix: "EGY", count: 20 },
  { id: "team_27", label: "IR Iran",             prefix: "IRN", count: 20 },
  { id: "team_28", label: "New Zealand",         prefix: "NZL", count: 20 },
  { id: "team_29", label: "Spain",               prefix: "ESP", count: 20 },
  { id: "team_30", label: "Cabo Verde",          prefix: "CPV", count: 20 },
  { id: "team_31", label: "Saudi Arabia",        prefix: "KSA", count: 20 },
  { id: "team_32", label: "Uruguay",             prefix: "URU", count: 20 },
  { id: "team_33", label: "France",              prefix: "FRA", count: 20 },
  { id: "team_34", label: "Senegal",             prefix: "SEN", count: 20 },
  { id: "team_35", label: "Iraq",                prefix: "IRQ", count: 20 },
  { id: "team_36", label: "Norway",              prefix: "NOR", count: 20 },
  { id: "team_37", label: "Argentina",           prefix: "ARG", count: 20 },
  { id: "team_38", label: "Algeria",             prefix: "ALG", count: 20 },
  { id: "team_39", label: "Austria",             prefix: "AUT", count: 20 },
  { id: "team_40", label: "Jordan",              prefix: "JOR", count: 20 },
  { id: "team_41", label: "Portugal",            prefix: "POR", count: 20 },
  { id: "team_42", label: "Congo DR",            prefix: "COD", count: 20 },
  { id: "team_43", label: "Uzbekistan",          prefix: "UZB", count: 20 },
  { id: "team_44", label: "Colombia",            prefix: "COL", count: 20 },
  { id: "team_45", label: "England",             prefix: "ENG", count: 20 },
  { id: "team_46", label: "Croatia",             prefix: "CRO", count: 20 },
  { id: "team_47", label: "Ghana",               prefix: "GHA", count: 20 },
  { id: "team_48", label: "Panama",              prefix: "PAN", count: 20 },
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
