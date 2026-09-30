import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  type Cfg,
  type DayInfo,
  type DayRec,
  type ShiftKey,
  type Stop,
  type Store,
  DEFAULTS,
  KIND_LABEL,
  SHIFTS,
  analyze,
  calendarShiftKeys,
  clampHours,
  dayInfo,
  dayStops,
  demoStore,
  extract,
  extractPlaces,
  fmtDur,
  fmtH,
  fmtMeters,
  hm,
  kvDel,
  kvGet,
  kvSet,
  loadCfg,
  monthStats,
  normalizeStore,
  pad,
  saveCfg,
  thaiLong,
  thaiMonth,
  thaiShort,
  ymd,
} from "@/lib/workpulse";

type PlaceChip = { label: string; lat: number; lng: number };
type LeafletNS = {
  map: (el: HTMLElement, opts: object) => MapObj;
  tileLayer: (url: string, opts: object) => { addTo: (m: MapObj) => void };
  circleMarker: (ll: [number, number], opts: object) => { setLatLng: (ll: [number, number]) => void; addTo: (m: MapObj) => unknown };
  circle: (ll: [number, number], opts: object) => { setLatLng: (ll: [number, number]) => void; setRadius: (n: number) => void; addTo: (m: MapObj) => unknown };
};
type MapObj = {
  setView: (ll: [number, number], z: number) => void;
  on: (ev: string, fn: (e: { latlng: { lat: number; lng: number } }) => void) => void;
  invalidateSize: () => void;
  remove: () => void;
};

const DAY_OPTS = [
  { v: 1, t: "จ" },
  { v: 2, t: "อ" },
  { v: 3, t: "พ" },
  { v: 4, t: "พฤ" },
  { v: 5, t: "ศ" },
  { v: 6, t: "ส" },
  { v: 0, t: "อา" },
];

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3V21.5M2.5 12h2.2M19.3 12H21.5M5 5l1.6 1.6M17.4 17.4 19 19M5 19l1.6-1.6M17.4 6.6 19 5" fill="none" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 4.2A6.2 6.2 0 1 0 18.6 15 7.4 7.4 0 0 1 12 4.2z" />
    </svg>
  );
}
function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 13a8 8 0 0 1 16 0" />
      <path d="M4 13v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 1zM20 13v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 1z" />
    </svg>
  );
}

function shiftBadge(key: ShiftKey, info: DayInfo): [string, string] {
  const s = info.shifts[key];
  if (!info.inRange) return ["mute", "ไม่มีข้อมูล"];
  if (key === "s") {
    if (s.st === "ok") return ["ok", "ขึ้นบนปฏิทิน"];
    if (s.st === "warn") return ["warn", "ไม่ครบ · ซ่อนไว้"];
    return ["none", "ไม่พบ · ซ่อนไว้"];
  }
  if (s.st === "ok") return ["ok", "ไปทำงาน"];
  if (s.st === "warn") return ["warn", "ไม่ครบเกณฑ์"];
  return ["none", "ไม่พบ"];
}

export function WorkApp() {
  const [booted, setBooted] = useState(false);
  const [cfg, setCfg] = useState<Cfg>({ ...DEFAULTS, days: [...DEFAULTS.days] });
  const [store, setStore] = useState<Store | null>(null);
  const [days, setDays] = useState<Map<string, DayRec>>(() => new Map());
  const [view, setView] = useState(() => new Date());
  const [selected, setSelected] = useState<string | null>(null);
  const [sheet, setSheet] = useState<"day" | "set" | null>(null);
  const [toastMsg, setToastMsg] = useState("");
  const [toastOn, setToastOn] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("เลือกไฟล์ JSON จากมือถือ");
  const [fileInfo, setFileInfo] = useState("ประมวลผลในเครื่อง ไม่ถูกส่งไปที่ไหน");
  const [places, setPlaces] = useState<PlaceChip[]>([]);
  const [mapOff, setMapOff] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [jump, setJump] = useState("");
  const [query, setQuery] = useState("");
  const toastTimer = useRef(0);
  const mapEl = useRef<HTMLDivElement>(null);
  const mapHandle = useRef<{
    map: MapObj;
    marker: { setLatLng: (ll: [number, number]) => void };
    circle: { setLatLng: (ll: [number, number]) => void; setRadius: (n: number) => void };
    live: boolean;
  } | null>(null);
  const leafletRef = useRef<LeafletNS | null>(null);
  const cfgRef = useRef(cfg);
  cfgRef.current = cfg;
  const touch = useRef({ x: 0, y: 0 });

  function toast(msg: string) {
    setToastMsg(msg);
    setToastOn(true);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastOn(false), 2400);
  }

  useEffect(() => {
    let dead = false;
    (async () => {
      const loaded = loadCfg();
      if (dead) return;
      setCfg(loaded);
      try {
        const raw = await kvGet("store");
        const saved = normalizeStore(raw);
        if (dead) return;
        if (saved) {
          setStore(saved);
          setFileName(saved.name || "ไฟล์ Timeline");
          setFileInfo(`${saved.count.toLocaleString("th-TH")} รายการ · ${thaiShort(saved.min)} – ${thaiShort(saved.max)}`);
          if (loaded.lat !== "" && loaded.lng !== "") {
            setDays(analyze(saved, loaded));
            const t = new Date();
            if (ymd(t) > ymd(new Date(saved.max))) {
              const m = new Date(saved.max);
              setView(new Date(m.getFullYear(), m.getMonth(), 1));
            } else setView(new Date(t.getFullYear(), t.getMonth(), 1));
          }
        } else {
          const t = new Date();
          setView(new Date(t.getFullYear(), t.getMonth(), 1));
        }
      } catch {
        const t = new Date();
        setView(new Date(t.getFullYear(), t.getMonth(), 1));
      }
      if (!dead) setBooted(true);
    })();
    return () => {
      dead = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = cfg.theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", cfg.theme === "dark" ? "#070c18" : "#e7eef8");
  }, [cfg.theme]);

  useEffect(() => {
    if (sheet !== "set") return;
    let dead = false;
    (async () => {
      if (mapHandle.current) {
        setTimeout(() => mapHandle.current?.map.invalidateSize(), 260);
        return;
      }
      const el = mapEl.current;
      if (!el) return;
      try {
        const imported = await import("leaflet");
        if (dead || !mapEl.current) return;
        const ns = ((imported as { map?: unknown }).map ? imported : (imported as { default: LeafletNS }).default) as LeafletNS;
        const map = ns.map(mapEl.current, { zoomControl: false });
        map.setView([13.7563, 100.5018], 12);
        ns.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap" }).addTo(map);
        leafletRef.current = ns;
        mapHandle.current = {
          map,
          live: false,
          marker: { setLatLng: () => {} },
          circle: { setLatLng: () => {}, setRadius: () => {} },
        };
        map.on("click", (e) => pin(e.latlng.lat, e.latlng.lng, false));
        const lat = parseFloat(cfgRef.current.lat);
        const lng = parseFloat(cfgRef.current.lng);
        if (Number.isFinite(lat) && Number.isFinite(lng)) pin(lat, lng, true);
        setMapOff(false);
        setTimeout(() => map.invalidateSize(), 280);
      } catch {
        if (!dead) setMapOff(true);
      }
    })();
    return () => {
      dead = true;
    };
  }, [sheet]);

  function pin(lat: number, lng: number, pan = true) {
    setCfg((c) => ({ ...c, lat: lat.toFixed(6), lng: lng.toFixed(6) }));
    const L = leafletRef.current;
    const handle = mapHandle.current;
    if (!L || !handle) return;
    const ll: [number, number] = [lat, lng];
    const radius = Number(cfgRef.current.radius) || 45;
    if (!handle.live) {
      const marker = L.circleMarker(ll, { radius: 8, color: "#7c3aed", weight: 2, fillColor: "#f59e0b", fillOpacity: 1 });
      const circle = L.circle(ll, { radius, color: "#22d3ee", weight: 1.5, fillColor: "#22d3ee", fillOpacity: 0.16 });
      marker.addTo(handle.map);
      circle.addTo(handle.map);
      handle.marker = marker;
      handle.circle = circle;
      handle.live = true;
    } else {
      handle.marker.setLatLng(ll);
      handle.circle.setLatLng(ll);
      handle.circle.setRadius(radius);
    }
    if (pan) handle.map.setView(ll, 17);
  }

  async function searchPlace(q: string) {
    const text = q.trim();
    if (!text) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}`);
      const data = (await res.json()) as Array<{ lat: string; lon: string }>;
      if (!data[0]) {
        setError("ไม่พบสถานที่ที่ค้นหา");
        return;
      }
      setError("");
      pin(+data[0].lat, +data[0].lon);
    } catch {
      setError("ค้นหาไม่ได้ ตรวจสอบอินเทอร์เน็ตหรือใส่พิกัดเอง");
    }
  }

  function patch(partial: Partial<Cfg>) {
    setCfg((c) => ({ ...c, ...partial }));
  }

  async function onFile(file: File) {
    setError("");
    setFileInfo("กำลังอ่านไฟล์…");
    try {
      const data = JSON.parse(await file.text()) as unknown;
      const next = extract(data);
      if (!next.count) throw new Error("ไม่พบข้อมูลตำแหน่งในไฟล์นี้ ลองส่งออก Timeline ใหม่");
      next.name = file.name;
      setStore(next);
      await kvSet("store", { ...next, visits: next.visits, samples: next.samples, visitMeta: next.visitMeta });
      setFileName(file.name);
      setFileInfo(`${next.count.toLocaleString("th-TH")} รายการ · ${thaiShort(next.min)} – ${thaiShort(next.max)}`);
      setPlaces(extractPlaces(data));
      if (cfgRef.current.lat && cfgRef.current.lng) {
        const applied = { ...cfgRef.current, minHours: clampHours(cfgRef.current.minHours) };
        setDays(analyze(next, applied));
        saveCfg(applied);
        toast("อ่านไฟล์และประมวลผลแล้ว");
      } else toast("อ่านไฟล์แล้ว ปักหมุดปั๊มก่อนประมวลผล");
    } catch (err) {
      setError(err instanceof Error ? err.message : "อ่านไฟล์ไม่ได้");
      setFileInfo("ลองใหม่อีกครั้ง");
    }
  }

  function run() {
    if (!store) {
      setError("ยังไม่ได้เลือกไฟล์ Timeline");
      return;
    }
    const lat = parseFloat(cfg.lat);
    const lng = parseFloat(cfg.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setError("ปักหมุดจุดปั๊มบนแผนที่ หรือใส่ละติจูด/ลองจิจูดก่อน");
      return;
    }
    const next = { ...cfg, minHours: clampHours(cfg.minHours), radius: Number(cfg.radius) || 45 };
    setCfg(next);
    saveCfg(next);
    setDays(analyze(store, next));
    setError("");
    setSheet(null);
    toast("บันทึกและประมวลผลแล้ว");
  }

  async function loadDemo() {
    const demo = demoStore();
    setCfg(demo.cfg);
    setStore(demo.store);
    saveCfg(demo.cfg);
    setDays(analyze(demo.store, demo.cfg));
    setFileName(demo.store.name);
    setFileInfo("ข้อมูลจำลอง 35 วัน · ยังไม่ใช่ไฟล์ของคุณ");
    setPlaces([]);
    const t = new Date();
    setView(t.getDate() < 12 ? new Date(t.getFullYear(), t.getMonth() - 1, 1) : new Date(t.getFullYear(), t.getMonth(), 1));
    await kvSet("store", demo.store).catch(() => {});
    setSheet(null);
    setError("");
    toast("โหลดตัวอย่างแล้ว วันที่เข้าเงื่อนไข Support จะมีกรอบที่สาม");
  }

  async function wipe() {
    if (!confirm("ล้างไฟล์ Timeline และผลทั้งหมดที่เก็บไว้ในเครื่อง?")) return;
    await kvDel("store").catch(() => {});
    setStore(null);
    setDays(new Map());
    setPlaces([]);
    setFileName("เลือกไฟล์ JSON จากมือถือ");
    setFileInfo("ประมวลผลในเครื่อง ไม่ถูกส่งไปที่ไหน");
    toast("ล้างข้อมูลแล้ว");
  }

  async function exportExcel() {
    if (!store) return;
    setExporting(true);
    try {
      const { workbookBlob } = await import("@/lib/excel-export");
      const blob = await workbookBlob(store, days, cfg);
      const a = document.createElement("a");
      const stamp = ymd(new Date());
      a.href = URL.createObjectURL(blob);
      a.download = `เข้างาน-${stamp}.xlsx`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      toast("ส่งออก Excel แล้ว · 5 ชีตด้านล่าง");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ส่งออกไม่ได้");
      setSheet("set");
    } finally {
      setExporting(false);
    }
  }

  function openDay(key: string) {
    setSelected(key);
    setSheet("day");
  }

  const y = view.getFullYear();
  const m = view.getMonth();
  const startPad = new Date(y, m, 1).getDay();
  const dim = new Date(y, m + 1, 0).getDate();
  const rows = Math.ceil((startPad + dim) / 7);
  const stats = monthStats(days, store, cfg, new Date(y, m, 1));
  const todayKey = ymd(new Date());
  const showEmpty = booted && (!store || cfg.lat === "");

  const activeInfo = selected ? dayInfo(selected, days, store, cfg) : null;
  const stops = useMemo(() => (store && selected ? dayStops(store, selected, cfg) : []), [store, selected, cfg]);

  const cells: Array<{ key?: string; blank?: boolean; day?: number; info?: DayInfo }> = [];
  for (let i = 0; i < startPad; i++) cells.push({ blank: true });
  for (let d = 1; d <= dim; d++) {
    const key = `${y}-${pad(m + 1)}-${pad(d)}`;
    cells.push({ key, day: d, info: dayInfo(key, days, store, cfg) });
  }

  if (!booted) {
    return (
      <>
        <div className="aurora" aria-hidden="true" />
        <main className="app">
          <header className="top">
            <div className="brand">
              <span className="logo" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4.5" width="18" height="16" rx="4" />
                  <path d="M8 2.8v3.4M16 2.8v3.4M3 10h18M9 15l2 2 4-4" />
                </svg>
              </span>
              <div className="brand-text">
                <b>ปฏิทินเข้างาน</b>
                <small>ปั๊มน้ำมัน</small>
              </div>
            </div>
          </header>
          <p className="booting">กำลังเปิดปฏิทิน…</p>
        </main>
      </>
    );
  }

  return (
    <>
      <div className="aurora" aria-hidden="true" />
      <main className="app">
        <header className="top">
          <div className="brand">
            <span className="logo" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4.5" width="18" height="16" rx="4" />
                <path d="M8 2.8v3.4M16 2.8v3.4M3 10h18M9 15l2 2 4-4" />
              </svg>
            </span>
            <div className="brand-text">
              <b>ปฏิทินเข้างาน</b>
              <small>ปั๊มน้ำมัน</small>
            </div>
          </div>
          <div className="top-btns">
            <button type="button" className="pill" onClick={() => { const t = new Date(); setView(new Date(t.getFullYear(), t.getMonth(), 1)); setSelected(ymd(t)); }}>
              วันนี้
            </button>
            <button type="button" className="icon-btn" aria-label="ตั้งค่า" onClick={() => setSheet("set")}>
              <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3.2" />
                <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.27.63.88 1.03 1.56 1.03H21a2 2 0 1 1 0 4h-.09A1.7 1.7 0 0 0 19.4 15z" />
              </svg>
            </button>
          </div>
        </header>

        <div className="monthbar">
          <button type="button" className="nav-btn" aria-label="เดือนก่อนหน้า" onClick={() => setView(new Date(y, m - 1, 1))}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 5-7 7 7 7" /></svg>
          </button>
          <h1>{thaiMonth(view)}</h1>
          <button type="button" className="nav-btn" aria-label="เดือนถัดไป" onClick={() => setView(new Date(y, m + 1, 1))}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 5 7 7-7 7" /></svg>
          </button>
        </div>

        <section className="stats" aria-label="สรุปประจำเดือน">
          <div className="stat s-days"><b>{stats.okDays}</b><span>วันทำงาน</span></div>
          <div className="stat s-m"><b>{stats.cm}</b><span>กะเช้า</span></div>
          <div className="stat s-e"><b>{stats.ce}</b><span>กะบ่าย</span></div>
          <div className="stat s-s"><b>{stats.cs}</b><span>Support</span></div>
          <div className="stat s-h"><b>{fmtH(stats.hours)}</b><span>ชั่วโมง</span></div>
        </section>

        <section
          className="cal"
          onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touch.current.x;
            const dy = e.changedTouches[0].clientY - touch.current.y;
            if (Math.abs(dx) > 60 && Math.abs(dy) < 45) setView(new Date(y, m + (dx < 0 ? 1 : -1), 1));
          }}
        >
          <div className="dow" aria-hidden="true">
            <i className="sun">อา</i><i>จ</i><i>อ</i><i>พ</i><i>พฤ</i><i>ศ</i><i className="sat">ส</i>
          </div>
          <div className="grid" style={{ ["--rows" as string]: rows }}>
            {cells.map((c, i) => {
              if (c.blank || !c.info || !c.key) return <div key={`b${i}`} className="cell blank" />;
              const keys = calendarShiftKeys(c.info);
              const triple = keys.length === 3;
              const cls = ["cell", c.info.kind, c.key === todayKey ? "today" : "", c.key === selected ? "sel" : "", triple ? "triple" : "", keys.length ? "has-slots" : ""].filter(Boolean).join(" ");
              return (
                <button key={c.key} type="button" className={cls} onClick={() => openDay(c.key!)} aria-label={`${c.day} ${KIND_LABEL[c.info.kind]}`}>
                  <span className="n">{c.day}</span>
                  {keys.length > 0 && (
                    <div className="slots">
                      {keys.map((k) => {
                        const sh = SHIFTS.find((s) => s.key === k)!;
                        const st = c.info!.shifts[k].st;
                        return (
                          <span key={k} className={`slot ${k} ${st}`}>
                            {st === "none" ? null : (
                              <>
                                {k === "m" ? <SunIcon /> : k === "e" ? <MoonIcon /> : <SupportIcon />}
                                {sh.short}
                              </>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="empty" hidden={!showEmpty}>
            <div className="empty-card">
              <b>ยังไม่มีข้อมูลเข้างาน</b>
              <p>นำเข้าไฟล์ Timeline แล้วปักหมุดปั๊ม หรือลองด้วยข้อมูลตัวอย่างเพื่อดูกรอบ Support</p>
              <div className="empty-actions">
                <button type="button" className="primary" onClick={() => setSheet("set")}>เปิดการตั้งค่า</button>
                <button type="button" className="ghost" onClick={() => void loadDemo()}>ลองข้อมูลตัวอย่าง</button>
              </div>
            </div>
          </div>
        </section>

        <footer className="legend">
          <span className="lg"><i className="dot m" />เช้า 06–14</span>
          <span className="lg"><i className="dot e" />บ่าย 14–22</span>
          <span className="lg"><i className="dot s" />Support เมื่อครบ</span>
          <span className="lg"><i className="dot w" />ไม่ครบ <b>{stats.warn}</b></span>
          <span className="lg"><i className="dot b" />ไม่พบ <b>{stats.bad}</b></span>
        </footer>
      </main>

      <div className={`backdrop ${sheet === "day" ? "open" : ""}`} aria-hidden={sheet !== "day"} onClick={(e) => { if (e.target === e.currentTarget) setSheet(null); }}>
        <div className="panel" role="dialog" aria-labelledby="dayTitle">
          <div className="grab" />
          <div className="panel-head">
            <div>
              <h2 id="dayTitle">{selected ? thaiLong(selected) : "—"}</h2>
              <p>{activeInfo ? KIND_LABEL[activeInfo.kind] : ""}</p>
            </div>
            <button type="button" className="icon-btn sm" aria-label="ปิด" onClick={() => setSheet(null)}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </div>
          <div className="panel-body">
            {activeInfo && (
              <>
                {(activeInfo.kind === "partial" || activeInfo.kind === "absent") && (
                  <div className={`callout ${activeInfo.kind}`}>
                    <b>{activeInfo.kind === "absent" ? "วันนี้ไม่เข้างานที่ปั๊ม" : `อยู่ที่ปั๊มไม่ครบ ${activeInfo.minH} ชั่วโมง`}</b>
                    <p>ด้านล่างคือที่ที่ไปในวันนี้ ทั้งจุดที่อยู่ในไฟล์ Timeline และจุดที่อยู่กับที่จากพิกัด</p>
                    <div className="shortfalls">
                      {SHIFTS.map((sh) => (
                        <span key={sh.key}>{sh.short} {fmtH(activeInfo.shifts[sh.key].h)}/{activeInfo.minH} ชม.</span>
                      ))}
                    </div>
                  </div>
                )}
                {(activeInfo.kind === "partial" || activeInfo.kind === "absent") && <Itinerary stops={stops} />}
                {SHIFTS.map((sh) => {
                  const s = activeInfo.shifts[sh.key];
                  const badge = shiftBadge(sh.key, activeInfo);
                  return (
                    <div key={sh.key} className={`shift-card ${sh.key} ${activeInfo.inRange ? s.st : ""}`}>
                      <div className="sc-head">
                        <div><b>{sh.label}</b><small>{sh.range} น.</small></div>
                        <span className={`badge ${badge[0]}`}>{badge[1]}</span>
                      </div>
                      <div className="sc-grid">
                        <div><span>เข้า</span><b>{s.rec ? hm(s.rec.first) : "—"}</b></div>
                        <div><span>ออก</span><b>{s.rec ? hm(s.rec.last) : "—"}</b></div>
                        <div><span>อยู่ที่ปั๊ม</span><b>{s.rec ? `${fmtH(s.h)} ชม.` : "—"}</b></div>
                      </div>
                      {s.rec && <div className="parts">{s.rec.parts.map(([a, b], i) => <span key={i}>{hm(a)}–{hm(b)}</span>)}</div>}
                      {sh.key === "s" && s.st !== "ok" && <p className="hint">กรอบ Support จะโผล่บนปฏิทินเฉพาะวันที่อยู่ที่ปั๊มช่วง 09:00–18:00 ครบอย่างน้อย {activeInfo.minH} ชั่วโมง</p>}
                    </div>
                  );
                })}
                {activeInfo.kind !== "partial" && activeInfo.kind !== "absent" && <Itinerary stops={stops} />}
                <p className="day-note">
                  นับว่าไปทำงานเมื่ออยู่ในรัศมี {cfg.radius} ม. อย่างน้อย {activeInfo.minH} ชั่วโมงในกะนั้น
                  ชั่วโมงรวมคิดจากกะเช้ากับกะบ่าย ไม่บวก Support ซ้ำ
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={`backdrop ${sheet === "set" ? "open" : ""}`} aria-hidden={sheet !== "set"} onClick={(e) => { if (e.target === e.currentTarget) setSheet(null); }}>
        <div className="panel tall" role="dialog" aria-labelledby="setTitle">
          <div className="grab" />
          <div className="panel-head">
            <h2 id="setTitle">ตั้งค่า</h2>
            <button type="button" className="icon-btn sm" aria-label="ปิด" onClick={() => setSheet(null)}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </div>
          <div className="panel-body">
            <section className="box">
              <h3>ไฟล์ Timeline</h3>
              <label className="drop">
                <input type="file" accept=".json,application/json" onChange={(e) => { const f = e.target.files?.[0]; if (f) void onFile(f); e.target.value = ""; }} />
                <b>{fileName}</b>
                <small>{fileInfo}</small>
              </label>
            </section>

            <section className="box">
              <h3>จุดปั๊ม</h3>
              <div className="row">
                <input type="search" placeholder="ค้นหาชื่อปั๊ม" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") void searchPlace(query); }} />
                <button type="button" className="ghost" onClick={() => void searchPlace(query)}>ค้นหา</button>
              </div>
              <div className="row two">
                <input type="number" step="any" inputMode="decimal" placeholder="ละติจูด" value={cfg.lat} onChange={(e) => patch({ lat: e.target.value })} onBlur={() => {
                  const lat = parseFloat(cfg.lat); const lng = parseFloat(cfg.lng);
                  if (Number.isFinite(lat) && Number.isFinite(lng)) pin(lat, lng);
                }} />
                <input type="number" step="any" inputMode="decimal" placeholder="ลองจิจูด" value={cfg.lng} onChange={(e) => patch({ lng: e.target.value })} onBlur={() => {
                  const lat = parseFloat(cfg.lat); const lng = parseFloat(cfg.lng);
                  if (Number.isFinite(lat) && Number.isFinite(lng)) pin(lat, lng);
                }} />
              </div>
              <div id="map" ref={mapEl}>{mapOff && <p className="map-off">แผนที่ใช้ไม่ได้ตอนออฟไลน์ ใส่พิกัดเองได้</p>}</div>
              {places.length > 0 && (
                <div className="chips">
                  {places.map((p) => (
                    <button type="button" key={`${p.label}-${p.lat}`} onClick={() => pin(p.lat, p.lng)}>{p.label}</button>
                  ))}
                </div>
              )}
              <label className="range">รัศมีรอบจุดปั๊ม <b>{cfg.radius} ม.</b>
                <input type="range" min={20} max={120} step={5} value={cfg.radius} onChange={(e) => {
                  const radius = Number(e.target.value);
                  patch({ radius });
                  mapHandle.current?.circle.setRadius(radius);
                }} />
              </label>
            </section>

            <section className="box">
              <h3>กะทำงาน</h3>
              <div className="locked">
                <div className="lk m"><b>กะเช้า</b><span>06:00 – 14:00 น.</span></div>
                <div className="lk e"><b>กะบ่าย</b><span>14:00 – 22:00 น.</span></div>
                <div className="lk s"><b>ตำแหน่ง Support</b><span>09:00 – 18:00 น. · โผล่บนปฏิทินเมื่อครบเกณฑ์เท่านั้น วันปกติจะไม่แสดงกรอบนี้</span></div>
              </div>
              <p className="note">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="10" rx="3" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                ถ้าวันนั้นมีสามกรอบ เลขวันจะกลับไปมุมซ้ายบน ถ้ามีแค่เช้ากับบ่าย เลขวันจะใหญ่ตรงกลาง
              </p>
              <div className="stepper">
                <span>นับว่าเข้างานเมื่ออยู่ที่ปั๊มอย่างน้อย</span>
                <div className="step-ctl">
                  <button type="button" className="step" aria-label="ลดชั่วโมง" onClick={() => patch({ minHours: clampHours(cfg.minHours - 0.5) })}>−</button>
                  <b>{cfg.minHours}</b><small>ชม.</small>
                  <button type="button" className="step" aria-label="เพิ่มชั่วโมง" onClick={() => patch({ minHours: clampHours(cfg.minHours + 0.5) })}>+</button>
                </div>
              </div>
              <div className="days-title">วันทำงานในสัปดาห์</div>
              <div className="days">
                {DAY_OPTS.map((d) => (
                  <label key={d.v}>
                    <input type="checkbox" checked={!!cfg.days[d.v]} onChange={(e) => {
                      const daysNext = [...cfg.days];
                      daysNext[d.v] = e.target.checked ? 1 : 0;
                      patch({ days: daysNext });
                    }} />
                    <i>{d.t}</i>
                  </label>
                ))}
              </div>
            </section>

            <section className="box">
              <h3>ดูวันที่เจาะจง</h3>
              <div className="row">
                <input type="date" value={jump} onChange={(e) => setJump(e.target.value)} />
                <button type="button" className="ghost" onClick={() => {
                  const v = jump || ymd(new Date());
                  const d = new Date(`${v}T00:00:00`);
                  setView(new Date(d.getFullYear(), d.getMonth(), 1));
                  openDay(v);
                }}>ไปที่วันนี้</button>
              </div>
            </section>

            <section className="box">
              <h3>อื่น ๆ</h3>
              <div className="row wrapbtn">
                <button type="button" className="ghost" onClick={() => {
                  const theme = cfg.theme === "dark" ? "light" : "dark";
                  const next = { ...cfg, theme } as Cfg;
                  setCfg(next);
                  saveCfg(next);
                }}>สลับโหมดสว่าง/มืด</button>
                <button type="button" className="ghost" disabled={!store || exporting} onClick={() => void exportExcel()}>{exporting ? "กำลังสร้างไฟล์…" : "ส่งออก Excel"}</button>
                <button type="button" className="ghost" onClick={() => void loadDemo()}>โหลดตัวอย่าง</button>
                <button type="button" className="ghost danger" onClick={() => void wipe()}>ล้างข้อมูล</button>
              </div>
              <p className="sheet-note">Excel มี 5 ชีต: ภาพรวม · เข้างาน (เบสิค) · รายละเอียดกะ · สถานที่ · ไม่เข้าเงื่อนไข</p>
            </section>
            {error && <p className="error">{error}</p>}
          </div>
          <div className="panel-foot">
            <button type="button" className="primary wide" onClick={run}>ประมวลผลและบันทึก</button>
          </div>
        </div>
      </div>

      <div className={`toast ${toastOn ? "show" : ""}`} role="status">{toastMsg}</div>
    </>
  );
}

function Itinerary({ stops }: { stops: Stop[] }) {
  if (!stops.length) return <p className="day-note">ไม่พบจุดแวะในไฟล์ของวันนี้</p>;
  const away = stops.filter((s) => !s.atPump).length;
  return (
    <section className="itin">
      <h3>ไปที่ไหนบ้าง <small>{stops.length} จุด{away ? ` · นอกปั๊ม ${away}` : ""}</small></h3>
      <ol>
        {stops.map((s, i) => (
          <li key={`${s.s}-${s.title}-${i}`} className={s.atPump ? "at" : ""}>
            <i />
            <div>
              <b>{s.title}</b>
              <span>{hm(s.s)} – {hm(s.e)} · {fmtDur(s.e - s.s)}</span>
              {s.detail ? <small>{s.detail}</small> : null}
              <em>
                {s.atPump ? "อยู่ในรัศมีปั๊ม" : "นอกจุดทำงาน"}
                {s.meters != null ? ` · ${fmtMeters(s.meters)}` : ""}
                {s.source === "gps" ? " · ประมาณจากพิกัด" : ""}
              </em>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
