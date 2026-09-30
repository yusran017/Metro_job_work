import { n as __exportAll } from "../_runtime.mjs";
import { n as zip, t as strToU8 } from "./fflate.mjs";
//#region node_modules/write-excel-file/modules/zip/zipToArrayBuffer.js
/**
* Creates a `*.zip` file from a map of files.
* @param  {Record<string,Uint8Array>} files
* @return {Promise<ArrayBuffer>} Promise of `*.zip` file data.
*/
function zipToArrayBuffer(files) {
	return zipAsync(files).then(function(uint8Array) {
		return uint8Array.buffer;
	});
}
function zipAsync(files) {
	return new Promise(function(resolve, reject) {
		zip(files, function(error, archive) {
			if (error) reject(error);
			else resolve(archive);
		});
	});
}
//#endregion
//#region node_modules/write-excel-file/modules/export/convertFilesContentToUint8Arrays.js
/**
* Converts `files` values to `Uint8Array`s.
* @param {Record<string,any>} files
* @param {function} convertFileContentToUint8Array
* @returns {Promise<Record<string,Uint8Array>>}
*/
function convertFilesContentToUint8Arrays(files, convertFileContentToUint8Array) {
	var convertedFiles = {};
	return Promise.all(Object.keys(files).map(function(key) {
		if (files[key] instanceof Uint8Array) convertedFiles[key] = files[key];
		else if (typeof files[key] === "string") convertedFiles[key] = convertStringToUint8Array(files[key]);
		else return convertFileContentToUint8Array(files[key]).then(function(uint8Array) {
			convertedFiles[key] = uint8Array;
		});
	})).then(function() {
		return convertedFiles;
	});
}
function convertStringToUint8Array(string) {
	return strToU8(string);
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/helpers/features/getAdditionalContent.js
function _createForOfIteratorHelperLoose$13(r, e) {
	var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (t) return (t = t.call(r)).next.bind(t);
	if (Array.isArray(r) || (t = _unsupportedIterableToArray$15(r)) || e && r && "number" == typeof r.length) {
		t && (r = t);
		var o = 0;
		return function() {
			return o >= r.length ? { done: !0 } : {
				done: !1,
				value: r[o++]
			};
		};
	}
	throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$15(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray$15(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$15(r, a) : void 0;
	}
}
function _arrayLikeToArray$15(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function getAdditionalContent(fileName, features, sheetOptions, properties) {
	var content = "";
	for (var _iterator = _createForOfIteratorHelperLoose$13(features), _step; !(_step = _iterator()).done;) {
		var feature = _step.value;
		var transform = feature.files && feature.files.transform && feature.files.transform[fileName];
		if (transform && transform.insert) {
			var insertedContent = transform.insert(sheetOptions, properties);
			if (insertedContent) content += insertedContent;
		}
	}
	return content;
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/helpers/features/transformContent.js
function _createForOfIteratorHelperLoose$12(r, e) {
	var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (t) return (t = t.call(r)).next.bind(t);
	if (Array.isArray(r) || (t = _unsupportedIterableToArray$14(r)) || e && r && "number" == typeof r.length) {
		t && (r = t);
		var o = 0;
		return function() {
			return o >= r.length ? { done: !0 } : {
				done: !1,
				value: r[o++]
			};
		};
	}
	throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$14(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray$14(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$14(r, a) : void 0;
	}
}
function _arrayLikeToArray$14(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function transformContent(content, fileName, features, sheetOptions, properties) {
	for (var _iterator = _createForOfIteratorHelperLoose$12(features), _step; !(_step = _iterator()).done;) {
		var feature = _step.value;
		var transform = feature.files && feature.files.transform && feature.files.transform[fileName];
		if (transform && transform.transform) content = transform.transform(content, sheetOptions, properties);
	}
	return content;
}
//#endregion
//#region node_modules/write-excel-file/modules/xml/escapeXmlSpecialCharacters.js
/**
* Escapes a string for including it in XML markup: replaces ">" with "&gt;", etc.
* https://en.wikipedia.org/wiki/Character_encodings_in_HTML#HTML_character_references
* @param  {string} string
* @param  {boolean} options.isAttributeValue — Pass `true` if an XML attribute value is being escaped. Pass `false` otherwise.
* @return {string}
*/
function escapeXmlSpecialCharacters(string, _ref) {
	var isAttributeValue = _ref.isAttributeValue;
	string = replaceAll(string, "&", "&amp;");
	string = replaceAll(string, ">", "&gt;");
	string = replaceAll(string, "<", "&lt;");
	if (isAttributeValue) {
		string = replaceAll(string, "'", "&apos;");
		string = replaceAll(string, "\"", "&quot;");
	}
	return string;
}
function replaceAll(string, replacedSubstring, replacementSubstring) {
	if (string.replaceAll) return string.replaceAll(replacedSubstring, replacementSubstring);
	return string.replace(new RegExp(replacedSubstring, "g"), replacementSubstring);
}
//#endregion
//#region node_modules/write-excel-file/modules/xml/removeInvalidXmlCharacters.js
var INVALID_CHARACTERS = /((?:[\0-\x08\x0B\f\x0E-\x1F\uFFFD\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))/g;
var DISCOURAGED_CHARACTERS = /* @__PURE__ */ new RegExp("([\\x7F-\\x84]|[\\x86-\\x9F]|[\\uFDD0-\\uFDEF]|(?:\\uD83F[\\uDFFE\\uDFFF])|(?:\\uD87F[\\uDFFE\\uDFFF])|(?:\\uD8BF[\\uDFFE\\uDFFF])|(?:\\uD8FF[\\uDFFE\\uDFFF])|(?:\\uD93F[\\uDFFE\\uDFFF])|(?:\\uD97F[\\uDFFE\\uDFFF])|(?:\\uD9BF[\\uDFFE\\uDFFF])|(?:\\uD9FF[\\uDFFE\\uDFFF])|(?:\\uDA3F[\\uDFFE\\uDFFF])|(?:\\uDA7F[\\uDFFE\\uDFFF])|(?:\\uDABF[\\uDFFE\\uDFFF])|(?:\\uDAFF[\\uDFFE\\uDFFF])|(?:\\uDB3F[\\uDFFE\\uDFFF])|(?:\\uDB7F[\\uDFFE\\uDFFF])|(?:\\uDBBF[\\uDFFE\\uDFFF])|(?:\\uDBFF[\\uDFFE\\uDFFF])(?:[\\0-\\t\\x0B\\f\\x0E-\\u2027\\u202A-\\uD7FF\\uE000-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF](?![\\uDC00-\\uDFFF])|(?:[^\\uD800-\\uDBFF]|^)[\\uDC00-\\uDFFF]))", "g");
/**
* Removes "invalid" or "discouraged" XML characters from a string.
* "Invalid" characters are "C0 control characters" or "surrogate blocks" ("non-characters" and "surrogate pairs").
* "Discouraged" characters are the ones that're officially discouraged from use in XML documents by the XML specification.
* @param {string} string - a string containing potentially invalid XML characters (non-UTF8 characters, STX, EOX etc)
* @return {string} a sanitized string stripped of invalid (and by default also discouraged) XML characters
*/
function removeInvalidXmlCharacters(string) {
	string = string.replace(INVALID_CHARACTERS, "");
	string = string.replace(DISCOURAGED_CHARACTERS, "");
	return string;
}
//#endregion
//#region node_modules/write-excel-file/modules/xml/sanitizeAttributeValue.js
/**
* Removes invalid characters and escapes "speciaL" characters in an XML attribute's value.
* @param {string} attributeValue
* @returns {string}
*/
function sanitizeAttributeValue(attributeValue) {
	if (typeof attributeValue !== "string") throw new TypeError("Argument must be a string");
	attributeValue = removeInvalidXmlCharacters(attributeValue);
	return escapeXmlSpecialCharacters(attributeValue, { isAttributeValue: true });
}
//#endregion
//#region node_modules/write-excel-file/modules/xml/sanitizeAttributeName.js
/**
* Removes invalid characters and escapes "speciaL" characters in an XML attribute's name.
* @param {string} attributeName
* @returns {string}
*/
function sanitizeAttributeName(attributeName) {
	if (typeof attributeName !== "string") throw new TypeError("Argument must be a string");
	attributeName = removeInvalidXmlCharacters(attributeName);
	return attributeName.replace(/[^a-zA-Z_0-9-.:]/g, "").replace(/^[^a-zA-Z_]+/, "");
}
//#endregion
//#region node_modules/write-excel-file/modules/xml/getAttributesString.js
/**
* Converts an object with XML attribute values to a string.
* Examples:
* { a: 'b', c: 'd' } → ' a="b" c="d"'
* {} → ''
* @param {object} attributes
* @returns {string}
*/
function getAttributesString(attributes) {
	return Object.keys(attributes).map(function(name) {
		return "".concat(sanitizeAttributeName(name), "=\"").concat(sanitizeAttributeValue(String(attributes[name])), "\"");
	}).reduce(function(combined, part) {
		return combined + " " + part;
	}, "");
}
//#endregion
//#region node_modules/write-excel-file/modules/xml/getOpeningTagMarkup.js
/**
* Returns XML for an "opening tag" with a given `tagName` and optional `attributes`.
* @param {string} tagName
* @param {object} [attributes]
* @returns {string}
*/
function getOpeningTagMarkup(tagName, attributes) {
	return "<" + tagName + (attributes ? getAttributesString(attributes) : "") + ">";
}
//#endregion
//#region node_modules/write-excel-file/modules/xml/getClosingTagMarkup.js
/**
* Returns XML for a "closing tag" with a given `tagName`.
* @param {string} tagName
* @returns {string}
*/
function getClosingTagMarkup(tagName) {
	return "</" + tagName + ">";
}
//#endregion
//#region node_modules/write-excel-file/modules/xml/getSelfClosingTagMarkup.js
/**
* Returns XML for an element with a given `tagName`, optional `attributes` and no child elements.
* @param {string} tagName
* @param {object} [attributes]
* @returns {string}
*/
function getSelfClosingTagMarkup(tagName, attributes) {
	return getOpeningTagMarkup(tagName, attributes).slice(0, -1) + "/>";
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/helpers/features/getElementXml.js
function _createForOfIteratorHelperLoose$11(r, e) {
	var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (t) return (t = t.call(r)).next.bind(t);
	if (Array.isArray(r) || (t = _unsupportedIterableToArray$13(r)) || e && r && "number" == typeof r.length) {
		t && (r = t);
		var o = 0;
		return function() {
			return o >= r.length ? { done: !0 } : {
				done: !1,
				value: r[o++]
			};
		};
	}
	throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$13(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray$13(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$13(r, a) : void 0;
	}
}
function _arrayLikeToArray$13(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function getElementXml(fileName, tagName, attributes, innerXml, index, properties, sheetOptionsOrSheetsOptions, features) {
	for (var _iterator = _createForOfIteratorHelperLoose$11(features), _step; !(_step = _iterator()).done;) {
		var feature = _step.value;
		var transform = feature.files && feature.files.transform && feature.files.transform[fileName];
		if (transform && transform.transformElementAttributes) attributes = transform.transformElementAttributes(tagName, attributes || NO_ATTRIBUTES, index, sheetOptionsOrSheetsOptions, properties);
	}
	if (innerXml) return getOpeningTagMarkup(tagName, attributes) + innerXml + getClosingTagMarkup(tagName);
	else return getSelfClosingTagMarkup(tagName, attributes);
}
var NO_ATTRIBUTES = {};
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/files/workbook.xml.js
function generateWorkbookXml(_ref) {
	var sheetIdsAndNames = _ref.sheetIdsAndNames, features = _ref.features, sheetsOptions = _ref.sheetsOptions;
	/**
	* Creates XML tag markup.
	* @param {string} tagName
	* @param {object} attributes
	* @param {string} [innerXml]
	* @param {number} [index]
	* @returns {string}
	*/
	var tag = function tag(tagName, attributes, innerXml, index) {
		return getElementXml("xl/workbook.xml", tagName, attributes, innerXml, index, EMPTY_OBJECT, sheetsOptions, features);
	};
	var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><workbook xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:mx=\"http://schemas.microsoft.com/office/mac/excel/2008/main\" xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" xmlns:mv=\"urn:schemas-microsoft-com:mac:vml\" xmlns:x14=\"http://schemas.microsoft.com/office/spreadsheetml/2009/9/main\" xmlns:x14ac=\"http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac\" xmlns:xm=\"http://schemas.microsoft.com/office/excel/2006/main\">" + tag("workbookPr") + tag("bookViews", null, tag("workbookView", null, null, 0)) + tag("sheets", null, sheetIdsAndNames.map(function(_ref2, i) {
		var sheetId = _ref2.sheetId, sheetName = _ref2.sheetName;
		return tag("sheet", {
			"r:id": "rId".concat(sheetId),
			sheetId,
			name: sheetName
		}, null, i);
	}).join("")) + tag("definedNames") + tag("calcPr") + getAdditionalContent("xl/workbook.xml", features, sheetsOptions) + "</workbook>";
	xml = transformContent(xml, "xl/workbook.xml", features, sheetsOptions);
	return xml;
}
var EMPTY_OBJECT = {};
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/files/workbook.xml.rels.js
function generateWorkbookXmlRels(_ref) {
	var sheetIds = _ref.sheetIds, features = _ref.features, sheetsOptions = _ref.sheetsOptions;
	var xml = "<?xml version=\"1.0\" ?><Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">" + sheetIds.map(function(id) {
		return "<Relationship Id=\"rId".concat(id, "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet\" Target=\"worksheets/sheet").concat(id, ".xml\"/>");
	}).join("") + "<Relationship Id=\"rId".concat(sheetIds.length + 1, "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings\" Target=\"sharedStrings.xml\"/>") + "<Relationship Id=\"rId".concat(sheetIds.length + 2, "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles\" Target=\"styles.xml\"/>") + getAdditionalContent("xl/_rels/workbook.xml.rels", features, sheetsOptions) + "</Relationships>";
	xml = transformContent(xml, "xl/_rels/workbook.xml.rels", features, sheetsOptions);
	return xml;
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/files/rels.js
function generateRelsXml(_ref) {
	var features = _ref.features, sheetsOptions = _ref.sheetsOptions;
	var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\"><Relationship Id=\"rId-workbook-1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument\" Target=\"xl/workbook.xml\"/>" + getAdditionalContent("_rels/.rels", features, sheetsOptions) + "</Relationships>";
	xml = transformContent(xml, "_rels/.rels", features, sheetsOptions);
	return xml;
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/files/[Content_Types].xml.js
function generateContentTypesXml(_ref) {
	var sheetIds = _ref.sheetIds, features = _ref.features, sheetsOptions = _ref.sheetsOptions;
	var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\"><Default ContentType=\"application/xml\" Extension=\"xml\"/><Default ContentType=\"application/vnd.openxmlformats-package.relationships+xml\" Extension=\"rels\"/><Override ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml\" PartName=\"/xl/workbook.xml\"/><Override ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml\" PartName=\"/xl/sharedStrings.xml\"/><Override ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml\" PartName=\"/xl/styles.xml\"/>" + sheetIds.map(function(sheetId) {
		return "<Override ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\" PartName=\"/xl/worksheets/sheet".concat(sheetId, ".xml\"/>");
	}).join("") + sheetIds.map(function(sheetId) {
		return getDrawingContentTypeXml(sheetId);
	}).join("") + getAdditionalContent("[Content_Types].xml", features, sheetsOptions) + "</Types>";
	xml = transformContent(xml, "[Content_Types].xml", features, sheetsOptions);
	return xml;
}
function getDrawingContentTypeXml(sheetId) {
	return "<Override ContentType=\"application/vnd.openxmlformats-officedocument.drawing+xml\" PartName=\"/xl/drawings/drawing".concat(sheetId, ".xml\"/>");
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/files/drawing.xml.js
function generateDrawingXml(_ref) {
	var sheetIndex = _ref.sheetIndex, sheetId = _ref.sheetId, sheetOptions = _ref.sheetOptions, features = _ref.features;
	var xml = DRAWING_XML_START + getAdditionalContent("xl/drawings/drawing{id}.xml", features, sheetOptions, {
		sheetIndex,
		sheetId
	}) + DRAWING_XML_END;
	xml = transformContent(xml, "xl/drawings/drawing{id}.xml", features, sheetOptions, {
		sheetIndex,
		sheetId
	});
	return xml;
}
var DRAWING_XML_START = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><xdr:wsDr xmlns:xdr=\"http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing\" xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\">";
var DRAWING_XML_END = "</xdr:wsDr>";
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/files/drawing.xml.rels.js
function generateDrawingXmlRels(_ref) {
	var sheetIndex = _ref.sheetIndex, sheetId = _ref.sheetId, sheetOptions = _ref.sheetOptions, features = _ref.features;
	var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">" + getAdditionalContent("xl/drawings/_rels/drawing{id}.xml.rels", features, sheetOptions, {
		sheetIndex,
		sheetId
	}) + "</Relationships>";
	xml = transformContent(xml, "xl/drawings/_rels/drawing{id}.xml.rels", features, sheetOptions, {
		sheetIndex,
		sheetId
	});
	return xml;
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/files/sheet.xml/sheetViews.js
function generateSheetViews(tag, viewProperties, sheetIndex) {
	if (!hasView(viewProperties)) return "";
	var showGridLines = viewProperties.showGridLines, rightToLeft = viewProperties.rightToLeft, zoomScale = viewProperties.zoomScale;
	var sheetViewAttributes = {
		tabSelected: sheetIndex === 0 ? 1 : 0,
		workbookViewId: 0
	};
	if (showGridLines === false) sheetViewAttributes.showGridLines = false;
	if (rightToLeft) sheetViewAttributes.rightToLeft = 1;
	if (typeof zoomScale === "number") sheetViewAttributes.zoomScale = Math.round(zoomScale * 100);
	return tag("sheetViews", null, tag("sheetView", sheetViewAttributes, null, 0));
}
function hasView(_ref) {
	var showGridLines = _ref.showGridLines, rightToLeft = _ref.rightToLeft, zoomScale = _ref.zoomScale;
	return showGridLines === false || rightToLeft || typeof zoomScale === "number";
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/files/sheet.xml/column.js
function generateColumnDescription(tag, column, index) {
	if (!column) return "";
	var width = column.width;
	if (!width) return "";
	var columnNumber = index + 1;
	return tag("col", {
		min: columnNumber,
		max: columnNumber,
		width,
		customWidth: 1
	}, null, index);
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/files/sheet.xml/columns.js
function generateColumnsDescription(tag, columns) {
	if (columns) {
		var columnsXml = columns.map(function(column, index) {
			return generateColumnDescription(tag, column, index);
		}).join("");
		if (columnsXml) return tag("cols", null, columnsXml);
	}
	return "";
}
//#endregion
//#region node_modules/write-excel-file/modules/xml/sanitizeTextContent.js
/**
* Removes invalid characters and escapes "speciaL" characters in an XML element's text content.
* @param {string} textContent
* @returns {string}
*/
function sanitizeTextContent(textContent) {
	if (typeof textContent !== "string") throw new TypeError("Argument must be a string");
	textContent = removeInvalidXmlCharacters(textContent);
	return escapeXmlSpecialCharacters(textContent, { isAttributeValue: false });
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/helpers/getCellAddress.js
/**
* Gets spreadsheet cell string coordinate from row index and column index.
* @param {number} rowIndex
* @param {number} columnIndex
* @returns {string}
*/
function getCellAddress(rowIndex, columnIndex) {
	return "".concat(getColumnLetter(columnIndex)).concat(rowIndex + 1);
}
var LETTERS_COUNT = 26;
function getColumnLetter(columnIndex) {
	if (typeof columnIndex !== "number") return "";
	var prefix = Math.floor(columnIndex / LETTERS_COUNT);
	var letter = String.fromCharCode(97 + columnIndex % LETTERS_COUNT).toUpperCase();
	if (prefix === 0) return letter;
	return getColumnLetter(prefix - 1) + letter;
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/helpers/convertDateToSerialNumber.js
var daysBeforeUnixEpoch = 25569;
var day = 864e5;
/**
* Converts a `Date` into an XLSX "serial" number.
* @param {Date} date
* @returns {number}
*/
function convertDateToSerialNumber(date) {
	return date.getTime() / day + daysBeforeUnixEpoch;
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/files/sheet.xml/cell.js
function _slicedToArray$1(r, e) {
	return _arrayWithHoles$1(r) || _iterableToArrayLimit$1(r, e) || _unsupportedIterableToArray$12(r, e) || _nonIterableRest$1();
}
function _nonIterableRest$1() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$12(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray$12(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$12(r, a) : void 0;
	}
}
function _arrayLikeToArray$12(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function _iterableToArrayLimit$1(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = !0, o = !1;
		try {
			if (i = (t = t.call(r)).next, 0 === l) {
				if (Object(t) !== t) return;
				f = !1;
			} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = !0, n = r;
		} finally {
			try {
				if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
function _arrayWithHoles$1(r) {
	if (Array.isArray(r)) return r;
}
function generateCell(tag, _ref, index, rowIndex) {
	var value = _ref.value, type = _ref.type, cellStyleId = _ref.cellStyleId, findOrCreateSharedString = _ref.findOrCreateSharedString;
	if (value === null) {
		if (cellStyleId === void 0) return "";
	}
	var cellAttributes = { r: getCellAddress(rowIndex, index) };
	if (cellStyleId !== void 0) cellAttributes.s = String(cellStyleId);
	if (value === null) return tag("c", cellAttributes, null, index);
	if (type === Date && cellStyleId === void 0) throw new Error("No `format` was specified for a `Date` value in a cell in row ".concat(rowIndex + 1, " column ").concat(index + 1, ". Either specify a `format` for this cell or specify a default global one by passing `dateFormat` option to `writeXlsxFile()` function"));
	var valueTextContent = getValueTextContent(type, value, findOrCreateSharedString);
	var typeAttribute = getTypeAttribute(type);
	if (typeAttribute) cellAttributes.t = typeAttribute;
	var _getOpeningAndClosing2 = _slicedToArray$1(getOpeningAndClosingTags(type), 2), valueOpeningTags = _getOpeningAndClosing2[0], valueClosingTags = _getOpeningAndClosing2[1];
	return tag("c", cellAttributes, valueOpeningTags + valueTextContent + valueClosingTags, index);
}
function getTypeAttribute(type) {
	switch (type) {
		case String: return "s";
		case Number: return;
		case Date: return;
		case Boolean: return "b";
		case "Formula": return;
		default: throw new Error("Unknown type: ".concat(type && type.name || type));
	}
}
function getValueTextContent(type, value, findOrCreateSharedString) {
	switch (type) {
		case String:
			if (typeof value !== "string") throw new Error("Invalid cell value: ".concat(value, ". Expected a string"));
			return findOrCreateSharedString(value);
		case Number:
			if (typeof value !== "number") throw new Error("Invalid cell value: ".concat(value, ". Expected a number"));
			return String(value);
		case Date:
			if (!(value instanceof Date)) throw new Error("Invalid cell value: ".concat(value, ". Expected a Date"));
			return String(convertDateToSerialNumber(value));
		case Boolean:
			if (typeof value !== "boolean") throw new Error("Invalid cell value: ".concat(value, ". Expected a boolean"));
			return value ? "1" : "0";
		case "Formula":
			if (typeof value !== "string") throw new Error("Invalid cell value: ".concat(value, ". Expected a string"));
			return sanitizeTextContent(value);
		default: throw new Error("Unknown type: ".concat(type && type.name || type));
	}
}
var TAG_BRACKET_LEFT_REGEXP = /</g;
function getOpeningAndClosingTags(type) {
	var openingTags = getOpeningTags(type);
	return [openingTags, openingTags.replace(TAG_BRACKET_LEFT_REGEXP, "</")];
}
function getOpeningTags(type) {
	switch (type) {
		case "Formula": return "<f>";
		default: return "<v>";
	}
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/helpers/hasAlignment.js
function hasAlignment(_ref) {
	var align = _ref.align, alignVertical = _ref.alignVertical, textRotation = _ref.textRotation, indent = _ref.indent, wrap = _ref.wrap;
	return Boolean(align || alignVertical || typeof textRotation === "number" || indent || wrap);
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/helpers/hasBorder.js
function hasBorder(_ref) {
	var borderColor = _ref.borderColor, borderStyle = _ref.borderStyle, leftBorderColor = _ref.leftBorderColor, leftBorderStyle = _ref.leftBorderStyle, rightBorderColor = _ref.rightBorderColor, rightBorderStyle = _ref.rightBorderStyle, topBorderColor = _ref.topBorderColor, topBorderStyle = _ref.topBorderStyle, bottomBorderColor = _ref.bottomBorderColor, bottomBorderStyle = _ref.bottomBorderStyle;
	return Boolean(borderColor || borderStyle || leftBorderColor || leftBorderStyle || rightBorderColor || rightBorderStyle || topBorderColor || topBorderStyle || bottomBorderColor || bottomBorderStyle);
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/helpers/hasFill.js
function hasFill(_ref) {
	var backgroundColor = _ref.backgroundColor, fillPatternStyle = _ref.fillPatternStyle, fillPatternColor = _ref.fillPatternColor;
	return Boolean(backgroundColor || fillPatternStyle && fillPatternColor);
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/helpers/hasFont.js
function hasFont(_ref) {
	var fontFamily = _ref.fontFamily, fontSize = _ref.fontSize, fontWeight = _ref.fontWeight, fontStyle = _ref.fontStyle, textDecoration = _ref.textDecoration, textColor = _ref.textColor;
	return Boolean(fontFamily || typeof fontSize === "number" || fontWeight || fontStyle || textDecoration && Object.keys(textDecoration).length > 0 || textColor);
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/files/sheet.xml/helpers/getCellStyleProperties.js
function getCellStyleProperties(cell, features) {
	var align = cell.align, alignVertical = cell.alignVertical, textRotation = cell.textRotation, indent = cell.indent, wrap = cell.wrap, fontFamily = cell.fontFamily, fontSize = cell.fontSize, fontWeight = cell.fontWeight, fontStyle = cell.fontStyle, textDecoration = cell.textDecoration, textColor = cell.textColor, backgroundColor = cell.backgroundColor, fillPatternStyle = cell.fillPatternStyle, fillPatternColor = cell.fillPatternColor, borderColor = cell.borderColor, borderStyle = cell.borderStyle, leftBorderColor = cell.leftBorderColor, leftBorderStyle = cell.leftBorderStyle, rightBorderColor = cell.rightBorderColor, rightBorderStyle = cell.rightBorderStyle, topBorderColor = cell.topBorderColor, topBorderStyle = cell.topBorderStyle, bottomBorderColor = cell.bottomBorderColor, bottomBorderStyle = cell.bottomBorderStyle;
	if (hasAlignment({
		align,
		alignVertical,
		textRotation,
		indent,
		wrap
	}) || hasFont({
		fontFamily,
		fontSize,
		fontWeight,
		fontStyle,
		textDecoration,
		textColor
	}) || hasFill({
		backgroundColor,
		fillPatternStyle,
		fillPatternColor
	}) || hasBorder({
		borderColor,
		borderStyle,
		leftBorderColor,
		leftBorderStyle,
		rightBorderColor,
		rightBorderStyle,
		topBorderColor,
		topBorderStyle,
		bottomBorderColor,
		bottomBorderStyle
	})) return omitUndefinedProperties({
		align,
		alignVertical,
		textRotation,
		indent,
		wrap,
		fontFamily,
		fontSize,
		fontWeight,
		fontStyle,
		textDecoration,
		textColor,
		backgroundColor,
		fillPatternStyle,
		fillPatternColor,
		borderColor,
		borderStyle,
		leftBorderColor,
		leftBorderStyle,
		rightBorderColor,
		rightBorderStyle,
		topBorderColor,
		topBorderStyle,
		bottomBorderColor,
		bottomBorderStyle
	});
}
function omitUndefinedProperties(object) {
	var filteredObject = {};
	for (var key in object) if (object[key] !== void 0) filteredObject[key] = object[key];
	return filteredObject;
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/helpers/isObject.js
var objectConstructor = {}.constructor;
function isObject(object) {
	return object !== void 0 && object !== null && object.constructor === objectConstructor;
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/helpers/isCellObject.js
/**
* Tells if a cell in sheet data is a simple value like `1` or "abc"
* or if it's a fully-specified object like `{ value: "abc", type: String, ... }`.
* https://gitlab.com/catamphetamine/write-excel-file/-/issues/107
* @returns {boolean}
*/
function isCellObject(cell) {
	return isObject(cell);
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/files/sheet.xml/row.js
function _typeof$4(o) {
	"@babel/helpers - typeof";
	return _typeof$4 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$4(o);
}
function ownKeys$4(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$4(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$4(Object(t), !0).forEach(function(r) {
			_defineProperty$4(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$4(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$4(e, r, t) {
	return (r = _toPropertyKey$4(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
function _toPropertyKey$4(t) {
	var i = _toPrimitive$4(t, "string");
	return "symbol" == _typeof$4(i) ? i : i + "";
}
function _toPrimitive$4(t, r) {
	if ("object" != _typeof$4(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$4(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _createForOfIteratorHelperLoose$10(r, e) {
	var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (t) return (t = t.call(r)).next.bind(t);
	if (Array.isArray(r) || (t = _unsupportedIterableToArray$11(r)) || e && r && "number" == typeof r.length) {
		t && (r = t);
		var o = 0;
		return function() {
			return o >= r.length ? { done: !0 } : {
				done: !1,
				value: r[o++]
			};
		};
	}
	throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$11(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray$11(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$11(r, a) : void 0;
	}
}
function _arrayLikeToArray$11(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function generateRow(tag, row, index, parameters) {
	var rowHeight;
	for (var _iterator = _createForOfIteratorHelperLoose$10(row), _step; !(_step = _iterator()).done;) {
		var cell = _step.value;
		if (isCellObject(cell)) {
			if (cell.height) {
				if (rowHeight === void 0 || rowHeight < cell.height) rowHeight = cell.height;
			}
		}
	}
	var rowIndex = index;
	var rowCellsXml = row.map(function(cell, index) {
		return getCellXml(tag, cell, index, rowIndex, parameters);
	}).join("");
	var rowAttributes = { r: index + 1 };
	if (rowHeight) {
		rowAttributes.ht = rowHeight;
		rowAttributes.customHeight = 1;
	}
	return tag("row", rowAttributes, rowCellsXml, index);
}
function getCellXml(tag, cell, index, rowIndex, _ref) {
	var findOrCreateCellStyle = _ref.findOrCreateCellStyle, findOrCreateSharedString = _ref.findOrCreateSharedString, hasDefaultFont = _ref.hasDefaultFont, dateFormat = _ref.dateFormat, features = _ref.features;
	if (cell === void 0 || cell === null) return "";
	var cellObject = isCellObject(cell) ? cell : { value: cell };
	var cellStyleProperties = getCellStyleProperties(cellObject, features);
	var type = cellObject.type, value = cellObject.value, format = cellObject.format;
	if (isEmpty(value)) value = null;
	else if (type === void 0) {
		type = detectValueType(value);
		if (type === void 0) {
			type = String;
			value = String(value);
		}
	}
	if (format) {
		if (type !== Date && type !== Number && type !== String && type !== "Formula") throw new Error("`format` \"".concat(format, "\" was specified on a cell of type `").concat(type, "`. `format` could only be specified on a cell of type `Date`, `Number`, `String` or `\"Formula\"`."));
		if (type === String && format !== "@") throw new Error("`format` \"".concat(format, "\" was specified on a cell of type `String`. The only supported `format` for a cell of type `String` is \"@\"."));
	} else if (type === Date) format = dateFormat;
	var hasFormat = Boolean(format);
	var hasCellStyle = Boolean(cellStyleProperties);
	var cellStyleId;
	if (hasDefaultFont || hasFormat || hasCellStyle) cellStyleId = findOrCreateCellStyle(_objectSpread$4({ format }, cellStyleProperties));
	return generateCell(tag, {
		value,
		type,
		cellStyleId,
		findOrCreateSharedString
	}, index, rowIndex);
}
function isEmpty(value) {
	return value === void 0 || value === null || value === "";
}
function detectValueType(value) {
	switch (_typeof$4(value)) {
		case "string": return String;
		case "number": return Number;
		case "boolean": return Boolean;
		default: if (value instanceof Date) return Date;
	}
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/files/sheet.xml/sheetData.js
function generateSheetData(tag, sheetData, parameters) {
	return tag("sheetData", null, sheetData.map(function(row, index) {
		return generateRow(tag, row, index, parameters);
	}).join(""));
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/files/sheet.xml/processMergedCells.js
function processMergedCells(sheetData, features) {
	var mergedCells = [];
	var _cloneSheetData = function cloneSheetData() {
		sheetData = sheetData.slice();
		var i = 0;
		while (i < sheetData.length) {
			sheetData[i] = sheetData[i].slice();
			i++;
		}
		_cloneSheetData = function cloneSheetData() {
			return sheetData;
		};
		return sheetData;
	};
	var rowIndex = 0;
	while (rowIndex < sheetData.length) {
		var row = sheetData[rowIndex];
		var columnIndex = 0;
		while (columnIndex < row.length) {
			var cell = row[columnIndex];
			if (cell) {
				var _cell$rowSpan = cell.rowSpan, rowSpan = _cell$rowSpan === void 0 ? 1 : _cell$rowSpan;
				var columnSpan = typeof cell.span === "number" ? cell.span : cell.columnSpan;
				if (typeof columnSpan !== "number") columnSpan = 1;
				if (columnSpan > 1 || rowSpan > 1) {
					processSpanningCells(sheetData, rowIndex, columnIndex, columnSpan, rowSpan, _cloneSheetData, features);
					mergedCells.push([[rowIndex, columnIndex], [rowIndex + (rowSpan ? rowSpan - 1 : 0), columnIndex + (columnSpan ? columnSpan - 1 : 0)]]);
				}
			}
			columnIndex++;
		}
		rowIndex++;
	}
	return {
		sheetData,
		mergedCells
	};
}
function processSpanningCells(sheetData, rowIndex, columnIndex, columnSpan, rowSpan, cloneSheetData, features) {
	var cellStyleProperties = getCellStyleProperties(sheetData[rowIndex][columnIndex], features);
	if (cellStyleProperties) sheetData = cloneSheetData();
	var i = rowIndex;
	while (i <= rowIndex + (rowSpan - 1)) {
		var j = columnIndex;
		while (j <= columnIndex + (columnSpan - 1)) {
			var cell = sheetData[i][j];
			if (i > rowIndex || j > columnIndex) {
				if (cell !== null && cell !== void 0) throw new Error("[write-excel-file] When using `columnSpan` or `rowSpan` parameters, all hidden overlapped cells should be represented by `null`s or `undefined`s. Cell at row ".concat(rowIndex + 1, " and column ").concat(columnIndex + 1, " is configured with `columnSpan` ").concat(columnSpan, " and `rowSpan` ").concat(rowSpan, ". Cell at row ").concat(i + 1, " and column ").concat(j + 1, " is neither `null` nor `undefined`: ").concat(JSON.stringify(cell)));
				if (cellStyleProperties) sheetData[i][j] = cellStyleProperties;
			}
			j++;
		}
		i++;
	}
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/files/sheet.xml/mergedCellsDescription.js
function _slicedToArray(r, e) {
	return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray$10(r, e) || _nonIterableRest();
}
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$10(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray$10(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$10(r, a) : void 0;
	}
}
function _arrayLikeToArray$10(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function _iterableToArrayLimit(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = !0, o = !1;
		try {
			if (i = (t = t.call(r)).next, 0 === l) {
				if (Object(t) !== t) return;
				f = !1;
			} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = !0, n = r;
		} finally {
			try {
				if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
function _arrayWithHoles(r) {
	if (Array.isArray(r)) return r;
}
function generateMergedCellsDescription(tag, mergedCells) {
	if (mergedCells.length === 0) return "";
	var mergeCellsXml = mergedCells.map(function(_ref, index) {
		var _ref2 = _slicedToArray(_ref, 2), from = _ref2[0], to = _ref2[1];
		return tag("mergeCell", { ref: getCellAddress(from[0], from[1]) + ":" + getCellAddress(to[0], to[1]) }, null, index);
	}).join("");
	return tag("mergeCells", { count: mergedCells.length }, mergeCellsXml);
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/files/sheet.xml/pageMargins.js
function generatePageMargins(tag, _ref) {
	if (_ref.orientation) return tag("pageMargins", {
		left: .7,
		right: .7,
		top: .75,
		bottom: .75,
		header: .3,
		footer: .3
	});
	return "";
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/files/sheet.xml/pageSetup.js
function generatePageSetup(tag, _ref) {
	var orientation = _ref.orientation;
	if (orientation) return tag("pageSetup", {
		paperSize: 9,
		orientation: sanitizeAttributeValue(orientation)
	});
	return "";
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/files/sheet.xml/drawingReference.js
function generateDrawingReference(tag) {
	return tag("drawing", { "r:id": "rId-drawing-1" });
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/files/sheet.xml/sheet.xml.js
function generateSheetXml(sheetXmlParameters, features) {
	var sheetData_ = sheetXmlParameters.sheetData, sheetOptions = sheetXmlParameters.sheetOptions, sheetIndex = sheetXmlParameters.sheetIndex, sheetId = sheetXmlParameters.sheetId, hasDefaultFont = sheetXmlParameters.hasDefaultFont, findOrCreateCellStyle = sheetXmlParameters.findOrCreateCellStyle, findOrCreateSharedString = sheetXmlParameters.findOrCreateSharedString;
	var columns = sheetOptions.columns, dateFormat = sheetOptions.dateFormat, orientation = sheetOptions.orientation, showGridLines = sheetOptions.showGridLines, rightToLeft = sheetOptions.rightToLeft, zoomScale = sheetOptions.zoomScale;
	var _processMergedCells = processMergedCells(sheetData_, { features }), sheetData = _processMergedCells.sheetData, mergedCells = _processMergedCells.mergedCells;
	var tagFunctionProperties = {
		sheetIndex,
		sheetId
	};
	/**
	* Creates XML tag markup.
	* @param {string} tagName
	* @param {object} attributes
	* @param {string} [innerXml]
	* @param {number} [index]
	* @returns {string}
	*/
	var tag = function tag(tagName, attributes, innerXml, index) {
		return getElementXml("xl/worksheets/sheet{id}.xml", tagName, attributes, innerXml, index, tagFunctionProperties, sheetOptions, features);
	};
	var xml = "<?xml version=\"1.0\" ?><worksheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" xmlns:mv=\"urn:schemas-microsoft-com:mac:vml\" xmlns:mx=\"http://schemas.microsoft.com/office/mac/excel/2008/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:x14=\"http://schemas.microsoft.com/office/spreadsheetml/2009/9/main\" xmlns:x14ac=\"http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac\" xmlns:xm=\"http://schemas.microsoft.com/office/excel/2006/main\">" + generateSheetViews(tag, {
		showGridLines,
		rightToLeft,
		zoomScale
	}, sheetIndex) + generateColumnsDescription(tag, columns) + generateSheetData(tag, sheetData, {
		findOrCreateCellStyle,
		findOrCreateSharedString,
		hasDefaultFont,
		dateFormat,
		features
	}) + generateMergedCellsDescription(tag, mergedCells) + generatePageMargins(tag, { orientation }) + generatePageSetup(tag, { orientation }) + generateDrawingReference(tag) + getAdditionalContent("xl/worksheets/sheet{id}.xml", features, sheetOptions, {
		sheetIndex,
		sheetId
	}) + "</worksheet>";
	xml = transformContent(xml, "xl/worksheets/sheet{id}.xml", features, sheetOptions, {
		sheetIndex,
		sheetId
	});
	return xml;
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/files/sheet.xml.rels.js
function generateSheetXmlRels(_ref) {
	var sheetIndex = _ref.sheetIndex, sheetId = _ref.sheetId, sheetOptions = _ref.sheetOptions, features = _ref.features;
	var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">" + getDrawingRelationshipXml(sheetId) + getAdditionalContent("xl/worksheets/_rels/sheet{id}.xml.rels", features, sheetOptions, {
		sheetIndex,
		sheetId
	}) + "</Relationships>";
	xml = transformContent(xml, "xl/worksheets/_rels/sheet{id}.xml.rels", features, sheetOptions, {
		sheetIndex,
		sheetId
	});
	return xml;
}
function getDrawingRelationshipXml(sheetId) {
	return "<Relationship Id=\"rId-drawing-1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing\" Target=\"../drawings/drawing".concat(sheetId, ".xml\"/>");
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/files/sharedStrings.xml.js
function _createForOfIteratorHelperLoose$9(r, e) {
	var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (t) return (t = t.call(r)).next.bind(t);
	if (Array.isArray(r) || (t = _unsupportedIterableToArray$9(r)) || e && r && "number" == typeof r.length) {
		t && (r = t);
		var o = 0;
		return function() {
			return o >= r.length ? { done: !0 } : {
				done: !1,
				value: r[o++]
			};
		};
	}
	throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$9(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray$9(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$9(r, a) : void 0;
	}
}
function _arrayLikeToArray$9(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function generateSharedStringsXml(sharedStrings) {
	var xml = "<?xml version=\"1.0\"?>";
	xml += "<sst xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\">";
	for (var _iterator = _createForOfIteratorHelperLoose$9(sharedStrings), _step; !(_step = _iterator()).done;) {
		var string = _step.value;
		var attributes = string.trim().length === string.length ? "" : " xml:space=\"preserve\"";
		xml += "<si><t".concat(attributes, ">");
		xml += sanitizeTextContent(string);
		xml += "</t></si>";
	}
	xml += "</sst>";
	return xml;
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/helpers/getXlsxColorForHexColor.js
function getXlsxColorForHexColor(color) {
	if (color[0] !== "#") throw new Error("Color \"".concat(color, "\" must start with a \"#\""));
	return "FF".concat(color.slice(1).toUpperCase());
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/helpers/getFillXml.js
function getFillXml(fill) {
	var conditionalFormatting = (arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}).conditionalFormatting;
	var backgroundColor = fill.backgroundColor, fillPatternStyle = fill.fillPatternStyle, fillPatternColor = fill.fillPatternColor;
	var isSolidFill = !fillPatternStyle || fillPatternStyle === "solid";
	if (!hasFill(fill)) return "<fill><patternFill patternType=\"none\"/></fill>";
	var xml = "<fill>";
	xml += "<patternFill patternType=\"".concat(isSolidFill ? "solid" : fillPatternStyle, "\">");
	xml += "<fgColor rgb=\"".concat(sanitizeAttributeValue(getXlsxColorForHexColor(isSolidFill ? backgroundColor : fillPatternColor)), "\"/>");
	xml += "<bgColor ".concat(isSolidFill && !conditionalFormatting ? "indexed=\"64\"" : "rgb=\"" + sanitizeAttributeValue(getXlsxColorForHexColor(backgroundColor)) + "\"", "/>");
	xml += "</patternFill>";
	xml += "</fill>";
	return xml;
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/helpers/getBorderXml.js
function getBorderXml(_ref) {
	var borderColor = _ref.borderColor, borderStyle = _ref.borderStyle, leftBorderColor = _ref.leftBorderColor, leftBorderStyle = _ref.leftBorderStyle, rightBorderColor = _ref.rightBorderColor, rightBorderStyle = _ref.rightBorderStyle, topBorderColor = _ref.topBorderColor, topBorderStyle = _ref.topBorderStyle, bottomBorderColor = _ref.bottomBorderColor, bottomBorderStyle = _ref.bottomBorderStyle;
	var left = {
		style: leftBorderStyle || borderStyle,
		color: leftBorderColor || borderColor
	};
	var right = {
		style: rightBorderStyle || borderStyle,
		color: rightBorderColor || borderColor
	};
	var top = {
		style: topBorderStyle || borderStyle,
		color: topBorderColor || borderColor
	};
	var bottom = {
		style: bottomBorderStyle || borderStyle,
		color: bottomBorderColor || borderColor
	};
	var xml = "<border>";
	xml += getSideBorderXml("left", left);
	xml += getSideBorderXml("right", right);
	xml += getSideBorderXml("top", top);
	xml += getSideBorderXml("bottom", bottom);
	xml += "<diagonal/>";
	xml += "</border>";
	return xml;
}
function getSideBorderXml(side, _ref2) {
	var style = _ref2.style, color = _ref2.color;
	if (color && !style) style = "thin";
	var hasChildren = Boolean(color);
	return "<".concat(side) + (style ? " style=\"".concat(sanitizeAttributeValue(style), "\"") : "") + (hasChildren ? ">" : "/>") + (color ? "<color rgb=\"".concat(sanitizeAttributeValue(getXlsxColorForHexColor(color)), "\"/>") : "") + (hasChildren ? "</".concat(side, ">") : "");
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/helpers/getFontXml.js
function getFontXml(font) {
	(arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}).isDefaultGenericFont;
	var fontFamily = font.fontFamily, fontSize = font.fontSize, fontWeight = font.fontWeight, fontStyle = font.fontStyle, textDecoration = font.textDecoration, textColor = font.textColor;
	var xml = "<font>";
	if (fontFamily) xml += "<name val=\"".concat(sanitizeAttributeValue(fontFamily), "\"/>");
	if (typeof fontSize === "number") xml += "<sz val=\"".concat(fontSize, "\"/>");
	xml += "<family val=\"2\"/>";
	if (!(fontFamily || typeof fontSize === "number")) xml += "<scheme val=\"minor\"/>";
	if (fontWeight === "bold") xml += "<b/>";
	if (fontStyle === "italic") xml += "<i/>";
	if (textDecoration) {
		if (textDecoration.strikethrough) xml += "<strike/>";
		if (textDecoration.underline) xml += "<u/>";
		else if (textDecoration.doubleUnderline) xml += "<u val=\"double\"/>";
	}
	if (textColor) xml += "<color rgb=\"".concat(sanitizeAttributeValue(getXlsxColorForHexColor(textColor)), "\"/>");
	else xml += "<color theme=\"1\"/>";
	xml += "</font>";
	return xml;
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/helpers/getAlignmentXml.js
function getAlignmentXml(_ref) {
	var align = _ref.align, alignVertical = _ref.alignVertical, textRotation = _ref.textRotation, indent = _ref.indent, wrap = _ref.wrap;
	return "<alignment" + (align ? " horizontal=\"".concat(sanitizeAttributeValue(align), "\"") : "") + (alignVertical ? " vertical=\"".concat(sanitizeAttributeValue(alignVertical), "\"") : "") + (textRotation ? " textRotation=\"".concat(getTextRotation(validateTextRotation(textRotation)), "\"") : "") + (indent ? " indent=\"".concat(sanitizeAttributeValue(String(indent)), "\"") : "") + (wrap ? " wrapText=\"1\"" : "") + "/>";
}
function validateTextRotation(textRotation) {
	if (!(textRotation >= -90 && textRotation <= 90)) throw new Error("Unsupported text rotation angle: ".concat(textRotation, ". Values from -90 to 90 are supported."));
	return textRotation;
}
function getTextRotation(textRotation) {
	if (textRotation < 0) return 90 - textRotation;
	return textRotation;
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/initializeStyles.js
function _typeof$3(o) {
	"@babel/helpers - typeof";
	return _typeof$3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$3(o);
}
function ownKeys$3(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$3(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$3(Object(t), !0).forEach(function(r) {
			_defineProperty$3(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$3(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$3(e, r, t) {
	return (r = _toPropertyKey$3(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
function _toPropertyKey$3(t) {
	var i = _toPrimitive$3(t, "string");
	return "symbol" == _typeof$3(i) ? i : i + "";
}
function _toPrimitive$3(t, r) {
	if ("object" != _typeof$3(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$3(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function initializeStyles(defaultFont) {
	var formats = [];
	var formatIdByFormat = {};
	var styles = [];
	var stylesIndex = {};
	var fonts = [];
	var fontIdByFontKey = {};
	var fills = [];
	var fillIdByFillKey = {};
	var borders = [];
	var borderIdByBorderKey = {};
	var defaultFontId = fonts.length;
	fontIdByFontKey[getKey(defaultFont)] = defaultFontId;
	fonts.push(defaultFont || {});
	var defaultFill = {};
	fillIdByFillKey[getKey(defaultFill)] = fills.length;
	fills.push(defaultFill);
	var defaultBorder = {};
	borderIdByBorderKey[getKey(defaultBorder)] = borders.length;
	borders.push(defaultBorder);
	fills.push({ gray125: true });
	function findOrCreateCellStyle(cellStyle) {
		var format = cellStyle.format, align = cellStyle.align, alignVertical = cellStyle.alignVertical, textRotation = cellStyle.textRotation, indent = cellStyle.indent, wrap = cellStyle.wrap, fontFamily = cellStyle.fontFamily, fontSize = cellStyle.fontSize, fontWeight = cellStyle.fontWeight, fontStyle = cellStyle.fontStyle, textDecoration = cellStyle.textDecoration, textColor = cellStyle.textColor, backgroundColor = cellStyle.backgroundColor, fillPatternStyle = cellStyle.fillPatternStyle, fillPatternColor = cellStyle.fillPatternColor, borderColor = cellStyle.borderColor, borderStyle = cellStyle.borderStyle, leftBorderColor = cellStyle.leftBorderColor, leftBorderStyle = cellStyle.leftBorderStyle, rightBorderColor = cellStyle.rightBorderColor, rightBorderStyle = cellStyle.rightBorderStyle, topBorderColor = cellStyle.topBorderColor, topBorderStyle = cellStyle.topBorderStyle, bottomBorderColor = cellStyle.bottomBorderColor, bottomBorderStyle = cellStyle.bottomBorderStyle;
		var font = {
			fontFamily,
			fontSize,
			fontWeight,
			fontStyle,
			textDecoration,
			textColor
		};
		var fill = {
			backgroundColor,
			fillPatternStyle,
			fillPatternColor
		};
		var border = {
			borderColor,
			borderStyle,
			leftBorderColor,
			leftBorderStyle,
			rightBorderColor,
			rightBorderStyle,
			topBorderColor,
			topBorderStyle,
			bottomBorderColor,
			bottomBorderStyle
		};
		var alignment = {
			align,
			alignVertical,
			textRotation,
			indent,
			wrap
		};
		var formatKey = getKey(format);
		var fontKey = getKey(font);
		var fillKey = getKey(fill);
		var borderKey = getKey(border);
		var styleKey = getKey(cellStyle);
		var addStyle = function addStyle() {
			var formatId;
			if (format) {
				formatId = formatIdByFormat[formatKey];
				if (formatId === void 0) {
					formatId = 100 + formats.length;
					formatIdByFormat[formatKey] = formatId;
					formats.push(format);
				}
			}
			var fontId;
			if (hasFont(font)) {
				fontId = fontIdByFontKey[fontKey];
				if (fontId === void 0) {
					fontId = fonts.length;
					fontIdByFontKey[fontKey] = fontId;
					fonts.push(_objectSpread$3(_objectSpread$3({}, font), {}, {
						fontSize: font.fontSize || defaultFont && defaultFont.fontSize,
						fontFamily: font.fontFamily || defaultFont && defaultFont.fontFamily
					}));
				}
			} else if (defaultFont) fontId = defaultFontId;
			var fillId;
			if (hasFill(fill)) {
				fillId = fillIdByFillKey[fillKey];
				if (fillId === void 0) {
					fillId = fills.length;
					fillIdByFillKey[fillKey] = fillId;
					fills.push({
						backgroundColor,
						fillPatternStyle,
						fillPatternColor
					});
				}
			}
			var borderId;
			if (hasBorder(border)) {
				borderId = borderIdByBorderKey[borderKey];
				if (borderId === void 0) {
					borderId = borders.length;
					borderIdByBorderKey[borderKey] = borderId;
					borders.push(border);
				}
			}
			var styleId = styles.length;
			stylesIndex[styleKey] = styleId;
			styles.push({
				formatId,
				fontId,
				fillId,
				borderId,
				alignment
			});
			return styleId;
		};
		if (stylesIndex[styleKey] !== void 0) return stylesIndex[styleKey];
		return addStyle();
	}
	findOrCreateCellStyle({});
	return {
		getCellStyles: function getCellStyles() {
			return {
				formats,
				styles,
				fonts,
				fills,
				borders
			};
		},
		findOrCreateCellStyle
	};
}
function getKey(object) {
	return JSON.stringify(object);
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/files/styles.xml.js
function _createForOfIteratorHelperLoose$8(r, e) {
	var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (t) return (t = t.call(r)).next.bind(t);
	if (Array.isArray(r) || (t = _unsupportedIterableToArray$8(r)) || e && r && "number" == typeof r.length) {
		t && (r = t);
		var o = 0;
		return function() {
			return o >= r.length ? { done: !0 } : {
				done: !1,
				value: r[o++]
			};
		};
	}
	throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$8(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray$8(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$8(r, a) : void 0;
	}
}
function _arrayLikeToArray$8(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function generateStylesXml(cellStyles, sheetsOptions, features) {
	var formats = cellStyles.formats, styles = cellStyles.styles, fonts = cellStyles.fonts, fills = cellStyles.fills, borders = cellStyles.borders;
	var xml = "<?xml version=\"1.0\" ?>";
	xml += "<styleSheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\">";
	if (formats.length > 0) {
		xml += "<numFmts count=\"".concat(formats.length, "\">");
		for (var i = 0; i < formats.length; i++) xml += "<numFmt numFmtId=\"".concat(100 + i, "\" formatCode=\"").concat(sanitizeAttributeValue(formats[i]), "\"/>");
		xml += "</numFmts>";
	}
	xml += "<fonts count=\"".concat(fonts.length, "\">");
	for (var _iterator = _createForOfIteratorHelperLoose$8(fonts), _step; !(_step = _iterator()).done;) {
		var font = _step.value;
		xml += getFontXml(font);
	}
	xml += "</fonts>";
	xml += "<fills count=\"".concat(fills.length, "\">");
	for (var _iterator2 = _createForOfIteratorHelperLoose$8(fills), _step2; !(_step2 = _iterator2()).done;) {
		var fill = _step2.value;
		if (fill.gray125) {
			xml += "<fill>";
			xml += "<patternFill patternType=\"gray125\"/>";
			xml += "</fill>";
		} else xml += getFillXml(fill);
	}
	xml += "</fills>";
	xml += "<borders count=\"".concat(borders.length, "\">");
	for (var _iterator3 = _createForOfIteratorHelperLoose$8(borders), _step3; !(_step3 = _iterator3()).done;) {
		var border = _step3.value;
		xml += getBorderXml(border);
	}
	xml += "</borders>";
	xml += "<cellXfs count=\"".concat(styles.length, "\">");
	for (var _iterator4 = _createForOfIteratorHelperLoose$8(styles), _step4; !(_step4 = _iterator4()).done;) {
		var cellStyle = _step4.value;
		var fontId = cellStyle.fontId, fillId = cellStyle.fillId, borderId = cellStyle.borderId, alignment = cellStyle.alignment, formatId = cellStyle.formatId;
		xml += "<xf " + [
			formatId === void 0 ? void 0 : "numFmtId=\"".concat(formatId, "\" applyNumberFormat=\"1\""),
			fontId === void 0 ? void 0 : "fontId=\"".concat(fontId, "\" applyFont=\"1\""),
			fillId === void 0 ? void 0 : "fillId=\"".concat(fillId, "\" applyFill=\"1\""),
			borderId === void 0 ? void 0 : "borderId=\"".concat(borderId, "\" applyBorder=\"1\""),
			hasAlignment(alignment) ? "applyAlignment=\"1\"" : void 0
		].filter(function(_) {
			return _;
		}).join(" ") + ">" + (hasAlignment(alignment) ? getAlignmentXml(alignment) : "") + "</xf>";
	}
	xml += "</cellXfs>";
	xml += getAdditionalContent("xl/styles.xml", features, sheetsOptions);
	xml += "</styleSheet>";
	xml = transformContent(xml, "xl/styles.xml", features, sheetsOptions);
	return xml;
}
//#endregion
//#region node_modules/write-excel-file/modules/xml/findElementsNonRecursive_.js
/**
* Finds elements in valid XML markup.
* Caveat: Every time it finds an element, it doesn't "step into" it but rather "steps over" it.
* @param {string} xml — XML markup
* @param {string} [options.tagName] — The name of the element to find
* @param {boolean} [options.stopAfterFirstMatch] — If `true`, will only return a single result.
* @returns {object[]} — Found elements, each element represented by an object with propeties: `{ openingTagStartIndex: number, openingTagEndIndex: number, openingTagAttributes: object, selfClosingTag?: boolean, closingTagStartIndex?: number, closingTagEndIndex?: number }`
*/
function findElementsNonRecursive_(xml) {
	var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, tagName = _ref.tagName, stopAfterFirstMatch = _ref.stopAfterFirstMatch;
	var openingTagRegExp = new RegExp(getOpeningTagRegExpPattern(tagName), stopAfterFirstMatch ? void 0 : "g");
	var results = [];
	var openingTagMatch;
	while ((openingTagMatch = openingTagRegExp.exec(xml)) !== null) {
		var openingTag = openingTagMatch[0];
		var openingTagName = tagName || openingTagMatch[1];
		var attributes = {};
		var attributeRegExp = /* @__PURE__ */ new RegExp("\\s+([^\\s=>]+)(?:=\"([^\\s=>]+)\")", "g");
		var attributeMatch = void 0;
		while ((attributeMatch = attributeRegExp.exec(openingTag)) !== null) attributes[attributeMatch[1]] = attributeMatch[2];
		var result = {
			tagName: openingTagName,
			openingTagStartIndex: openingTagMatch.index,
			openingTagEndIndex: openingTagMatch.index + openingTag.length - 1,
			openingTagAttributes: attributes,
			selfClosingTag: false,
			closingTagStartIndex: void 0,
			closingTagEndIndex: void 0
		};
		if (openingTag[openingTag.length - 2] === "/") result.selfClosingTag = true;
		else {
			var closingTagPosition = findClosingTagPosition(xml, result.openingTagEndIndex + 1, openingTagName);
			if (!closingTagPosition) throw new Error("Invalid XML: opening tag was found but closing tag was not: </".concat(openingTagName, ">"));
			result.closingTagStartIndex = closingTagPosition[0];
			result.closingTagEndIndex = closingTagPosition[1];
		}
		results.push(result);
		if (stopAfterFirstMatch) break;
		if (result.selfClosingTag) openingTagRegExp.lastIndex = result.openingTagEndIndex + 1;
		else openingTagRegExp.lastIndex = result.closingTagEndIndex + 1;
	}
	return results;
}
function findClosingTagPosition(xml, startFromIndex, tagName) {
	var openingOrClosingTagRegExp = new RegExp("<(/)?" + tagName + "(?:\\s+[^>]+|/)?>", "g");
	openingOrClosingTagRegExp.lastIndex = startFromIndex;
	var nestingLevel = 0;
	var openingOrClosingTagMatch;
	while ((openingOrClosingTagMatch = openingOrClosingTagRegExp.exec(xml)) !== null) {
		var openingOrClosingTag = openingOrClosingTagMatch[0];
		if (openingOrClosingTagMatch[1]) {
			if (nestingLevel > 0) nestingLevel--;
			else return [openingOrClosingTagMatch.index, openingOrClosingTagMatch.index + openingOrClosingTag.length - 1];
		} else nestingLevel++;
	}
}
function getOpeningTagRegExpPattern(tagName) {
	return "<" + (tagName || "([^\\s/>]+)") + "(?:\\s+[^>]+|/)?>";
}
//#endregion
//#region node_modules/write-excel-file/modules/xml/findElement.js
/**
* Finds a single element in valid XML markup.
* @param {string} xml — XML markup
* @param {string} tagName — The name of the element to find
* @returns {object|undefined} — A found element, represented by an object with propeties: `{ openingTagStartIndex: number, openingTagEndIndex: number, openingTagAttributes: object, selfClosingTag?: boolean, closingTagStartIndex?: number, closingTagEndIndex?: number }`
*/
function findElement(xml, tagName) {
	return findElementsNonRecursive_(xml, {
		tagName,
		stopAfterFirstMatch: true
	})[0];
}
//#endregion
//#region node_modules/write-excel-file/modules/xml/setMarkupInsideElement.js
/**
* Replaces the XML inside an `element` that was found in `xml` using `findElement()` function.
* @param {string} xml
* @param {FoundElement} element
* @param {string} [replacementXml]
* @returns {string}
*/
function setMarkupInsideElement(xml, element, replacementXml) {
	if (replacementXml) {
		if (element.selfClosingTag) return xml.slice(0, element.openingTagEndIndex - 1) + ">" + replacementXml + "</" + element.tagName + ">" + xml.slice(element.openingTagEndIndex + 1);
		return xml.slice(0, element.openingTagEndIndex + 1) + replacementXml + xml.slice(element.closingTagStartIndex);
	} else {
		if (element.selfClosingTag) return xml;
		return xml.slice(0, element.openingTagEndIndex) + "/>" + xml.slice(element.closingTagEndIndex + 1);
	}
}
//#endregion
//#region node_modules/write-excel-file/modules/xml/appendMarkupInsideElement.js
/**
* Appends XML inside an `element` that was found in `xml` using `findElement()` function.
* @param {string} xml
* @param {FoundElement} element
* @param {string} addedXml
* @returns {string}
*/
function appendMarkupInsideElement(xml, element, addedXml) {
	if (element.selfClosingTag) return setMarkupInsideElement(xml, element, addedXml);
	return xml.slice(0, element.closingTagStartIndex) + addedXml + xml.slice(element.closingTagStartIndex);
}
//#endregion
//#region node_modules/write-excel-file/modules/xml/getMarkupInsideElement.js
/**
* Returns the XML inside an `element` that was found in `xml` using `findElement()` function.
* @param {string} xml
* @param {FoundElement} element
* @returns {string}
*/
function getMarkupInsideElement(xml, element) {
	if (element.selfClosingTag) return "";
	return xml.substring(element.openingTagEndIndex + 1, element.closingTagStartIndex);
}
//#endregion
//#region node_modules/write-excel-file/modules/xml/applyEnclosingElementOffset.js
function applyEnclosingElementOffset(element, enclosingElement) {
	var enclosingElementOffset = enclosingElement.openingTagEndIndex + 1;
	element.openingTagStartIndex += enclosingElementOffset;
	element.openingTagEndIndex += enclosingElementOffset;
	if (!element.selfClosingTag) {
		element.closingTagStartIndex += enclosingElementOffset;
		element.closingTagEndIndex += enclosingElementOffset;
	}
}
//#endregion
//#region node_modules/write-excel-file/modules/xml/getChildElements.js
function _createForOfIteratorHelperLoose$7(r, e) {
	var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (t) return (t = t.call(r)).next.bind(t);
	if (Array.isArray(r) || (t = _unsupportedIterableToArray$7(r)) || e && r && "number" == typeof r.length) {
		t && (r = t);
		var o = 0;
		return function() {
			return o >= r.length ? { done: !0 } : {
				done: !1,
				value: r[o++]
			};
		};
	}
	throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$7(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray$7(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$7(r, a) : void 0;
	}
}
function _arrayLikeToArray$7(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
/**
* Returns all child elements of a given element.
* @param {string} xml — XML markup
* @param {object} element — A parent element that was previously found using `findElement()` function.
* @returns {object[]} — Child elements, each element represented by an object with propeties: `{ openingTagStartIndex: number, openingTagEndIndex: number, openingTagAttributes: object, selfClosingTag?: boolean, closingTagStartIndex?: number, closingTagEndIndex?: number }`
*/
function getChildElements(xml, element) {
	var children = findElementsNonRecursive_(getMarkupInsideElement(xml, element));
	for (var _iterator = _createForOfIteratorHelperLoose$7(children), _step; !(_step = _iterator()).done;) {
		var child = _step.value;
		applyEnclosingElementOffset(child, element);
	}
	return children;
}
//#endregion
//#region node_modules/write-excel-file/modules/xml/prependMarkupInsideElement.js
/**
* Prepends XML inside an `element` that was found in `xml` using `findElement()` function.
* @param {string} xml
* @param {FoundElement} element
* @param {string} addedXml
* @returns {string}
*/
function prependMarkupInsideElement(xml, element, addedXml) {
	if (element.selfClosingTag) return setMarkupInsideElement(xml, element, addedXml);
	return xml.slice(0, element.openingTagEndIndex + 1) + addedXml + xml.slice(element.openingTagEndIndex + 1);
}
//#endregion
//#region node_modules/write-excel-file/modules/xml/insertElementMarkupAccordingToOrderOfSiblings.js
function _createForOfIteratorHelperLoose$6(r, e) {
	var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (t) return (t = t.call(r)).next.bind(t);
	if (Array.isArray(r) || (t = _unsupportedIterableToArray$6(r)) || e && r && "number" == typeof r.length) {
		t && (r = t);
		var o = 0;
		return function() {
			return o >= r.length ? { done: !0 } : {
				done: !1,
				value: r[o++]
			};
		};
	}
	throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$6(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray$6(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$6(r, a) : void 0;
	}
}
function _arrayLikeToArray$6(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function insertElementMarkupAccordingToOrderOfSiblings(xml, elementMarkup, orderOfSiblings) {
	for (var _len = arguments.length, parentElementTagNames = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) parentElementTagNames[_key - 3] = arguments[_key];
	if (parentElementTagNames.length === 0) throw new Error("At least one parent element tag name is required");
	parentElementTagNames = parentElementTagNames.slice().reverse();
	var parentElement;
	var _loop = function _loop() {
		var parentElementTagName = _step.value;
		if (parentElement) parentElement = getChildElements(xml, parentElement).find(function(_) {
			return _.tagName === parentElementTagName;
		});
		else parentElement = findElement(xml, parentElementTagName);
		if (!parentElement) throw new Error("Element not found: <".concat(parentElementTagName, ">"));
	};
	for (var _iterator = _createForOfIteratorHelperLoose$6(parentElementTagNames), _step; !(_step = _iterator()).done;) _loop();
	var elementTagNameMatch = elementMarkup.match(TAG_NAME_REG_EXP);
	if (!elementTagNameMatch) throw new Error("Couldn't extract tag name from markup: ".concat(elementMarkup));
	var elementTagName = elementTagNameMatch[1];
	if (!orderOfSiblings || orderOfSiblings.length < 2) return appendMarkupInsideElement(xml, parentElement, elementMarkup);
	var children = getChildElements(xml, parentElement);
	if (children.length === 0) return appendMarkupInsideElement(xml, parentElement, elementMarkup);
	var elementTagNameOrder = orderOfSiblings.indexOf(elementTagName);
	if (elementTagNameOrder < 0) return appendMarkupInsideElement(xml, parentElement, elementMarkup);
	var tagNamesBeforeElement = orderOfSiblings.slice(0, elementTagNameOrder).reverse();
	var _loop2 = function _loop2() {
		var tagName = _step2.value;
		var precedingElement = children.find(function(_) {
			return _.tagName === tagName;
		});
		if (precedingElement) return { v: xml.slice(0, precedingElement.selfClosingTag ? precedingElement.openingTagEndIndex + 1 : precedingElement.closingTagEndIndex + 1) + elementMarkup + xml.slice(precedingElement.selfClosingTag ? precedingElement.openingTagEndIndex + 1 : precedingElement.closingTagEndIndex + 1) };
	}, _ret;
	for (var _iterator2 = _createForOfIteratorHelperLoose$6(tagNamesBeforeElement), _step2; !(_step2 = _iterator2()).done;) {
		_ret = _loop2();
		if (_ret) return _ret.v;
	}
	return prependMarkupInsideElement(xml, parentElement, elementMarkup);
}
var TAG_NAME_REG_EXP = new RegExp(getOpeningTagRegExpPattern());
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/helpers/orderOfSiblings.js
var orderOfSiblings_default = {
	"xl/workbook.xml": [["workbook", [
		"workbookPr",
		"bookViews",
		"sheets",
		"pivotCaches",
		"definedNames",
		"calcPr"
	]]],
	"xl/styles.xml": [["styleSheet", [
		"numFmts",
		"fonts",
		"fills",
		"borders",
		"cellStyleXfs",
		"cellXfs",
		"cellStyles",
		"dxfs",
		"tableStyles"
	]]],
	"xl/worksheets/sheet{id}.xml": [["worksheet", [
		"sheetPr",
		"dimension",
		"sheetViews",
		"sheetFormatPr",
		"cols",
		"sheetData",
		"sheetCalcPr",
		"sheetProtection",
		"protectedRanges",
		"scenarios",
		"autoFilter",
		"sortState",
		"dataConsolidate",
		"customSheetViews",
		"mergeCells",
		"phoneticPr",
		"conditionalFormatting",
		"dataValidations",
		"hyperlinks",
		"printOptions",
		"pageMargins",
		"pageSetup",
		"headerFooter",
		"rowBreaks",
		"colBreaks",
		"drawing",
		"legacyDrawing",
		"picture",
		"oleObjects",
		"controls",
		"tableParts",
		"extLst"
	]]]
};
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/helpers/getOrderOfSiblings.js
/**
* Returns the order of siblings in a given `.xml` file inside given parent tag(s).
* @param {string} fileName
* @param {string[]} parentTagNames
* @returns {string[]}
*/
function getOrderOfSiblings(fileName) {
	var orderOfSiblings = orderOfSiblings_default[fileName];
	if (!orderOfSiblings) return;
	for (var _len = arguments.length, parentTagNames = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) parentTagNames[_key - 1] = arguments[_key];
	if (parentTagNames.length === 0) throw new Error("At least one parent element tag name is required");
	var _loop = function _loop() {
		var tagName = _parentTagNames[_i];
		var orderOfSiblingsMatchingElement = orderOfSiblings.find(function(element) {
			if (Array.isArray(element)) return element[0] === tagName;
			else return element === tagName;
		});
		if (!orderOfSiblingsMatchingElement) return { v: void 0 };
		if (Array.isArray(orderOfSiblingsMatchingElement)) orderOfSiblings = orderOfSiblingsMatchingElement[1];
		else return { v: void 0 };
	}, _ret;
	for (var _i = 0, _parentTagNames = parentTagNames; _i < _parentTagNames.length; _i++) {
		_ret = _loop();
		if (_ret) return _ret.v;
	}
	if (orderOfSiblings) return orderOfSiblings.map(function(element) {
		if (Array.isArray(element)) return element[0];
		else return element;
	});
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/features/conditionalFormatting.js
function _createForOfIteratorHelperLoose$5(r, e) {
	var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (t) return (t = t.call(r)).next.bind(t);
	if (Array.isArray(r) || (t = _unsupportedIterableToArray$5(r)) || e && r && "number" == typeof r.length) {
		t && (r = t);
		var o = 0;
		return function() {
			return o >= r.length ? { done: !0 } : {
				done: !1,
				value: r[o++]
			};
		};
	}
	throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$5(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray$5(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$5(r, a) : void 0;
	}
}
function _arrayLikeToArray$5(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
var conditionalFormatting_default = { files: { transform: {
	"xl/worksheets/sheet{id}.xml": { transform: function transform(xml, sheetOptions, _ref) {
		_ref.sheetIndex;
		_ref.sheetId;
		var conditionalFormatting = sheetOptions.conditionalFormatting;
		if (conditionalFormatting) return insertElementMarkupAccordingToOrderOfSiblings(xml, getConditionalFormattingRulesXml(conditionalFormatting), getOrderOfSiblings("xl/worksheets/sheet{id}.xml", "worksheet"), "worksheet");
		return xml;
	} },
	"xl/styles.xml": { insert: function insert(sheetsOptions) {
		var sheetsConditionalFormatting = sheetsOptions.map(function(sheetOptions) {
			return sheetOptions.conditionalFormatting;
		});
		if (sheetsConditionalFormatting.some(Boolean)) return getConditionalFormattingStylesXml(sheetsConditionalFormatting);
	} }
} } };
function getConditionalFormattingRulesXml(conditionalFormattingRules) {
	var xml = "";
	var i = 0;
	for (var _iterator = _createForOfIteratorHelperLoose$5(conditionalFormattingRules), _step; !(_step = _iterator()).done;) {
		var conditionalFormattingRule = _step.value;
		var _conditionalFormattin = conditionalFormattingRule.cellRange, from = _conditionalFormattin.from, to = _conditionalFormattin.to, _conditionalFormattin2 = conditionalFormattingRule.condition, formula = _conditionalFormattin2.formula, operator = _conditionalFormattin2.operator, value = _conditionalFormattin2.value, value2 = _conditionalFormattin2.value2;
		var cellRange = getCellAddress(from.row - 1, from.column - 1) + ":" + getCellAddress(to.row - 1, to.column - 1);
		xml += "<conditionalFormatting sqref=\"".concat(cellRange, "\">");
		var priority = i + 1;
		var dxfId = conditionalFormattingRule._globalIndex;
		if (formula) {
			xml += "<cfRule type=\"expression\" dxfId=\"".concat(dxfId, "\" priority=\"").concat(priority, "\">");
			xml += "<formula>".concat(sanitizeTextContent(formula), "</formula>");
			xml += "</cfRule>";
		} else if (operator) {
			xml += "<cfRule type=\"cellIs\" operator=\"".concat(getXlsxOperatorName(operator), "\" dxfId=\"").concat(dxfId, "\" priority=\"").concat(priority, "\">");
			xml += "<formula>".concat(sanitizeTextContent(formatValue(value)), "</formula>");
			if (getXlsxOperatorName(operator) === "between") xml += "<formula>".concat(sanitizeTextContent(formatValue(value2)), "</formula>");
			xml += "</cfRule>";
		} else throw new Error("Invalid conditional formatting rule:\n".concat(JSON.stringify(conditionalFormattingRule, null, 2)));
		xml += "</conditionalFormatting>";
		i++;
	}
	return xml;
}
function formatValue(value) {
	if (typeof value === "string") return "\"" + value + "\"";
	return String(value);
}
function getXlsxOperatorName(operator) {
	switch (operator) {
		case "<": return "lessThan";
		case ">": return "greaterThan";
		case "<=": return "lessThanOrEqual";
		case ">=": return "greaterThanOrEqual";
		case "=": return "equal";
		case "!=": return "notEqual";
		case "...": return "between";
		default: throw new Error("Unknown conditional formatting operator: ".concat(operator));
	}
}
function getConditionalFormattingStylesXml(sheetsConditionalFormatting) {
	var totalConditionalFormattingRulesCount = 0;
	for (var _iterator2 = _createForOfIteratorHelperLoose$5(sheetsConditionalFormatting), _step2; !(_step2 = _iterator2()).done;) {
		var conditionalFormattingOfSheet = _step2.value;
		if (conditionalFormattingOfSheet) totalConditionalFormattingRulesCount += conditionalFormattingOfSheet.length;
	}
	var xml = "";
	xml += "<dxfs count=\"".concat(totalConditionalFormattingRulesCount, "\">");
	for (var _iterator3 = _createForOfIteratorHelperLoose$5(sheetsConditionalFormatting), _step3; !(_step3 = _iterator3()).done;) {
		var _conditionalFormattingOfSheet = _step3.value;
		if (_conditionalFormattingOfSheet) for (var _iterator4 = _createForOfIteratorHelperLoose$5(_conditionalFormattingOfSheet), _step4; !(_step4 = _iterator4()).done;) {
			var _conditionalFormattin3 = _step4.value.style, fontFamily = _conditionalFormattin3.fontFamily, fontSize = _conditionalFormattin3.fontSize, fontWeight = _conditionalFormattin3.fontWeight, fontStyle = _conditionalFormattin3.fontStyle, textDecoration = _conditionalFormattin3.textDecoration, textColor = _conditionalFormattin3.textColor, backgroundColor = _conditionalFormattin3.backgroundColor, fillPatternStyle = _conditionalFormattin3.fillPatternStyle, fillPatternColor = _conditionalFormattin3.fillPatternColor, borderColor = _conditionalFormattin3.borderColor, borderStyle = _conditionalFormattin3.borderStyle, leftBorderColor = _conditionalFormattin3.leftBorderColor, leftBorderStyle = _conditionalFormattin3.leftBorderStyle, rightBorderColor = _conditionalFormattin3.rightBorderColor, rightBorderStyle = _conditionalFormattin3.rightBorderStyle, topBorderColor = _conditionalFormattin3.topBorderColor, topBorderStyle = _conditionalFormattin3.topBorderStyle, bottomBorderColor = _conditionalFormattin3.bottomBorderColor, bottomBorderStyle = _conditionalFormattin3.bottomBorderStyle;
			xml += "<dxf>";
			var font = {
				fontFamily,
				fontSize,
				fontWeight,
				fontStyle,
				textDecoration,
				textColor
			};
			if (hasFont(font)) {
				if (fontFamily) throw new Error("Conditional formatting can't be used to override font family");
				if (typeof fontSize === "number") throw new Error("Conditional formatting can't be used to override font size");
				xml += getFontXml(font);
			}
			var fill = {
				backgroundColor,
				fillPatternStyle,
				fillPatternColor
			};
			if (hasFill(fill)) xml += getFillXml(fill, { conditionalFormatting: true });
			var border = {
				borderColor,
				borderStyle,
				leftBorderColor,
				leftBorderStyle,
				rightBorderColor,
				rightBorderStyle,
				topBorderColor,
				topBorderStyle,
				bottomBorderColor,
				bottomBorderStyle
			};
			if (hasBorder(border)) xml += getBorderXml(border);
			xml += "</dxf>";
		}
	}
	xml += "</dxfs>";
	return xml;
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/helpers/getFileExtensionForContentType.js
function getFileExtensionForContentType(contentType) {
	if (!contentType) throw new Error("`contentType` is required");
	var extension = contentType.toLowerCase().replace(/.*\//, "");
	if (!extension) throw new Error("Unsupported `contentType`: " + contentType);
	return extension;
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/features/images.js
function _typeof$2(o) {
	"@babel/helpers - typeof";
	return _typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$2(o);
}
function _createForOfIteratorHelperLoose$4(r, e) {
	var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (t) return (t = t.call(r)).next.bind(t);
	if (Array.isArray(r) || (t = _unsupportedIterableToArray$4(r)) || e && r && "number" == typeof r.length) {
		t && (r = t);
		var o = 0;
		return function() {
			return o >= r.length ? { done: !0 } : {
				done: !1,
				value: r[o++]
			};
		};
	}
	throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toConsumableArray(r) {
	return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray$4(r) || _nonIterableSpread();
}
function _nonIterableSpread() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$4(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray$4(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$4(r, a) : void 0;
	}
}
function _iterableToArray(r) {
	if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _arrayWithoutHoles(r) {
	if (Array.isArray(r)) return _arrayLikeToArray$4(r);
}
function _arrayLikeToArray$4(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function ownKeys$2(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$2(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$2(Object(t), !0).forEach(function(r) {
			_defineProperty$2(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$2(e, r, t) {
	return (r = _toPropertyKey$2(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
function _toPropertyKey$2(t) {
	var i = _toPrimitive$2(t, "string");
	return "symbol" == _typeof$2(i) ? i : i + "";
}
function _toPrimitive$2(t, r) {
	if ("object" != _typeof$2(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$2(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var images_default = { files: {
	transform: {
		"[Content_Types].xml": { insert: function insert(sheetsOptions) {
			var sheetsImages = sheetsOptions.map(function(sheetOptions) {
				return sheetOptions.images;
			});
			if (sheetsImages.some(Boolean)) return getContentTypesXml(sheetsImages);
		} },
		"xl/drawings/drawing{id}.xml": { insert: function insert(sheetOptions, _ref) {
			_ref.sheetIndex;
			_ref.sheetId;
			var images = sheetOptions.images;
			if (images) return getImagesDrawingXml({ images });
		} },
		"xl/drawings/_rels/drawing{id}.xml.rels": { insert: function insert(sheetOptions, _ref2) {
			var sheetIndex = _ref2.sheetIndex;
			_ref2.sheetId;
			var images = sheetOptions.images;
			if (images) return getImagesDrawingXmlRels({
				images,
				sheetIndex
			});
		} }
	},
	write: { files: function files(sheetsOptions, _ref3) {
		_ref3.read;
		var sheetsImages = sheetsOptions.map(function(sheetOptions) {
			return sheetOptions.images;
		});
		if (sheetsImages.some(Boolean)) return sheetsImages.map(function(images, sheetIndex) {
			if (images) return images.reduce(function(imagesContent, image, imageIndex) {
				return _objectSpread$2(_objectSpread$2({}, imagesContent), {}, _defineProperty$2({}, "xl/media/".concat(getImageFileName(image, {
					sheetIndex,
					imageIndex
				})), image.content));
			}, {});
			return {};
		}).reduce(function(allImagesContent, sheetImagesContent) {
			return _objectSpread$2(_objectSpread$2({}, allImagesContent), sheetImagesContent);
		}, {});
	} }
} };
function getContentTypesXml(sheetsImages) {
	var imagesFromAllSheets = sheetsImages.reduce(function(all, images) {
		return [].concat(_toConsumableArray(all), _toConsumableArray(images || []));
	}, []);
	var xml = "";
	for (var _iterator = _createForOfIteratorHelperLoose$4(getFileExtensionContentTypes(imagesFromAllSheets)), _step; !(_step = _iterator()).done;) {
		var _step$value = _step.value, fileExtension = _step$value.fileExtension, contentType = _step$value.contentType;
		xml += "<Default Extension=\"".concat(fileExtension, "\" ContentType=\"").concat(contentType, "\"/>");
	}
	return xml;
}
function getFileExtensionContentTypes(images) {
	var fileExtensionContentTypes = [];
	var addFileExtensionContentType = function addFileExtensionContentType(image) {
		var fileExtension = getFileExtensionForContentType(image.contentType);
		if (!fileExtensionContentTypes.find(function(_) {
			return _.fileExtension === fileExtension;
		})) fileExtensionContentTypes.push({
			fileExtension,
			contentType: image.contentType
		});
	};
	for (var _iterator2 = _createForOfIteratorHelperLoose$4(images), _step2; !(_step2 = _iterator2()).done;) {
		var image = _step2.value;
		addFileExtensionContentType(image);
	}
	return fileExtensionContentTypes;
}
function getImageFileName(image, _ref4) {
	var sheetIndex = _ref4.sheetIndex, imageIndex = _ref4.imageIndex;
	var sheetNumber = sheetIndex + 1;
	var imageNumber = imageIndex + 1;
	return "sheet".concat(sheetNumber, "-image").concat(imageNumber, ".").concat(getFileExtensionForContentType(image.contentType));
}
function getImagesDrawingXml(_ref5) {
	var images = _ref5.images;
	var xml = "";
	var i = 0;
	var _loop = function _loop() {
		var image = _step3.value;
		var imageId = i + 1;
		var pxToEmu = function pxToEmu(px) {
			return pxToEmu_(px, image.dpi);
		};
		xml += "<xdr:oneCellAnchor>";
		xml += "<xdr:from>";
		xml += "<xdr:col>".concat(image.anchor.column - 1, "</xdr:col>");
		xml += "<xdr:colOff>".concat(typeof image.offsetX === "number" ? pxToEmu(image.offsetX) : 0, "</xdr:colOff>");
		xml += "<xdr:row>".concat(image.anchor.row - 1, "</xdr:row>");
		xml += "<xdr:rowOff>".concat(typeof image.offsetY === "number" ? pxToEmu(image.offsetY) : 0, "</xdr:rowOff>");
		xml += "</xdr:from>";
		xml += "<xdr:ext cx=\"".concat(pxToEmu(image.width), "\" cy=\"").concat(pxToEmu(image.height), "\"/>");
		xml += "<xdr:pic>";
		xml += "<xdr:nvPicPr>";
		xml += "<xdr:cNvPr id=\"".concat(imageId, "\" name=\"").concat(image.title ? sanitizeAttributeValue(image.title) : "Picture " + imageId, "\" descr=\"").concat(image.description ? sanitizeAttributeValue(image.description) : "", "\"/>");
		xml += "<xdr:cNvPicPr>";
		xml += "<a:picLocks noChangeAspect=\"1\"/>";
		xml += "</xdr:cNvPicPr>";
		xml += "</xdr:nvPicPr>";
		xml += "<xdr:blipFill>";
		xml += "<a:blip xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" r:embed=\"rId-image-".concat(imageId, "\" cstate=\"print\"/>");
		xml += "<a:stretch>";
		xml += "<a:fillRect/>";
		xml += "</a:stretch>";
		xml += "</xdr:blipFill>";
		xml += "<xdr:spPr>";
		xml += "<a:prstGeom prst=\"rect\">";
		xml += "<a:avLst/>";
		xml += "</a:prstGeom>";
		xml += "</xdr:spPr>";
		xml += "</xdr:pic>";
		xml += "<xdr:clientData/>";
		xml += "</xdr:oneCellAnchor>";
		i++;
	};
	for (var _iterator3 = _createForOfIteratorHelperLoose$4(images), _step3; !(_step3 = _iterator3()).done;) _loop();
	return xml;
}
function getImagesDrawingXmlRels(_ref6) {
	var images = _ref6.images, sheetIndex = _ref6.sheetIndex;
	return images.map(function(image, i) {
		var imageId = i + 1;
		return "<Relationship Id=\"rId-image-".concat(imageId, "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/image\" Target=\"../media/").concat(getImageFileName(image, {
			sheetIndex,
			imageIndex: i
		}), "\"/>");
	}).join("");
}
var DEFAULT_DISPLAY_DPI = 96;
var DEFAULT_IMAGE_DPI = 96;
function pxToEmu_(px, imageDpi) {
	var displayDpi = DEFAULT_DISPLAY_DPI;
	return Math.round(px * 9525 * (DEFAULT_DISPLAY_DPI / displayDpi) * (DEFAULT_IMAGE_DPI / imageDpi));
}
//#endregion
//#region node_modules/write-excel-file/modules/xml/replaceElement.js
/**
* Replaces an `element` that was found in `xml` using `findElement()` function with a given `replacementXml` markup.
* @param {string} xml
* @param {FoundElement} element
* @param {string} replacementXml
* @returns {string}
*/
function replaceElement(xml, element, replacementXml) {
	if (element.selfClosingTag) return xml.slice(0, element.openingTagStartIndex) + replacementXml + xml.slice(element.openingTagEndIndex + 1);
	return xml.slice(0, element.openingTagStartIndex) + replacementXml + xml.slice(element.closingTagEndIndex + 1);
}
//#endregion
//#region node_modules/write-excel-file/modules/xml/findElementInsideElement.js
/**
* Finds a single element in valid XML markup within bounds of a given element that was previously found using `findElement()` function.
* @param {string} xml — XML markup
* @param {string} tagName — The name of the element to find
* @param {object} enclosingElement — An enclosing element that was previously found using `findElement()` function.
* @returns {object|undefined} — A found element, represented by an object with propeties: `{ openingTagStartIndex: number, openingTagEndIndex: number, openingTagAttributes: object, selfClosingTag?: boolean, closingTagStartIndex?: number, closingTagEndIndex?: number }`
*/
function findElementInsideElement(xml, tagName, enclosingElement) {
	var element = findElement(getMarkupInsideElement(xml, enclosingElement), tagName);
	if (element) {
		applyEnclosingElementOffset(element, enclosingElement);
		return element;
	}
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/features/stickyRowsOrColumns.js
var stickyRowsOrColumns_default = { files: { transform: {
	"xl/worksheets/sheet{id}.xml": { transform: function transform(xml, sheetOptions, _ref) {
		var sheetIndex = _ref.sheetIndex, sheetId = _ref.sheetId;
		if (hasStickyRowsOrColumns(sheetOptions)) {
			var stickyRowsCount = sheetOptions.stickyRowsCount, stickyColumnsCount = sheetOptions.stickyColumnsCount;
			var paneAttributes = {
				ySplit: stickyRowsCount || 0,
				xSplit: stickyColumnsCount || 0,
				topLeftCell: getCellAddress(stickyRowsCount || 0, stickyColumnsCount || 0),
				activePane: "bottomRight",
				state: "frozen"
			};
			var sheetViewElement = findElement(xml, "sheetView");
			if (sheetViewElement) {
				var paneElement = findElementInsideElement(xml, "pane", sheetViewElement);
				var paneXml = getSelfClosingTagMarkup("pane", paneAttributes);
				if (paneElement) xml = replaceElement(xml, paneElement, paneXml);
				else xml = appendMarkupInsideElement(xml, sheetViewElement, paneXml);
			} else {
				if (findElement(xml, "sheetViews")) throw new Error("xl/worksheets/sheet".concat(sheetId, ".xml: <sheetViews/> element exists but it doesn't contain any <sheetView/> elements"));
				var sheetViewAttributes = {
					tabSelected: sheetIndex === 0 ? 1 : 0,
					workbookViewId: 0
				};
				var sheetViewsXml = getOpeningTagMarkup("sheetViews") + getOpeningTagMarkup("sheetView", sheetViewAttributes) + getSelfClosingTagMarkup("pane", paneAttributes) + getClosingTagMarkup("sheetView", sheetViewAttributes) + getClosingTagMarkup("sheetViews");
				var worksheetElement = findElement(xml, "worksheet");
				xml = prependMarkupInsideElement(xml, worksheetElement, sheetViewsXml);
			}
		}
		return xml;
	} },
	"xl/workbook.xml": { transform: function transform(xml, sheetsOptions) {
		if (sheetsOptions.some(hasStickyRowsOrColumns)) {
			if (!findElement(xml, "workbookView")) {
				if (findElement(xml, "bookViews")) throw new Error("xl/workbook.xml: <bookViews/> element exists but it doesn't contain any <workbookView/> elements");
				return insertElementMarkupAccordingToOrderOfSiblings(xml, "<bookViews><workbookView/></bookViews>", getOrderOfSiblings("xl/workbook.xml", "workbook"), "workbook");
			}
		}
		return xml;
	} }
} } };
function hasStickyRowsOrColumns(sheetOptions) {
	return Boolean(sheetOptions.stickyRowsCount) || Boolean(sheetOptions.stickyColumnsCount);
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/getFeatures.js
function getFeatures(customFeatures) {
	var features = [];
	features.push(conditionalFormatting_default);
	features.push(images_default);
	features.push(stickyRowsOrColumns_default);
	if (customFeatures) {
		customFeatures.forEach(validateFeature);
		features = features.concat(customFeatures);
	}
	return features;
}
var TRANSFORMABLE_FILES = [
	"[Content_Types].xml",
	"_rels/.rels",
	"xl/styles.xml",
	"xl/workbook.xml",
	"xl/_rels/workbook.xml.rels",
	"xl/worksheets/sheet{id}.xml",
	"xl/worksheets/_rels/sheet{id}.xml.rels",
	"xl/drawings/drawing{id}.xml",
	"xl/drawings/_rels/drawing{id}.xml.rels"
];
function validateFeature(feature) {
	if (feature.files && feature.files.transform) for (var _i = 0, _Object$keys = Object.keys(feature.files.transform); _i < _Object$keys.length; _i++) {
		var key = _Object$keys[_i];
		if (TRANSFORMABLE_FILES.indexOf(key) < 0) throw new Error("Unknown file to transform: ".concat(key));
	}
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/validateSheetData.js
function _createForOfIteratorHelperLoose$3(r, e) {
	var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (t) return (t = t.call(r)).next.bind(t);
	if (Array.isArray(r) || (t = _unsupportedIterableToArray$3(r)) || e && r && "number" == typeof r.length) {
		t && (r = t);
		var o = 0;
		return function() {
			return o >= r.length ? { done: !0 } : {
				done: !1,
				value: r[o++]
			};
		};
	}
	throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$3(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray$3(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$3(r, a) : void 0;
	}
}
function _arrayLikeToArray$3(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function validateSheetData(data) {
	if (!Array.isArray(data)) throw new TypeError("Expected sheet data to be an array of rows");
	for (var _iterator = _createForOfIteratorHelperLoose$3(data), _step; !(_step = _iterator()).done;) {
		var row = _step.value;
		if (Array.isArray(row)) return;
		else throw new Error("Expected each sheet data row to be an array");
	}
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/initializeSharedStrings.js
function initializeSharedStrings() {
	var sharedStrings = [];
	var sharedStringIdByString = {};
	return {
		getSharedStrings: function getSharedStrings() {
			return sharedStrings;
		},
		findOrCreateSharedString: function findOrCreateSharedString(string) {
			var id = sharedStringIdByString[string];
			if (id === void 0) {
				id = sharedStrings.length;
				sharedStringIdByString[string] = id;
				sharedStrings.push(string);
			}
			return id;
		}
	};
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/validateSheetName.js
var ILLEGAL_CHARACTERS_IN_SHEET_NAME = /[\[\]\/\\:*?]+/;
function validateSheetName(sheetName) {
	if (!sheetName) throw new Error("Sheet name can't be empty");
	if (sheetName.length > 31) throw new Error("Sheet name \"".concat(sheetName, "\" can't be longer than 31 characters"));
	if (ILLEGAL_CHARACTERS_IN_SHEET_NAME.test(sheetName)) throw new Error("Sheet name \"".concat(sheetName, "\" contains illegal characters: []/\\:*?"));
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/initializeSheets.js
function _createForOfIteratorHelperLoose$2(r, e) {
	var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (t) return (t = t.call(r)).next.bind(t);
	if (Array.isArray(r) || (t = _unsupportedIterableToArray$2(r)) || e && r && "number" == typeof r.length) {
		t && (r = t);
		var o = 0;
		return function() {
			return o >= r.length ? { done: !0 } : {
				done: !1,
				value: r[o++]
			};
		};
	}
	throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$2(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray$2(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$2(r, a) : void 0;
	}
}
function _arrayLikeToArray$2(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function initializeSheets(sheetsData, sheetsOptions, globalOptions) {
	var _initializeSharedStri = initializeSharedStrings(), getSharedStrings = _initializeSharedStri.getSharedStrings, findOrCreateSharedString = _initializeSharedStri.findOrCreateSharedString;
	var defaultFont = getDefaultFont(globalOptions);
	var _initializeStyles = initializeStyles(defaultFont), getCellStyles = _initializeStyles.getCellStyles, findOrCreateCellStyle = _initializeStyles.findOrCreateCellStyle;
	var sheetNames = sheetsOptions.map(function(sheetOptions) {
		return sheetOptions.sheet;
	});
	for (var _iterator = _createForOfIteratorHelperLoose$2(sheetNames), _step; !(_step = _iterator()).done;) {
		var sheetName = _step.value;
		validateSheetName(sheetName);
	}
	var sheetXmlParameters = [];
	var sheetIndex = 0;
	while (sheetIndex < sheetNames.length) {
		sheetXmlParameters.push({
			sheetData: sheetsData[sheetIndex],
			sheetOptions: sheetsOptions[sheetIndex],
			sheetIndex,
			sheetId: getSheetId(sheetIndex),
			hasDefaultFont: Boolean(defaultFont),
			findOrCreateCellStyle,
			findOrCreateSharedString
		});
		sheetIndex++;
	}
	return {
		sheets: sheetNames.map(function(sheetName, _i) {
			var sheetIndex = _i;
			return {
				sheetId: getSheetId(sheetIndex),
				sheetName,
				sheetXmlParameters: sheetXmlParameters[sheetIndex]
			};
		}),
		getSharedStrings,
		getCellStyles
	};
}
function getSheetId(sheetIndex) {
	return String(sheetIndex + 1);
}
function getDefaultFont(globalOptions) {
	var fontFamily = globalOptions.fontFamily, fontSize = globalOptions.fontSize;
	if (fontFamily || typeof fontSize === "number") return {
		fontFamily,
		fontSize
	};
}
//#endregion
//#region node_modules/write-excel-file/modules/getSheetData/getSheetData.js
function getSheetData(objects, columns) {
	var headerRow;
	if (columns.some(function(column) {
		return column.header;
	})) headerRow = columns.map(function(_ref) {
		return _ref.header || null;
	});
	return (headerRow ? [headerRow] : []).concat(objects.map(function(object, objectIndex) {
		return columns.map(function(_ref2) {
			var cell = _ref2.cell;
			return cell(object, objectIndex);
		});
	}));
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/helpers/features/getWrittenFiles.js
function _typeof$1(o) {
	"@babel/helpers - typeof";
	return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$1(o);
}
function ownKeys$1(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$1(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$1(Object(t), !0).forEach(function(r) {
			_defineProperty$1(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$1(e, r, t) {
	return (r = _toPropertyKey$1(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
function _toPropertyKey$1(t) {
	var i = _toPrimitive$1(t, "string");
	return "symbol" == _typeof$1(i) ? i : i + "";
}
function _toPrimitive$1(t, r) {
	if ("object" != _typeof$1(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$1(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _createForOfIteratorHelperLoose$1(r, e) {
	var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (t) return (t = t.call(r)).next.bind(t);
	if (Array.isArray(r) || (t = _unsupportedIterableToArray$1(r)) || e && r && "number" == typeof r.length) {
		t && (r = t);
		var o = 0;
		return function() {
			return o >= r.length ? { done: !0 } : {
				done: !1,
				value: r[o++]
			};
		};
	}
	throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$1(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray$1(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$1(r, a) : void 0;
	}
}
function _arrayLikeToArray$1(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function getWrittenFiles(features, sheetsOptions, _ref) {
	var read = _ref.read;
	var writtenFiles = {};
	for (var _iterator = _createForOfIteratorHelperLoose$1(features), _step; !(_step = _iterator()).done;) {
		var feature = _step.value;
		if (feature.files && feature.files.write) {
			if (feature.files.write.files) {
				var files = feature.files.write.files(sheetsOptions, { read });
				if (files) writtenFiles = _objectSpread$1(_objectSpread$1({}, writtenFiles), files);
			}
		}
	}
	return writtenFiles;
}
//#endregion
//#region node_modules/write-excel-file/modules/xlsx/generateXlsxFileContents.js
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
}
var _excluded = ["data"];
function ownKeys(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
			_defineProperty(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty(e, r, t) {
	return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
function _toPropertyKey(t) {
	var i = _toPrimitive(t, "string");
	return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
	if ("object" != _typeof(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _objectWithoutProperties(e, t) {
	if (null == e) return {};
	var o, r, i = _objectWithoutPropertiesLoose(e, t);
	if (Object.getOwnPropertySymbols) {
		var n = Object.getOwnPropertySymbols(e);
		for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
	}
	return i;
}
function _objectWithoutPropertiesLoose(r, e) {
	if (null == r) return {};
	var t = {};
	for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
		if (-1 !== e.indexOf(n)) continue;
		t[n] = r[n];
	}
	return t;
}
function _createForOfIteratorHelperLoose(r, e) {
	var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (t) return (t = t.call(r)).next.bind(t);
	if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
		t && (r = t);
		var o = 0;
		return function() {
			return o >= r.length ? { done: !0 } : {
				done: !1,
				value: r[o++]
			};
		};
	}
	throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
	}
}
function _arrayLikeToArray(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
/**
* Creates contents (files) an `*.xlsx` file.
* @param {SheetData|Object[]|Sheet[]} arg1
* @param {object} arg2 — If `arg1` is `SheetData`, `arg2` is `SheetOptions` and `arg3` is `Options`. If `arg1` is `Sheet[]`, `arg2` is `Options`.
* @param {object} [arg3] — If `arg1` is `SheetData`, `arg2` is `SheetOptions` and `arg3` is `Options`. If `arg1` is `Sheet[]`, `arg2` is `Options`.
* @return {Record<string,string|Blob>} A map of files that exist inside an `.xlsx` file.
*/
function generateXlsxFileContents(arg1, arg2, arg3) {
	var _getArguments = getArguments(arg1, arg2, arg3), sheetsDataAndOptions = _getArguments.sheets, options = _getArguments.options;
	var sheetsData = sheetsDataAndOptions.map(function(sheet) {
		return sheet.data;
	});
	var sheetsOptions = sheetsDataAndOptions.map(function(sheet) {
		return sheet.options;
	});
	sheetsOptions = setSheetNames(sheetsOptions);
	sheetsOptions = setConditionalFormattingRulesGlobalIndexes(sheetsOptions);
	var features = getFeatures(options.features);
	var files = {};
	var readFile = function readFile(path) {
		return files[path];
	};
	var writeFiles = function writeFiles(filesToWrite) {
		for (var _i = 0, _Object$keys = Object.keys(filesToWrite); _i < _Object$keys.length; _i++) {
			var path = _Object$keys[_i];
			validateFilePath(path);
			validateFileContent(path, filesToWrite[path]);
			files[path] = filesToWrite[path];
		}
	};
	var _initializeSheets = initializeSheets(sheetsData, sheetsOptions, options), sheets = _initializeSheets.sheets, getSharedStrings = _initializeSheets.getSharedStrings, getCellStyles = _initializeSheets.getCellStyles;
	files["[Content_Types].xml"] = generateContentTypesXml({
		sheetIds: sheets.map(function(_) {
			return _.sheetId;
		}),
		features,
		sheetsOptions
	});
	files["_rels/.rels"] = generateRelsXml({
		features,
		sheetsOptions
	});
	files["xl/_rels/workbook.xml.rels"] = generateWorkbookXmlRels({
		sheetIds: sheets.map(function(_) {
			return _.sheetId;
		}),
		features,
		sheetsOptions
	});
	files["xl/workbook.xml"] = generateWorkbookXml({
		sheetIdsAndNames: sheets.map(function(_ref) {
			return {
				sheetId: _ref.sheetId,
				sheetName: _ref.sheetName
			};
		}),
		features,
		sheetsOptions
	});
	var sheetIndex = 0;
	for (var _iterator = _createForOfIteratorHelperLoose(sheets), _step; !(_step = _iterator()).done;) {
		var _step$value = _step.value, sheetId = _step$value.sheetId, sheetXmlParameters = _step$value.sheetXmlParameters;
		var sheetOptions = sheetsOptions[sheetIndex];
		files["xl/worksheets/sheet".concat(sheetId, ".xml")] = generateSheetXml(sheetXmlParameters, features);
		files["xl/worksheets/_rels/sheet".concat(sheetId, ".xml.rels")] = generateSheetXmlRels({
			sheetIndex,
			sheetId,
			sheetOptions,
			features
		});
		files["xl/drawings/drawing".concat(sheetId, ".xml")] = generateDrawingXml({
			sheetIndex,
			sheetId,
			sheetOptions,
			features
		});
		files["xl/drawings/_rels/drawing".concat(sheetId, ".xml.rels")] = generateDrawingXmlRels({
			sheetIndex,
			sheetId,
			sheetOptions,
			features
		});
		sheetIndex++;
	}
	writeFiles(getWrittenFiles(features, sheetsOptions, { read: readFile }));
	files["xl/styles.xml"] = generateStylesXml(getCellStyles(), sheetsOptions, features);
	files["xl/sharedStrings.xml"] = generateSharedStringsXml(getSharedStrings());
	removeUnusedDrawings(files, sheets);
	return files;
}
function removeUnusedDrawings(files, sheets) {
	for (var _iterator2 = _createForOfIteratorHelperLoose(sheets), _step2; !(_step2 = _iterator2()).done;) {
		var sheetId = _step2.value.sheetId;
		if (files["xl/drawings/drawing".concat(sheetId, ".xml")] === "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><xdr:wsDr xmlns:xdr=\"http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing\" xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\"></xdr:wsDr>") {
			delete files["xl/drawings/drawing".concat(sheetId, ".xml")];
			delete files["xl/drawings/_rels/drawing".concat(sheetId, ".xml.rels")];
			if (!removeSubstring(files, "xl/worksheets/sheet".concat(sheetId, ".xml"), generateDrawingReference(getSelfClosingTagMarkup))) throw new Error(COULD_NOT_REMOVE_UNUSED_DRAWINGS);
			removeSubstring(files, "xl/worksheets/_rels/sheet".concat(sheetId, ".xml.rels"), getDrawingRelationshipXml(sheetId));
			removeSubstring(files, "[Content_Types].xml", getDrawingContentTypeXml(sheetId));
		}
	}
}
var COULD_NOT_REMOVE_UNUSED_DRAWINGS = "Couldn't remove unused drawings";
function removeSubstring(files, key, substring) {
	if (!files[key]) throw new Error("File not found: ".concat(key));
	if (files[key].indexOf(substring) < 0) throw new Error("Substring \"".concat(substring, "\" not found in \"").concat(key, "\""));
	var stringBeforeRemoval = files[key];
	var stringAfterRemoval = stringBeforeRemoval.replace(substring, "");
	files[key] = stringAfterRemoval;
	return stringBeforeRemoval !== stringAfterRemoval;
}
function validateFilePath(path) {
	if (path[0] === "/") throw new Error("File path must not start with a slash (/)");
}
function validateFileContent(path, content) {
	if (!content) throw new Error("File `content` not specified: ".concat(path));
}
function getArguments(arg1, arg2, arg3) {
	if (Array.isArray(arg1)) {
		if (arg1.length === 0 || Array.isArray(arg1[0])) {
			validateSheetData(arg1);
			if (Array.isArray(arg1[0]) && arg1.length > 0 && Array.isArray(arg1[0][0])) throw new Error("In order to write multiple sheets, pass an array of sheet objects");
			return {
				sheets: [{
					data: arg1,
					options: arg2 || {}
				}],
				options: arg3 || {}
			};
		} else if (isObject(arg1[0])) {
			if (isObject(arg2) && Array.isArray(arg2.schema)) throw new Error("`schema` parameter was removed, use `columns` parameter instead");
			if (isObject(arg2) && Array.isArray(arg2.columns)) return getArguments(getSheetData(arg1, arg2.columns), arg2, arg3);
			return {
				sheets: arg1.map(function(_ref2) {
					var data = _ref2.data, options = _objectWithoutProperties(_ref2, _excluded);
					if (!data) throw new Error("`data` property is required for each sheet");
					validateSheetData(data);
					return {
						data,
						options: options || {}
					};
				}),
				options: arg2 || {}
			};
		} else throw new Error("Invalid first argument: must be either sheet data — an array of arrays — or an array of sheet objects");
	} else throw new Error("Invalid first argument: must be an array");
}
function setSheetNames(sheetsOptions) {
	return sheetsOptions.map(function(sheetOptions, sheetIndex) {
		return _objectSpread(_objectSpread({}, sheetOptions), {}, { sheet: sheetOptions.sheet || "Sheet".concat(sheetIndex + 1) });
	});
}
function setConditionalFormattingRulesGlobalIndexes(sheetsOptions) {
	var globalIndex = 0;
	return sheetsOptions.map(function(sheetOptions) {
		return _objectSpread(_objectSpread({}, sheetOptions), {}, { conditionalFormatting: sheetOptions.conditionalFormatting && sheetOptions.conditionalFormatting.map(function(conditionalFormattingRule) {
			return _objectSpread(_objectSpread({}, conditionalFormattingRule), {}, { _globalIndex: globalIndex++ });
		}) });
	});
}
//#endregion
//#region node_modules/write-excel-file/modules/export/writeXlsxFileUniversal.js
/**
* @return {Promise<Blob>}
*/
function generateXlsxFile(arg1, arg2, arg3, convertFileContentToUint8Array, createZipArchiveAsArrayBuffer, isAsyncZip) {
	return convertFilesContentToUint8Arrays(generateXlsxFileContents(arg1, arg2, arg3), convertFileContentToUint8Array).then(function(files) {
		var result = createZipArchiveAsArrayBuffer(files);
		if (isAsyncZip) return result.then(function(result) {
			return convertArrayBufferToBlob(result);
		});
		else return convertArrayBufferToBlob(result);
	});
}
function convertArrayBufferToBlob(arrayBuffer) {
	return new Blob([arrayBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}
/**
* Generates an *.xlsx file "asynchronously".
* @return {Promise<Blob>}
*/
function generateXlsxFileAsync(arg1, arg2, arg3, convertFileContentToUint8Array) {
	return generateXlsxFile(arg1, arg2, arg3, convertFileContentToUint8Array, zipToArrayBuffer, true);
}
//#endregion
//#region node_modules/write-excel-file/modules/export/convertFileContentToUint8ArrayBrowser.js
/**
* Converts file content to a `Uint8Array`.
* @param {File|Blob|ArrayBuffer} fileContent
* @returns {Promise<Uint8Array>}
*/
function convertFileContentToUint8Array(fileContent) {
	if (fileContent instanceof File) return fileContent.arrayBuffer().then(arrayBufferToUint8Array);
	if (fileContent instanceof Blob) return fileContent.arrayBuffer().then(arrayBufferToUint8Array);
	if (fileContent instanceof ArrayBuffer) return Promise.resolve(arrayBufferToUint8Array(fileContent));
	throw new Error("Unsupported file content type. Expected a `File`, a `Blob` or an `ArrayBuffer`");
}
function arrayBufferToUint8Array(arrayBuffer) {
	return new Uint8Array(arrayBuffer);
}
//#endregion
//#region node_modules/write-excel-file/modules/export/downloadBlob.js
function downloadBlob(blob, filename) {
	var url = URL.createObjectURL(blob);
	var a = document.createElement("a");
	a.style.display = "none";
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	setTimeout(function() {
		URL.revokeObjectURL(url);
		document.body.removeChild(a);
	}, 100);
}
//#endregion
//#region node_modules/write-excel-file/modules/export/writeXlsxFileBrowser.js
/**
* Creates an `*.xlsx` file.
* @param {SheetData|Object[]|Sheet[]} arg1
* @param {object} arg2 — If `arg1` is `SheetData`, `arg2` is `SheetOptions` and `arg3` is `Options`. If `arg1` is `Sheet[]`, `arg2` is `Options`.
* @param {object} [arg3] — If `arg1` is `SheetData`, `arg2` is `SheetOptions` and `arg3` is `Options`. If `arg1` is `Sheet[]`, `arg2` is `Options`.
* @returns {object} Returns an object with `async` methods: `toBlob()`, `toFile(fileName)`.
*/
function writeXlsxFile(arg1, arg2, arg3) {
	var createBlob = function createBlob() {
		return generateXlsxFileAsync(arg1, arg2, arg3, convertFileContentToUint8Array);
	};
	return {
		toBlob: function toBlob() {
			return createBlob();
		},
		toFile: function toFile(fileName) {
			return createBlob().then(function(blob) {
				downloadBlob(blob, fileName);
			});
		}
	};
}
//#endregion
//#region node_modules/write-excel-file/browser/index.js
var browser_exports = /* @__PURE__ */ __exportAll({ default: () => writeXlsxFile });
//#endregion
export { browser_exports as t };
