import { a as eachKey, c as keyToDate, d as stopSummary, f as thaiMonth, i as dayStops, l as shiftPay, m as weekdayShort, n as SHIFTS, o as fmtH, p as thaiShort, r as dayInfo, s as hm, u as slotLabel } from "./routes-uz9BgQ7B.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/excel-export-DFJuY9Ni.js
var INK = "#1E1B4B";
var LINE = "#DDD6FE";
var HEAD = "#4C1D95";
var HEAD2 = "#0F766E";
var HEAD3 = "#9F1239";
var TITLE = "#2E1065";
function cell(value, extra = {}) {
	return {
		value,
		fontFamily: "Tahoma",
		fontSize: 11,
		alignVertical: "center",
		borderColor: LINE,
		borderStyle: "thin",
		textColor: INK,
		...extra
	};
}
function blank(n) {
	return Array.from({ length: n }, () => null);
}
function titleRow(text, cols, bg = TITLE, size = 18) {
	const row = [cell(text, {
		fontWeight: "bold",
		fontSize: size,
		textColor: "#FFFFFF",
		backgroundColor: bg,
		align: "left",
		columnSpan: cols,
		height: 32,
		borderColor: bg
	})];
	for (let i = 1; i < cols; i++) row.push(null);
	return row;
}
function subRow(text, cols, bg = "#6D28D9") {
	const row = [cell(text, {
		fontSize: 11,
		textColor: "#F5F3FF",
		backgroundColor: bg,
		columnSpan: cols,
		height: 20,
		borderColor: bg
	})];
	for (let i = 1; i < cols; i++) row.push(null);
	return row;
}
function heads(labels, bg) {
	return labels.map((label) => cell(label, {
		fontWeight: "bold",
		fontSize: 11,
		textColor: "#FFFFFF",
		backgroundColor: bg,
		align: "center",
		height: 22,
		borderColor: bg
	}));
}
var KIND_FILL = {
	worked: {
		bg: "#D1FAE5",
		fg: "#065F46",
		label: "ไปทำงาน"
	},
	partial: {
		bg: "#FFEDD5",
		fg: "#9A3412",
		label: "ไม่ครบเกณฑ์"
	},
	absent: {
		bg: "#FFE4E6",
		fg: "#9F1239",
		label: "ไม่พบที่ปั๊ม"
	},
	off: {
		bg: "#F1F5F9",
		fg: "#475569",
		label: "วันหยุด"
	},
	out: {
		bg: "#FFFFFF",
		fg: "#64748B",
		label: "นอกช่วง"
	}
};
var SHIFT_FILL = {
	m: {
		bg: "#FDE68A",
		fg: "#78350F",
		label: "กะเช้า"
	},
	e: {
		bg: "#DDD6FE",
		fg: "#5B21B6",
		label: "กะบ่าย"
	},
	s: {
		bg: "#A5F3FC",
		fg: "#155E75",
		label: "Support"
	}
};
function statusWord(st) {
	if (st === "ok") return "เต็มกะ";
	if (st === "half") return "ครึ่งกะ";
	if (st === "warn") return "ไม่ครบ";
	return "ไม่พบ";
}
function num(n, extra = {}) {
	return cell(Math.round(n * 100) / 100, {
		align: "center",
		format: "0.00",
		...extra,
		type: Number
	});
}
function buildSheets(store, days, cfg) {
	const infos = eachKey(store).map((key) => dayInfo(key, days, store, cfg));
	const worked = infos.filter((i) => i.kind === "worked").length;
	const partial = infos.filter((i) => i.kind === "partial").length;
	const absent = infos.filter((i) => i.kind === "absent").length;
	const cm = infos.filter((i) => i.shifts.m.st === "ok").length;
	const ce = infos.filter((i) => i.shifts.e.st === "ok").length;
	const cs = infos.filter((i) => i.supportOn).length;
	const pay = infos.reduce((a, i) => a + i.pay, 0);
	const half = infos.filter((i) => i.shifts.m.st === "half" || i.shifts.e.st === "half").length;
	const byMonth = /* @__PURE__ */ new Map();
	for (const info of infos) {
		const mk = info.key.slice(0, 7);
		const list = byMonth.get(mk) || [];
		list.push(info);
		byMonth.set(mk, list);
	}
	const ovCols = 8;
	const overview = [
		titleRow("ปฏิทินเข้างาน  ·  ปั๊มน้ำมัน", ovCols),
		subRow(`ข้อมูล ${thaiShort(store.min)} – ${thaiShort(store.max)}   ·   เกณฑ์เต็มกะ ${cfg.minHours} ชม.   ·   ครึ่งกะตั้งแต่ 3.5 ชม.   ·   กะละ 337 บาท`, ovCols),
		blank(ovCols),
		subRow("สรุปทั้งไฟล์", ovCols, "#5B21B6"),
		heads([
			"วันทำงาน",
			"กะเช้า",
			"กะบ่าย",
			"Support",
			"รายได้ (บาท)",
			"ครึ่งกะ",
			"ไม่ครบ",
			"ไม่พบ"
		], HEAD),
		[
			num(worked, {
				backgroundColor: "#D1FAE5",
				textColor: "#065F46",
				fontWeight: "bold",
				fontSize: 16,
				height: 28
			}),
			num(cm, {
				backgroundColor: "#FDE68A",
				textColor: "#78350F",
				fontWeight: "bold",
				fontSize: 16
			}),
			num(ce, {
				backgroundColor: "#DDD6FE",
				textColor: "#5B21B6",
				fontWeight: "bold",
				fontSize: 16
			}),
			num(cs, {
				backgroundColor: "#A5F3FC",
				textColor: "#155E75",
				fontWeight: "bold",
				fontSize: 16
			}),
			num(pay, {
				backgroundColor: "#E0F2FE",
				textColor: "#075985",
				fontWeight: "bold",
				fontSize: 16,
				format: "#,##0.0"
			}),
			num(half, {
				backgroundColor: "#FFEDD5",
				textColor: "#9A3412",
				fontWeight: "bold",
				fontSize: 16
			}),
			num(partial, {
				backgroundColor: "#FFEDD5",
				textColor: "#9A3412",
				fontWeight: "bold",
				fontSize: 16
			}),
			num(absent, {
				backgroundColor: "#FFE4E6",
				textColor: "#9F1239",
				fontWeight: "bold",
				fontSize: 16
			})
		],
		blank(ovCols),
		subRow("สรุปรายเดือน  ·  รายได้คิดจากกะเช้าและกะบ่าย เต็มกะ 337 บาท ครึ่งกะ 168.5 บาท  Support ไม่บวกเงินซ้ำ", ovCols, "#5B21B6"),
		heads([
			"เดือน",
			"วันทำงาน",
			"กะเช้า",
			"กะบ่าย",
			"Support",
			"รายได้",
			"ครึ่งกะ",
			"ไม่ครบ"
		], "#6D28D9")
	];
	let stripe = false;
	for (const [mk, list] of byMonth) {
		stripe = !stripe;
		const bg = stripe ? "#F5F3FF" : "#FFFFFF";
		overview.push([
			cell(thaiMonth(keyToDate(`${mk}-01`)), {
				backgroundColor: bg,
				fontWeight: "bold"
			}),
			num(list.filter((i) => i.kind === "worked").length, { backgroundColor: bg }),
			num(list.filter((i) => i.shifts.m.st === "ok").length, { backgroundColor: "#FFFBEB" }),
			num(list.filter((i) => i.shifts.e.st === "ok").length, { backgroundColor: "#F5F3FF" }),
			num(list.filter((i) => i.supportOn).length, { backgroundColor: "#ECFEFF" }),
			num(list.reduce((a, i) => a + i.pay, 0), {
				backgroundColor: bg,
				fontWeight: "bold",
				format: "#,##0.0"
			}),
			num(list.filter((i) => i.shifts.m.st === "half" || i.shifts.e.st === "half").length, { backgroundColor: bg }),
			num(list.filter((i) => i.kind === "partial").length, { backgroundColor: bg })
		]);
	}
	overview.push(blank(ovCols));
	overview.push(subRow("สีสถานะ: เขียว = ไปทำงาน · เหลือง = เช้า · ม่วง = บ่าย · ฟ้า = Support · ส้ม = ไม่ครบ · ชมพู = ไม่พบ", ovCols, "#312E81"));
	const basicHead = [
		"วันที่",
		"วัน",
		"สถานะ",
		"เช้า",
		"บ่าย",
		"Support",
		"รายได้",
		"บนปฏิทิน"
	];
	const basic = [
		titleRow("เข้างาน  ·  ตารางเบสิค", basicHead.length, "#4C1D95", 16),
		subRow("หนึ่งแถวต่อหนึ่งวัน  ·  เต็มกะ 337 บาท  ·  อยู่ที่ปั๊มตั้งแต่ 3.5 ชั่วโมงแต่ไม่ถึงเกณฑ์เต็มกะ = ครึ่งกะ 168.5 บาท", basicHead.length),
		heads(basicHead, HEAD)
	];
	for (const info of infos) {
		const fill = KIND_FILL[info.kind];
		const base = {
			backgroundColor: fill.bg,
			textColor: fill.fg
		};
		basic.push([
			cell(info.key, {
				...base,
				align: "center",
				fontWeight: "bold"
			}),
			cell(weekdayShort(info.key), {
				...base,
				align: "center"
			}),
			cell(fill.label, {
				...base,
				align: "center",
				fontWeight: "bold"
			}),
			cell(slotLabel("m", info.shifts.m.st) || "—", {
				backgroundColor: info.shifts.m.st === "ok" || info.shifts.m.st === "half" ? "#FDE68A" : fill.bg,
				textColor: info.shifts.m.st === "ok" || info.shifts.m.st === "half" ? "#78350F" : fill.fg,
				align: "center",
				fontWeight: "bold"
			}),
			cell(slotLabel("e", info.shifts.e.st) || "—", {
				backgroundColor: info.shifts.e.st === "ok" || info.shifts.e.st === "half" ? "#DDD6FE" : fill.bg,
				textColor: info.shifts.e.st === "ok" || info.shifts.e.st === "half" ? "#5B21B6" : fill.fg,
				align: "center",
				fontWeight: "bold"
			}),
			cell(info.supportOn ? "Support" : "—", {
				backgroundColor: info.supportOn ? "#A5F3FC" : fill.bg,
				textColor: info.supportOn ? "#155E75" : fill.fg,
				align: "center",
				fontWeight: "bold"
			}),
			num(info.pay, {
				...base,
				fontWeight: "bold",
				format: "#,##0.0"
			}),
			cell([
				slotLabel("m", info.shifts.m.st),
				slotLabel("e", info.shifts.e.st),
				info.supportOn ? "Support" : ""
			].filter(Boolean).join(" · ") || "—", {
				...base,
				align: "center"
			})
		]);
	}
	const deepHead = [
		"วันที่",
		"วัน",
		"กะ",
		"ช่วงเวลา",
		"สถานะ",
		"เข้า",
		"ออก",
		"ชั่วโมง",
		"รายได้",
		"ช่วงย่อย"
	];
	const deep = [
		titleRow("รายละเอียดกะ  ·  เชิงลึก", deepHead.length, "#0F766E", 16),
		subRow("เช้า 06:00–14:00  ·  บ่าย 14:00–22:00  ·  Support 09:00–18:00 (ทับช่วงเช้าและบ่าย จึงไม่ถูกบวกซ้ำในชั่วโมงรวม)", deepHead.length, "#0F766E"),
		heads(deepHead, HEAD2)
	];
	let rowAlt = false;
	for (const info of infos) {
		rowAlt = !rowAlt;
		for (const sh of SHIFTS) {
			const view = info.shifts[sh.key];
			const paint = SHIFT_FILL[sh.key];
			const zebra = rowAlt ? "#F8FAFC" : "#FFFFFF";
			const stFill = view.st === "ok" ? {
				bg: "#D1FAE5",
				fg: "#065F46"
			} : view.st === "half" ? {
				bg: "#FFEDD5",
				fg: "#9A3412"
			} : view.st === "warn" ? {
				bg: "#FEF3C7",
				fg: "#92400E"
			} : {
				bg: zebra,
				fg: "#64748B"
			};
			deep.push([
				cell(info.key, {
					backgroundColor: zebra,
					align: "center"
				}),
				cell(weekdayShort(info.key), {
					backgroundColor: zebra,
					align: "center"
				}),
				cell(paint.label, {
					backgroundColor: paint.bg,
					textColor: paint.fg,
					fontWeight: "bold",
					align: "center"
				}),
				cell(sh.range, {
					backgroundColor: paint.bg,
					textColor: paint.fg,
					align: "center"
				}),
				cell(sh.key === "s" && view.st !== "ok" ? `${statusWord(view.st)} · ซ่อนบนปฏิทิน` : statusWord(view.st), {
					backgroundColor: stFill.bg,
					textColor: stFill.fg,
					align: "center",
					fontWeight: "bold"
				}),
				cell(view.rec ? hm(view.rec.first) : "—", {
					backgroundColor: zebra,
					align: "center"
				}),
				cell(view.rec ? hm(view.rec.last) : "—", {
					backgroundColor: zebra,
					align: "center"
				}),
				num(view.h, {
					backgroundColor: zebra,
					...view.st === "ok" || view.st === "half" ? { fontWeight: "bold" } : {}
				}),
				num(shiftPay(sh.key, view.st), {
					backgroundColor: zebra,
					fontWeight: "bold",
					format: "#,##0.0"
				}),
				cell(view.rec ? view.rec.parts.map(([a, b]) => `${hm(a)}–${hm(b)}`).join(", ") : "—", {
					backgroundColor: zebra,
					wrap: true
				})
			]);
		}
	}
	const placeHead = [
		"วันที่",
		"วัน",
		"ลำดับ",
		"เริ่ม",
		"ถึง",
		"ระยะเวลา",
		"สถานที่",
		"รายละเอียด",
		"ระยะจากปั๊ม",
		"อยู่ในรัศมี",
		"ที่มา"
	];
	const places = [
		titleRow("สถานที่รายวัน  ·  ไปที่ไหนบ้าง", placeHead.length, "#0E7490", 16),
		subRow("รวมจุดจาก Timeline และจุดที่อยู่กับที่จากพิกัด  ·  แถวสีเขียวคืออยู่ในรัศมีปั๊ม", placeHead.length, "#0E7490"),
		heads(placeHead, "#155E75")
	];
	for (const info of infos) {
		const stops = dayStops(store, info.key, cfg);
		if (!stops.length) continue;
		stops.forEach((s, i) => {
			const bg = s.atPump ? "#D1FAE5" : i % 2 ? "#F0FDFA" : "#FFFFFF";
			const fg = s.atPump ? "#065F46" : INK;
			places.push([
				cell(info.key, {
					backgroundColor: bg,
					textColor: fg,
					align: "center"
				}),
				cell(weekdayShort(info.key), {
					backgroundColor: bg,
					textColor: fg,
					align: "center"
				}),
				num(i + 1, {
					backgroundColor: bg,
					textColor: fg,
					format: "0"
				}),
				cell(hm(s.s), {
					backgroundColor: bg,
					textColor: fg,
					align: "center"
				}),
				cell(hm(s.e), {
					backgroundColor: bg,
					textColor: fg,
					align: "center"
				}),
				cell(fmtH((s.e - s.s) / 36e5), {
					backgroundColor: bg,
					textColor: fg,
					align: "center"
				}),
				cell(s.title, {
					backgroundColor: bg,
					textColor: fg,
					fontWeight: "bold",
					wrap: true
				}),
				cell(s.detail || "—", {
					backgroundColor: bg,
					textColor: fg,
					wrap: true
				}),
				cell(s.meters == null ? "—" : String(Math.round(s.meters)), {
					backgroundColor: bg,
					textColor: fg,
					align: "right"
				}),
				cell(s.atPump ? "ใช่" : "ไม่", {
					backgroundColor: bg,
					textColor: fg,
					align: "center",
					fontWeight: "bold"
				}),
				cell(s.source === "visit" ? "Timeline" : "พิกัด", {
					backgroundColor: bg,
					textColor: fg,
					align: "center"
				})
			]);
		});
	}
	if (places.length === 3) places.push([cell("ไม่พบจุดแวะในช่วงข้อมูล", { columnSpan: placeHead.length }), ...Array(placeHead.length - 1).fill(null)]);
	const missHead = [
		"วันที่",
		"วัน",
		"สถานะ",
		"เช้า",
		"บ่าย",
		"Support",
		"รวมที่ปั๊ม",
		"จำนวนที่",
		"ไปที่ไหนบ้าง"
	];
	const missed = [
		titleRow("ไม่เข้าเงื่อนไข  ·  วันที่ไม่ครบหรือไม่เข้างาน", missHead.length, "#9F1239", 16),
		subRow("เฉพาะวันทำงานที่ไม่ถึงเกณฑ์ 6–8 ชั่วโมง หรือไม่พบที่ปั๊ม  ·  คอลัมน์สุดท้ายคือรายละเอียดเส้นทาง", missHead.length, "#9F1239"),
		heads(missHead, HEAD3)
	];
	for (const info of infos) {
		if (info.kind !== "partial" && info.kind !== "absent") continue;
		const stops = dayStops(store, info.key, cfg);
		const fill = KIND_FILL[info.kind];
		const base = {
			backgroundColor: fill.bg,
			textColor: fill.fg
		};
		missed.push([
			cell(info.key, {
				...base,
				align: "center",
				fontWeight: "bold"
			}),
			cell(weekdayShort(info.key), {
				...base,
				align: "center"
			}),
			cell(fill.label, {
				...base,
				align: "center",
				fontWeight: "bold"
			}),
			cell(`${fmtH(info.shifts.m.h)} ชม.`, {
				...base,
				align: "center"
			}),
			cell(`${fmtH(info.shifts.e.h)} ชม.`, {
				...base,
				align: "center"
			}),
			cell(`${fmtH(info.shifts.s.h)} ชม.`, {
				...base,
				align: "center"
			}),
			cell(`${fmtH(info.hours)} ชม.`, {
				...base,
				align: "center",
				fontWeight: "bold"
			}),
			num(stops.length, {
				...base,
				format: "0"
			}),
			cell(stopSummary(stops) || "ไม่พบจุดแวะในไฟล์", {
				...base,
				wrap: true,
				align: "left",
				height: 36
			})
		]);
	}
	if (missed.length === 3) missed.push([cell("ไม่มีวันที่ตกเกณฑ์ในช่วงนี้", {
		columnSpan: missHead.length,
		backgroundColor: "#D1FAE5",
		textColor: "#065F46",
		fontWeight: "bold"
	}), ...Array(missHead.length - 1).fill(null)]);
	return [
		{
			data: overview,
			sheet: "ภาพรวม",
			columns: Array.from({ length: ovCols }, () => ({ width: 16 })),
			stickyRowsCount: 3,
			zoomScale: 120
		},
		{
			data: basic,
			sheet: "เข้างาน",
			columns: [
				14,
				10,
				16,
				14,
				14,
				16,
				12,
				24
			].map((width) => ({ width })),
			stickyRowsCount: 3,
			zoomScale: 120
		},
		{
			data: deep,
			sheet: "รายละเอียดกะ",
			columns: [
				14,
				10,
				14,
				18,
				22,
				10,
				10,
				12,
				12,
				36
			].map((width) => ({ width })),
			stickyRowsCount: 3,
			zoomScale: 110
		},
		{
			data: places,
			sheet: "สถานที่",
			columns: [
				14,
				10,
				8,
				10,
				10,
				12,
				24,
				28,
				14,
				12,
				12
			].map((width) => ({ width })),
			stickyRowsCount: 3,
			zoomScale: 110
		},
		{
			data: missed,
			sheet: "ไม่เข้าเงื่อนไข",
			columns: [
				14,
				10,
				16,
				12,
				12,
				14,
				14,
				12,
				64
			].map((width) => ({ width })),
			stickyRowsCount: 3,
			zoomScale: 120
		}
	];
}
async function workbookBlob(store, days, cfg) {
	const writeXlsxFile = (await import("../_libs/write-excel-file.mjs").then((n) => n.t)).default;
	return writeXlsxFile(buildSheets(store, days, cfg).map((sheet) => ({
		...sheet,
		sheet: sheet.sheet.slice(0, 31)
	}))).toBlob();
}
function csvCell(value) {
	const text = String(value ?? "");
	if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, "\"\"")}"`;
	return text;
}
/** CSV แบบ UTF-8 มี BOM ให้ Excel เปิดภาษาไทยได้ ไม่พึ่งตัวสร้าง xlsx */
function attendanceCsv(store, days, cfg) {
	const lines = [[
		"วันที่",
		"วัน",
		"สถานะ",
		"เช้า",
		"บ่าย",
		"Support",
		"รายได้"
	].map(csvCell).join(",")];
	for (const key of eachKey(store)) {
		const info = dayInfo(key, days, store, cfg);
		const fill = KIND_FILL[info.kind];
		lines.push([
			info.key,
			weekdayShort(info.key),
			fill.label,
			slotLabel("m", info.shifts.m.st) || "—",
			slotLabel("e", info.shifts.e.st) || "—",
			info.supportOn ? "Support" : "—",
			info.pay
		].map(csvCell).join(","));
	}
	return `\uFEFF${lines.join("\r\n")}`;
}
//#endregion
export { attendanceCsv, workbookBlob };
