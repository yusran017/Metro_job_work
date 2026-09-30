/** ปฏิทินเข้างานปั๊ม — ตรวจจาก Google Timeline ในเครื่องเท่านั้น */

export const MIN_PIECE_H = 0.25;
const SAMPLE_BRIDGE_MS = 45 * 60 * 1000;
const GPS_STAY_GAP_MS = 40 * 60 * 1000;
const GPS_STAY_RADIUS_M = 160;
const GPS_STAY_MIN_MS = 12 * 60 * 1000;

export type ShiftKey = "m" | "e" | "s";

export const SHIFTS = [
  { key: "m" as const, label: "กะเช้า", short: "เช้า", from: 6, to: 14, range: "06:00 – 14:00" },
  { key: "e" as const, label: "กะบ่าย", short: "บ่าย", from: 14, to: 22, range: "14:00 – 22:00" },
  { key: "s" as const, label: "ตำแหน่ง Support", short: "Support", from: 9, to: 18, range: "09:00 – 18:00" },
];

const SEMANTIC_TH: Record<string, string> = {
  HOME: "บ้าน",
  WORK: "ที่ทำงาน",
  INFERRED_HOME: "บ้าน",
  INFERRED_WORK: "ที่ทำงาน",
  SEARCHED_ADDRESS: "สถานที่ที่ค้นหา",
};

export type Cfg = {
  lat: string;
  lng: string;
  radius: number;
  minHours: number;
  days: number[];
  theme: "dark" | "light";
};

export const DEFAULTS: Cfg = {
  lat: "",
  lng: "",
  radius: 45,
  minHours: 6,
  days: [1, 1, 1, 1, 1, 1, 1],
  theme: "dark",
};

export type Store = {
  visits: Float64Array;
  visitMeta: string[];
  samples: Float64Array;
  min: number;
  max: number;
  count: number;
  name: string;
};

export type ShiftRec = { ms: number; first: number; last: number; parts: Array<[number, number]> };
export type DayRec = Partial<Record<ShiftKey, ShiftRec>>;
export type ShiftStatus = "ok" | "warn" | "none";
export type DayKind = "out" | "worked" | "off" | "partial" | "absent";

export type ShiftView = { st: ShiftStatus; h: number; rec?: ShiftRec };

export type DayInfo = {
  key: string;
  kind: DayKind;
  shifts: Record<ShiftKey, ShiftView>;
  okCount: number;
  hours: number;
  inRange: boolean;
  minH: number;
  supportOn: boolean;
};

export type Stop = {
  s: number;
  e: number;
  lat: number;
  lng: number;
  title: string;
  detail: string;
  atPump: boolean;
  meters: number | null;
  source: "visit" | "gps";
};

const LS = "workpulse-v3";

export const pad = (n: number) => String(n).padStart(2, "0");
export const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const keyToDate = (k: string) => new Date(`${k}T00:00:00`);
export const hm = (ms: number) => {
  const d = new Date(ms);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
export const fmtH = (h: number) => (Math.round(h * 10) / 10).toString();
export const thaiLong = (k: string) =>
  keyToDate(k).toLocaleDateString("th-TH", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
export const thaiMonth = (d: Date) => d.toLocaleDateString("th-TH", { month: "long", year: "numeric" });
export const thaiShort = (ms: number) =>
  new Date(ms).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" });
export const weekdayShort = (k: string) => keyToDate(k).toLocaleDateString("th-TH", { weekday: "short" });

export function fmtMeters(m: number) {
  if (m < 1000) return `${Math.round(m)} ม.`;
  const km = m / 1000;
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} กม.`;
}

export function fmtDur(ms: number) {
  const m = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(m / 60);
  const min = m % 60;
  if (h <= 0) return `${min} นาที`;
  if (min === 0) return `${h} ชม.`;
  return `${h} ชม. ${min} นาที`;
}

export function haversine(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371000;
  const r = Math.PI / 180;
  const dLat = (bLat - aLat) * r;
  const dLng = (bLng - aLng) * r;
  const n =
    Math.sin(dLat / 2) ** 2 + Math.cos(aLat * r) * Math.cos(bLat * r) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(n)));
}

export function loadCfg(): Cfg {
  try {
    const raw = JSON.parse(localStorage.getItem(LS) || "null") as Partial<Cfg> | null;
    if (raw) return { ...DEFAULTS, ...raw, days: Array.isArray(raw.days) ? raw.days : DEFAULTS.days };
    const old = JSON.parse(localStorage.getItem("workpulse-v2") || localStorage.getItem("workpulse-gas") || "null") as
      | Partial<Cfg>
      | null;
    if (old) {
      return {
        ...DEFAULTS,
        lat: old.lat || "",
        lng: old.lng || "",
        radius: Number(old.radius) || 45,
        minHours: clampHours(Number(old.minHours) || 6),
        days: Array.isArray(old.days) ? old.days : DEFAULTS.days,
        theme: old.theme === "light" ? "light" : "dark",
      };
    }
  } catch {
    /* ignore broken storage */
  }
  return { ...DEFAULTS, days: [...DEFAULTS.days] };
}

export function saveCfg(cfg: Cfg) {
  try {
    localStorage.setItem(LS, JSON.stringify(cfg));
  } catch {
    /* private mode */
  }
}

export function clampHours(n: number) {
  return Math.max(6, Math.min(8, Math.round(n * 2) / 2 || 6));
}

const idb = () =>
  new Promise<IDBDatabase>((res, rej) => {
    const r = indexedDB.open("workpulse", 1);
    r.onupgradeneeded = () => {
      if (!r.result.objectStoreNames.contains("kv")) r.result.createObjectStore("kv");
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });

export async function kvGet(k: string): Promise<unknown> {
  const db = await idb();
  return new Promise((res, rej) => {
    const q = db.transaction("kv").objectStore("kv").get(k);
    q.onsuccess = () => res(q.result);
    q.onerror = () => rej(q.error);
  });
}

export async function kvSet(k: string, v: unknown) {
  const db = await idb();
  return new Promise<void>((res, rej) => {
    const t = db.transaction("kv", "readwrite");
    t.objectStore("kv").put(v, k);
    t.oncomplete = () => res();
    t.onerror = () => rej(t.error);
  });
}

export async function kvDel(k: string) {
  const db = await idb();
  return new Promise<void>((res, rej) => {
    const t = db.transaction("kv", "readwrite");
    t.objectStore("kv").delete(k);
    t.oncomplete = () => res();
    t.onerror = () => rej(t.error);
  });
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

export function parseLatLng(value: unknown): { lat: number; lng: number } | null {
  if (value == null) return null;
  if (typeof value === "object") {
    const o = value as Record<string, unknown>;
    if (o.latLng) return parseLatLng(o.latLng);
    if (typeof o.latitudeE7 === "number" && typeof o.longitudeE7 === "number") {
      return { lat: o.latitudeE7 / 1e7, lng: o.longitudeE7 / 1e7 };
    }
    if (typeof o.latitude === "number" && typeof o.longitude === "number") return { lat: o.latitude, lng: o.longitude };
    if (typeof o.lat === "number" && typeof o.lng === "number") return { lat: o.lat, lng: o.lng };
    return null;
  }
  const text = String(value);
  const geo = text.match(/geo:(-?\d+\.?\d*),(-?\d+\.?\d*)/i);
  if (geo) return { lat: +geo[1], lng: +geo[2] };
  const deg = text.match(/(-?\d+\.?\d*)\s*°\s*,\s*(-?\d+\.?\d*)\s*°?/);
  if (deg) return { lat: +deg[1], lng: +deg[2] };
  const plain = text.match(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
  if (plain) return { lat: +plain[1], lng: +plain[2] };
  return null;
}

function toMs(v: unknown): number {
  if (v == null || v === "") return NaN;
  if (typeof v === "number") return v > 1e12 ? v : v * 1000;
  if (typeof v === "string" && /^\d+$/.test(v)) {
    const n = Number(v);
    return n > 1e12 ? n : n * 1000;
  }
  return Date.parse(String(v));
}

function pickStr(...vals: unknown[]): string {
  for (const v of vals) {
    if (typeof v === "string") {
      const t = v.trim();
      if (t && !t.startsWith("geo:") && !/^ChIJ/.test(t)) return t;
    }
  }
  return "";
}

function encodeMeta(name: string, address: string, semantic: string) {
  return [name, address, semantic].join("\u0001");
}

export function decodeMeta(raw: string | undefined) {
  const [name = "", address = "", semantic = ""] = (raw || "").split("\u0001");
  return { name, address, semantic };
}

function metaFromVisit(node: Record<string, unknown>, loc: unknown) {
  const top = asRecord(node.topCandidate) || asRecord(node.location) || asRecord(loc);
  const pools = [top, asRecord(node.location), asRecord(loc)];
  if (Array.isArray(node.otherCandidate)) pools.push(...node.otherCandidate.map(asRecord));
  if (Array.isArray(node.otherCandidates)) pools.push(...node.otherCandidates.map(asRecord));
  let name = "";
  let address = "";
  let semantic = "";
  for (const p of pools) {
    if (!p) continue;
    if (!name) name = pickStr(p.name, p.placeName, p.candidateName);
    if (!address) address = pickStr(p.address, p.formattedAddress);
    if (!semantic && typeof p.semanticType === "string") semantic = p.semanticType;
  }
  if (!semantic && typeof node.semanticType === "string") semantic = node.semanticType;
  return encodeMeta(name, address, semantic);
}

export function extract(data: unknown): Store {
  const visits: number[] = [];
  const visitMeta: string[] = [];
  const samples: number[] = [];

  const addVisit = (s: number, e: number, p: { lat: number; lng: number } | null, meta: string) => {
    if (p && Number.isFinite(s) && Number.isFinite(e) && e > s) {
      visits.push(s, e, p.lat, p.lng);
      visitMeta.push(meta);
    }
  };
  const addSample = (t: number, p: { lat: number; lng: number } | null) => {
    if (p && Number.isFinite(t)) samples.push(t, p.lat, p.lng);
  };

  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      for (const x of node) walk(x);
      return;
    }
    const o = node as Record<string, unknown>;
    if (o.latitudeE7 != null && (o.timestamp || o.timestampMs)) {
      addSample(toMs(o.timestamp || o.timestampMs), parseLatLng(o));
      return;
    }
    if (o.visit && typeof o.visit === "object") {
      const v = o.visit as Record<string, unknown>;
      const top = asRecord(v.topCandidate);
      addVisit(toMs(o.startTime), toMs(o.endTime), parseLatLng(top?.placeLocation ?? top), metaFromVisit(v, top));
      return;
    }
    if (o.placeVisit && typeof o.placeVisit === "object") {
      const v = o.placeVisit as Record<string, unknown>;
      const d = (asRecord(v.duration) || {}) as Record<string, unknown>;
      const location = asRecord(v.location);
      const loc =
        location?.latitudeE7 != null
          ? location
          : v.centerLatE7 != null
            ? { latitudeE7: v.centerLatE7, longitudeE7: v.centerLngE7 }
            : location;
      addVisit(
        toMs(d.startTimestamp || d.startTimestampMs),
        toMs(d.endTimestamp || d.endTimestampMs),
        parseLatLng(loc),
        metaFromVisit(v, loc),
      );
      return;
    }
    if (o.activity || o.activitySegment) return;
    if (Array.isArray(o.timelinePath)) {
      const base = toMs(o.startTime);
      for (const p of o.timelinePath) {
        const pt = asRecord(p);
        if (!pt) continue;
        const t = pt.time ? toMs(pt.time) : base + (Number(pt.durationMinutesOffsetFromStartTime) || 0) * 60000;
        addSample(t, parseLatLng(pt.point));
      }
      return;
    }
    for (const v of Object.values(o)) if (v && typeof v === "object") walk(v);
  };
  walk(data);

  const n = samples.length / 3;
  const idx = new Uint32Array(n);
  for (let i = 0; i < n; i++) idx[i] = i;
  idx.sort((a, b) => samples[a * 3] - samples[b * 3]);
  const sorted = new Float64Array(n * 3);
  for (let i = 0; i < n; i++) {
    const o = idx[i] * 3;
    sorted[i * 3] = samples[o];
    sorted[i * 3 + 1] = samples[o + 1];
    sorted[i * 3 + 2] = samples[o + 2];
  }

  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < visits.length; i += 4) {
    if (visits[i] < min) min = visits[i];
    if (visits[i + 1] > max) max = visits[i + 1];
  }
  if (n) {
    if (sorted[0] < min) min = sorted[0];
    if (sorted[(n - 1) * 3] > max) max = sorted[(n - 1) * 3];
  }
  return {
    visits: Float64Array.from(visits),
    visitMeta,
    samples: sorted,
    min: Number.isFinite(min) ? min : 0,
    max: Number.isFinite(max) ? max : 0,
    count: visits.length / 4 + n,
    name: "",
  };
}

export function extractPlaces(data: unknown): Array<{ label: string; lat: number; lng: number }> {
  const root = asRecord(data);
  const freq = asRecord(root?.userLocationProfile)?.frequentPlaces;
  if (!Array.isArray(freq)) return [];
  const out: Array<{ label: string; lat: number; lng: number }> = [];
  for (const item of freq) {
    const p = asRecord(item);
    if (!p) continue;
    const loc = parseLatLng(p.placeLocation || p);
    if (!loc) continue;
    out.push({ label: pickStr(p.label, p.name) || "สถานที่ที่ไปบ่อย", lat: loc.lat, lng: loc.lng });
  }
  return out;
}

export function normalizeStore(raw: unknown): Store | null {
  const o = asRecord(raw);
  if (!o || o.visits == null || o.samples == null) return null;
  const visits =
    o.visits instanceof Float64Array ? o.visits : Float64Array.from(o.visits as ArrayLike<number>);
  const samples =
    o.samples instanceof Float64Array ? o.samples : Float64Array.from(o.samples as ArrayLike<number>);
  if (visits.length % 4 !== 0 || samples.length % 3 !== 0) return null;
  return {
    visits,
    samples,
    visitMeta: Array.isArray(o.visitMeta) ? o.visitMeta.map(String) : [],
    min: Number(o.min) || 0,
    max: Number(o.max) || 0,
    count: Number(o.count) || visits.length / 4 + samples.length / 3,
    name: typeof o.name === "string" ? o.name : "Timeline",
  };
}

function stationOf(cfg: Cfg) {
  const lat = parseFloat(cfg.lat);
  const lng = parseFloat(cfg.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng, radius: Number(cfg.radius) || 45 };
}

export function analyze(store: Store, cfg: Cfg): Map<string, DayRec> {
  const station = stationOf(cfg);
  const pieces: Array<[number, number]> = [];
  if (station) {
    const V = store.visits;
    for (let i = 0; i < V.length; i += 4) {
      if (haversine(station.lat, station.lng, V[i + 2], V[i + 3]) <= station.radius) pieces.push([V[i], V[i + 1]]);
    }
    const S = store.samples;
    let prevIn = false;
    let prevT = 0;
    for (let i = 0; i < S.length; i += 3) {
      const t = S[i];
      const inn = haversine(station.lat, station.lng, S[i + 1], S[i + 2]) <= station.radius;
      if (inn && prevIn && t > prevT && t - prevT <= SAMPLE_BRIDGE_MS) pieces.push([prevT, t]);
      prevIn = inn;
      prevT = t;
    }
  }
  pieces.sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const p of pieces) {
    const last = merged[merged.length - 1];
    if (last && p[0] <= last[1]) last[1] = Math.max(last[1], p[1]);
    else merged.push([p[0], p[1]]);
  }

  const days = new Map<string, DayRec>();
  for (const [s, e] of merged) {
    const d = new Date(s);
    d.setHours(0, 0, 0, 0);
    for (let guard = 0; d.getTime() < e && guard < 8; guard++, d.setDate(d.getDate() + 1)) {
      const key = ymd(d);
      for (const sh of SHIFTS) {
        const ws = new Date(d);
        ws.setHours(sh.from, 0, 0, 0);
        const we = new Date(d);
        we.setHours(sh.to, 0, 0, 0);
        const a = Math.max(s, ws.getTime());
        const b = Math.min(e, we.getTime());
        if (b <= a) continue;
        const rec = days.get(key) || {};
        const r = rec[sh.key] || (rec[sh.key] = { ms: 0, first: a, last: b, parts: [] });
        r.ms += b - a;
        r.first = Math.min(r.first, a);
        r.last = Math.max(r.last, b);
        r.parts.push([a, b]);
        days.set(key, rec);
      }
    }
  }
  return days;
}

export function dayInfo(key: string, days: Map<string, DayRec>, store: Store | null, cfg: Cfg, now = new Date()): DayInfo {
  const minH = clampHours(Number(cfg.minHours) || 6);
  const rec = days.get(key) || {};
  const date = keyToDate(key);
  const todayKey = ymd(now);
  const hasData = !!store && cfg.lat !== "" && cfg.lng !== "";
  const minKey = hasData && store ? ymd(new Date(store.min)) : "";
  const maxKey = hasData && store ? ymd(new Date(store.max)) : "";
  const inRange = !!hasData && key >= minKey && key <= maxKey && key <= todayKey;
  const shifts = {} as Record<ShiftKey, ShiftView>;
  let okCount = 0;
  let warnAny = false;
  let totalMs = 0;
  for (const sh of SHIFTS) {
    const r = rec[sh.key];
    const h = r ? r.ms / 3600000 : 0;
    const st: ShiftStatus = h >= minH ? "ok" : h >= MIN_PIECE_H ? "warn" : "none";
    if (st === "ok") okCount++;
    if (st === "warn") warnAny = true;
    if (r && sh.key !== "s") totalMs += r.ms;
    shifts[sh.key] = r ? { st, h, rec: r } : { st, h };
  }
  const workDay = !!cfg.days[date.getDay()];
  let kind: DayKind;
  if (!inRange) kind = "out";
  else if (okCount) kind = "worked";
  else if (!workDay) kind = "off";
  else if (warnAny) kind = "partial";
  else kind = "absent";
  const supportOn = inRange && shifts.s.st === "ok";
  return { key, kind, shifts, okCount, hours: totalMs / 3600000, inRange, minH, supportOn };
}

export function calendarShiftKeys(info: DayInfo): ShiftKey[] {
  if (!info.inRange || info.kind === "off") return [];
  const keys: ShiftKey[] = ["m", "e"];
  if (info.supportOn) keys.push("s");
  return keys;
}

export const KIND_LABEL: Record<DayKind, string> = {
  worked: "ไปทำงาน",
  partial: "อยู่ที่ปั๊มไม่ครบเกณฑ์",
  absent: "ไม่พบที่ปั๊ม",
  off: "วันหยุดที่ตั้งไว้",
  out: "ไม่มีข้อมูลของวันนี้",
};

function dayBounds(key: string): [number, number] {
  const a = keyToDate(key).getTime();
  return [a, a + 86400000];
}

function lowerBound(samples: Float64Array, t: number) {
  let lo = 0;
  let hi = samples.length / 3;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (samples[mid * 3] < t) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function placeTitle(meta: { name: string; address: string; semantic: string }, atPump: boolean) {
  if (atPump && !meta.name) return "ปั๊มน้ำมัน";
  if (meta.name) return meta.name;
  const sem = SEMANTIC_TH[meta.semantic];
  if (sem) return sem;
  return atPump ? "ปั๊มน้ำมัน" : "สถานที่ไม่มีชื่อ";
}

export function dayStops(store: Store, key: string, cfg: Cfg): Stop[] {
  const [day0, day1] = dayBounds(key);
  const station = stationOf(cfg);
  const stops: Stop[] = [];
  const V = store.visits;
  for (let i = 0; i < V.length; i += 4) {
    const s = V[i];
    const e = V[i + 1];
    if (e <= day0 || s >= day1) continue;
    const cs = Math.max(s, day0);
    const ce = Math.min(e, day1);
    if (ce - cs < 3 * 60000) continue;
    const lat = V[i + 2];
    const lng = V[i + 3];
    const meta = decodeMeta(store.visitMeta[i / 4]);
    const meters = station ? haversine(station.lat, station.lng, lat, lng) : null;
    const atPump = meters != null && meters <= station!.radius;
    const sem = SEMANTIC_TH[meta.semantic];
    const detailParts = [meta.address, meta.name && sem ? sem : ""].filter(Boolean);
    stops.push({
      s: cs,
      e: ce,
      lat,
      lng,
      title: placeTitle(meta, atPump),
      detail: detailParts.join(" · "),
      atPump,
      meters,
      source: "visit",
    });
  }

  const clusters: Array<{ s: number; e: number; sumLat: number; sumLng: number; n: number }> = [];
  const S = store.samples;
  const n = S.length / 3;
  let cur: (typeof clusters)[number] | null = null;
  const flush = () => {
    if (cur) clusters.push(cur);
    cur = null;
  };
  for (let i = lowerBound(S, day0); i < n; i++) {
    const t = S[i * 3];
    if (t >= day1) break;
    const lat = S[i * 3 + 1];
    const lng = S[i * 3 + 2];
    if (!cur) {
      cur = { s: t, e: t, sumLat: lat, sumLng: lng, n: 1 };
      continue;
    }
    const dist = haversine(cur.sumLat / cur.n, cur.sumLng / cur.n, lat, lng);
    if (t - cur.e <= GPS_STAY_GAP_MS && dist <= GPS_STAY_RADIUS_M) {
      cur.e = t;
      cur.sumLat += lat;
      cur.sumLng += lng;
      cur.n += 1;
    } else {
      flush();
      cur = { s: t, e: t, sumLat: lat, sumLng: lng, n: 1 };
    }
  }
  flush();

  for (const c of clusters) {
    if (c.e - c.s < GPS_STAY_MIN_MS || c.n < 2) continue;
    const lat = c.sumLat / c.n;
    const lng = c.sumLng / c.n;
    const covered = stops.reduce((acc, st) => acc + overlap(c.s, c.e, st.s, st.e), 0);
    if (covered > (c.e - c.s) * 0.5) continue;
    const meters = station ? haversine(station.lat, station.lng, lat, lng) : null;
    const atPump = meters != null && meters <= station!.radius;
    stops.push({
      s: c.s,
      e: c.e,
      lat,
      lng,
      title: atPump ? "ปั๊มน้ำมัน" : "จุดที่อยู่กับที่",
      detail: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      atPump,
      meters,
      source: "gps",
    });
  }

  stops.sort((a, b) => a.s - b.s);
  const merged: Stop[] = [];
  for (const s of stops) {
    const last = merged[merged.length - 1];
    const near =
      last &&
      s.title === last.title &&
      s.atPump === last.atPump &&
      s.source === last.source &&
      s.s - last.e < 15 * 60000 &&
      haversine(last.lat, last.lng, s.lat, s.lng) < 220;
    if (last && near) {
      last.e = Math.max(last.e, s.e);
    } else merged.push({ ...s });
  }
  return merged;
}

function overlap(a0: number, a1: number, b0: number, b1: number) {
  return Math.max(0, Math.min(a1, b1) - Math.max(a0, b0));
}

export function stopSummary(stops: Stop[]) {
  if (!stops.length) return "";
  return stops
    .map((s) => `${hm(s.s)}–${hm(s.e)} ${s.title}${s.atPump ? " (ปั๊ม)" : ""}`)
    .join(" · ");
}

export function eachKey(store: Store, now = new Date()) {
  const from = new Date(store.min);
  from.setHours(0, 0, 0, 0);
  const to = new Date(Math.min(store.max, now.getTime()));
  to.setHours(0, 0, 0, 0);
  const keys: string[] = [];
  for (const d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) keys.push(ymd(d));
  return keys;
}

export function monthStats(days: Map<string, DayRec>, store: Store | null, cfg: Cfg, view: Date) {
  const y = view.getFullYear();
  const m = view.getMonth();
  const dim = new Date(y, m + 1, 0).getDate();
  let okDays = 0;
  let cm = 0;
  let ce = 0;
  let cs = 0;
  let hours = 0;
  let warn = 0;
  let bad = 0;
  for (let d = 1; d <= dim; d++) {
    const info = dayInfo(`${y}-${pad(m + 1)}-${pad(d)}`, days, store, cfg);
    if (!info.inRange) continue;
    hours += info.hours;
    if (info.okCount) okDays++;
    if (info.shifts.m.st === "ok") cm++;
    if (info.shifts.e.st === "ok") ce++;
    if (info.supportOn) cs++;
    if (info.kind === "partial") warn++;
    if (info.kind === "absent") bad++;
  }
  return { okDays, cm, ce, cs, hours, warn, bad };
}

/** ข้อมูลตัวอย่างให้เห็นกรอบ Support และวันที่ไม่เข้าเงื่อนไข โดยไม่ต้องมีไฟล์ Timeline */
export function demoStore(now = new Date()): { store: Store; cfg: Cfg } {
  const pump = { lat: 13.7462, lng: 100.5391 };
  const home = { lat: 13.786, lng: 100.551 };
  const mall = { lat: 13.7465, lng: 100.5698 };
  const cafe = { lat: 13.732, lng: 100.53 };
  const market = { lat: 13.758, lng: 100.52 };
  const visits: number[] = [];
  const visitMeta: string[] = [];
  const add = (day: Date, sh: number, sm: number, eh: number, em: number, loc: { lat: number; lng: number }, name: string, address = "", semantic = "") => {
    const s = new Date(day);
    s.setHours(sh, sm, 0, 0);
    const e = new Date(day);
    e.setHours(eh, em, 0, 0);
    if (e <= s) return;
    visits.push(s.getTime(), e.getTime(), loc.lat, loc.lng, );
    visitMeta.push(encodeMeta(name, address, semantic));
  };
  for (let back = 34; back >= 0; back--) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - back);
    const mode = day.getDate() % 6;
    if (mode === 0) add(day, 6, 4, 14, 6, pump, "ปั๊มน้ำมัน", "จุดที่ปักหมุด", "WORK");
    else if (mode === 1) add(day, 13, 56, 22, 4, pump, "ปั๊มน้ำมัน", "จุดที่ปักหมุด", "WORK");
    else if (mode === 2) add(day, 8, 52, 18, 8, pump, "ปั๊มน้ำมัน", "ช่วง Support 09:00–18:00", "WORK");
    else if (mode === 3) {
      add(day, 6, 12, 9, 36, pump, "ปั๊มน้ำมัน", "อยู่ไม่ครบเกณฑ์", "WORK");
      add(day, 10, 5, 13, 20, mall, "ห้างสรรพสินค้า", "แวะระหว่างวัน", "");
      add(day, 14, 0, 16, 15, cafe, "ร้านกาแฟ", "", "");
    } else if (mode === 4) {
      add(day, 0, 10, 8, 40, home, "บ้าน", "", "HOME");
      add(day, 9, 5, 10, 20, market, "ตลาด", "", "");
      add(day, 11, 0, 15, 45, mall, "ห้างสรรพสินค้า", "", "");
      add(day, 16, 30, 23, 40, home, "บ้าน", "", "HOME");
    } else {
      add(day, 5, 58, 14, 2, pump, "ปั๊มน้ำมัน", "กะเช้า", "WORK");
      add(day, 18, 30, 20, 10, market, "ตลาดเย็น", "หลังเลิกกะ", "");
    }
  }
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < visits.length; i += 4) {
    if (visits[i] < min) min = visits[i];
    if (visits[i + 1] > max) max = visits[i + 1];
  }
  return {
    store: {
      visits: Float64Array.from(visits),
      visitMeta,
      samples: new Float64Array(),
      min,
      max,
      count: visits.length / 4,
      name: "ข้อมูลตัวอย่าง",
    },
    cfg: { ...DEFAULTS, lat: pump.lat.toFixed(6), lng: pump.lng.toFixed(6), radius: 80, minHours: 6, days: [1, 1, 1, 1, 1, 1, 1] },
  };
}
