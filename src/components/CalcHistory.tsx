
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Save } from "lucide-react";
import { exportHistoryToExcel } from "@/utils/exportExcel";

interface CalcHistoryProps {
  history: {
    time: string;
    panelName: string;
    totalPanels: number;
    inverterResult: string;
    dcAcRatio: number;
    inverterWireSummary?: string;
    mainWireSummary?: string;
  }[];
  onExport?: () => void;
}

const CalcHistory = ({ history, onExport }: CalcHistoryProps) => {
  const handleExport = () => {
    exportHistoryToExcel(history);
    if (onExport) onExport();
  };

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <CardTitle>Lịch sử tính toán</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" title="Xuất Excel" onClick={handleExport} disabled={history.length === 0}>
            <FileSpreadsheet className="mr-2" /> Xuất
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-gray-500">Chưa có lịch sử.</div>
        ) : (
          <div className="overflow-auto max-w-full">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="p-2 border-b">Thời gian</th>
                  <th className="p-2 border-b">Tấm pin</th>
                  <th className="p-2 border-b">Số lượng pin</th>
                  <th className="p-2 border-b">Kết quả inverter</th>
                  <th className="p-2 border-b">Tỷ số DC/AC</th>
                  <th className="p-2 border-b">Dây inverter + MCCB</th>
                  <th className="p-2 border-b">Dây tổng + MCCB</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, i) => (
                  <tr key={i}>
                    <td className="p-2 border-b whitespace-nowrap">{item.time}</td>
                    <td className="p-2 border-b">{item.panelName}</td>
                    <td className="p-2 border-b text-center">{item.totalPanels}</td>
                    <td className="p-2 border-b">{item.inverterResult}</td>
                    <td className="p-2 border-b text-center">
                      {item.dcAcRatio?.toFixed(2) ?? ""}
                    </td>
                    <td className="p-2 border-b">{item.inverterWireSummary ?? ""}</td>
                    <td className="p-2 border-b">{item.mainWireSummary ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default CalcHistory;
