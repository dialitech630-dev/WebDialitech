/**
 * Small browser-side download helpers shared by every monitoring chart.
 */

export function downloadBlob(content, filename, mime = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCell(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/**
 * @param {{ columns: string[], rows: (string|number)[][] }} payload
 */
export function downloadCsv({ columns, rows }, filename) {
  const lines = [columns.map(escapeCell).join(',')];
  for (const row of rows) lines.push(row.map(escapeCell).join(','));
  downloadBlob(lines.join('\n'), filename);
}

/**
 * @param {import('echarts/core').EChartsType} chart ECharts instance
 * @param {string} filename
 * @param {string} [backgroundColor] PNG background color
 */
export function downloadChartImage(chart, filename, backgroundColor = '#ffffff') {
  if (!chart) return;
  const url = chart.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor });
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
