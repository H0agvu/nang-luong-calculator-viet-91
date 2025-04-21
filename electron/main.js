
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = require('electron-is-dev');
const XLSX = require('xlsx');

// Khởi tạo cửa sổ chính
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Tải ứng dụng
  mainWindow.loadURL(
    isDev 
      ? 'http://localhost:8080' 
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );
  
  // Mở DevTools trong môi trường phát triển
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

// Khởi động ứng dụng
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Đóng ứng dụng khi tắt tất cả cửa sổ (trừ macOS)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Xử lý các sự kiện từ renderer process

// Xuất dữ liệu ra Excel
ipcMain.on('export-excel', async (event, data) => {
  try {
    const { filePath } = await dialog.showSaveDialog({
      title: 'Lưu dữ liệu điện mặt trời',
      defaultPath: 'du-lieu-dien-mat-troi.xlsx',
      filters: [{ name: 'Excel Files', extensions: ['xlsx'] }]
    });

    if (!filePath) return;

    // Tạo workbook
    const wb = XLSX.utils.book_new();
    
    // Tạo sheet dữ liệu inverter
    if (data.inverters && data.inverters.length > 0) {
      const inverterWs = XLSX.utils.json_to_sheet(data.inverters);
      XLSX.utils.book_append_sheet(wb, inverterWs, 'Inverters');
    }
    
    // Tạo sheet dữ liệu tấm pin
    if (data.panels && data.panels.length > 0) {
      const panelWs = XLSX.utils.json_to_sheet(data.panels);
      XLSX.utils.book_append_sheet(wb, panelWs, 'SolarPanels');
    }
    
    // Tạo sheet lịch sử tính toán
    if (data.history && data.history.length > 0) {
      const historyWs = XLSX.utils.json_to_sheet(data.history);
      XLSX.utils.book_append_sheet(wb, historyWs, 'History');
    }
    
    // Ghi file
    XLSX.writeFile(wb, filePath);
    
    event.reply('export-excel-result', { success: true });
  } catch (error) {
    console.error('Lỗi khi xuất Excel:', error);
    event.reply('export-excel-result', { success: false, error: error.message });
  }
});

// Nhập dữ liệu từ Excel
ipcMain.on('import-excel', async (event) => {
  try {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }]
    });

    if (!filePaths || filePaths.length === 0) return;
    
    const filePath = filePaths[0];
    const workbook = XLSX.readFile(filePath);
    
    const data = {};
    
    // Đọc dữ liệu từ các sheet
    if (workbook.SheetNames.includes('Inverters')) {
      const inverterSheet = workbook.Sheets['Inverters'];
      data.inverters = XLSX.utils.sheet_to_json(inverterSheet);
    }
    
    if (workbook.SheetNames.includes('SolarPanels')) {
      const panelSheet = workbook.Sheets['SolarPanels'];
      data.panels = XLSX.utils.sheet_to_json(panelSheet);
    }
    
    if (workbook.SheetNames.includes('History')) {
      const historySheet = workbook.Sheets['History'];
      data.history = XLSX.utils.sheet_to_json(historySheet);
    }
    
    event.reply('import-excel-result', { success: true, data });
  } catch (error) {
    console.error('Lỗi khi nhập Excel:', error);
    event.reply('import-excel-result', { success: false, error: error.message });
  }
});
