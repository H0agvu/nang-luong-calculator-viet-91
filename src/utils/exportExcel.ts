
import * as XLSX from "xlsx";

// Receives an array of history items and generates & downloads an Excel file
export function exportHistoryToExcel(history: any[], filename = "lich_su_tinh_toan.xlsx") {
  // Ensure history has at least 1 item
  if (!history.length) return;

  // Column headers
  const columns = [
    "Thời gian",
    "Chủng loại tấm pin",
    "Số lượng tấm pin",
    "Số lượng inverter",
    "Tỷ số DC/AC",
    "Dây inverter + MCCB",
    "Dây tổng + MCCB",
  ];

  // Map history data
  const data = history.map(item => [
    item.time,
    item.panelName,
    item.totalPanels,
    item.inverterResult,
    item.dcAcRatio?.toFixed(2) ?? "",
    item.inverterWireSummary ?? "",
    item.mainWireSummary ?? "",
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet([columns, ...data]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Lịch sử");

  XLSX.writeFile(workbook, filename);
}
