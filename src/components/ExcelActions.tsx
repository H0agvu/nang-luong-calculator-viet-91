
import { FC, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SolarPanel, Inverter } from "@/data/solarData";
import { toast } from "@/components/ui/use-toast";
import { FileDown, FileUp, Database } from "lucide-react";

interface ExcelActionsProps {
  inverters: Inverter[];
  panels?: SolarPanel[];
  history?: any[];
  onImportData?: (data: {
    inverters?: Inverter[];
    panels?: SolarPanel[];
    history?: any[];
  }) => void;
}

declare global {
  interface Window {
    electronAPI?: {
      exportExcel: (data: any) => void;
      onExportExcelResult: (callback: (result: any) => void) => void;
      importExcel: () => void;
      onImportExcelResult: (callback: (result: any) => void) => void;
    };
  }
}

const ExcelActions: FC<ExcelActionsProps> = ({
  inverters,
  panels,
  history,
  onImportData
}) => {
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Kiểm tra xem có đang chạy trong Electron không
    setIsElectron(!!window.electronAPI);
    
    // Đăng ký listener cho kết quả xuất Excel
    if (window.electronAPI) {
      window.electronAPI.onExportExcelResult((result) => {
        if (result.success) {
          toast({
            title: "Xuất dữ liệu thành công",
            description: "Dữ liệu đã được lưu vào file Excel",
          });
        } else {
          toast({
            title: "Xuất dữ liệu thất bại",
            description: result.error || "Có lỗi xảy ra khi xuất file",
            variant: "destructive",
          });
        }
      });
      
      // Đăng ký listener cho kết quả nhập Excel
      window.electronAPI.onImportExcelResult((result) => {
        if (result.success && result.data && onImportData) {
          onImportData(result.data);
          toast({
            title: "Nhập dữ liệu thành công",
            description: "Dữ liệu đã được nhập từ file Excel",
          });
        } else {
          toast({
            title: "Nhập dữ liệu thất bại",
            description: result.error || "Có lỗi xảy ra khi nhập file",
            variant: "destructive",
          });
        }
      });
    }
  }, [onImportData]);

  const handleExport = () => {
    if (window.electronAPI) {
      window.electronAPI.exportExcel({
        inverters,
        panels,
        history
      });
    } else {
      // Fallback cho web browser
      toast({
        title: "Chức năng chỉ khả dụng trong phiên bản desktop",
        description: "Vui lòng sử dụng phiên bản desktop để xuất Excel",
        variant: "destructive",
      });
    }
  };

  const handleImport = () => {
    if (window.electronAPI) {
      window.electronAPI.importExcel();
    } else {
      // Fallback cho web browser
      toast({
        title: "Chức năng chỉ khả dụng trong phiên bản desktop",
        description: "Vui lòng sử dụng phiên bản desktop để nhập Excel",
        variant: "destructive",
      });
    }
  };

  if (!isElectron) {
    return null; // Ẩn component nếu không chạy trong Electron
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex gap-2 items-center">
          <Database className="w-5 h-5 text-blue-500" />
          Quản lý dữ liệu Excel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExport}
          >
            <FileDown className="w-4 h-4" />
            Xuất dữ liệu ra Excel
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleImport}
          >
            <FileUp className="w-4 h-4" />
            Nhập dữ liệu từ Excel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExcelActions;
