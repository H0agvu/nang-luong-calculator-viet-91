
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  exportExcel: (data) => ipcRenderer.send('export-excel', data),
  onExportExcelResult: (callback) => 
    ipcRenderer.on('export-excel-result', (_, result) => callback(result)),
  
  importExcel: () => ipcRenderer.send('import-excel'),
  onImportExcelResult: (callback) => 
    ipcRenderer.on('import-excel-result', (_, result) => callback(result))
});
