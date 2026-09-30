import type { Cell, SheetData } from "write-excel-file/browser";
import {
  type Cfg,
  type DayKind,
  type DayRec,
  type Store,
  SHIFTS,
  dayInfo,
  dayStops,
  eachKey,
  fmtH,
  hm,
  keyToDate,
  stopSummary,
  thaiMonth,
  thaiShort,
  weekdayShort,
} from "@/lib/workpulse";

type SheetSpec = {
  data: SheetData;
  sheet: string;
  columns: Array<{ width: number }>;
  stickyRowsCount: number;
  zoomScale?: number;
};

const INK = "#1E1B4B";
const LINE = "#DDD6FE";
const HEAD = "#4C1D95";
const HEAD2 = "#0F766E";
const HEAD3 = "#9F1239";
const TITLE = "#2E1065";

function cell(
  value: string | number,
  extra: Partial<Cell> & { textColor?: string; backgroundColor?: string } = {},
): Cell {
  return {
    value,
    fontFamily: "Tahoma",
    fontSize: 11,
    alignVertical: "center",
    borderColor: LINE,
    borderStyle: "thin",
    textColor: INK,
    ...extra,
  };
}

function blank(n: number): Cell[] {
  return Array.from({ length: n }, () => null);
}

function titleRow(text: string, cols: number, bg = TITLE, size = 18): Cell[] {
  const row: Cell[] = [
    cell(text, {
      fontWeight: "bold",
      fontSize: size,
      textColor: "#FFFFFF",
      backgroundColor: bg,
      align: "left",
      columnSpan: cols,
      height: 32,
      borderColor: bg,
    }),
  ];
  for (let i = 1; i < cols; i++) row.push(null);
  return row;
}

function subRow(text: string, cols: number, bg = "#6D28D9"): Cell[] {
  const row: Cell[] = [
    cell(text, {
      fontSize: 11,
      textColor: "#F5F3FF",
      backgroundColor: bg,
      columnSpan: cols,
      height: 20,
      borderColor: bg,
    }),
  ];
  for (let i = 1; i < cols; i++) row.push(null);
  return row;
}

function heads(labels: string[], bg: string): Cell[] {
  return labels.map((label) =>
    cell(label, {
      fontWeight: "bold",
      fontSize: 11,
      textColor: "#FFFFFF",
      backgroundColor: bg,
      align: "center",
      height: 22,
      borderColor: bg,
    }),
  );
}

const KIND_FILL: Record<DayKind, { bg: string; fg: string; label: string }> = {
  worked: { bg: "#D1FAE5", fg: "#065F46", label: "ไปทำงาน" },
  partial: { bg: "#FFEDD5", fg: "#9A3412", label: "ไม่ครบเกณฑ์" },
  absent: { bg: "#FFE4E6", fg: "#9F1239", label: "ไม่พบที่ปั๊ม" },
  off: { bg: "#F1F5F9", fg: "#475569", label: "วันหยุด" },
  out: { bg: "#FFFFFF", fg: "#64748B", label: "นอกช่วง" },
};

const SHIFT_FILL = {
  m: { bg: "#FDE68A", fg: "#78350F", label: "กะเช้า" },
  e: { bg: "#DDD6FE", fg: "#5B21B6", label: "กะบ่าย" },
  s: { bg: "#A5F3FC", fg: "#155E75", label: "Support" },
} as const;

function statusWord(st: string) {
  if (st === "ok") return "ครบเกณฑ์";
  if (st === "warn") return "ไม่ครบ";
  return "ไม่พบ";
}

function num(n: number, extra: Partial<Cell> = {}): Cell {
  return cell(Math.round(n * 100) / 100, { align: "center", format: "0.00", ...extra, type: Number });
}

export function buildSheets(store: Store, days: Map<string, DayRec>, cfg: Cfg): SheetSpec[] {
  const keys = eachKey(store);
  const infos = keys.map((key) => dayInfo(key, days, store, cfg));
  const worked = infos.filter((i) => i.kind === "worked").length;
  const partial = infos.filter((i) => i.kind === "partial").length;
  const absent = infos.filter((i) => i.kind === "absent").length;
  const off = infos.filter((i) => i.kind === "off").length;
  const cm = infos.filter((i) => i.shifts.m.st === "ok").length;
  const ce = infos.filter((i) => i.shifts.e.st === "ok").length;
  const cs = infos.filter((i) => i.supportOn).length;
  const hours = infos.reduce((a, i) => a + i.hours, 0);

  const byMonth = new Map<string, typeof infos>();
  for (const info of infos) {
    const mk = info.key.slice(0, 7);
    const list = byMonth.get(mk) || [];
    list.push(info);
    byMonth.set(mk, list);
  }

  const ovCols = 8;
  const overview: SheetData = [
    titleRow("ปฏิทินเข้างาน  ·  ปั๊มน้ำมัน", ovCols),
    subRow(
      `ข้อมูล ${thaiShort(store.min)} – ${thaiShort(store.max)}   ·   เกณฑ์ ${cfg.minHours} ชม.   ·   รัศมี ${cfg.radius} ม.   ·   พิกัด ${cfg.lat}, ${cfg.lng}`,
      ovCols,
    ),
    blank(ovCols),
    subRow("สรุปทั้งไฟล์", ovCols, "#5B21B6"),
    heads(["วันทำงาน", "กะเช้า", "กะบ่าย", "Support", "ชั่วโมงในกะ", "ไม่ครบ", "ไม่พบ", "วันหยุด"], HEAD),
    [
      num(worked, { backgroundColor: "#D1FAE5", textColor: "#065F46", fontWeight: "bold", fontSize: 16, height: 28 }),
      num(cm, { backgroundColor: "#FDE68A", textColor: "#78350F", fontWeight: "bold", fontSize: 16 }),
      num(ce, { backgroundColor: "#DDD6FE", textColor: "#5B21B6", fontWeight: "bold", fontSize: 16 }),
      num(cs, { backgroundColor: "#A5F3FC", textColor: "#155E75", fontWeight: "bold", fontSize: 16 }),
      num(hours, { backgroundColor: "#E0F2FE", textColor: "#075985", fontWeight: "bold", fontSize: 16 }),
      num(partial, { backgroundColor: "#FFEDD5", textColor: "#9A3412", fontWeight: "bold", fontSize: 16 }),
      num(absent, { backgroundColor: "#FFE4E6", textColor: "#9F1239", fontWeight: "bold", fontSize: 16 }),
      num(off, { backgroundColor: "#F1F5F9", textColor: "#475569", fontWeight: "bold", fontSize: 16 }),
    ],
    blank(ovCols),
    subRow("สรุปรายเดือน  ·  ชั่วโมงไม่นับ Support ซ้ำกับเช้า/บ่าย", ovCols, "#5B21B6"),
    heads(["เดือน", "วันทำงาน", "กะเช้า", "กะบ่าย", "Support", "ชั่วโมง", "ไม่ครบ", "ไม่พบ"], "#6D28D9"),
  ];

  let stripe = false;
  for (const [mk, list] of byMonth) {
    stripe = !stripe;
    const bg = stripe ? "#F5F3FF" : "#FFFFFF";
    overview.push([
      cell(thaiMonth(keyToDate(`${mk}-01`)), { backgroundColor: bg, fontWeight: "bold" }),
      num(list.filter((i) => i.kind === "worked").length, { backgroundColor: bg }),
      num(list.filter((i) => i.shifts.m.st === "ok").length, { backgroundColor: "#FFFBEB" }),
      num(list.filter((i) => i.shifts.e.st === "ok").length, { backgroundColor: "#F5F3FF" }),
      num(list.filter((i) => i.supportOn).length, { backgroundColor: "#ECFEFF" }),
      num(list.reduce((a, i) => a + i.hours, 0), { backgroundColor: bg, fontWeight: "bold" }),
      num(list.filter((i) => i.kind === "partial").length, { backgroundColor: bg }),
      num(list.filter((i) => i.kind === "absent").length, { backgroundColor: bg }),
    ]);
  }

  overview.push(blank(ovCols));
  overview.push(
    subRow("สีสถานะ: เขียว = ไปทำงาน · เหลือง = เช้า · ม่วง = บ่าย · ฟ้า = Support · ส้ม = ไม่ครบ · ชมพู = ไม่พบ", ovCols, "#312E81"),
  );

  const basicHead = ["วันที่", "วัน", "สถานะ", "เช้า (ชม.)", "บ่าย (ชม.)", "Support (ชม.)", "รวมในกะ", "ผลบนปฏิทิน"];
  const basic: SheetData = [
    titleRow("เข้างาน  ·  ตารางเบสิค", basicHead.length, "#4C1D95", 16),
    subRow("หนึ่งแถวต่อหนึ่งวัน  ·  Support แสดงชั่วโมงเสมอ แต่จะขึ้นกรอบบนปฏิทินเมื่อครบเกณฑ์เท่านั้น", basicHead.length),
    heads(basicHead, HEAD),
  ];
  for (const info of infos) {
    const fill = KIND_FILL[info.kind];
    const base = { backgroundColor: fill.bg, textColor: fill.fg };
    basic.push([
      cell(info.key, { ...base, align: "center", fontWeight: "bold" }),
      cell(weekdayShort(info.key), { ...base, align: "center" }),
      cell(fill.label, { ...base, align: "center", fontWeight: "bold" }),
      num(info.shifts.m.h, { backgroundColor: info.shifts.m.st === "ok" ? "#FDE68A" : fill.bg, textColor: info.shifts.m.st === "ok" ? "#78350F" : fill.fg, fontWeight: info.shifts.m.st === "ok" ? "bold" : undefined }),
      num(info.shifts.e.h, { backgroundColor: info.shifts.e.st === "ok" ? "#DDD6FE" : fill.bg, textColor: info.shifts.e.st === "ok" ? "#5B21B6" : fill.fg, fontWeight: info.shifts.e.st === "ok" ? "bold" : undefined }),
      num(info.shifts.s.h, { backgroundColor: info.supportOn ? "#A5F3FC" : fill.bg, textColor: info.supportOn ? "#155E75" : fill.fg, fontWeight: info.supportOn ? "bold" : undefined }),
      num(info.hours, { ...base, fontWeight: "bold" }),
      cell(info.supportOn ? "เช้า · บ่าย · Support" : info.inRange && info.kind !== "off" ? "เช้า · บ่าย" : "—", {
        ...base,
        align: "center",
      }),
    ]);
  }

  const deepHead = ["วันที่", "วัน", "กะ", "ช่วงเวลา", "สถานะ", "เข้า", "ออก", "ชั่วโมง", "ช่วงย่อย"];
  const deep: SheetData = [
    titleRow("รายละเอียดกะ  ·  เชิงลึก", deepHead.length, "#0F766E", 16),
    subRow("เช้า 06:00–14:00  ·  บ่าย 14:00–22:00  ·  Support 09:00–18:00 (ทับช่วงเช้าและบ่าย จึงไม่ถูกบวกซ้ำในชั่วโมงรวม)", deepHead.length, "#0F766E"),
    heads(deepHead, HEAD2),
  ];
  let rowAlt = false;
  for (const info of infos) {
    rowAlt = !rowAlt;
    for (const sh of SHIFTS) {
      const view = info.shifts[sh.key];
      const paint = SHIFT_FILL[sh.key];
      const zebra = rowAlt ? "#F8FAFC" : "#FFFFFF";
      const stFill = view.st === "ok" ? { bg: "#D1FAE5", fg: "#065F46" } : view.st === "warn" ? { bg: "#FFEDD5", fg: "#9A3412" } : { bg: zebra, fg: "#64748B" };
      deep.push([
        cell(info.key, { backgroundColor: zebra, align: "center" }),
        cell(weekdayShort(info.key), { backgroundColor: zebra, align: "center" }),
        cell(paint.label, { backgroundColor: paint.bg, textColor: paint.fg, fontWeight: "bold", align: "center" }),
        cell(sh.range, { backgroundColor: paint.bg, textColor: paint.fg, align: "center" }),
        cell(sh.key === "s" && view.st !== "ok" ? `${statusWord(view.st)} · ซ่อนบนปฏิทิน` : statusWord(view.st), {
          backgroundColor: stFill.bg,
          textColor: stFill.fg,
          align: "center",
          fontWeight: "bold",
        }),
        cell(view.rec ? hm(view.rec.first) : "—", { backgroundColor: zebra, align: "center" }),
        cell(view.rec ? hm(view.rec.last) : "—", { backgroundColor: zebra, align: "center" }),
        num(view.h, { backgroundColor: zebra, fontWeight: view.st === "ok" ? "bold" : undefined }),
        cell(view.rec ? view.rec.parts.map(([a, b]) => `${hm(a)}–${hm(b)}`).join(", ") : "—", {
          backgroundColor: zebra,
          wrap: true,
        }),
      ]);
    }
  }

  const placeHead = ["วันที่", "วัน", "ลำดับ", "เริ่ม", "ถึง", "ระยะเวลา", "สถานที่", "รายละเอียด", "ระยะจากปั๊ม", "อยู่ในรัศมี", "ที่มา"];
  const places: SheetData = [
    titleRow("สถานที่รายวัน  ·  ไปที่ไหนบ้าง", placeHead.length, "#0E7490", 16),
    subRow("รวมจุดจาก Timeline และจุดที่อยู่กับที่จากพิกัด  ·  แถวสีเขียวคืออยู่ในรัศมีปั๊ม", placeHead.length, "#0E7490"),
    heads(placeHead, "#155E75"),
  ];
  for (const info of infos) {
    const stops = dayStops(store, info.key, cfg);
    if (!stops.length) continue;
    stops.forEach((s, i) => {
      const bg = s.atPump ? "#D1FAE5" : i % 2 ? "#F0FDFA" : "#FFFFFF";
      const fg = s.atPump ? "#065F46" : INK;
      places.push([
        cell(info.key, { backgroundColor: bg, textColor: fg, align: "center" }),
        cell(weekdayShort(info.key), { backgroundColor: bg, textColor: fg, align: "center" }),
        num(i + 1, { backgroundColor: bg, textColor: fg, format: "0" }),
        cell(hm(s.s), { backgroundColor: bg, textColor: fg, align: "center" }),
        cell(hm(s.e), { backgroundColor: bg, textColor: fg, align: "center" }),
        cell(fmtH((s.e - s.s) / 3600000), { backgroundColor: bg, textColor: fg, align: "center" }),
        cell(s.title, { backgroundColor: bg, textColor: fg, fontWeight: "bold", wrap: true }),
        cell(s.detail || "—", { backgroundColor: bg, textColor: fg, wrap: true }),
        cell(s.meters == null ? "—" : String(Math.round(s.meters)), { backgroundColor: bg, textColor: fg, align: "right" }),
        cell(s.atPump ? "ใช่" : "ไม่", { backgroundColor: bg, textColor: fg, align: "center", fontWeight: "bold" }),
        cell(s.source === "visit" ? "Timeline" : "พิกัด", { backgroundColor: bg, textColor: fg, align: "center" }),
      ]);
    });
  }
  if (places.length === 3) {
    places.push([cell("ไม่พบจุดแวะในช่วงข้อมูล", { columnSpan: placeHead.length }), ...Array(placeHead.length - 1).fill(null)]);
  }

  const missHead = ["วันที่", "วัน", "สถานะ", "เช้า", "บ่าย", "Support", "รวมที่ปั๊ม", "จำนวนที่", "ไปที่ไหนบ้าง"];
  const missed: SheetData = [
    titleRow("ไม่เข้าเงื่อนไข  ·  วันที่ไม่ครบหรือไม่เข้างาน", missHead.length, "#9F1239", 16),
    subRow("เฉพาะวันทำงานที่ไม่ถึงเกณฑ์ 6–8 ชั่วโมง หรือไม่พบที่ปั๊ม  ·  คอลัมน์สุดท้ายคือรายละเอียดเส้นทาง", missHead.length, "#9F1239"),
    heads(missHead, HEAD3),
  ];
  for (const info of infos) {
    if (info.kind !== "partial" && info.kind !== "absent") continue;
    const stops = dayStops(store, info.key, cfg);
    const fill = KIND_FILL[info.kind];
    const base = { backgroundColor: fill.bg, textColor: fill.fg };
    missed.push([
      cell(info.key, { ...base, align: "center", fontWeight: "bold" }),
      cell(weekdayShort(info.key), { ...base, align: "center" }),
      cell(fill.label, { ...base, align: "center", fontWeight: "bold" }),
      cell(`${fmtH(info.shifts.m.h)} ชม.`, { ...base, align: "center" }),
      cell(`${fmtH(info.shifts.e.h)} ชม.`, { ...base, align: "center" }),
      cell(`${fmtH(info.shifts.s.h)} ชม.`, { ...base, align: "center" }),
      cell(`${fmtH(info.hours)} ชม.`, { ...base, align: "center", fontWeight: "bold" }),
      num(stops.length, { ...base, format: "0" }),
      cell(stopSummary(stops) || "ไม่พบจุดแวะในไฟล์", { ...base, wrap: true, align: "left", height: 36 }),
    ]);
  }
  if (missed.length === 3) {
    missed.push([
      cell("ไม่มีวันที่ตกเกณฑ์ในช่วงนี้", { columnSpan: missHead.length, backgroundColor: "#D1FAE5", textColor: "#065F46", fontWeight: "bold" }),
      ...Array(missHead.length - 1).fill(null),
    ]);
  }

  return [
    { data: overview, sheet: "ภาพรวม", columns: Array.from({ length: ovCols }, () => ({ width: 16 })), stickyRowsCount: 3, zoomScale: 120 },
    { data: basic, sheet: "เข้างาน", columns: [14, 10, 16, 14, 14, 16, 12, 24].map((width) => ({ width })), stickyRowsCount: 3, zoomScale: 120 },
    { data: deep, sheet: "รายละเอียดกะ", columns: [14, 10, 14, 18, 24, 10, 10, 12, 36].map((width) => ({ width })), stickyRowsCount: 3, zoomScale: 110 },
    { data: places, sheet: "สถานที่", columns: [14, 10, 8, 10, 10, 12, 24, 28, 14, 12, 12].map((width) => ({ width })), stickyRowsCount: 3, zoomScale: 110 },
    { data: missed, sheet: "ไม่เข้าเงื่อนไข", columns: [14, 10, 16, 12, 12, 14, 14, 12, 64].map((width) => ({ width })), stickyRowsCount: 3, zoomScale: 120 },
  ];
}

export async function workbookBlob(store: Store, days: Map<string, DayRec>, cfg: Cfg) {
  const writeXlsxFile = (await import("write-excel-file/browser")).default;
  return writeXlsxFile(buildSheets(store, days, cfg)).toBlob();
}
