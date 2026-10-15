/**
 * Excel & CSV utility for Marketing and Sales operations
 */

export function exportToCSV(dataArray, filename = "landlots_export.csv") {
  if (!dataArray || !dataArray.length) {
    alert("No data available to export.");
    return;
  }

  const headers = Object.keys(dataArray[0]);
  const csvRows = [];

  // Header row
  csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(","));

  // Value rows
  for (const row of dataArray) {
    const values = headers.map(header => {
      let val = row[header];
      if (val === null || val === undefined) val = "";
      if (typeof val === "object") val = JSON.stringify(val);
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(","));
  }

  const csvString = "\uFEFF" + csvRows.join("\r\n"); // UTF-8 BOM for Microsoft Excel compatibility
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseCSV(text) {
  const lines = text.trim().split(/\r\n|\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map(h => h.replace(/^"|"$/g, '').trim());
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i];
    if (!currentLine.trim()) continue;

    // Simple regex CSV parser handling quoted strings
    const matches = currentLine.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    const obj = {};
    headers.forEach((header, index) => {
      let val = matches[index] ? matches[index].replace(/^"|"$/g, '').trim() : "";
      obj[header] = val;
    });
    results.push(obj);
  }

  return results;
}

// Land Area conversions (Base unit: Square Yards)
const CONVERSIONS_TO_SQYDS = {
  sqyds: 1,
  sqft: 1 / 9,
  cents: 48.4,
  guntas: 121,
  acres: 4840,
  sqmtrs: 1.19599
};

export function convertLandArea(value, fromUnit, toUnit) {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return 0;

  const inSqYds = num * CONVERSIONS_TO_SQYDS[fromUnit];
  const converted = inSqYds / CONVERSIONS_TO_SQYDS[toUnit];

  // Precision formatting
  if (toUnit === "acres" || toUnit === "guntas") {
    return Number(converted.toFixed(3));
  }
  return Number(converted.toFixed(2));
}

// EMI Calculation Formula
export function calculateEMI(principal, annualRate, tenureYears) {
  const p = parseFloat(principal);
  const r = (parseFloat(annualRate) / 12) / 100;
  const n = parseFloat(tenureYears) * 12;

  if (!p || !r || !n) return { monthlyEMI: 0, totalPayment: 0, totalInterest: 0 };

  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - p;

  return {
    monthlyEMI: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest)
  };
}
