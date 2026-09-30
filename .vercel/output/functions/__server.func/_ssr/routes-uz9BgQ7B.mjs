import { i as __toESM } from "../_runtime.mjs";
import { G as require_jsx_runtime, K as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-uz9BgQ7B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var SAMPLE_BRIDGE_MS = 27e5;
var GPS_STAY_GAP_MS = 24e5;
var GPS_STAY_RADIUS_M = 160;
var GPS_STAY_MIN_MS = 72e4;
var SHIFTS = [
	{
		key: "m",
		label: "กะเช้า",
		short: "เช้า",
		from: 6,
		to: 14,
		range: "06:00 – 14:00"
	},
	{
		key: "e",
		label: "กะบ่าย",
		short: "บ่าย",
		from: 14,
		to: 22,
		range: "14:00 – 22:00"
	},
	{
		key: "s",
		label: "ตำแหน่ง Support",
		short: "Support",
		from: 9,
		to: 18,
		range: "09:00 – 18:00"
	}
];
var SEMANTIC_TH = {
	HOME: "บ้าน",
	WORK: "ที่ทำงาน",
	INFERRED_HOME: "บ้าน",
	INFERRED_WORK: "ที่ทำงาน",
	TYPE_HOME: "บ้าน",
	TYPE_WORK: "ที่ทำงาน",
	SEARCHED: "สถานที่ที่ค้นหา",
	SEARCHED_ADDRESS: "สถานที่ที่ค้นหา",
	TYPE_SEARCHED_ADDRESS: "สถานที่ที่ค้นหา"
};
function semanticLabel(raw) {
	return SEMANTIC_TH[raw.trim().toUpperCase().replace(/[\s-]+/g, "_")] || "";
}
var DEFAULTS = {
	lat: "",
	lng: "",
	radius: 45,
	minHours: 6,
	days: [
		1,
		1,
		1,
		1,
		1,
		1,
		1
	],
	theme: "dark"
};
var LS = "workpulse-v3";
var pad = (n) => String(n).padStart(2, "0");
var ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
var keyToDate = (k) => /* @__PURE__ */ new Date(`${k}T00:00:00`);
var hm = (ms) => {
	const d = new Date(ms);
	return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
var fmtH = (h) => (Math.round(h * 10) / 10).toString();
function shiftPay(key, st) {
	if (key === "s") return 0;
	if (st === "ok") return 337;
	if (st === "half") return 337 / 2;
	return 0;
}
function fmtBaht(n) {
	const rounded = Math.round(n * 10) / 10;
	return (Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function slotLabel(key, st) {
	if (st === "none") return "";
	if (st === "warn") return "ไม่ครบ";
	if (key === "s") return "Support";
	if (key === "m") return st === "half" ? "½เช้า" : "เช้า";
	return st === "half" ? "½บ่าย" : "บ่าย";
}
var thaiLong = (k) => keyToDate(k).toLocaleDateString("th-TH", {
	weekday: "long",
	day: "numeric",
	month: "long",
	year: "numeric"
});
var thaiMonth = (d) => d.toLocaleDateString("th-TH", {
	month: "long",
	year: "numeric"
});
var thaiShort = (ms) => new Date(ms).toLocaleDateString("th-TH", {
	day: "numeric",
	month: "short",
	year: "2-digit"
});
var weekdayShort = (k) => keyToDate(k).toLocaleDateString("th-TH", { weekday: "short" });
function fmtMeters(m) {
	if (m < 1e3) return `${Math.round(m)} ม.`;
	const km = m / 1e3;
	return `${km < 10 ? km.toFixed(1) : Math.round(km)} กม.`;
}
function fmtDur(ms) {
	const m = Math.max(0, Math.round(ms / 6e4));
	const h = Math.floor(m / 60);
	const min = m % 60;
	if (h <= 0) return `${min} นาที`;
	if (min === 0) return `${h} ชม.`;
	return `${h} ชม. ${min} นาที`;
}
function haversine(aLat, aLng, bLat, bLng) {
	const R = 6371e3;
	const r = Math.PI / 180;
	const dLat = (bLat - aLat) * r;
	const dLng = (bLng - aLng) * r;
	const n = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * r) * Math.cos(bLat * r) * Math.sin(dLng / 2) ** 2;
	return 2 * R * Math.asin(Math.min(1, Math.sqrt(n)));
}
function loadCfg() {
	try {
		const raw = JSON.parse(localStorage.getItem(LS) || "null");
		if (raw) return {
			...DEFAULTS,
			...raw,
			days: Array.isArray(raw.days) ? raw.days : DEFAULTS.days
		};
		const old = JSON.parse(localStorage.getItem("workpulse-v2") || localStorage.getItem("workpulse-gas") || "null");
		if (old) return {
			...DEFAULTS,
			lat: old.lat || "",
			lng: old.lng || "",
			radius: Number(old.radius) || 45,
			minHours: clampHours(Number(old.minHours) || 6),
			days: Array.isArray(old.days) ? old.days : DEFAULTS.days,
			theme: old.theme === "light" ? "light" : "dark"
		};
	} catch {}
	return {
		...DEFAULTS,
		days: [...DEFAULTS.days]
	};
}
function saveCfg(cfg) {
	try {
		localStorage.setItem(LS, JSON.stringify(cfg));
	} catch {}
}
function clampHours(n) {
	return Math.max(6, Math.min(8, Math.round(n * 2) / 2 || 6));
}
var idb = () => new Promise((res, rej) => {
	const r = indexedDB.open("workpulse", 1);
	r.onupgradeneeded = () => {
		if (!r.result.objectStoreNames.contains("kv")) r.result.createObjectStore("kv");
	};
	r.onsuccess = () => res(r.result);
	r.onerror = () => rej(r.error);
});
async function kvGet(k) {
	const db = await idb();
	return new Promise((res, rej) => {
		const q = db.transaction("kv").objectStore("kv").get(k);
		q.onsuccess = () => res(q.result);
		q.onerror = () => rej(q.error);
	});
}
async function kvSet(k, v) {
	const db = await idb();
	return new Promise((res, rej) => {
		const t = db.transaction("kv", "readwrite");
		t.objectStore("kv").put(v, k);
		t.oncomplete = () => res();
		t.onerror = () => rej(t.error);
	});
}
async function kvDel(k) {
	const db = await idb();
	return new Promise((res, rej) => {
		const t = db.transaction("kv", "readwrite");
		t.objectStore("kv").delete(k);
		t.oncomplete = () => res();
		t.onerror = () => rej(t.error);
	});
}
function asRecord(v) {
	return v && typeof v === "object" && !Array.isArray(v) ? v : null;
}
function parseLatLng(value) {
	if (value == null) return null;
	if (typeof value === "object") {
		const o = value;
		if (o.latLng) return parseLatLng(o.latLng);
		if (typeof o.latitudeE7 === "number" && typeof o.longitudeE7 === "number") return {
			lat: o.latitudeE7 / 1e7,
			lng: o.longitudeE7 / 1e7
		};
		if (typeof o.latitude === "number" && typeof o.longitude === "number") return {
			lat: o.latitude,
			lng: o.longitude
		};
		if (typeof o.lat === "number" && typeof o.lng === "number") return {
			lat: o.lat,
			lng: o.lng
		};
		return null;
	}
	const text = String(value);
	const geo = text.match(/geo:(-?\d+\.?\d*),(-?\d+\.?\d*)/i);
	if (geo) return {
		lat: +geo[1],
		lng: +geo[2]
	};
	const deg = text.match(/(-?\d+\.?\d*)\s*°\s*,\s*(-?\d+\.?\d*)\s*°?/);
	if (deg) return {
		lat: +deg[1],
		lng: +deg[2]
	};
	const plain = text.match(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
	if (plain) return {
		lat: +plain[1],
		lng: +plain[2]
	};
	return null;
}
function toMs(v) {
	if (v == null || v === "") return NaN;
	if (typeof v === "number") return v > 0xe8d4a51000 ? v : v * 1e3;
	if (typeof v === "string" && /^\d+$/.test(v)) {
		const n = Number(v);
		return n > 0xe8d4a51000 ? n : n * 1e3;
	}
	return Date.parse(String(v));
}
function pickStr(...vals) {
	for (const v of vals) if (typeof v === "string") {
		const t = v.trim();
		if (t && !t.startsWith("geo:") && !/^ChIJ/.test(t)) return t;
	}
	return "";
}
function textOf(v) {
	if (typeof v === "string") return pickStr(v);
	const o = asRecord(v);
	if (!o) return "";
	return pickStr(o.text, o.value, o.name);
}
function pickId(...vals) {
	for (const v of vals) if (typeof v === "string") {
		const t = v.trim();
		if (t.startsWith("ChIJ") || t.startsWith("GhIJ")) return t;
	}
	return "";
}
function encodeMeta(name, address, semantic, placeId = "") {
	return [
		name,
		address,
		semantic,
		placeId
	].join("");
}
function decodeMeta(raw) {
	const [name = "", address = "", semantic = "", placeId = ""] = (raw || "").split("");
	return {
		name,
		address,
		semantic,
		placeId
	};
}
function metaFromVisit(node, loc) {
	const pools = [
		asRecord(node.topCandidate) || asRecord(node.location) || asRecord(loc),
		asRecord(node.location),
		asRecord(loc),
		asRecord(node.placeLocation)
	];
	if (Array.isArray(node.otherCandidate)) pools.push(...node.otherCandidate.map(asRecord));
	if (Array.isArray(node.otherCandidates)) pools.push(...node.otherCandidates.map(asRecord));
	let name = "";
	let address = "";
	let semantic = "";
	let placeId = "";
	for (const p of pools) {
		if (!p) continue;
		const placeLoc = asRecord(p.placeLocation);
		if (!name) name = pickStr(p.name, p.placeName, p.candidateName, textOf(p.displayName), placeLoc?.name, textOf(placeLoc?.displayName));
		if (!address) address = pickStr(p.address, p.formattedAddress, p.formatted_address, placeLoc?.address);
		if (!semantic && typeof p.semanticType === "string") semantic = p.semanticType;
		if (!placeId) placeId = pickId(p.placeId, p.placeID, p.place_id, placeLoc?.placeId, placeLoc?.placeID);
	}
	if (!semantic && typeof node.semanticType === "string") semantic = node.semanticType;
	if (!placeId) placeId = pickId(node.placeId, node.placeID);
	return encodeMeta(name, address, semantic, placeId);
}
function extract(data) {
	const visits = [];
	const visitMeta = [];
	const samples = [];
	const addVisit = (s, e, p, meta) => {
		if (p && Number.isFinite(s) && Number.isFinite(e) && e > s) {
			visits.push(s, e, p.lat, p.lng);
			visitMeta.push(meta);
		}
	};
	const addSample = (t, p) => {
		if (p && Number.isFinite(t)) samples.push(t, p.lat, p.lng);
	};
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		if (Array.isArray(node)) {
			for (const x of node) walk(x);
			return;
		}
		const o = node;
		if (o.latitudeE7 != null && (o.timestamp || o.timestampMs)) {
			addSample(toMs(o.timestamp || o.timestampMs), parseLatLng(o));
			return;
		}
		if (o.visit && typeof o.visit === "object") {
			const v = o.visit;
			const top = asRecord(v.topCandidate);
			addVisit(toMs(o.startTime), toMs(o.endTime), parseLatLng(top?.placeLocation ?? top), metaFromVisit(v, top));
			return;
		}
		if (o.placeVisit && typeof o.placeVisit === "object") {
			const v = o.placeVisit;
			const d = asRecord(v.duration) || {};
			const location = asRecord(v.location);
			const loc = location?.latitudeE7 != null ? location : v.centerLatE7 != null ? {
				latitudeE7: v.centerLatE7,
				longitudeE7: v.centerLngE7
			} : location;
			addVisit(toMs(d.startTimestamp || d.startTimestampMs), toMs(d.endTimestamp || d.endTimestampMs), parseLatLng(loc), metaFromVisit(v, loc));
			return;
		}
		if (o.activity || o.activitySegment) return;
		if (Array.isArray(o.timelinePath)) {
			const base = toMs(o.startTime);
			for (const p of o.timelinePath) {
				const pt = asRecord(p);
				if (!pt) continue;
				const t = pt.time ? toMs(pt.time) : base + (Number(pt.durationMinutesOffsetFromStartTime) || 0) * 6e4;
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
		name: ""
	};
}
function extractPlaces(data) {
	const freq = asRecord(asRecord(data)?.userLocationProfile)?.frequentPlaces;
	if (!Array.isArray(freq)) return [];
	const out = [];
	for (const item of freq) {
		const p = asRecord(item);
		if (!p) continue;
		const loc = parseLatLng(p.placeLocation || p);
		if (!loc) continue;
		out.push({
			label: pickStr(p.label, p.name) || "สถานที่ที่ไปบ่อย",
			lat: loc.lat,
			lng: loc.lng
		});
	}
	return out;
}
function normalizeStore(raw) {
	const o = asRecord(raw);
	if (!o || o.visits == null || o.samples == null) return null;
	const visits = o.visits instanceof Float64Array ? o.visits : Float64Array.from(o.visits);
	const samples = o.samples instanceof Float64Array ? o.samples : Float64Array.from(o.samples);
	if (visits.length % 4 !== 0 || samples.length % 3 !== 0) return null;
	return {
		visits,
		samples,
		visitMeta: Array.isArray(o.visitMeta) ? o.visitMeta.map(String) : [],
		min: Number(o.min) || 0,
		max: Number(o.max) || 0,
		count: Number(o.count) || visits.length / 4 + samples.length / 3,
		name: typeof o.name === "string" ? o.name : "Timeline"
	};
}
function stationOf(cfg) {
	const lat = parseFloat(cfg.lat);
	const lng = parseFloat(cfg.lng);
	if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
	return {
		lat,
		lng,
		radius: Number(cfg.radius) || 45
	};
}
function analyze(store, cfg) {
	const station = stationOf(cfg);
	const pieces = [];
	if (station) {
		const V = store.visits;
		for (let i = 0; i < V.length; i += 4) if (haversine(station.lat, station.lng, V[i + 2], V[i + 3]) <= station.radius) pieces.push([V[i], V[i + 1]]);
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
	const merged = [];
	for (const p of pieces) {
		const last = merged[merged.length - 1];
		if (last && p[0] <= last[1]) last[1] = Math.max(last[1], p[1]);
		else merged.push([p[0], p[1]]);
	}
	const days = /* @__PURE__ */ new Map();
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
				const r = rec[sh.key] || (rec[sh.key] = {
					ms: 0,
					first: a,
					last: b,
					parts: []
				});
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
function dayInfo(key, days, store, cfg, now = /* @__PURE__ */ new Date()) {
	const minH = clampHours(Number(cfg.minHours) || 6);
	const rec = days.get(key) || {};
	const date = keyToDate(key);
	const todayKey = ymd(now);
	const hasData = !!store && cfg.lat !== "" && cfg.lng !== "";
	const minKey = hasData && store ? ymd(new Date(store.min)) : "";
	const maxKey = hasData && store ? ymd(new Date(store.max)) : "";
	const inRange = !!hasData && key >= minKey && key <= maxKey && key <= todayKey;
	const shifts = {};
	let okCount = 0;
	let warnAny = false;
	let totalMs = 0;
	for (const sh of SHIFTS) {
		const r = rec[sh.key];
		const h = r ? r.ms / 36e5 : 0;
		const st = h >= minH ? "ok" : h + 1e-6 >= 3.5 ? "half" : h >= .25 ? "warn" : "none";
		if (st === "ok" || st === "half" && sh.key !== "s") okCount++;
		if (st === "warn") warnAny = true;
		if (r && sh.key !== "s") totalMs += r.ms;
		shifts[sh.key] = r ? {
			st,
			h,
			rec: r
		} : {
			st,
			h
		};
	}
	const workDay = !!cfg.days[date.getDay()];
	let kind;
	if (!inRange) kind = "out";
	else if (okCount) kind = "worked";
	else if (!workDay) kind = "off";
	else if (warnAny) kind = "partial";
	else kind = "absent";
	const supportOn = inRange && shifts.s.st === "ok";
	const pay = shiftPay("m", shifts.m.st) + shiftPay("e", shifts.e.st);
	return {
		key,
		kind,
		shifts,
		okCount,
		hours: totalMs / 36e5,
		pay,
		inRange,
		minH,
		supportOn
	};
}
function calendarShiftKeys(info) {
	if (!info.inRange || info.kind === "off") return [];
	const keys = [];
	if (info.shifts.m.st !== "none") keys.push("m");
	if (info.shifts.e.st !== "none") keys.push("e");
	if (info.supportOn) keys.push("s");
	return keys;
}
var KIND_LABEL = {
	worked: "ไปทำงาน",
	partial: "อยู่ที่ปั๊มไม่ครบเกณฑ์",
	absent: "ไม่พบที่ปั๊ม",
	off: "วันหยุดที่ตั้งไว้",
	out: "ไม่มีข้อมูลของวันนี้"
};
function dayBounds(key) {
	const a = keyToDate(key).getTime();
	return [a, a + 864e5];
}
function lowerBound(samples, t) {
	let lo = 0;
	let hi = samples.length / 3;
	while (lo < hi) {
		const mid = lo + hi >> 1;
		if (samples[mid * 3] < t) lo = mid + 1;
		else hi = mid;
	}
	return lo;
}
function shortAddress(address) {
	const clean = address.replace(/\s+/g, " ").trim();
	if (!clean) return "";
	const part = clean.split(",")[0]?.trim() || clean;
	return part.length > 48 ? `${part.slice(0, 48)}…` : part;
}
function mapsHref(lat, lng, placeId = "") {
	const q = `${lat.toFixed(6)},${lng.toFixed(6)}`;
	const base = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
	return placeId ? `${base}&query_place_id=${encodeURIComponent(placeId)}` : base;
}
function placeTitle(meta, atPump) {
	if (atPump && !meta.name && !meta.address) return "ปั๊มน้ำมัน";
	if (meta.name) return meta.name;
	const sem = semanticLabel(meta.semantic);
	if (sem) return sem;
	const addr = shortAddress(meta.address);
	if (addr) return addr;
	return atPump ? "ปั๊มน้ำมัน" : "สถานที่ไม่มีชื่อ";
}
var GENERIC_TITLES = /* @__PURE__ */ new Set(["สถานที่ไม่มีชื่อ", "จุดที่อยู่กับที่"]);
function stopNeedsName(title) {
	return GENERIC_TITLES.has(title);
}
function dayStops(store, key, cfg) {
	const [day0, day1] = dayBounds(key);
	const station = stationOf(cfg);
	const stops = [];
	const V = store.visits;
	for (let i = 0; i < V.length; i += 4) {
		const s = V[i];
		const e = V[i + 1];
		if (e <= day0 || s >= day1) continue;
		const cs = Math.max(s, day0);
		const ce = Math.min(e, day1);
		if (ce - cs < 18e4) continue;
		const lat = V[i + 2];
		const lng = V[i + 3];
		const meta = decodeMeta(store.visitMeta[i / 4]);
		const meters = station ? haversine(station.lat, station.lng, lat, lng) : null;
		const atPump = meters != null && meters <= station.radius;
		const sem = semanticLabel(meta.semantic);
		const detailParts = [meta.address, meta.name && sem && meta.name !== sem ? sem : ""].filter(Boolean);
		if (!detailParts.length) detailParts.push(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
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
			placeId: meta.placeId,
			mapsUrl: mapsHref(lat, lng, meta.placeId)
		});
	}
	const clusters = [];
	const S = store.samples;
	const n = S.length / 3;
	let cur = null;
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
			cur = {
				s: t,
				e: t,
				sumLat: lat,
				sumLng: lng,
				n: 1
			};
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
			cur = {
				s: t,
				e: t,
				sumLat: lat,
				sumLng: lng,
				n: 1
			};
		}
	}
	flush();
	for (const c of clusters) {
		if (c.e - c.s < GPS_STAY_MIN_MS || c.n < 2) continue;
		const lat = c.sumLat / c.n;
		const lng = c.sumLng / c.n;
		if (stops.reduce((acc, st) => acc + overlap(c.s, c.e, st.s, st.e), 0) > (c.e - c.s) * .5) continue;
		const meters = station ? haversine(station.lat, station.lng, lat, lng) : null;
		const atPump = meters != null && meters <= station.radius;
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
			placeId: "",
			mapsUrl: mapsHref(lat, lng)
		});
	}
	stops.sort((a, b) => a.s - b.s);
	const merged = [];
	for (const s of stops) {
		const last = merged[merged.length - 1];
		const near = last && s.title === last.title && s.atPump === last.atPump && s.source === last.source && s.s - last.e < 9e5 && haversine(last.lat, last.lng, s.lat, s.lng) < 220;
		if (last && near) last.e = Math.max(last.e, s.e);
		else merged.push({ ...s });
	}
	return merged;
}
var GEO_KEY = "wp-place-names";
function geoKey(lat, lng) {
	return `${lat.toFixed(4)},${lng.toFixed(4)}`;
}
function readGeoCache() {
	try {
		const raw = JSON.parse(localStorage.getItem(GEO_KEY) || "{}");
		if (!raw || typeof raw !== "object") return {};
		return raw;
	} catch {
		return {};
	}
}
function labelFromPhoton(data) {
	const root = asRecord(data);
	const props = asRecord(asRecord((root && Array.isArray(root.features) ? root.features : [])[0])?.properties);
	if (!props) return "";
	const parts = [
		props.name,
		props.street,
		props.district,
		props.city
	].map((v) => typeof v === "string" ? v.trim() : "").filter(Boolean);
	return [...new Set(parts)].slice(0, 2).join(" · ");
}
function labelFromLocality(data) {
	const o = asRecord(data);
	if (!o) return "";
	const info = asRecord(o.localityInfo);
	const hit = (Array.isArray(info?.informative) ? info.informative : []).map(asRecord).filter((row) => !!row && typeof row.name === "string").sort((a, b) => Number(b.order || 0) - Number(a.order || 0)).find((row) => !/ประเทศ|country|ทวีป|continent/i.test(`${row.description || ""} ${row.name}`));
	const name = typeof hit?.name === "string" ? hit.name : "";
	const city = typeof o.city === "string" ? o.city : typeof o.locality === "string" ? o.locality : "";
	if (name && city && city !== name) return `${name} · ${city}`;
	return name || city || (typeof o.principalSubdivision === "string" ? o.principalSubdivision : "");
}
async function reverseName(lat, lng) {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), 7e3);
	try {
		const photon = await fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}&lang=th`, { signal: ctrl.signal });
		if (photon.ok) {
			const label = labelFromPhoton(await photon.json());
			if (label) return label;
		}
	} catch {} finally {
		clearTimeout(timer);
	}
	try {
		const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=th`);
		if (!res.ok) return "";
		return labelFromLocality(await res.json());
	} catch {
		return "";
	}
}
/** เติมชื่อสถานที่เมื่อไฟล์ Timeline ไม่มีชื่อ แต่มีพิกัด */
async function enrichStops(stops) {
	const cache = readGeoCache();
	const next = stops.map((s) => ({ ...s }));
	let dirty = false;
	for (const stop of next) {
		if (!stopNeedsName(stop.title)) continue;
		const key = geoKey(stop.lat, stop.lng);
		let name = cache[key] || "";
		if (!name) {
			name = await reverseName(stop.lat, stop.lng);
			if (name) {
				cache[key] = name;
				dirty = true;
			}
		}
		if (name) stop.title = name;
	}
	if (dirty) {
		const keys = Object.keys(cache);
		const trimmed = keys.length > 500 ? Object.fromEntries(keys.slice(-400).map((k) => [k, cache[k]])) : cache;
		try {
			localStorage.setItem(GEO_KEY, JSON.stringify(trimmed));
		} catch {}
	}
	return next;
}
function overlap(a0, a1, b0, b1) {
	return Math.max(0, Math.min(a1, b1) - Math.max(a0, b0));
}
function stopSummary(stops) {
	if (!stops.length) return "";
	return stops.map((s) => `${hm(s.s)}–${hm(s.e)} ${s.title}${s.atPump ? " (ปั๊ม)" : ""}`).join(" · ");
}
function eachKey(store, now = /* @__PURE__ */ new Date()) {
	const from = new Date(store.min);
	from.setHours(0, 0, 0, 0);
	const to = new Date(Math.min(store.max, now.getTime()));
	to.setHours(0, 0, 0, 0);
	const keys = [];
	for (const d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) keys.push(ymd(d));
	return keys;
}
function monthStats(days, store, cfg, view) {
	const y = view.getFullYear();
	const m = view.getMonth();
	const dim = new Date(y, m + 1, 0).getDate();
	let okDays = 0;
	let cm = 0;
	let ce = 0;
	let cs = 0;
	let hours = 0;
	let pay = 0;
	let half = 0;
	let warn = 0;
	let bad = 0;
	for (let d = 1; d <= dim; d++) {
		const info = dayInfo(`${y}-${pad(m + 1)}-${pad(d)}`, days, store, cfg);
		if (!info.inRange) continue;
		hours += info.hours;
		pay += info.pay;
		if (info.pay > 0) okDays++;
		if (info.shifts.m.st === "ok") cm++;
		if (info.shifts.e.st === "ok") ce++;
		if (info.shifts.m.st === "half" || info.shifts.e.st === "half") half++;
		if (info.supportOn) cs++;
		if (info.kind === "partial") warn++;
		if (info.kind === "absent") bad++;
	}
	return {
		okDays,
		cm,
		ce,
		cs,
		hours,
		pay,
		half,
		warn,
		bad
	};
}
/** ข้อมูลตัวอย่างให้เห็นกรอบ Support และวันที่ไม่เข้าเงื่อนไข โดยไม่ต้องมีไฟล์ Timeline */
function demoStore(now = /* @__PURE__ */ new Date()) {
	const pump = {
		lat: 13.7462,
		lng: 100.5391
	};
	const home = {
		lat: 13.786,
		lng: 100.551
	};
	const mall = {
		lat: 13.7465,
		lng: 100.5698
	};
	const cafe = {
		lat: 13.732,
		lng: 100.53
	};
	const market = {
		lat: 13.758,
		lng: 100.52
	};
	const visits = [];
	const visitMeta = [];
	const add = (day, sh, sm, eh, em, loc, name, address = "", semantic = "") => {
		const s = new Date(day);
		s.setHours(sh, sm, 0, 0);
		const e = new Date(day);
		e.setHours(eh, em, 0, 0);
		if (e <= s) return;
		visits.push(s.getTime(), e.getTime(), loc.lat, loc.lng);
		visitMeta.push(encodeMeta(name, address, semantic));
	};
	for (let back = 34; back >= 0; back--) {
		const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - back);
		const mode = day.getDate() % 6;
		if (day.getDate() % 10 === 4) {
			add(day, 14, 0, 18, 12, pump, "ปั๊มน้ำมัน", "ครึ่งกะบ่าย ประมาณ 4 ชั่วโมง", "WORK");
			add(day, 10, 0, 12, 20, mall, "ห้างสรรพสินค้า", "ก่อนเข้ากะ", "");
		} else if (mode === 0) add(day, 6, 4, 14, 6, pump, "ปั๊มน้ำมัน", "จุดที่ปักหมุด", "WORK");
		else if (mode === 1) add(day, 13, 56, 22, 4, pump, "ปั๊มน้ำมัน", "จุดที่ปักหมุด", "WORK");
		else if (mode === 2) add(day, 8, 52, 18, 8, pump, "ปั๊มน้ำมัน", "ช่วง Support 09:00–18:00", "WORK");
		else if (mode === 3) {
			add(day, 6, 0, 10, 5, pump, "ปั๊มน้ำมัน", "ครึ่งกะเช้า ประมาณ 4 ชั่วโมง", "WORK");
			add(day, 11, 10, 13, 40, mall, "ห้างสรรพสินค้า", "หลังเลิกครึ่งกะ", "");
			add(day, 15, 0, 16, 20, cafe, "ร้านกาแฟ", "", "");
		} else if (mode === 4) {
			add(day, 0, 10, 8, 40, home, "บ้าน", "", "HOME");
			add(day, 9, 5, 10, 20, market, "ตลาด", "", "");
			add(day, 11, 0, 15, 45, mall, "ห้างสรรพสินค้า", "", "");
			add(day, 16, 30, 23, 40, home, "บ้าน", "", "HOME");
		} else {
			add(day, 6, 10, 8, 25, pump, "ปั๊มน้ำมัน", "อยู่ไม่ถึง 4 ชั่วโมง", "WORK");
			add(day, 10, 0, 12, 30, mall, "ห้างสรรพสินค้า", "ออกจากปั๊มก่อนครบครึ่งกะ", "");
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
			samples: /* @__PURE__ */ new Float64Array(),
			min,
			max,
			count: visits.length / 4,
			name: "ข้อมูลตัวอย่าง"
		},
		cfg: {
			...DEFAULTS,
			lat: pump.lat.toFixed(6),
			lng: pump.lng.toFixed(6),
			radius: 80,
			minHours: 6,
			days: [
				1,
				1,
				1,
				1,
				1,
				1,
				1
			]
		}
	};
}
var DAY_OPTS = [
	{
		v: 1,
		t: "จ"
	},
	{
		v: 2,
		t: "อ"
	},
	{
		v: 3,
		t: "พ"
	},
	{
		v: 4,
		t: "พฤ"
	},
	{
		v: 5,
		t: "ศ"
	},
	{
		v: 6,
		t: "ส"
	},
	{
		v: 0,
		t: "อา"
	}
];
function shiftBadge(key, info) {
	const s = info.shifts[key];
	if (!info.inRange) return ["mute", "ไม่มีข้อมูล"];
	if (key === "s") {
		if (s.st === "ok") return ["ok", "ขึ้นบนปฏิทิน"];
		if (s.st === "half" || s.st === "warn") return ["warn", "ไม่ครบ · ซ่อนไว้"];
		return ["none", "ไม่พบ · ซ่อนไว้"];
	}
	if (s.st === "ok") return ["ok", "เต็มกะ 337 บาท"];
	if (s.st === "half") return ["half", key === "m" ? "ครึ่งกะเช้า 168.5" : "ครึ่งกะบ่าย 168.5"];
	if (s.st === "warn") return ["warn", "ไม่ถึงครึ่งกะ"];
	return ["none", "ไม่พบ"];
}
function WorkApp() {
	const [booted, setBooted] = (0, import_react.useState)(false);
	const [cfg, setCfg] = (0, import_react.useState)({
		...DEFAULTS,
		days: [...DEFAULTS.days]
	});
	const [store, setStore] = (0, import_react.useState)(null);
	const [days, setDays] = (0, import_react.useState)(() => /* @__PURE__ */ new Map());
	const [view, setView] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [sheet, setSheet] = (0, import_react.useState)(null);
	const [toastMsg, setToastMsg] = (0, import_react.useState)("");
	const [toastOn, setToastOn] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [fileName, setFileName] = (0, import_react.useState)("เลือกไฟล์ JSON จากมือถือ");
	const [fileInfo, setFileInfo] = (0, import_react.useState)("ประมวลผลในเครื่อง ไม่ถูกส่งไปที่ไหน");
	const [places, setPlaces] = (0, import_react.useState)([]);
	const [mapOff, setMapOff] = (0, import_react.useState)(false);
	const [exporting, setExporting] = (0, import_react.useState)(false);
	const [jump, setJump] = (0, import_react.useState)("");
	const [query, setQuery] = (0, import_react.useState)("");
	const [installEvt, setInstallEvt] = (0, import_react.useState)(null);
	const [standalone, setStandalone] = (0, import_react.useState)(false);
	const [stops, setStops] = (0, import_react.useState)([]);
	const [naming, setNaming] = (0, import_react.useState)(false);
	const toastTimer = (0, import_react.useRef)(0);
	const mapEl = (0, import_react.useRef)(null);
	const mapHandle = (0, import_react.useRef)(null);
	const leafletRef = (0, import_react.useRef)(null);
	const cfgRef = (0, import_react.useRef)(cfg);
	cfgRef.current = cfg;
	const touch = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	function toast(msg) {
		setToastMsg(msg);
		setToastOn(true);
		window.clearTimeout(toastTimer.current);
		toastTimer.current = window.setTimeout(() => setToastOn(false), 2800);
	}
	async function installApp() {
		if (installEvt) {
			await installEvt.prompt();
			if ((await installEvt.userChoice).outcome === "accepted") {
				setInstallEvt(null);
				setStandalone(true);
				toast("ติดตั้งแล้ว ไอคอนปฏิทินอยู่ที่หน้าจอหลัก");
			}
			return;
		}
		toast(/iphone|ipad|ipod/i.test(navigator.userAgent) ? "บน iPhone กดแชร์ แล้วเลือก เพิ่มไปยังหน้าจอโฮม" : "เปิดเมนู Chrome ⋮ แล้วเลือก ติดตั้งแอป");
	}
	(0, import_react.useEffect)(() => {
		let dead = false;
		(async () => {
			const loaded = loadCfg();
			if (dead) return;
			setCfg(loaded);
			try {
				const saved = normalizeStore(await kvGet("store"));
				if (dead) return;
				if (saved) {
					setStore(saved);
					setFileName(saved.name || "ไฟล์ Timeline");
					setFileInfo(`${saved.count.toLocaleString("th-TH")} รายการ · ${thaiShort(saved.min)} – ${thaiShort(saved.max)}`);
					if (loaded.lat !== "" && loaded.lng !== "") {
						setDays(analyze(saved, loaded));
						const t = /* @__PURE__ */ new Date();
						if (ymd(t) > ymd(new Date(saved.max))) {
							const m = new Date(saved.max);
							setView(new Date(m.getFullYear(), m.getMonth(), 1));
						} else setView(new Date(t.getFullYear(), t.getMonth(), 1));
					}
				} else {
					const t = /* @__PURE__ */ new Date();
					setView(new Date(t.getFullYear(), t.getMonth(), 1));
				}
			} catch {
				const t = /* @__PURE__ */ new Date();
				setView(new Date(t.getFullYear(), t.getMonth(), 1));
			}
			if (!dead) setBooted(true);
		})();
		return () => {
			dead = true;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		document.documentElement.dataset.theme = cfg.theme;
		document.querySelector("meta[name=\"theme-color\"]")?.setAttribute("content", cfg.theme === "dark" ? "#070c18" : "#e7eef8");
	}, [cfg.theme]);
	(0, import_react.useEffect)(() => {
		const media = window.matchMedia("(display-mode: standalone)");
		const sync = () => {
			setStandalone(media.matches || navigator.standalone === true);
		};
		sync();
		media.addEventListener("change", sync);
		const onPrompt = (event) => {
			event.preventDefault();
			setInstallEvt(event);
		};
		window.addEventListener("beforeinstallprompt", onPrompt);
		if ("serviceWorker" in navigator) {
			const worker = new URL("sw.js", document.baseURI);
			const scope = new URL("./", document.baseURI);
			navigator.serviceWorker.register(worker.href, { scope: scope.href }).catch(() => {});
		}
		return () => {
			media.removeEventListener("change", sync);
			window.removeEventListener("beforeinstallprompt", onPrompt);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (sheet !== "set") return;
		let dead = false;
		(async () => {
			if (mapHandle.current) {
				setTimeout(() => mapHandle.current?.map.invalidateSize(), 260);
				return;
			}
			if (!mapEl.current) return;
			try {
				const imported = await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
				if (dead || !mapEl.current) return;
				const ns = imported.map ? imported : imported.default;
				const map = ns.map(mapEl.current, { zoomControl: false });
				map.setView([13.7563, 100.5018], 12);
				ns.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap" }).addTo(map);
				leafletRef.current = ns;
				mapHandle.current = {
					map,
					live: false,
					marker: { setLatLng: () => {} },
					circle: {
						setLatLng: () => {},
						setRadius: () => {}
					}
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
	function pin(lat, lng, pan = true) {
		setCfg((c) => ({
			...c,
			lat: lat.toFixed(6),
			lng: lng.toFixed(6)
		}));
		const L = leafletRef.current;
		const handle = mapHandle.current;
		if (!L || !handle) return;
		const ll = [lat, lng];
		const radius = Number(cfgRef.current.radius) || 45;
		if (!handle.live) {
			const marker = L.circleMarker(ll, {
				radius: 8,
				color: "#7c3aed",
				weight: 2,
				fillColor: "#f59e0b",
				fillOpacity: 1
			});
			const circle = L.circle(ll, {
				radius,
				color: "#22d3ee",
				weight: 1.5,
				fillColor: "#22d3ee",
				fillOpacity: .16
			});
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
	async function searchPlace(q) {
		const text = q.trim();
		if (!text) return;
		try {
			const data = await (await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}`)).json();
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
	function patch(partial) {
		setCfg((c) => ({
			...c,
			...partial
		}));
	}
	async function onFile(file) {
		setError("");
		setFileInfo("กำลังอ่านไฟล์…");
		try {
			const data = JSON.parse(await file.text());
			const next = extract(data);
			if (!next.count) throw new Error("ไม่พบข้อมูลตำแหน่งในไฟล์นี้ ลองส่งออก Timeline ใหม่");
			next.name = file.name;
			setStore(next);
			await kvSet("store", {
				...next,
				visits: next.visits,
				samples: next.samples,
				visitMeta: next.visitMeta
			});
			setFileName(file.name);
			setFileInfo(`${next.count.toLocaleString("th-TH")} รายการ · ${thaiShort(next.min)} – ${thaiShort(next.max)}`);
			setPlaces(extractPlaces(data));
			if (cfgRef.current.lat && cfgRef.current.lng) {
				const applied = {
					...cfgRef.current,
					minHours: clampHours(cfgRef.current.minHours)
				};
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
		const next = {
			...cfg,
			minHours: clampHours(cfg.minHours),
			radius: Number(cfg.radius) || 45
		};
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
		const t = /* @__PURE__ */ new Date();
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
		setDays(/* @__PURE__ */ new Map());
		setPlaces([]);
		setFileName("เลือกไฟล์ JSON จากมือถือ");
		setFileInfo("ประมวลผลในเครื่อง ไม่ถูกส่งไปที่ไหน");
		toast("ล้างข้อมูลแล้ว");
	}
	async function saveBlob(blob, name) {
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = name;
		document.body.appendChild(a);
		a.click();
		a.remove();
		setTimeout(() => URL.revokeObjectURL(a.href), 4e3);
	}
	async function exportExcel() {
		if (!store) return;
		setExporting(true);
		try {
			const { workbookBlob, attendanceCsv } = await import("./excel-export-DFJuY9Ni.mjs");
			const blob = await workbookBlob(store, days, cfg);
			const stamp = ymd(/* @__PURE__ */ new Date());
			await saveBlob(blob, `เข้างาน-${stamp}.xlsx`);
			await new Promise((r) => setTimeout(r, 400));
			await saveBlob(new Blob([attendanceCsv(store, days, cfg)], { type: "text/csv;charset=utf-8" }), `เข้างาน-${stamp}.csv`);
			toast("ส่งออก Excel และ CSV แล้ว");
		} catch (err) {
			try {
				const { attendanceCsv } = await import("./excel-export-DFJuY9Ni.mjs");
				const stamp = ymd(/* @__PURE__ */ new Date());
				await saveBlob(new Blob([attendanceCsv(store, days, cfg)], { type: "text/csv;charset=utf-8" }), `เข้างาน-${stamp}.csv`);
				toast("Excel สร้างไม่ได้ จึงส่ง CSV ให้แทน");
			} catch (err2) {
				setError(err2 instanceof Error ? err2.message : err instanceof Error ? err.message : "ส่งออกไม่ได้");
				setSheet("set");
			}
		} finally {
			setExporting(false);
		}
	}
	function openDay(key) {
		setSelected(key);
		setSheet("day");
	}
	const y = view.getFullYear();
	const m = view.getMonth();
	const startPad = new Date(y, m, 1).getDay();
	const dim = new Date(y, m + 1, 0).getDate();
	const rows = Math.ceil((startPad + dim) / 7);
	const stats = monthStats(days, store, cfg, new Date(y, m, 1));
	const todayKey = ymd(/* @__PURE__ */ new Date());
	const showEmpty = booted && (!store || cfg.lat === "");
	const activeInfo = selected ? dayInfo(selected, days, store, cfg) : null;
	const rawStops = (0, import_react.useMemo)(() => store && selected ? dayStops(store, selected, cfg) : [], [
		store,
		selected,
		cfg
	]);
	(0, import_react.useEffect)(() => {
		let dead = false;
		setStops(rawStops);
		if (!rawStops.some((stop) => stopNeedsName(stop.title))) {
			setNaming(false);
			return;
		}
		setNaming(true);
		enrichStops(rawStops).then((next) => {
			if (dead) return;
			setStops(next);
			setNaming(false);
		});
		return () => {
			dead = true;
		};
	}, [rawStops]);
	const cells = [];
	for (let i = 0; i < startPad; i++) cells.push({ blank: true });
	for (let d = 1; d <= dim; d++) {
		const key = `${y}-${pad(m + 1)}-${pad(d)}`;
		cells.push({
			key,
			day: d,
			info: dayInfo(key, days, store, cfg)
		});
	}
	if (!booted) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "aurora",
		"aria-hidden": "true"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "app",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "top",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "brand",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "logo",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						viewBox: "0 0 24 24",
						width: "20",
						height: "20",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2.2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "3",
							y: "4.5",
							width: "18",
							height: "16",
							rx: "4"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 2.8v3.4M16 2.8v3.4M3 10h18M9 15l2 2 4-4" })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "brand-text",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "ปฏิทินเข้างาน" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "ปั๊มน้ำมัน" })]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "booting",
			children: "กำลังเปิดปฏิทิน…"
		})]
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "aurora",
			"aria-hidden": "true"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "app",
			"aria-hidden": sheet ? true : void 0,
			style: sheet ? { visibility: "hidden" } : void 0,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "top",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "brand",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "logo",
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								viewBox: "0 0 24 24",
								width: "20",
								height: "20",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2.2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									x: "3",
									y: "4.5",
									width: "18",
									height: "16",
									rx: "4"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 2.8v3.4M16 2.8v3.4M3 10h18M9 15l2 2 4-4" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "brand-text",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "ปฏิทินเข้างาน" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "ปั๊มน้ำมัน" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "top-btns",
						children: [
							installEvt && !standalone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "pill",
								onClick: () => void installApp(),
								children: "ติดตั้ง"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "pill",
								onClick: () => {
									const t = /* @__PURE__ */ new Date();
									setView(new Date(t.getFullYear(), t.getMonth(), 1));
									setSelected(ymd(t));
								},
								children: "วันนี้"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "icon-btn",
								"aria-label": "ตั้งค่า",
								onClick: () => setSheet("set"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									viewBox: "0 0 24 24",
									width: "21",
									height: "21",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "1.9",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "12",
										cy: "12",
										r: "3.2"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.27.63.88 1.03 1.56 1.03H21a2 2 0 1 1 0 4h-.09A1.7 1.7 0 0 0 19.4 15z" })]
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "monthbar",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "nav-btn",
							"aria-label": "เดือนก่อนหน้า",
							onClick: () => setView(new Date(y, m - 1, 1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								viewBox: "0 0 24 24",
								width: "20",
								height: "20",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2.4",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m15 5-7 7 7 7" })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: thaiMonth(view) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "nav-btn",
							"aria-label": "เดือนถัดไป",
							onClick: () => setView(new Date(y, m + 1, 1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								viewBox: "0 0 24 24",
								width: "20",
								height: "20",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2.4",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m9 5 7 7-7 7" })
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "cal",
					onTouchStart: (e) => {
						touch.current = {
							x: e.touches[0].clientX,
							y: e.touches[0].clientY
						};
					},
					onTouchEnd: (e) => {
						const dx = e.changedTouches[0].clientX - touch.current.x;
						const dy = e.changedTouches[0].clientY - touch.current.y;
						if (Math.abs(dx) > 60 && Math.abs(dy) < 45) setView(new Date(y, m + (dx < 0 ? 1 : -1), 1));
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "board",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "dow",
							"aria-hidden": "true",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
									className: "sun",
									children: "อา"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "จ" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "อ" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "พ" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "พฤ" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "ศ" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
									className: "sat",
									children: "ส"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid",
							style: { ["--rows"]: rows },
							children: cells.map((c, i) => {
								if (c.blank || !c.info || !c.key) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cell blank" }, `b${i}`);
								const keys = calendarShiftKeys(c.info);
								const triple = keys.length === 3;
								const cls = [
									"cell",
									c.info.kind,
									c.key === todayKey ? "today" : "",
									c.key === selected ? "sel" : "",
									triple ? "triple" : "",
									keys.length ? "has-slots" : ""
								].filter(Boolean).join(" ");
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: cls,
									onClick: () => openDay(c.key),
									"aria-label": `${c.day} ${KIND_LABEL[c.info.kind]}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "n",
										children: c.day
									}), keys.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "slots",
										children: keys.map((k) => {
											const st = c.info.shifts[k].st;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `slot ${k} ${st}`,
												children: slotLabel(k, st)
											}, k);
										})
									})]
								}, c.key);
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "empty",
						hidden: !showEmpty,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "empty-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "ยังไม่มีข้อมูลเข้างาน" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "นำเข้าไฟล์ Timeline แล้วปักหมุดปั๊ม หรือลองด้วยข้อมูลตัวอย่างเพื่อดูกรอบ Support" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "empty-actions",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "primary",
										onClick: () => setSheet("set"),
										children: "เปิดการตั้งค่า"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "ghost",
										onClick: () => void loadDemo(),
										children: "ลองข้อมูลตัวอย่าง"
									})]
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "stats",
					"aria-label": "สรุปประจำเดือน",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "stat s-days",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: stats.okDays }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "วันทำงาน" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "stat s-m",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: stats.cm }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "กะเช้า" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "stat s-e",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: stats.ce }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "กะบ่าย" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "stat s-s",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: stats.cs }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Support" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "stat s-pay",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: fmtBaht(stats.pay) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["รายได้บาท · ครึ่งกะ ", stats.half] })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
					className: "legend",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "legend-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "lg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "dot m" }), "เช้า 337"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "lg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "dot e" }), "บ่าย 337"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "lg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "dot s" }), "Support"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "legend-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "lg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "dot h" }), "ครึ่งกะ 168.5"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "lg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "dot w" }),
									"ไม่ครบ ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: stats.warn })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "lg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "dot b" }),
									"ไม่พบ ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: stats.bad })
								]
							})
						]
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `backdrop ${sheet === "day" ? "open" : ""}`,
			"aria-hidden": sheet !== "day",
			onClick: (e) => {
				if (e.target === e.currentTarget) setSheet(null);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel",
				role: "dialog",
				"aria-labelledby": "dayTitle",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grab" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel-head",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "dayTitle",
							children: selected ? thaiLong(selected) : "—"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: activeInfo ? KIND_LABEL[activeInfo.kind] : "" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "icon-btn sm",
							"aria-label": "ปิด",
							onClick: () => setSheet(null),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								viewBox: "0 0 24 24",
								width: "18",
								height: "18",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2.4",
								strokeLinecap: "round",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M6 6l12 12M18 6 6 18" })
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "panel-body",
						children: activeInfo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							(activeInfo.kind === "partial" || activeInfo.kind === "absent") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `callout ${activeInfo.kind}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: activeInfo.kind === "absent" ? "วันนี้ไม่เข้างานที่ปั๊ม" : `อยู่ที่ปั๊มไม่ครบ ${activeInfo.minH} ชั่วโมง` }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "ด้านล่างคือที่ที่ไปในวันนี้ ทั้งจุดที่อยู่ในไฟล์ Timeline และจุดที่อยู่กับที่จากพิกัด" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "shortfalls",
										children: SHIFTS.map((sh) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											sh.short,
											" ",
											fmtH(activeInfo.shifts[sh.key].h),
											"/",
											activeInfo.minH,
											" ชม."
										] }, sh.key))
									})
								]
							}),
							(activeInfo.kind === "partial" || activeInfo.kind === "absent") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Itinerary, {
								stops,
								naming
							}),
							SHIFTS.map((sh) => {
								const s = activeInfo.shifts[sh.key];
								const badge = shiftBadge(sh.key, activeInfo);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `shift-card ${sh.key} ${activeInfo.inRange ? s.st : ""}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sc-head",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: sh.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [sh.range, " น."] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `badge ${badge[0]}`,
												children: badge[1]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sc-grid",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "เข้า" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: s.rec ? hm(s.rec.first) : "—" })] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ออก" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: s.rec ? hm(s.rec.last) : "—" })] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "รายได้" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: shiftPay(sh.key, s.st) ? `${fmtBaht(shiftPay(sh.key, s.st))}` : "—" })] })
											]
										}),
										s.rec && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "parts",
											children: s.rec.parts.map(([a, b], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												hm(a),
												"–",
												hm(b)
											] }, i))
										}),
										sh.key === "s" && s.st !== "ok" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "hint",
											children: [
												"กรอบ Support จะโผล่บนปฏิทินเฉพาะวันที่อยู่ที่ปั๊มช่วง 09:00–18:00 ครบอย่างน้อย ",
												activeInfo.minH,
												" ชั่วโมง"
											]
										})
									]
								}, sh.key);
							}),
							activeInfo.kind !== "partial" && activeInfo.kind !== "absent" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Itinerary, {
								stops,
								naming
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "day-note",
								children: [
									"เต็มกะได้ 337 บาท เมื่ออยู่ที่ปั๊มอย่างน้อย ",
									activeInfo.minH,
									" ชั่วโมงในกะนั้น ถ้าอยู่ประมาณ 4 ชั่วโมงขึ้นไปแต่ยังไม่ถึงเกณฑ์ ถือเป็นครึ่งกะ ได้ 168.5 บาท Support ไม่คิดเงินซ้ำ เพราะทับช่วงเช้าและบ่าย"
								]
							})
						] })
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `backdrop ${sheet === "set" ? "open" : ""}`,
			"aria-hidden": sheet !== "set",
			onClick: (e) => {
				if (e.target === e.currentTarget) setSheet(null);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel tall",
				role: "dialog",
				"aria-labelledby": "setTitle",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grab" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel-head",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "setTitle",
							children: "ตั้งค่า"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "icon-btn sm",
							"aria-label": "ปิด",
							onClick: () => setSheet(null),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								viewBox: "0 0 24 24",
								width: "18",
								height: "18",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2.4",
								strokeLinecap: "round",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M6 6l12 12M18 6 6 18" })
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel-body",
						children: [
							!standalone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "box install-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "ติดตั้งเป็นแอป" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "เปิดลิงก์นี้ใน Chrome บนมือถือ แล้วกดติดตั้ง ไอคอนปฏิทินจะอยู่ที่หน้าจอหลัก และเปิดได้แบบแอป" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "primary",
										onClick: () => void installApp(),
										children: "ติดตั้งแอป"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "box",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "ไฟล์ Timeline" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "drop",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											accept: ".json,application/json",
											onChange: (e) => {
												const f = e.target.files?.[0];
												if (f) onFile(f);
												e.target.value = "";
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: fileName }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: fileInfo })
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "box",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "จุดปั๊ม" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "search",
											placeholder: "ค้นหาชื่อปั๊ม",
											value: query,
											onChange: (e) => setQuery(e.target.value),
											onKeyDown: (e) => {
												if (e.key === "Enter") searchPlace(query);
											}
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "ghost",
											onClick: () => void searchPlace(query),
											children: "ค้นหา"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row two",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											step: "any",
											inputMode: "decimal",
											placeholder: "ละติจูด",
											value: cfg.lat,
											onChange: (e) => patch({ lat: e.target.value }),
											onBlur: () => {
												const lat = parseFloat(cfg.lat);
												const lng = parseFloat(cfg.lng);
												if (Number.isFinite(lat) && Number.isFinite(lng)) pin(lat, lng);
											}
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											step: "any",
											inputMode: "decimal",
											placeholder: "ลองจิจูด",
											value: cfg.lng,
											onChange: (e) => patch({ lng: e.target.value }),
											onBlur: () => {
												const lat = parseFloat(cfg.lat);
												const lng = parseFloat(cfg.lng);
												if (Number.isFinite(lat) && Number.isFinite(lng)) pin(lat, lng);
											}
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										id: "map",
										ref: mapEl,
										children: mapOff && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "map-off",
											children: "แผนที่ใช้ไม่ได้ตอนออฟไลน์ ใส่พิกัดเองได้"
										})
									}),
									places.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "chips",
										children: places.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => pin(p.lat, p.lng),
											children: p.label
										}, `${p.label}-${p.lat}`))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "range",
										children: [
											"รัศมีรอบจุดปั๊ม ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [cfg.radius, " ม."] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "range",
												min: 20,
												max: 120,
												step: 5,
												value: cfg.radius,
												onChange: (e) => {
													const radius = Number(e.target.value);
													patch({ radius });
													mapHandle.current?.circle.setRadius(radius);
												}
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "box",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "กะทำงาน" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "locked",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "lk m",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "กะเช้า" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "06:00 – 14:00 น." })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "lk e",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "กะบ่าย" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "14:00 – 22:00 น." })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "lk s",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "ตำแหน่ง Support" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "09:00 – 18:00 น. · โผล่บนปฏิทินเมื่อครบเกณฑ์เท่านั้น วันปกติจะไม่แสดงกรอบนี้" })]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "note",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
											viewBox: "0 0 24 24",
											width: "13",
											height: "13",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "2.2",
											strokeLinecap: "round",
											strokeLinejoin: "round",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
												x: "5",
												y: "11",
												width: "14",
												height: "10",
												rx: "3"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 11V8a4 4 0 0 1 8 0v3" })]
										}), "ถ้าวันนั้นมีสามกรอบ เลขวันจะกลับไปมุมซ้ายบน ถ้ามีแค่เช้ากับบ่าย เลขวันจะใหญ่ตรงกลาง"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "stepper",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "นับว่าเข้างานเมื่ออยู่ที่ปั๊มอย่างน้อย" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "step-ctl",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "step",
													"aria-label": "ลดชั่วโมง",
													onClick: () => patch({ minHours: clampHours(cfg.minHours - .5) }),
													children: "−"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: cfg.minHours }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "ชม." }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "step",
													"aria-label": "เพิ่มชั่วโมง",
													onClick: () => patch({ minHours: clampHours(cfg.minHours + .5) }),
													children: "+"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "days-title",
										children: "วันทำงานในสัปดาห์"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "days",
										children: DAY_OPTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: !!cfg.days[d.v],
											onChange: (e) => {
												const daysNext = [...cfg.days];
												daysNext[d.v] = e.target.checked ? 1 : 0;
												patch({ days: daysNext });
											}
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: d.t })] }, d.v))
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "box",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "ดูวันที่เจาะจง" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "row",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										value: jump,
										onChange: (e) => setJump(e.target.value)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "ghost",
										onClick: () => {
											const v = jump || ymd(/* @__PURE__ */ new Date());
											const d = /* @__PURE__ */ new Date(`${v}T00:00:00`);
											setView(new Date(d.getFullYear(), d.getMonth(), 1));
											openDay(v);
										},
										children: "ไปที่วันนี้"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "box",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "อื่น ๆ" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row wrapbtn",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "ghost",
												onClick: () => {
													const theme = cfg.theme === "dark" ? "light" : "dark";
													const next = {
														...cfg,
														theme
													};
													setCfg(next);
													saveCfg(next);
												},
												children: "สลับโหมดสว่าง/มืด"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "ghost",
												disabled: !store || exporting,
												onClick: () => void exportExcel(),
												children: exporting ? "กำลังสร้างไฟล์…" : "ส่งออก Excel และ CSV"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "ghost",
												onClick: () => void loadDemo(),
												children: "โหลดตัวอย่าง"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "ghost danger",
												onClick: () => void wipe(),
												children: "ล้างข้อมูล"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "sheet-note",
										children: "ได้ไฟล์ Excel 5 ชีต และไฟล์ CSV สำหรับเปิดใน Excel รายได้เต็มกะ 337 บาท ครึ่งกะ 168.5 บาท"
									})
								]
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "error",
								children: error
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "panel-foot",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "primary wide",
							onClick: run,
							children: "ประมวลผลและบันทึก"
						})
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `toast ${toastOn ? "show" : ""}`,
			role: "status",
			children: toastMsg
		})
	] });
}
function Itinerary({ stops, naming }) {
	if (!stops.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "day-note",
		children: "ไม่พบจุดแวะในไฟล์ของวันนี้"
	});
	const away = stops.filter((s) => !s.atPump).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "itin",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: ["ไปที่ไหนบ้าง ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
				stops.length,
				" จุด",
				away ? ` · นอกปั๊ม ${away}` : ""
			] })] }),
			naming && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "day-note",
				children: "กำลังอ่านชื่อสถานที่จากพิกัดในไฟล์ Timeline…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", { children: stops.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: s.atPump ? "at" : "",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: s.title }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						hm(s.s),
						" – ",
						hm(s.e),
						" · ",
						fmtDur(s.e - s.s)
					] }),
					s.detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: s.detail }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("em", { children: [
						s.atPump ? "อยู่ในรัศมีปั๊ม" : "นอกจุดทำงาน",
						s.meters != null ? ` · ${fmtMeters(s.meters)}` : "",
						s.source === "gps" ? " · ประมาณจากพิกัด" : ""
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "maplink",
						href: s.mapsUrl,
						target: "_blank",
						rel: "noreferrer",
						children: "เปิดใน Google Maps"
					})
				] })]
			}, `${s.s}-${s.title}-${i}`)) })
		]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => SplitComponent });
var SplitComponent = WorkApp;
//#endregion
export { eachKey as a, keyToDate as c, stopSummary as d, thaiMonth as f, dayStops as i, shiftPay as l, weekdayShort as m, SHIFTS as n, fmtH as o, thaiShort as p, dayInfo as r, hm as s, routes_exports as t, slotLabel as u };
